"use client";

import TabImagensAnuncio from "@/components/page/anuncios/editar/tab-imagens";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ExternalLink,
  FileText,
  Image,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getPostAnuncioInfosById } from "../../action";

type tabType = "form" | "image" | "video";

export default function EditarAnuncio() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["edit-anuncio", id],
    queryFn: () => getPostAnuncioInfosById(id as string),
    // gcTime: 0,
    // staleTime: 0,
  });

  const [tab, setTab] = useState<tabType>("form");

  const tabOptions = [
    { id: "form", label: "Formulário", icon: FileText },
    { id: "image", label: "Imagens", icon: ImageIcon },
    { id: "video", label: "Vídeos", icon: Video },
  ];

  // console.log(data)

  return (
    <div className="container flex flex-col items-center">
      <div className="flex flex-col w-full max-w-6xl overflow-hidden">
        <div className="w-full bg-[#1E1E1E] rounded-xl p-4 flex items-center gap-3 sm:gap-5 shadow-lg border border-[#333] mb-6 sm:mb-8">
          <Link
            href="/gestao/anuncios"
            className="group flex flex-col items-center justify-center gap-1 text-neutral-500 hover:text-white transition-colors min-w-[50px] sm:min-w-[60px]"
          >
            <div className="p-1.5 sm:p-2 rounded-full bg-[#2a2a2a] group-hover:bg-[#333] transition-all border border-[#333] group-hover:border-[#444]">
              <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider">
              Voltar
            </span>
          </Link>

          <div className="h-8 sm:h-10 w-px bg-[#333]"></div>

          <div className="flex flex-col justify-center overflow-hidden">
            <span className="text-[10px] sm:text-xs text-neutral-500 uppercase font-semibold tracking-wide truncate">
              Editando Anúncio
            </span>
            <h3 className="font-bold text-base sm:text-xl text-white leading-tight truncate">
              {isLoading
                ? "Carregando..."
                : data?.form?.infos?.titulo || "Sem título"}
            </h3>
          </div>

          <div>
            <Link
              href={data?.form.infos.url || "#"}
              target="_blank"
              className="group flex flex-col items-center justify-center gap-1 text-neutral-500 hover:text-white transition-colors min-w-[50px] sm:min-w-[60px]"
            >
              <div className="p-1.5 sm:p-2 rounded-full bg-[#2a2a2a] group-hover:bg-[#333] transition-all border border-[#333] group-hover:border-[#444]">
                <ExternalLink size={18} className="sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider">
                Anúncio
              </span>
            </Link>
          </div>
        </div>

        <div className="mb-6 sm:mb-8 w-full flex justify-center">
          <div className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex p-1 bg-[#1E1E1E] border border-[#333] rounded-xl sm:rounded-full shadow-inner gap-1">
            {tabOptions.map((item) => {
              const isActive = tab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  // disabled={isLoading}
                  onClick={() => setTab(item.id as tabType)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 rounded-lg sm:rounded-full font-medium transition-all duration-300 ease-out whitespace-nowrap",
                    "text-xs sm:text-sm px-1 sm:px-6",
                    isActive
                      ? "bg-neutral-100 text-neutral-950 shadow-md transform scale-[1.02]"
                      : "text-neutral-400 hover:text-white hover:bg-[#2a2a2a]",
                  )}
                >
                  <Icon
                    className="w-4 h-4 sm:w-4 sm:h-4"
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <section key={tab} className="w-full animate-in fade-in duration-500">
          {tab === "form" && (
            <div className="w-full bg-[#1E1E1E] p-6 sm:p-10 rounded-xl border border-[#333] text-center text-neutral-500">
              <FileText size={48} className="mx-auto mb-4 opacity-20" />
              <p>Conteúdo do Formulário Aqui</p>
            </div>
          )}

          {tab === "image" && (
            <>
              {data?.imagens ? (
                <TabImagensAnuncio
                  postId={id as string}
                  images={data.imagens}
                />
              ) : (
                <div className="w-full bg-[#1E1E1E] p-6 sm:p-10 rounded-xl border border-[#333] text-center text-neutral-500">
                  <Image size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Nehuma imagem encontrada</p>
                </div>
              )}
            </>
          )}

          {tab === "video" && (
            <div className="w-full bg-[#1E1E1E] p-6 sm:p-10 rounded-xl border border-[#333] text-center text-neutral-500">
              <Video size={48} className="mx-auto mb-4 opacity-20" />
              <p>Conteúdo dos Vídeos Aqui</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
