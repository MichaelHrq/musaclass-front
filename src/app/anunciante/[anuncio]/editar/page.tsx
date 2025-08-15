import EditarAnuncioPage from "@/components/page/anuncio/editar";
import { ParamsType } from "@/interface";

export default async function EditarAnuncio({ params }: ParamsType) {
  const { anuncio } = await params;
  
  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-3xl rounded-lg gap-6">
        <p className="text-xl md:text-2xl font-[500]">Editar Anúncio</p>
        <EditarAnuncioPage anuncioId={anuncio as string}/> 
      </div>
    </div>
  );
}
