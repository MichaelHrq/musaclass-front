import Anuncios from "@/components/page/dashboard/anunciante/anuncios";
import { getAnunciosAction } from "./action";

export default async function DashboardAnct() {
  const anuncios = await getAnunciosAction();
  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-2xl rounded-lg gap-2">
        <h1 className="text-3xl font-[500]">Meus Anúncios</h1>
        <Anuncios items={anuncios} />
      </div>
    </div>
  );
}
