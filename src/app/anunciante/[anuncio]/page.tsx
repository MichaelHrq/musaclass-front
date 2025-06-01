import FormPost from "@/components/form/post";
import ListAnuncios from "@/components/list/anuncio";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAnuncioId } from "./action";

export default async function Anuncio({ params }: any) {
  const { anuncio } = await params;
  const item = await getAnuncioId(anuncio);

  if (!item) {
    redirect(`/anunciante`);
  }

  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-3xl rounded-lg gap-6">
        <p className="text-3xl font-[500]">Detalhes do Anúncio</p>
        <ListAnuncios item={item}>
          <Link className="w-full" href={`${anuncio}/editar`}>
            <Button className="w-full">Editar informações</Button>
          </Link>
        </ListAnuncios>
        <p className="text-2xl">Postar no Feed</p>
        <FormPost />
      </div>
    </div>
  );
}
