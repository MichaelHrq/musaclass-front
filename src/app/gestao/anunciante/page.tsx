"use client";

import FormSearchCpf from "@/components/form/search/cpf";
import FormSendEmail from "@/components/form/send/email";
import ListAnuncios from "@/components/list/anuncio";
import React from "react";

export type AnuncioType = {
  id: number;
  title: string;
  url: boolean;
  vencimento: string;
  status: string;
};

export default function Anunciante() {
  const [anuncios, setAnuncios] = React.useState<AnuncioType[]>();

  return (
    <div className="container flex flex-col items-center">
      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-2xl rounded-lg">
        <h1 className="text-3xl font-[500]">Anunciante</h1>
        <FormSearchCpf setAnuncios={setAnuncios} />

        {anuncios && (
          <>
            {anuncios.length === 0
              ? <p className="mt-8">Nenhum anúncio encontrado</p>
              : anuncios.map((item) => (
                  <ListAnuncios key={item.id} item={item} />
                ))}

            <h2 className="text-xl text-yellow-400 font-bold mt-8">
              Enviar convite
            </h2>
            <FormSendEmail />
          </>
        )}
      </div>
    </div>
  );
}
