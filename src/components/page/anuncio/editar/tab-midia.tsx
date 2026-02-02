"use client";

import {
  deleteMidiaAction,
  midiaResponseType,
  reOrderMidiaAction,
} from "@/app/anunciante/[anuncio]/action";
import PreviewVideo from "@/components/preview-video";
import SortableItem from "@/components/sorteble-item";
import { TabOption, TabSwitcher } from "@/components/tab-switcher";
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
import {
  Camera,
  CameraOff,
  CircleCheck,
  CircleEllipsis,
  CircleX,
  LucideIcon,
  MessageCircleX,
  Move,
  Play,
  Save,
  Trash,
  Video,
  VideoOff,
} from "lucide-react";
import Link from "next/link";
import { MouseEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { tabMidiaType } from "..";

type stateType = {
  imagem?: midiaResponseType[];
  video?: midiaResponseType[];
};

type PropsType = {
  data: stateType;
  anuncioId: string;
  tab: tabMidiaType;
};

type tabType = "imagem" | "video";

export default function TabMidias({ data, anuncioId, tab }: PropsType) {
  const [imageDelete, setImageDelete] = useState<{
    dialog: boolean;
    image?: { id: number; url: string };
  }>({
    dialog: false,
    image: undefined,
  });

  const [videoDelete, setVideoDelete] = useState<{
    dialog: boolean;
    video?: { id: number; url: string };
  }>({
    dialog: false,
    video: undefined,
  });

  const [failed, setFailed] = useState({
    dialog: false,
    message: "",
  });

  const [midias, setMidias] = useState<stateType>({
    imagem: data.imagem ?? [],
    video: data.video ?? [],
  });

  useEffect(() => {
    setMidias({
      imagem: data.imagem ?? [],
      video: data.video ?? [],
    });
  }, [data]);

  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const t: Record<
    "aprovado" | "reprovado" | "pendente",
    {
      Icon: LucideIcon;
      emptyImage: string;
      emptyVideo: string;
    }
  > = {
    aprovado: {
      Icon: CircleCheck,
      emptyImage: "Nenhuma foto aprovada",
      emptyVideo: "Nenhum vídeo aprovado",
    },
    reprovado: {
      Icon: CircleX,
      emptyImage: "Nenhuma foto reprovada",
      emptyVideo: "Nenhum vídeo reprovado",
    },
    pendente: {
      Icon: CircleEllipsis,
      emptyImage: "Nenhuma foto pendente",
      emptyVideo: "Nenhum vídeo pendente",
    },
  };

  const currentTabInfo = t[tab];

  const [tabType, setTabType] = useState<tabType>("imagem");

  const tabOptions: TabOption<tabType>[] = [
    { id: "imagem", label: "Imagem", icon: Camera },
    { id: "video", label: "Vídeo", icon: Video },
  ];

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEndImage(event: DragEndEvent) {
    const { active, over } = event;

    // CORREÇÃO 3: Verificação de segurança
    // Se midias.imagem for undefined, aborta
    const currentImages = midias.imagem;
    if (!currentImages) return;

    if (over && active.id !== over.id) {
      setMidias((prev) => {
        // Usa o estado anterior (prev) para garantir consistência
        const currentList = prev.imagem || [];
        const oldIndex = currentList.findIndex((item) => item.id === active.id);
        const newIndex = currentList.findIndex((item) => item.id === over.id);

        return {
          ...prev,
          imagem: arrayMove(currentList, oldIndex, newIndex),
        };
      });
    }
  }

  function handleDragEndVideo(event: DragEndEvent) {
    const { active, over } = event;

    const currentVideos = midias.video;
    if (!currentVideos) return;

    if (over && active.id !== over.id) {
      setMidias((prev) => {
        const currentList = prev.video || [];
        const oldIndex = currentList.findIndex((item) => item.id === active.id);
        const newIndex = currentList.findIndex((item) => item.id === over.id);

        return {
          ...prev,
          video: arrayMove(currentList, oldIndex, newIndex),
        };
      });
    }
  }

  async function handleSaveOrderMidia({ key }: { key: keyof stateType }) {
    const list = midias[key];

    if (!list || list.length === 0) {
      toast.warning("Nada para ordenar.");
      return;
    }

    const items = list.map((item) => item.id);
    const message = key === "imagem" ? "as fotos" : "os vídeos";
    const toastId = toast.loading(`Reordenando ${message}...`);

    const res = await reOrderMidiaAction(anuncioId, items, key, tab);

    if (res.success) {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["midias", anuncioId] });
        return toast.success(res.message, { id: toastId });
      }, 1000 * 3);
    } else {
      return toast.error(res.message, { id: toastId });
    }
  }

  function handleOnRemoveImage(
    e: MouseEvent<HTMLDivElement>,
    id: number,
    url: string,
  ) {
    e.stopPropagation();
    setImageDelete({ dialog: true, image: { id, url } });
  }

  const deleteMidia = async (key: keyof stateType) => {
    // Verificação extra para garantir que temos IDs para deletar
    const idToDelete =
      key === "imagem" ? imageDelete.image?.id : videoDelete.video?.id;

    if (!idToDelete) return;

    const message = key === "imagem" ? "a foto" : "o vídeo";
    const toastId = toast.loading(`Removendo ${message}...`);

    const res = await deleteMidiaAction(idToDelete);

    if (res.sucess) {
      setTimeout(() => {
        setImageDelete({ dialog: false, image: undefined });
        setVideoDelete({ dialog: false, video: undefined });
        queryClient.invalidateQueries({ queryKey: ["midias", anuncioId] });
        return toast.success("Midia removida com sucesso", { id: toastId });
      }, 1000 * 3);
    } else {
      return toast.error("Falha ao remover midia", { id: toastId });
    }
  };

  function handleOnRemoveVideo(
    e: MouseEvent<HTMLDivElement>,
    id: number,
    url: string,
  ) {
    e.stopPropagation();
    setVideoDelete({ dialog: true, video: { id, url } });
  }

  // Helpers para o JSX ficar limpo e seguro
  const safeImages = midias.imagem || [];
  const safeVideos = midias.video || [];

  return (
    <>
      {/* ========== TAB SWITCHER ========== */}

      <TabSwitcher
        options={tabOptions}
        activeTab={tabType}
        onTabChange={setTabType}
      />

      {/* ========== IMAGENS ========== */}

      {tabType === "imagem" && (
        <>
          <div className="flex flex-col mb-2 sm:flex-row justify-between items-center bg-[#1E1E1E] p-4 rounded-xl border border-[#333] gap-4 sticky top-0 z-30 shadow-md">
            <div className="text-sm text-neutral-400 font-medium flex items-center gap-2">
              <span className="bg-[#2a2a2a] px-2 py-0.5 rounded text-white border border-[#333]">
                {safeImages.length}
              </span>
              <span>Fotos na galeria</span>
            </div>
            {tab == "aprovado" && safeImages.length > 0 && (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  onClick={() => handleSaveOrderMidia({ key: "imagem" })}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/20 hover:border-amber-500/50 rounded-md transition-all font-medium text-sm h-10 whitespace-nowrap"
                >
                  <Save size={18} />
                  Salvar Ordem
                </Button>
              </div>
            )}
          </div>

          {safeImages.length === 0 ? (
            <div className="w-full bg-[#1E1E1E] p-6 sm:p-10 rounded-xl border border-[#333] text-center text-neutral-500 mb-6">
              <CameraOff size={48} className="mx-auto mb-4 opacity-20" />
              <p>{currentTabInfo.emptyImage}</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEndImage}
            >
              <div
                key={`img-${tab}`}
                className="w-full animate-in fade-in duration-200 bg-[#1E1E1E] rounded-xl p-6 shadow-lg border border-[#333] mb-4"
              >
                {/* CORREÇÃO 5: Passando a lista segura */}
                <SortableContext
                  items={safeImages}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {safeImages.map((item) => (
                      <SortableItem key={item.id} id={item.id}>
                        <img
                          src={item.midia[0].url}
                          className="h-full w-full object-cover pointer-events-none"
                          alt="Imagem aprovada"
                        />
                        <div className="absolute top-2 right-2 bg-black/40 p-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <Move size={12} className="text-white" />
                        </div>
                        {item?.notifications?.[0]?.data?.motivo &&
                          tab === "reprovado" && (
                            <div
                              onPointerDown={(e) => e.stopPropagation()}
                              onClick={() =>
                                setFailed({
                                  dialog: true,
                                  message:
                                    item?.notifications?.[0]?.data?.motivo,
                                })
                              }
                              className="absolute bottom-12 right-2 bg-amber-500/50 hover:bg-amber-500 duration-200 p-1.5 z-20 rounded-full backdrop-blur shadow-lg cursor-pointer pointer-events-auto"
                            >
                              <MessageCircleX
                                size={20}
                                className="text-white"
                              />
                            </div>
                          )}
                        <div
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) =>
                            handleOnRemoveImage(e, item.id, item.midia[0].url)
                          }
                          className="absolute bottom-2 right-2 bg-red-600/50 hover:bg-red-600 duration-200 p-2 z-20 rounded-full backdrop-blur shadow-lg cursor-pointer pointer-events-auto"
                        >
                          <Trash size={16} className="text-white" />
                        </div>
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </div>
            </DndContext>
          )}
        </>
      )}

      {/* ========== DIALOG DELETE IMAGE ========== */}
      <Dialog
        open={imageDelete.dialog}
        onClose={() => {
          setImageDelete({ dialog: false, image: undefined });
        }}
        title="Remover imagem"
        subtitle="Deseja realmente remover essa imagem?"
        className="max-w-xl"
      >
        <div className="group relative aspect-square bg-neutral-800 rounded-lg overflow-hidden">
          {imageDelete.image && (
            <img
              src={imageDelete.image.url}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="w-full flex items-center justify-end gap-2">
          <Button
            onClick={() => setImageDelete({ dialog: false, image: undefined })}
            className="bg-neutral-800 hover:bg-neutral-700"
          >
            Cancelar
          </Button>
          <Button
            className="bg-red-800 hover:bg-red-700"
            onClick={() => deleteMidia("imagem")}
          >
            Remover
          </Button>
        </div>
      </Dialog>

      {/* ========== VIDEOS ========== */}

      {tabType === "video" && (
        <>
          <div className="flex flex-col mb-2 sm:flex-row justify-between items-center bg-[#1E1E1E] p-4 rounded-xl border border-[#333] gap-4 sticky top-0 z-30 shadow-md">
            <div className="text-sm text-neutral-400 font-medium flex items-center gap-2">
              <span className="bg-[#2a2a2a] px-2 py-0.5 rounded text-white border border-[#333]">
                {safeVideos.length}
              </span>
              <span>Videos na galeria</span>
            </div>
            {tab === "aprovado" && safeVideos.length > 0 && (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  onClick={() => handleSaveOrderMidia({ key: "video" })}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/20 hover:border-amber-500/50 rounded-md transition-all font-medium text-sm h-10 whitespace-nowrap"
                >
                  <Save size={18} />
                  Salvar Ordem
                </Button>
              </div>
            )}
          </div>

          {safeVideos.length === 0 ? (
            <div className="w-full bg-[#1E1E1E] p-6 sm:p-10 rounded-xl border border-[#333] text-center text-neutral-500">
              <VideoOff size={48} className="mx-auto mb-4 opacity-20" />
              <p>Nenhum vídeo na galeria</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEndVideo}
            >
              <div
                key={`vid-${tab}`}
                className="w-full animate-in fade-in duration-200 bg-[#1E1E1E] rounded-xl p-6 shadow-lg border border-[#333]"
              >
                <SortableContext
                  items={safeVideos}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {safeVideos.map((item) => (
                      <SortableItem key={item.id} id={item.id}>
                        <video
                          src={item.midia[0].url}
                          className="h-full w-full object-cover pointer-events-none bg-black"
                          muted
                          playsInline
                          preload="metadata"
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewVideo(item.midia[0].url)}
                          onPointerDown={(e) => e.stopPropagation()}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 hover:scale-110 transition-all p-4 rounded-full backdrop-blur-sm cursor-pointer z-20 group-hover:bg-amber-500/80"
                          title="Visualizar vídeo"
                        >
                          <Play size={24} className="text-white fill-white" />
                        </button>

                        <div className="absolute top-2 right-2 bg-black/40 p-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <Move size={12} className="text-white" />
                        </div>

                        {item?.notifications?.[0]?.data?.motivo &&
                          tab === "reprovado" && (
                            <div
                              onPointerDown={(e) => e.stopPropagation()}
                              onClick={() =>
                                setFailed({
                                  dialog: true,
                                  message:
                                    item?.notifications?.[0]?.data?.motivo,
                                })
                              }
                              className="absolute bottom-12 right-2 bg-amber-500/50 hover:bg-amber-500 duration-200 p-1.5 z-20 rounded-full backdrop-blur shadow-lg cursor-pointer pointer-events-auto"
                            >
                              <MessageCircleX
                                size={20}
                                className="text-white"
                              />
                            </div>
                          )}

                        <div
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) =>
                            handleOnRemoveVideo(e, item.id, item.midia[0].url)
                          }
                          className="absolute bottom-2 right-2 bg-red-600/60 hover:bg-red-600 duration-200 p-2 z-20 rounded-full backdrop-blur shadow-lg cursor-pointer"
                          title="Remover vídeo"
                        >
                          <Trash size={16} className="text-white" />
                        </div>
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </div>
            </DndContext>
          )}
        </>
      )}

      <Dialog
        open={videoDelete.dialog}
        onClose={() => {
          setVideoDelete({ dialog: false, video: undefined });
        }}
        title="Remover vídeo"
        subtitle="Deseja realmente remover esse vídeo?"
      >
        <div className="group relative aspect-square bg-neutral-800 rounded-lg overflow-hidden">
          {videoDelete.video && (
            <video
              src={videoDelete.video.url}
              className="mx-auto h-full w-full object-cover bg-black rounded-lg"
              muted
              playsInline
              preload="metadata"
            />
          )}
        </div>
        <div className="w-full flex items-center justify-end gap-2">
          <Button
            onClick={() => setVideoDelete({ dialog: false, video: undefined })}
            className="bg-neutral-800 hover:bg-neutral-700"
          >
            Cancelar
          </Button>
          <Button
            className="bg-red-800 hover:bg-red-700"
            onClick={() => deleteMidia("video")}
          >
            Remover
          </Button>
        </div>
      </Dialog>

      <Dialog
        open={failed.dialog}
        title="Motivo da reprovação:"
        onClose={() => {
          setFailed({ dialog: false, message: "" });
        }}
      >
        <p className="text-white">{failed.message}</p>
        <Link
          className="text-sm mt-2 hover:underline"
          href="/anunciante/diretrizes"
        >
          Clique aqui para ver as diretrizes completas.
        </Link>
      </Dialog>

      <PreviewVideo
        previewVideo={previewVideo}
        setPreviewVideo={setPreviewVideo}
      />
    </>
  );
}
