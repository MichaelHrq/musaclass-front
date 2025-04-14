import { MediaProps } from "@/app/gestao/types";
import ImagePost from "./image-post";
import VideoPost from "./video-post";


export default function TypeMedia({ media }: { media: MediaProps }) {
  switch (media.tipo) {
    case "imagem":
      return <ImagePost url={media.url} />;
    case "video":
      return <VideoPost url={media.url} />;
    default:
      return (
        <p className="text-sm text-gray-400">Tipo de mídia não suportado</p>
      );
  }
}