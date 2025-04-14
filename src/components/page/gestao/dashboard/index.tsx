import getPostagensAction from "@/app/gestao/action";
import Link from "next/link";
import TypeMedia from "./type-media";
import AprovarDialog from "@/components/modal/dashboard/aprovar";
import ReprovarDialog from "@/components/modal/dashboard/reprovar";

export default async function Dashboard() {
  const postagens = await getPostagensAction();

  if (!postagens || postagens.length === 0) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl sm:text-3xl font-[500] mb-4">
          Gerenciar Postagens
        </h2>
        <p className="text-gray-400">Nenhuma postagem encontrada</p>
      </div>
    );
  }

  return (
    <div className="container flex flex-col items-center justify-center py-8">
      <h2 className="text-2xl sm:text-3xl font-[500] mb-6">
        Gerenciar Postagens
      </h2>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 bg-[#1E1E1E] rounded-lg p-4 sm:p-8 w-full max-w-[1200px]">
        {postagens.map((item) => (
          <div
            className="bg-[#2A2A2A] border border-[#444444] rounded-md p-4 mb-6 break-inside-avoid-column flex flex-col gap-4"
            key={item.id}
          >
            <div className="text-sm">
              <span className="font-medium">Anunciante: </span>
              <span className="font-normal text-gray-400">
                {item.anunciante}
              </span>
            </div>

            <Link href={`#`} className="text-sm text-blue-400 hover:underline">
              Ver Anúncio
            </Link>

            <div className="text-sm flex justify-between">
              <div>
                <span className="font-medium">Data: </span>
                <span className="font-normal text-gray-400">{item.data}</span>
              </div>
              <div>
                <span className="font-medium">Hora: </span>
                <span className="font-normal text-gray-400">{item.hora}</span>
              </div>
            </div>

            <TypeMedia media={item.midia} />

            <p className="text-sm font-normal text-gray-400">{item.legenda}</p>
            <p className={`text-sm font-medium text-amber-400`}>
              {item.status}
            </p>

            <div className="flex flex-row gap-4 mt-2">
              <AprovarDialog id={item.id} />
              <ReprovarDialog id={item.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
