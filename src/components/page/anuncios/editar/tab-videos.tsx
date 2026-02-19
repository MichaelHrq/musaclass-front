"use client";

import {
  deleteVideosAnuncio,
  getVideosPostAnuncioByIdType,
  reorderVideosAnuncio,
  uploadVideosAnuncio,
} from "@/app/gestao/anuncios/action";
import PreviewVideo from "@/components/preview-video";
import SortableItem from "@/components/sorteble-item";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog/dialog";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { Move, Play, Plus, Save, Trash, Upload, X } from "lucide-react";
import { MouseEvent, useEffect, useState } from "react";
import { toast } from "sonner";

type propsType = {
  postId: string;
  videos: getVideosPostAnuncioByIdType[];
};

export default function TabVideosAnuncio({ postId, videos }: propsType) {
  const [items, setItems] = useState<getVideosPostAnuncioByIdType[]>([]);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  const [dialogShow, setDialogShow] = useState(false);
  const [midias, setMidias] = useState<File[]>([]);

  const [dialogDeleteShow, setDialogDeleteShow] = useState(false);
  const [videoDelete, setVideoDelete] = useState<{
    id: number;
    url: string;
  } | null>(null);

  const MAX_SIZE_MB = 20;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  const hasOversizedFile = midias.some((file) => file.size > MAX_SIZE_BYTES);

  useEffect(() => {
    setItems(videos);
  }, [videos]);

  const queryClient = useQueryClient();

  const sensors = useSensors(
    // 1. MouseSensor: Só ativa com mouse. Evita conflito no mobile.
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // Arrasta logo ao mover o mouse
      },
    }),
    // 2. TouchSensor: Configurado especificamente para o dedo.
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Segure por 250ms para ativar o "Drag"
        tolerance: 8, // Aumentei a tolerância para 8px (dedos tremem um pouco ao segurar)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function handleOnRemove(
    e: MouseEvent<HTMLDivElement>,
    id: number,
    url: string,
  ) {
    e.stopPropagation();
    setVideoDelete({ id, url });
    setDialogDeleteShow(true);
  }

  async function handleRemoveVideo() {
    if (!videoDelete) return;
    const toastId = toast.loading("Removendo vídeo...");
    const res = await deleteVideosAnuncio(postId, videoDelete.url);
    if (res.success) {
      setTimeout(() => {
        toast.success(res.message, { id: toastId });
        queryClient.invalidateQueries({
          queryKey: ["edit-anuncio-videos", postId],
        });
        setDialogDeleteShow(false);
        setVideoDelete(null);
      }, 1000 * 3);
    } else {
      toast.error(res.message, { id: toastId });
    }
  }

  async function handleSaveOrder() {
    const reorder = items.map((item) => item.url);
    const toastId = toast.loading("Reordenando os vídeos...");
    const res = await reorderVideosAnuncio(postId, reorder);
    if (res.success) {
      toast.success("Vídeos reordenados com sucesso", { id: toastId });
      queryClient.invalidateQueries({
        queryKey: ["edit-anuncio-videos", postId],
      });
    } else {
      toast.error(res.message, { id: toastId });
    }
  }

  function handleCloseModal() {
    setDialogShow(false);
    setMidias([]);
  }

  function handleAddFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setMidias((prev) => [...prev, ...Array.from(files)]);
    e.target.value = "";
  }

  function handleRemoveFile(indexToRemove: number) {
    setMidias((prev) => prev.filter((_, index) => index !== indexToRemove));
  }

  async function handleConfirmUpload() {
    if (midias.length === 0 || hasOversizedFile) return;
    const totalFiles = midias.length;
    const toastId = toast.loading(
      `Iniciando processamento de ${totalFiles} arquivo(s)...`,
    );

    for (const [index, file] of midias.entries()) {
      const numVideo = index + 1;
      toast.loading(`Importando vídeo ${numVideo} de ${totalFiles}`, {
        id: toastId,
      });

      const formData = new FormData();
      formData.append("postId", postId);
      formData.append("file", file);

      const res = await uploadVideosAnuncio(formData, postId);
      if (!res.success) {
        toast.error(res.message, { id: toastId });
      }
    }

    toast.loading(`Atualizando galeria de vídeos...`, { id: toastId });
    setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: ["edit-anuncio-videos", postId],
      });
      toast.success("Processo de importação finalizado!", { id: toastId });
      handleCloseModal();
    }, 1000 * 5);
  }

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-[#1E1E1E] p-4 rounded-xl border border-[#333] gap-4 sticky top-0 z-30 shadow-md">
          <div className="text-sm text-neutral-400 font-medium flex items-center gap-2">
            <span className="bg-[#2a2a2a] px-2 py-0.5 rounded text-white border border-[#333]">
              {items.length}
            </span>
            <span>videos na galeria</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={() => setDialogShow(true)}
              variant="outline"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:border-blue-500/50 transition-all font-medium text-sm h-10"
            >
              <Upload size={16} />
              Importar vídeos
            </Button>
            <Button
              onClick={handleSaveOrder}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/20 hover:border-amber-500/50 rounded-md transition-all font-medium text-sm h-10 whitespace-nowrap"
            >
              <Save size={18} />
              Salvar Ordem
            </Button>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="w-full bg-[#1E1E1E] rounded-xl p-6 shadow-lg border border-[#333]">
            {items.length > 0 ? (
              <SortableContext items={items} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {items.map((item) => (
                    <SortableItem key={item.id} id={item.id}>
                      <video
                        src={item.url}
                        className="h-full w-full object-cover pointer-events-none bg-black"
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <button
                        type="button"
                        onClick={() => setPreviewVideo(item.url)}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 hover:scale-110 transition-all p-4 rounded-full backdrop-blur-sm cursor-pointer z-20 group-hover:bg-amber-500/80"
                        title="Visualizar vídeo"
                      >
                        <Play size={24} className="text-white fill-white" />
                      </button>

                      <div className="absolute top-2 right-2 bg-black/40 p-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <Move size={12} className="text-white" />
                      </div>

                      <div
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => handleOnRemove(e, item.id, item.url)}
                        className="absolute bottom-2 right-2 bg-red-600/60 hover:bg-red-600 duration-200 p-2 z-20 rounded-full backdrop-blur shadow-lg cursor-pointer pointer-events-auto"
                      >
                        <Trash size={16} className="text-white" />
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-neutral-500 gap-2">
                <div className="p-4 bg-[#2a2a2a] rounded-full">
                  <Play size={32} className="opacity-50" />
                </div>
                <p>Nenhum vídeo adicionado.</p>
              </div>
            )}
          </div>
        </DndContext>
      </div>

      {/* MODAL IMPORTAR */}
      <Dialog
        open={dialogShow}
        onClose={handleCloseModal}
        title="Importar Vídeos"
        subtitle={`Selecione os vídeos (Máx. ${MAX_SIZE_MB}MB por vídeo).`}
        className="max-w-6xl"
      >
        <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-1">
          <div className="flex items-center gap-4">
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                className="hidden"
                accept="video/*"
                onChange={handleAddFiles}
              />
              <div className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 transition-colors px-4 py-2.5 rounded-lg border border-neutral-700 text-sm font-medium">
                <Plus size={16} />
                Escolher vídeos...
              </div>
            </label>
            <span className="text-xs text-neutral-500">
              {midias.length > 0
                ? `${midias.length} arquivo(s)`
                : "Nenhum arquivo"}
            </span>
          </div>

          {midias.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
              {midias.map((file, index) => {
                const previewUrl = URL.createObjectURL(file);
                const fileSizeMB = file.size / (1024 * 1024);
                const isOverSize = file.size > MAX_SIZE_BYTES;

                return (
                  <div
                    key={index}
                    className={`group relative aspect-square bg-neutral-800 rounded-lg overflow-hidden ${
                      isOverSize
                        ? "border-red-600 border-2"
                        : "border border-neutral-700"
                    }`}
                  >
                    {/* <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    /> */}

                    <video
                      src={previewUrl}
                      className="h-full w-full object-cover pointer-events-none bg-black"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div
                      className={`absolute bottom-0 left-0 right-0 text-[10px] text-center py-1 text-white backdrop-blur-sm ${
                        isOverSize ? "bg-red-600/80" : "bg-black/60"
                      }`}
                    >
                      {fileSizeMB.toFixed(1)} MB
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white p-1 rounded-full shadow-md transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmUpload}
              disabled={midias.length === 0 || hasOversizedFile}
              className={`text-white transition-colors ${
                midias.length === 0 || hasOversizedFile
                  ? "bg-neutral-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <Upload size={16} className="mr-2" />
              {hasOversizedFile
                ? "Remova inválidas"
                : `Enviar ${midias.length}`}
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={dialogDeleteShow}
        onClose={() => {
          setDialogDeleteShow(false);
          setVideoDelete(null);
        }}
        title="Remover vídeo"
        subtitle="Deseja realmente remover esse vídeo?"
        className="max-w-xl"
      >
        <div
          className={`group relative aspect-square bg-neutral-800 rounded-lg overflow-hidden`}
        >
          {/* <img
            src={videoDelete?.url}
            alt="Preview"
            className="w-full h-full object-cover"
          /> */}
          <video
            src={videoDelete?.url}
            className="h-full w-full object-cover pointer-events-none bg-black"
            muted
            playsInline
            preload="metadata"
          />
        </div>
        <div className="w-full flex items-center justify-end gap-2">
          <Button
            onClick={() => {
              setDialogDeleteShow(false);
              setVideoDelete(null);
            }}
            className="bg-neutral-800 hover:bg-neutral-700"
          >
            Cancelar
          </Button>
          <Button
            className="bg-red-800 hover:bg-red-700"
            onClick={handleRemoveVideo}
          >
            Remover
          </Button>
        </div>
      </Dialog>

      <PreviewVideo
        previewVideo={previewVideo}
        setPreviewVideo={setPreviewVideo}
      />
    </>
  );
}
