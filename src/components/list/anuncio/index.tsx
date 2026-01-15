import { AnuncioWPType } from "@/app/gestao/anunciante/type";
import Loading from "@/components/loading";
import { getStatusBadge } from "@/lib/statusBadge";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  FilePen,
  Images,
  MapPin,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";



export default function ListAnuncios({
  item,
  btn,
}: {
  item?: AnuncioWPType;
  btn?: boolean;
}) {
  if (!item) {
    return (
      <div className="w-full flex justify-center items-center h-40 mt-4 p-4 border border-[#444] rounded-lg bg-[#2A2A2A]">
        <Loading />
      </div>
    );
  }

  // Estilos dos botões
  const buttonBaseClass =
    "flex items-center justify-center gap-2 w-full text-xs font-medium py-2 px-3 rounded-lg transition-colors border border-[#444]";
  const buttonGrayClass =
    "bg-[#3c3c3c] hover:bg-[#4d4d4d] text-white hover:border-[#666]";

  return (
    // Removida a borda, padding extra e background do container principal
    <div className="w-full flex flex-col md:flex-row items-start gap-4 mb-6 last:mb-0">
      {/* Imagem */}
      <Image
        src={item.imgcapa}
        alt={`Capa do anúncio de ${item.title}`}
        width={360}
        height={360}
        className="w-full h-48 md:w-36 md:h-36 rounded-md object-cover flex-shrink-0 bg-neutral-800"
      />

      <div className="flex flex-col w-full h-full min-h-[144px]">
        {/* Título */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-white">{item.title}</h3>
        </div>

        {/* Metadados (Cidade, Data, Status) */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-y-2 gap-x-4 text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin size={16} className="text-gray-500" />
            <span>{item.cidadeanome}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays size={16} className="text-gray-500" />
            <span>Vencimento: {item.vencimento}</span>
          </div>
          <div>{getStatusBadge(item.status)}</div>
        </div>

        {btn && (
          <div className="mt-auto grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Botão 1: Editar Anúncio */}
            <Link
              href={`anunciante/${item.id}/editar`}
              className={`${buttonBaseClass} ${buttonGrayClass}`}
            >
              <FilePen size={14} />
              Editar dados do anúncio
            </Link>

            {/* Botão 2: Ver Mídias */}
            <Link
              href={`anunciante/${item.id}?title=${encodeURIComponent(
                item.title
              )}&cidade=${encodeURIComponent(
                item.cidadeanome
              )}&vencimento=${encodeURIComponent(item.vencimento)}`}
              className={`${buttonBaseClass} ${buttonGrayClass}`}
            >
              <Images size={14} />
              Ver mídias
            </Link>

            {/* Botão 3: Ver Anúncio (Externo) */}
            {item.url ? (
              <Link
                href={item.url.toString()}
                target="_blank"
                rel="noopener noreferrer"
                className={`${buttonBaseClass} bg-transparent border-dashed border-[#555] text-gray-300 hover:text-white hover:border-gray-400 hover:bg-[#333]`}
              >
                <ExternalLink size={14} />
                Ver anúncio
              </Link>
            ) : (
              <button
                disabled
                className={`${buttonBaseClass} opacity-40 cursor-not-allowed border-dashed bg-transparent text-gray-500`}
              >
                <ExternalLink size={14} />
                Sem link
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
