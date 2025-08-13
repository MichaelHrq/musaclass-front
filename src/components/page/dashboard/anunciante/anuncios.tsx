"use client";

import { AnuncioType } from "@/app/gestao/anunciante/type";
import ListAnuncios from "@/components/list/anuncio";
import ButtonIcon from "@/components/ui/button/icon";
import { Ellipsis } from "lucide-react";
import Link from "next/link";

export default function Anuncios({ items }: { items: AnuncioType[] }) {
  return (
    <>
      {items?.length > 0 ? (
        items?.map((item) => (
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
