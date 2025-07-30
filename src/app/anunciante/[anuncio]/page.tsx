import FormPost from "@/components/form/post";
import ListAnuncios from "@/components/list/anuncio";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAnuncioId, getFeedAction } from "./action";

export default async function Anuncio({ params }: any) {
  const { anuncio } = await params;
  const item = await getAnuncioId(anuncio);
  const feed = await getFeedAction();

  if (!item) {
    redirect(`/anunciante`);
  }

  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-3xl rounded-lg gap-6 mb-4">
        <p className="text-xl md:text-2xl font-[500]">Detalhes do Anúncio</p>
        <ListAnuncios item={item}>
          <Link className="w-full" href={`${anuncio}/editar`}>
            <Button className="w-full">Editar informações</Button>
          </Link>
        </ListAnuncios>
        <p className="text-xl md:text-2xl">Postar no Feed</p>
        <FormPost />
      </div>
      {feed.length > 0 && (
        <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-3xl rounded-lg space-y-8">
          {feed.map((item, index) => (
            <div
              key={item.id}
              className="w-full border-b border-b-neutral-600 pb-8 last:border-b-0 last:pb-0"
            >
              <p className="text-sm text-neutral-200 mb-4">{item.conteudo}</p>

              <div className="flex justify-center">
                {item.tipo === "imagem" && item.midia?.[0]?.url ? (
                  <Image
                    src={item.midia[0].url}
                    alt="Imagem do conteúdo"
                    width={240}
                    height={240}
                    className="rounded-lg max-h-[360px] object-contain"
                  />
                ) : item.tipo === "video" && item.midia?.[0]?.url ? (
                  <video
                    src={item.midia[0].url}
                    controls
                    className="rounded-lg max-h-[360px] w-full max-w-xs object-contain"
                  />
                ) : (
                  <span className="text-neutral-400 text-sm italic">
                    Mídia não disponível
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
