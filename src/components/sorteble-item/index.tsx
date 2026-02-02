import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type CSSProperties } from "react";

export default function SortableItem({
  id,
  children,
}: {
  id: string | number;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
    // Permite scroll e zoom (manipulation), mas deixa o JS tentar capturar o evento de segurar
    touchAction: "manipulation",
    // Prevenção extra para iOS (impede selecionar texto ou abrir menu ao segurar)
    // @ts-ignore
    WebkitTouchCallout: "none",
    WebkitUserSelect: "none",
    userSelect: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onContextMenu={(e) => e.preventDefault()}
      className={`group relative overflow-hidden rounded-xl border bg-neutral-900 shadow-lg aspect-[3/4] cursor-grab active:cursor-grabbing hover:border-neutral-500 transition-colors
        ${isDragging ? "border-amber-500 shadow-xl" : "border-neutral-800"}
      `}
    >
      {children}
    </div>
  );
}
