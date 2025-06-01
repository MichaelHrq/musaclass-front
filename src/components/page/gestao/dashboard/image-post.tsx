// Este componente é um Server Component por ser async.
// A diretiva "use server" não é para componentes, mas para Server Actions.
import getBase64 from "@/lib/plaiceholder"; // Função que gera o placeholder
import Image from "next/image";

interface ImagePostProps {
  url: string;
  alt: string; // Tornar o alt text obrigatório e significativo
}

export default async function ImagePost({ url, alt }: ImagePostProps) {
  let blurDataURLValue: string | undefined;
  try {
    if (url) { // Só tenta gerar se a URL existir
      blurDataURLValue = await getBase64(url);
    }
  } catch (error) {
    console.error(`Falha ao gerar Base64 para a imagem ${url}:`, error);
    // Prossegue sem blurDataURL se houver erro
  }

  if (!url) {
    return <div className="relative w-full aspect-video bg-gray-700 rounded-md flex items-center justify-center text-gray-400">Imagem não disponível</div>;
  }

  return (
    <div className="relative w-full aspect-video sm:h-64 overflow-hidden rounded-md bg-gray-800">
      {/* aspect-video mantém proporção 16:9. Se h-64 for fixo, fill se adapta. */}
      {/* Ajuste 'sizes' conforme seu layout de colunas para otimização */}
      <Image
        src={url}
        alt={alt}
        fill
        className="object-cover" // object-cover é importante com fill
        placeholder={blurDataURLValue ? "blur" : "empty"}
        blurDataURL={blurDataURLValue}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>
  );
}