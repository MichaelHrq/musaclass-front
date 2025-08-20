"use client";

import {
  getAnuncioId,
  getFeedAction,
  getFeedType,
} from "@/app/anunciante/[anuncio]/action";
import { AnuncioType } from "@/app/gestao/anunciante/type";
import Feed from "@/components/feed";
import FormPost from "@/components/form/post";
import ListAnuncios from "@/components/list/anuncio";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useCallback, useEffect, useState } from "react";

type PropsType = {
  anuncioId: string;
};

export type dataAnuncioPageType = {
  feed: getFeedType[];
  anuncio: AnuncioType;
};

export default function AnuncioPage({ anuncioId }: PropsType) {
  const [data, setData] = useState<dataAnuncioPageType>();

  const fetchData = useCallback(async () => {
    const res = await getFeedAction(anuncioId);
    setData((cur) => ({ ...cur!, feed: res }));
  }, []);

  const onDeleteFeedItem = useCallback((id: number) => {
    setData(cur=>({
      ...cur!,
      feed: cur!.feed.filter((item) => item.id !== id),
    }))
  }, []);

  useEffect(() => {
    (async () => {
      const [anuncio, feed] = await Promise.all([
        getAnuncioId(anuncioId),
        getFeedAction(anuncioId),
      ]);
      console.log({ feed, anuncio: anuncio! });
      setData({ feed, anuncio: anuncio! });
    })();
  }, []);

  return (
    <>
      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full justify-center max-w-3xl rounded-lg gap-6 mb-4">
        <p className="text-xl md:text-2xl font-[500]">Detalhes do Anúncio</p>
        <ListAnuncios item={data?.anuncio}>
          <Button asChild className="w-full">
            <Link className="w-full" href={`${anuncioId}/editar`}>
              Editar informações
            </Link>
          </Button>
        </ListAnuncios>
      </div>

      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-3xl rounded-lg gap-6 mb-4">
        <p className="text-xl md:text-2xl">Postar no Feed</p>
        <FormPost postId={anuncioId} fetchData={fetchData} />
      </div>

      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-3xl rounded-lg space-y-6">
        <p className="text-xl md:text-2xl font-[500]">Meu Feed</p>
        {data?.feed ? (
          <Feed
            anuncio={anuncioId}
            initialFeed={data.feed}
            onDeleteFeedItem={onDeleteFeedItem}
          />
        ) : (
          <Loading />
        )}
      </div>
    </>
  );
}
