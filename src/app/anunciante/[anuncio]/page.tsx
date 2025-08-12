import Feed from "@/components/feed";
import ListAnuncios from "@/components/list/anuncio";
import { Button } from "@/components/ui/button";
import { ParamsType } from "@/interface";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAnuncioId } from "./action";

export default async function Anuncio({ params }: ParamsType) {
  const { anuncio } = await params;

  const item = await getAnuncioId(anuncio as string);

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
      </div>
      <Feed anuncio={anuncio as string} />
    </div>
  );
}
