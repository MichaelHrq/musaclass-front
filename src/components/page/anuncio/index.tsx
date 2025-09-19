"use client";

import {
  getFeedAction,
  getAnuncioId,
} from "@/app/anunciante/[anuncio]/action";
import Feed from "@/components/feed";
import FormPost from "@/components/form/post";
import ListAnuncios from "@/components/list/anuncio";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

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
    queryFn: ({ pageParam }) => getFeedAction({ anuncio: anuncioId, pageParam }),
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

  return (
    <>
      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full justify-center max-w-3xl rounded-lg gap-6 mb-4">
        <p className="text-xl md:text-2xl font-[500]">Detalhes do Anúncio</p>
        <ListAnuncios item={anuncioData}>
          <Button asChild className="w-full mt-2">
            <Link className="w-full" href={`${anuncioId}/editar`}>
              Editar informações
            </Link>
          </Button>
        </ListAnuncios>
      </div>

      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-3xl rounded-lg gap-6 mb-4">
        <p className="text-xl md:text-2xl">Postar no Feed</p>
        <FormPost anuncioId={anuncioId} />
      </div>

      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-3xl rounded-lg space-y-6">
        <p className="text-xl md:text-2xl font-[500]">Meu Feed</p>
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
