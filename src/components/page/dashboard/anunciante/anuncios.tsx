"use client";

import { getAnunciosAction } from "@/app/anunciante/action";
import { AnuncioWPType } from "@/app/gestao/anunciante/type";
import ListAnuncios from "@/components/list/anuncio";
import Loading from "@/components/loading";
import ButtonIcon from "@/components/ui/button/icon";
import { Ellipsis, FilePen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AnunciosList() {
  const [anuncios, setAnuncios] = useState<AnuncioWPType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setAnuncios(await getAnunciosAction());
      setLoading(false);
    })();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : anuncios?.length > 0 ? (
        anuncios?.map((item) => (
          <div
            key={item.id}
            className="w-full mt-4 p-4 border border-[#444] rounded-lg bg-[#2A2A2A] flex flex-col gap-2 text-white relative"
          >
            <ListAnuncios item={item} />
            {(item.status !== "Não publicado" && !!item.cidadeanome) && (
              <ButtonIcon tooltip="Ver detalhes">
                <Link href={`anunciante/${item.id}`} className="flex gap-1 items-center text-xs">
                  <FilePen size={16} /> Editar
                </Link>
              </ButtonIcon>
            )}
          </div>
        ))
      ) : (
        <p className="mt-8 text-neutral-400">Nenhum anúncio encontrado</p>
      )}
    </>
  );
}
