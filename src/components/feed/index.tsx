"use client";

import { getFeedAction, getFeedType } from "@/app/anunciante/[anuncio]/action";
import Image from "next/image";
import { useCallback, useState } from "react";
import FormPost from "../form/post";
import { Button } from "../ui/button";
import { SquarePen, Trash } from "lucide-react";

type PropsType = {
  anuncio: string;
  initialFeed: getFeedType[];
};

const STATUS_COLORS: Record<string, string> = {
  Pendente: "text-yellow-500",
  Aprovado: "text-green-500",
  Reprovado: "text-red-500",
};

function formatarDataPublicacao(dateString: string): string {
  const parts = dateString.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/);
  if (!parts) return dateString;

  const [, day, month, year, hours, minutes] = parts;
  const dateObj = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);

  if (isNaN(dateObj.getTime())) {
    return dateString;
  }

  const dataFormatada = new Intl.DateTimeFormat("pt-BR").format(dateObj);
  const horaFormatada = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);

  return `Data: ${dataFormatada} - Hora: ${horaFormatada}`;
}

export default function Feed({ anuncio, initialFeed }: PropsType) {
  const [feed, setFeed] = useState<getFeedType[]>(initialFeed);
  const fetchData = useCallback(async () => {
    const res = await getFeedAction(anuncio);
    setFeed(res);
  }, [anuncio]);

  return (
    <>
      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-3xl rounded-lg gap-6 mb-4">
        <p className="text-xl md:text-2xl">Postar no Feed</p>
        <FormPost postId={anuncio as string} fetchData={fetchData} />
      </div>

      {feed.length > 0 ? (
        <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-3xl rounded-lg space-y-6">
          <p className="text-xl md:text-2xl font-[500]">Meu Feed</p>
          {feed.map((item) => (
            <div
              key={item.id}
              className="text-xs md:text-[16px] flex flex-col w-full p-4 border border-[#444] rounded-lg bg-[#2A2A2A] gap-2"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-neutral-300 ">
                  {formatarDataPublicacao(item.publicado_em)}
                </p>
                <p
                  className={`text-sm font-semibold  ${
                    STATUS_COLORS[item.publish] ?? "text-neutral-500"
                  }`}
                >
                  {item.publish}
                </p>
              </div>
              {item.publish === "Reprovado" &&
                item.notifications[0].data.motivo && (
                  <div className="p-2 text-sm bg-red-900 rounded-md mb-4">
                    <span>
                      Motivo da reprovação: {item.notifications[0].data.motivo}
                    </span>
                  </div>
                )}
              <div className="flex justify-center mb-4">
                {item.midia?.[0]?.url ? (
                  <>
                    {item.midia[0].tipo === "image" && (
                      <Image
                        src={item.midia[0].url}
                        alt="Imagem do conteúdo"
                        height={1000}
                        width={1000}
                        className="rounded-lg h-96 w-auto object-contain"
                      />
                    )}
                    {item.midia[0].tipo === "video" && (
                      <video
                        src={item.midia[0].url}
                        controls
                        className="rounded-lg h-96 w-full object-contain"
                      />
                    )}
                  </>
                ) : (
                  <span className="text-neutral-400 text-sm italic">
                    Mídia não disponível
                  </span>
                )}
              </div>
              <p className="text-sm text-neutral-200 whitespace-pre-wrap">
                {item.post}
              </p>
              {/* <div className="flex gap-4 justify-end mt-2">
                <Button className="bg-[#444444] hover:bg-[#555555]">
                  <SquarePen />
                  Editar
                </Button>
                <Button className="bg-red-700 hover:bg-red-800">
                  <Trash />
                  Remover
                </Button>
              </div> */}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col bg-[#1E1E1E] items-center justify-center p-10 w-full max-w-3xl rounded-lg space-y-6">
          <p className="text-xl md:text-2xl font-[500]">Meu Feed</p>
          <p className="text-neutral-400 text-xs md:text-sm">
            Ainda não há publicações neste feed
          </p>
        </div>
      )}
    </>
  );
}
