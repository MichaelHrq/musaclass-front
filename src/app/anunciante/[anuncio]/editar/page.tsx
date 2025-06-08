import FormAnuncio from "@/components/form/anuncio";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAnuncioInfos } from "../action";

export default async function EditarAnuncio({ params }: any) {
  const { anuncio } = await params;
  const { edit, infos } = await getAnuncioInfos(anuncio);
  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-3xl rounded-lg gap-6">
        <p className="text-xl md:text-2xl font-[500]">Editar Anúncio</p>
        <div className="flex justify-between items-center w-full">
          <span className="text-lg md:text-xl text-gray-400">{infos.titulo}</span>
          {infos.url && (
            <Link href={infos.url} target="_blank">
              <Button>Vizualizar anúncio</Button>
            </Link>
          )}
        </div>
        <FormAnuncio edit={edit} />
      </div>
    </div>
  );
}
