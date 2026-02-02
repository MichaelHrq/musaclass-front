"use client";

import { getFeedAction } from "@/app/anunciante/[anuncio]/action";
import FormPost from "@/components/form/post";
import Loading from "@/components/loading";
import { TabOption, TabSwitcher } from "@/components/tab-switcher";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  ChevronLeft,
  CircleCheck,
  CircleEllipsis,
  CircleX,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import TabMidias from "./editar/tab-midia";

type PropsType = {
  anuncioId: string;
};

export type tabMidiaType = "aprovado" | "reprovado" | "pendente";

export default function AnuncioPage({ anuncioId }: PropsType) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["midias", anuncioId],
    queryFn: () => getFeedAction({ anuncio: anuncioId }),
    enabled: !!anuncioId,
  });

  const search = useSearchParams();
  const title = search.get("title") || "";
  const cidade = search.get("cidade") || "";
  const vencimento = search.get("vencimento") || "";

  const [tab, setTab] = useState<tabMidiaType>("aprovado");

  const tabOptions: TabOption<tabMidiaType>[] = [
    { id: "aprovado", label: "Aprovado", icon: CircleCheck },
    { id: "reprovado", label: "Reprovado", icon: CircleX },
    { id: "pendente", label: "Pendente", icon: CircleEllipsis },
  ];

  return (
    <>
      <div className="w-full bg-[#1E1E1E] rounded-xl p-4 flex items-center gap-5 shadow-lg mb-4">
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

      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full rounded-lg gap-6 mb-6 sm:mb-8">
        <p className="text-xl md:text-2xl">Postar mídia</p>
        <FormPost anuncioId={anuncioId} />
      </div>

      <TabSwitcher
        options={tabOptions}
        activeTab={tab}
        onTabChange={setTab}
        disabled={isLoading}
      />

      {isLoading ? (
        <div className="w-full bg-[#1E1E1E] p-6 sm:p-10 rounded-xl border border-[#333] text-center text-neutral-500">
          <Loading className="mx-auto mb-4 opacity-20" />
          <p>Buscando mídias</p>
        </div>
      ) : (
        <section className="w-full">
          {tab === "aprovado" && (
            <TabMidias
              tab={tab}
              anuncioId={anuncioId}
              data={data?.aprovado ?? { imagem: [], video: [] }}
            />
          )}

          {tab === "reprovado" && (
            <TabMidias
              tab={tab}
              anuncioId={anuncioId}
              data={data?.reprovado ?? { imagem: [], video: [] }}
            />
          )}

          {tab === "pendente" && (
            <TabMidias
              tab={tab}
              anuncioId={anuncioId}
              data={data?.pendente ?? { imagem: [], video: [] }}
            />
          )}
        </section>
      )}
    </>
  );
}

// <div className="w-full bg-[#1E1E1E] p-6 sm:p-10 rounded-xl border border-[#333] text-center text-neutral-500">
//   <CircleEllipsis size={48} className="mx-auto mb-4 opacity-20" />
//   <p>Conteúdo Pendente Aqui</p>
// </div>
