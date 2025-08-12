// @/app/gestao/dashboard/page.tsx (ou caminho similar)
import getPostagensAction from "@/app/gestao/action";
import { MediaProps } from "@/app/gestao/types"; // Supondo que MediaProps venha de um arquivo de tipos
import AprovarDialog from "@/components/modal/dashboard/aprovar"; // Ajuste o caminho
import ReprovarDialog from "@/components/modal/dashboard/reprovar"; // Ajuste o caminho
import Link from "next/link";
import TypeMedia from "./type-media"; // Ajuste o caminho se necessário

// Defina um tipo para suas postagens para melhor type safety
interface Postagem {
  id: string; // Ou number, dependendo do seu backend
  anunciante: string;
  data: string; // Considere usar Date e formatar na exibição
  hora: string; // Considere usar Date e formatar na exibição
  midia: MediaProps;
  legenda: string;
  status: string;
  urlAnuncio?: string; // URL para "Ver Anúncio"
}

export default async function Dashboard() {

  let postagens: Postagem[] = [];
  let errorLoadingPosts: string | null = null;

  try {
    // Idealmente, getPostagensAction deve ser robusta e tratar seus próprios erros internos,
    // mas podemos adicionar um try-catch aqui para erros na chamada da action.
    const result = await getPostagensAction(); // Assumindo que retorna Postagem[] ou lança erro.
    // Ou pode retornar { data: Postagem[], error: string | null }
    postagens = result; // Ajuste conforme o retorno da sua action
  } catch (error) {
    console.error("Falha ao buscar postagens:", error);
    errorLoadingPosts =
      "Não foi possível carregar as postagens. Tente novamente mais tarde.";
  }

  if (errorLoadingPosts) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl sm:text-3xl font-medium mb-4">
          Gerenciar Postagens
        </h2>
        <p className="text-red-500">{errorLoadingPosts}</p>
      </div>
    );
  }

  if (!postagens || postagens.length === 0) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl sm:text-3xl font-medium mb-4">
          Gerenciar Postagens
        </h2>
        <p className="text-gray-400">Nenhuma postagem encontrada</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "aprovado":
        return "text-green-400";
      case "reprovado":
        return "text-red-400";
      case "pendente":
      case "em análise":
        return "text-amber-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="container flex flex-col items-center py-8">
      <h2 className="text-2xl sm:text-3xl font-medium mb-6 text-center">
        Gerenciar Postagens
      </h2>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 bg-[#1E1E1E] rounded-lg p-4 sm:p-8 w-full max-w-[1200px]">
        {postagens.map((item) => (
          <div
            className="bg-[#2A2A2A] border border-[#444444] rounded-md p-4 mb-6 break-inside-avoid-column flex flex-col gap-4 shadow-md"
            key={item.id}
          >
            <div className="text-sm">
              <span className="font-medium">Anunciante: </span>
              <span className="font-normal text-gray-300">
                {item.anunciante}
              </span>
            </div>

            <Link
              href={item.urlAnuncio || `/anuncios/${item.id}`} // Levar para uma página de detalhe ou URL externa
              className="text-sm text-blue-400 hover:underline"
              target={item.urlAnuncio ? "_blank" : "_self"}
              rel={item.urlAnuncio ? "noopener noreferrer" : ""}
            >
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

            <TypeMedia
              media={item.midia}
              altText={`Mídia da postagem de ${
                item.anunciante
              }: ${item.legenda.substring(0, 50)}...`}
            />

            {item.legenda && (
              <p className="text-sm font-normal text-gray-300 whitespace-pre-line">
                {item.legenda}
              </p>
            )}

            <p
              className={`text-sm font-semibold ${getStatusColor(item.status)}`}
            >
              Status: {item.status}
            </p>

            <div className="flex flex-row gap-4 mt-2 pt-4 border-t border-[#444444]">
              <AprovarDialog postId={item.id} anunciante={item.anunciante} />
              <ReprovarDialog postId={item.id} anunciante={item.anunciante} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
