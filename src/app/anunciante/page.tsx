import AnunciosList from "@/components/page/dashboard/anunciante/anuncios";

export default async function DashboardAnct() {
  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-4xl rounded-lg gap-2">
        <h1 className="text-xl md:text-2xl font-[500]">Meus Anúncios</h1>
        <AnunciosList />
      </div>
    </div>
  );
}
