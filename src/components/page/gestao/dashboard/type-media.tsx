// @/app/gestao/dashboard/type-media.tsx (ou onde estiver)
import { MediaProps } from "@/app/gestao/types"; // Garanta que este tipo esteja definido e exportado
import ImagePost from "./image-post";
import VideoPost from "./video-post";

interface TypeMediaComponentProps {
  media: MediaProps;
  altText?: string; // altText é opcional, mas recomendado para imagens
}

export default function TypeMedia({ media, altText }: TypeMediaComponentProps) {
  if (!media || !media.url) {
    return <p className="text-sm text-gray-500 italic">Mídia indisponível.</p>;
  }

  switch (media.tipo) {
    case "imagem":
      return <ImagePost url={media.url} alt={altText || "Imagem da postagem"} />;
    case "video":
      return <VideoPost url={media.url} />;
    default:
      return (
        <p className="text-sm text-orange-400">
          Tipo de mídia "{media.tipo}" não suportado. URL: {media.url}
        </p>
      );
  }
}