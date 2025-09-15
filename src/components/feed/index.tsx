"use client";

import {
  deleteFeedAction,
  getFeedDataType,
  getFeedType,
} from "@/app/anunciante/[anuncio]/action";
import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import Loading from "../loading";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog/dialog";

type PropsType = {
  anuncio: string;
  items: getFeedDataType[];
};

const STATUS_COLORS: Record<string, string> = {
  Pendente: "text-yellow-500",
  Aprovado: "text-green-500",
  Reprovado: "text-red-500",
};

function formatarDataPublicacao(dateString: string): string {
  const parts = dateString.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/);
  if (!parts) return dateString;

  const [day, month, year, hours, minutes] = parts;
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

export default function Feed({ items, anuncio }: PropsType) {
  const queryClient = useQueryClient();
  const [feedItem, setFeedItem] = useState<getFeedDataType>();
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState({
    delete: false,
  });

  const deleteFeedItem = async () => {
    if (!feedItem) return;
    setLoading((cur) => ({ ...cur, delete: true }));
    const res = await deleteFeedAction(feedItem.id);
    setLoading((cur) => ({ ...cur, delete: false }));
    if (res.sucess) {
      setShowDialog(false);
      setFeedItem(undefined);
      queryClient.invalidateQueries({ queryKey: ["feed", anuncio] });
      return toast.success(res.message);
    }
    return toast.error(res.message);
  };

  return (
    <>
      {items.length > 0 ? (
        items.map((item) => (
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
              item.notifications?.[0]?.data?.motivo && (
                <div className="p-2 text-sm bg-red-900 rounded-md mb-4">
                  <span>
                    Motivo da reprovação:{" "}
                    {item?.notifications?.[0]?.data?.motivo}
                  </span>
                </div>
              )}
            <div className="flex justify-center mb-4">
              <>{console.log(item)}</>
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
            <div className="flex gap-4 justify-end mt-2">
              <Button
                className="bg-red-700 hover:bg-red-800"
                onClick={() => {
                  setFeedItem(item);
                  setShowDialog(true);
                }}
              >
                <Trash />
                Remover
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-neutral-400 text-xs md:text-sm">
          Ainda não há publicações neste feed
        </p>
      )}

      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(!showDialog)}
        title="Remover Feed"
        subtitle="Tem certeza que deseja remover este feed? Esta ação não pode ser desfeita."
      >
        <div className="w-full flex justify-end gap-2 mt-4">
          <Button
            disabled={loading.delete}
            onClick={() => setShowDialog(false)}
          >
            Cancelar
          </Button>
          {loading.delete ? (
            <Button className="bg-red-700 hover:bg-red-800">
              <Loading />
            </Button>
          ) : (
            <Button
              onClick={deleteFeedItem}
              className="bg-red-700 hover:bg-red-800"
            >
              Remover
            </Button>
          )}
        </div>
      </Dialog>
    </>
  );
}
