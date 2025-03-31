import React from "react";
import getAnunciosAction from "./action";
import ListAnuncios from "@/components/list/anuncio";
import { Ellipsis } from "lucide-react";
import ButtonIcon from "@/components/ui/button/icon";

export default async function DashboardAnct() {
  const anuncios = await getAnunciosAction();

  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-2xl rounded-lg">
        {anuncios &&
          anuncios.map((item) => (
            <div key={item.id} className="w-full relative">
              <ListAnuncios item={item} />
              <ButtonIcon tooltip="Ver detalhes">
                <Ellipsis />
              </ButtonIcon>
            </div>
          ))}
      </div>
    </div>
  );
}
