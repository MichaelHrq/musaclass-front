"use client";


import { AnuncioType } from "@/app/gestao/anunciante/type";
import ListAnuncios from "@/components/list/anuncio";
import ButtonIcon from "@/components/ui/button/icon";
import { Ellipsis } from "lucide-react";
import Link from "next/link";

export default function Anuncios({ items }: { items: AnuncioType[] }) {
  return (
    <>
      {items?.map((item) => (
        <div key={item.id} className="w-full relative">
          <ListAnuncios item={item} />
          <ButtonIcon tooltip="Ver detalhes">
            <Link target="_blank" href={`anunciante/${item.id}`}>
              <Ellipsis />
            </Link>
          </ButtonIcon>
        </div>
      ))}
    </>
  );
}
