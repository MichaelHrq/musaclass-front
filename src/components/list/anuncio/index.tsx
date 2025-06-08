
import { AnuncioType } from "@/app/gestao/anunciante/type";
import React from "react";

export default function ListAnuncios({
  item,
  children,
}: {
  item: AnuncioType;
  children?: React.ReactNode;
}) {
  return (
    <div
      key={item.id}
      className="text-xs md:text-[16px] flex flex-col w-full mt-4 p-4 border-1 border-[#444] rounded-lg bg-[#2A2A2A] gap-2"
    >
      <p className="font-medium">{item.title}</p>
      <div>
        Status: <span className="text-gray-400">{item.status}</span>
      </div>
      <div>
        URL: <span className="text-gray-400">{(item.url).toString()}</span>
      </div>
      <div>
        Vencimento: <span className="text-gray-400">{item.vencimento}</span>
      </div>
      {children}
    </div>
  );
}
