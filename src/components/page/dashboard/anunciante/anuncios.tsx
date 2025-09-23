"use client";

import { getAnunciosAction } from "@/app/anunciante/action";
import { AnuncioWPType } from "@/app/gestao/anunciante/type";
import ListAnuncios from "@/components/list/anuncio";
import Loading from "@/components/loading";
import ButtonIcon from "@/components/ui/button/icon";
import { Ellipsis } from "lucide-react";
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
          <div key={item.id} className="w-full relative">
            <ListAnuncios item={item} />
            <ButtonIcon tooltip="Ver detalhes">
              <Link href={`anunciante/${item.id}`}>
                <Ellipsis size={18} />
              </Link>
            </ButtonIcon>
          </div>
        ))
      ) : (
        <p className="mt-8 text-neutral-400">Nenhum anúncio encontrado</p>
      )}
    </>
  );
}
