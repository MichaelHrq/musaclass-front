import { AnuncioWPType } from "@/app/gestao/anunciante/type";
import Loading from "@/components/loading";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ListAnuncios({
  item,
  children,
}: {
  item?: AnuncioWPType;
  children?: React.ReactNode;
}) {
  return (
    <div className="text-xs md:text-sm w-full mt-4 p-4 border-1 border-[#444] rounded-lg bg-[#2A2A2A]">
      {item ? (
        <>
          <div className="flex gap-4">
            <Image
              src={item.imgcapa}
              alt="imagem capa"
              width={100}
              height={100}
              className="rounded"
            />
            <div className="flex flex-col gap-2">
              <p className="font-medium text-base">{item.title}</p>
              <div>
                Cidade: <span className="text-gray-400">{item.cidadeanome}</span>
              </div>
              <div>
                Status: <span className="text-gray-400">{item.status}</span>
              </div>
              <div>
                Vencimento: <span className="text-gray-400">{item.vencimento}</span>
              </div>
              <Link href={item.url.toString()} className="break-all" target="_blank" rel="noopener noreferrer">
                URL: <span className="text-gray-400">{item.url.toString()}</span>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full flex justify-center items-center h-26">
          <Loading />
        </div>
      )}
      {children}
    </div>
  );
}
