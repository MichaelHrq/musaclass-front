import FormAnuncio from "@/components/form/anuncio";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function EditarAnuncio({ params }: any) {
  const { anuncio } = await params;
  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-3xl rounded-lg gap-6">
        <p className="text-3xl font-[500]">Editar Anúncio</p>
        <div className="flex justify-between items-center w-full">
          <span className="text-sm text-gray-400 italic">
            Última atualização: 29/03/2025 às 14:30
          </span>
          <Link href={`/anunciante/${anuncio}`}>
            <Button>Vizualizar anúncio</Button>
          </Link>
        </div>
        <FormAnuncio />
      </div>
    </div>
  );
}
