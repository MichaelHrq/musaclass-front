import AnuncioPage from "@/components/page/anuncio";
import { ParamsType } from "@/interface";

export default async function Anuncio({ params }: ParamsType) {
  const { anuncio } = await params;
  return (
    <div className="container flex flex-col items-center justify-center">
      <AnuncioPage anuncioId={anuncio as string} />
    </div>
  );
}
