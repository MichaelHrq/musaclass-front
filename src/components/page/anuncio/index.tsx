"use client";

import { getAnuncioId, getFeedAction } from "@/app/anunciante/[anuncio]/action";
import Feed from "@/components/feed";
import FormPost from "@/components/form/post";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { getStatusBadge } from "@/lib/statusBadge";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CalendarDays, ChevronLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type PropsType = {
  anuncioId: string;
};

export default function AnuncioPage({ anuncioId }: PropsType) {
  const queryClient = useQueryClient();

  // Query para os detalhes do anúncio (não paginado)
  const { data: anuncioData, isLoading: isLoadingAnuncio } = useQuery({
    queryKey: ["anuncioDetails", anuncioId],
    queryFn: () => getAnuncioId(anuncioId),
    enabled: !!anuncioId,
  });

  // Query infinita para o feed (paginado)
  const {
    data: feedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingFeed,
  } = useInfiniteQuery({
    queryKey: ["feed", anuncioId],
    queryFn: ({ pageParam }) =>
      getFeedAction({ anuncio: anuncioId, pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.current_page < lastPage.last_page) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
    enabled: !!anuncioId,
  });

  const feedItems = feedData?.pages.flatMap((page) => page.data) ?? [];
  const isLoading = isLoadingAnuncio || isLoadingFeed;

  const search = useSearchParams();
  const title = search.get("title") || "";
  const cidade = search.get("cidade") || "";
  const vencimento = search.get("vencimento") || "";

  return (
    <>
      <div className="w-full max-w-3xl mx-auto bg-[#1E1E1E] rounded-xl p-4 flex items-center gap-5 shadow-lg mb-4">
        {/* Botão Voltar */}
        <Link
          href="/anunciante" // Coloque a rota correta de voltar aqui
          className="group flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-white transition-colors min-w-[60px]"
        >
          <div className="p-2 rounded-full bg-[#2a2a2a] group-hover:bg-[#333] transition-all border border-[#333] group-hover:border-[#444]">
            <ChevronLeft size={20} />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wider">
            Voltar
          </span>
        </Link>

        {/* Divisória Vertical */}
        <div className="h-10 w-px bg-[#333]"></div>

        {/* Informações Principais */}
        <div className="flex flex-col justify-center">
          <h3 className="font-bold text-xl text-white mb-1 leading-tight">
            {title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-gray-500" />
              <span className="font-medium text-gray-500">{cidade}</span>
            </div>

            {/* Pequeno ponto separador (opcional, visual) */}
            <div className="hidden sm:block w-1 h-1 rounded-full bg-[#333]"></div>

            <div className="flex items-center gap-1.5">
              <CalendarDays size={14} className="text-gray-500" />
              <span>
                Vencimento: <span className="text-gray-500">{vencimento}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-3xl rounded-lg gap-6 mb-4">
        <p className="text-xl md:text-2xl">Postar mídia</p>
        <FormPost anuncioId={anuncioId} />
      </div>

      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-3xl rounded-lg space-y-6">
        <p className="text-xl md:text-2xl font-[500]">Minhas mídias</p>
        {isLoading ? (
          <Loading />
        ) : (
          <Feed anuncio={anuncioId} items={feedItems} />
        )}
        {hasNextPage && (
          <div className="w-full flex justify-center mt-8">
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? <Loading /> : "Mostrar mais"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
