'use client'

import { AnuncioType } from "@/app/gestao/anunciante/page";
import ListAnuncios from "@/components/list/anuncio";
import ButtonIcon from "@/components/ui/button/icon";
import { Ellipsis } from "lucide-react";

export default function Anuncios({ items }: { items: AnuncioType[] }) {
  function handleClick() {
    console.log("Button clicked for item ID:");
  };
  return (
    <>
      {items?.map((item) => (
        <div key={item.id} className="w-full relative">
          <ListAnuncios item={item} />
          <ButtonIcon onClick={handleClick} tooltip="Ver detalhes">
            <Ellipsis />
          </ButtonIcon>
        </div>
      ))}
    </>
  );
}
