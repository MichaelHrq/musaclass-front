import { AnuncioWPType } from "@/app/gestao/anunciante/type";
import Loading from "@/components/loading";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "publicado":
      return (
        <div className="flex items-center gap-1.5 text-green-400">
          <CheckCircle2 size={16} /> {/* Ícone do Lucide */}
          <span>Publicado</span>
        </div>
      );
    case "não publicado":
      return (
        <div className="flex items-center gap-1.5 text-red-400">
          <XCircle size={16} /> {/* Ícone do Lucide */}
          <span>Não publicado</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-1.5 text-yellow-400">
          <Clock size={16} /> {/* Ícone do Lucide */}
          <span>{status}</span>
        </div>
      );
  }
};

export default function ListAnuncios({ item }: { item?: AnuncioWPType }) {
  if (!item) {
    return (
      <div className="w-full flex justify-center items-center h-40 mt-4 p-4 border border-[#444] rounded-lg bg-[#2A2A2A]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col md:flex-row items-start gap-4">
      <Image
        src={item.imgcapa}
        alt={`Capa do anúncio de ${item.title}`}
        width={360}
        height={360}
        className="w-full h-48 md:w-32 md:h-auto rounded-md object-cover flex-shrink-0"
      />

      <div className="flex flex-col w-full h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{item.title}</h3>
        </div>

        <div className="flex flex-col sm:flex-wrap gap-y-2 gap-x-4 text-sm text-gray-300 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin size={16} className="text-gray-500" />{" "}
            <span>{item.cidadeanome}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays size={16} className="text-gray-500" />{" "}
            <span>Vencimento: {item.vencimento}</span>
          </div>
          <div>{getStatusBadge(item.status)}</div>
        </div>

        {item.url && (
          <div className="mt-auto">
            <Link
              href={item.url.toString()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full text-xs sm:text-sm sm:w-auto text-center bg-[#3c3c3c] hover:bg-[#4d4d4d] text-white py-2 px-4 rounded-lg transition-colors"
            >
              Visualizar anúncio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
