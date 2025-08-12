'use client'

import { getFeedAction, getFeedType } from "@/app/anunciante/[anuncio]/action";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import FormPost from "../form/post";

type PropsType = {
  anuncio: string;
};

export default function Feed({ anuncio }: PropsType) {
  const [feed, setFeed] = useState<getFeedType[]>([]);

  const fetchData = useCallback(async () => {
    const res = await getFeedAction(anuncio)
    setFeed(res)
  },[])

  useEffect(() => {
    fetchData()
  }, []);

  return (
    <>
      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-3xl rounded-lg gap-6 mb-4">
        <p className="text-xl md:text-2xl">Postar no Feed</p>
        <FormPost postId={anuncio as string} fetchData={fetchData}/>
      </div>

      {feed.length > 0 && (
        <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-3xl rounded-lg space-y-8">
          <p className="text-xl md:text-2xl font-[500]">Feed</p>
          {feed.map((item) => (
            <div
              key={item.id}
              className="text-xs md:text-[16px] flex flex-col w-full mt-4 p-4 border-1 border-[#444] rounded-lg bg-[#2A2A2A] gap-2 last:border-b-0 last:pb-0"
            >
              <div className="flex justify-between">
                <p className="text-sm text-neutral-200 mb-4">
                  {item.publicado_em.replace(
                    /(\d{2}\/\d{2}\/\d{4}) (\d{2}:\d{2})/,
                    "Data: $1 - Hora: $2"
                  )}
                </p>
                <p className="text-sm text-neutral-200 mb-4">{item.publish}</p>
              </div>
              <div className="flex justify-center">
                {item.midia?.[0]?.midia.endsWith(".png") &&
                item.midia?.[0]?.url ? (
                  <Image
                    src={item.midia[0].url}
                    alt="Imagem do conteúdo"
                    height={1000}
                    width={1000}
                    className="rounded-lg h-96 w-auto object-contain"
                  />
                ) : item.midia?.[0]?.midia.endsWith(".mp4") &&
                  item.midia?.[0]?.url ? (
                  <video
                    src={item.midia[0].url}
                    controls
                    className="rounded-lg h-96 w-full object-contain"
                  />
                ) : (
                  <span className="text-neutral-400 text-sm italic">
                    Mídia não disponível
                  </span>
                )}
              </div>
              <p className="text-sm text-neutral-200 mb-4">{item.post}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
