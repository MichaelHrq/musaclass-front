"use client";

import { Button } from "@/components/ui/button";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Move, Play, Save, Trash, Upload, X } from "lucide-react";
import { useState } from "react";

interface SortableVideoProps {
  url: string;
  id: string;
  onRemove: (id: string) => void;
  onPlay: (url: string) => void;
}

function SortableVideo({ url, id, onRemove, onPlay }: SortableVideoProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
    touchAction: "none" as React.CSSProperties["touchAction"],
  };

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    onRemove(id);
  }

  function handlePlayClick(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    onPlay(url);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative overflow-hidden rounded-xl border bg-neutral-900 shadow-lg aspect-[9/16] cursor-grab active:cursor-grabbing hover:border-neutral-500 transition-colors touch-none
        ${isDragging ? "border-amber-500 shadow-xl" : "border-neutral-800"}
      `}
    >
      <video
        src={url}
        className="h-full w-full object-cover pointer-events-none bg-black"
        muted
        playsInline
        preload="metadata"
      />

      <button
        type="button"
        onClick={handlePlayClick}
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
        onClick={handleRemove}
        className="absolute bottom-2 right-2 bg-red-600/60 hover:bg-red-600 duration-200 p-2 z-20 rounded-full backdrop-blur shadow-lg cursor-pointer"
        title="Remover vídeo"
      >
        <Trash size={16} className="text-white" />
      </div>
    </div>
  );
}

export default function TabVideosAnuncio() {
  const [items, setItems] = useState([
    {
      id: "v1",
      url: "https://media.musaclass.com.br/019adfe8-f983-7389-ae6b-0b3054cc2d49/posts/video-697203d3e4cbf.mp4",
    },
    {
      id: "v2",
      url: "https://media.musaclass.com.br/019b47cd-dfc7-7171-8a58-928568f84e6a/posts/video-6972260ff0541.mp4",
    },
    {
      id: "v3",
      url: "https://media.musaclass.com.br/019b6b90-5aa2-71d0-a88f-beae8243d28e/posts/video-6970ece5aa5ee.mp4",
    },
    {
      id: "v4",
      url: "https://media.musaclass.com.br/0199ee40-a679-706d-980f-f6b30e25c6cd/posts/video-6970fc12878c1.mp4",
    },
    {
      id: "v5",
      url: "https://media.musaclass.com.br/019b6b90-5aa2-71d0-a88f-beae8243d28e/posts/video-6970ebc8ad9e6.mp4",
    },
  ]);

  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
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

  function handleRemoveItem(id: string) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }

  function handleSaveOrder() {
    console.log("Ordem e lista final de vídeos:", items);
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
            <label className="flex-1 sm:flex-none cursor-pointer">
              <input type="file" className="hidden" accept="video/*" />
              <div className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:border-blue-500/50 rounded-md transition-all font-medium text-sm h-10 whitespace-nowrap">
                <Upload size={16} />
                Importar Vídeo
              </div>
            </label>
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
                    <SortableVideo
                      key={item.id}
                      id={item.id}
                      url={item.url}
                      onRemove={handleRemoveItem}
                      onPlay={setPreviewVideo}
                    />
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

      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
          <button
            onClick={() => setPreviewVideo(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all z-50"
          >
            <X size={32} />
          </button>

          <div className="relative w-full max-w-sm aspect-[9/16] max-h-[90vh] bg-black rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 mx-4">
            <video
              src={previewVideo}
              className="w-full h-full object-cover" // object-cover garante que preencha tudo
              controls
              autoPlay
            />
          </div>

          <div
            className="absolute inset-0 -z-10"
            onClick={() => setPreviewVideo(null)}
          />
        </div>
      )}
    </>
  );
}
