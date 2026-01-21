"use client";

import FormChangeEmail from "@/components/form/changeEmail/change-email";
import FormSearchCpf from "@/components/form/search/cpf";
import FormSendEmail from "@/components/form/send/email";
import ListAnuncios from "@/components/list/anuncio";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { AnuncioWPType, SearchCPFGetType } from "./type";

export default function Anunciante() {
  const [anuncios, setAnuncios] = React.useState<SearchCPFGetType>();
  const [isSearched, setisSearched] = useState(false);

  console.log(anuncios)

  return (
    <div className="container flex flex-col items-center">
      <div className="flex flex-col items-center w-full max-w-2xl">
        <div className="bg-[#1E1E1E] w-full p-6 rounded-lg mb-4 text-center">
          <h1 className="text-3xl font-[500]">Anunciante</h1>
          <FormSearchCpf
            setAnuncios={setAnuncios}
            setisSearched={setisSearched}
          />

          {anuncios?.anuncios && (
            <>
              {anuncios.anuncios.length === 0 ? (
                <p className="mt-8">Nenhum anúncio encontrado</p>
              ) : (
                anuncios?.anuncios.map((item) => (
                  <ListAnuncios key={item.id} item={item} />
                ))
              )}
            </>
          )}
        </div>

        {isSearched ? (
          <>
            {anuncios?.profile?.email ? (
              <div className="bg-[#1E1E1E] flex flex-col items-center w-full p-6 rounded-lg text-center mb-4 gap-6">
                <h2 className="text-xl font-medium">
                  Alterar email da anunciante
                </h2>

                <div className="w-full">
                  <Label className="mb-2">Atual email</Label>
                  <Input readOnly value={anuncios.profile.email} />
                </div>
                <FormChangeEmail lastEmail={anuncios.profile.email} />
              </div>
            ) : (
              <div className="bg-[#1E1E1E] w-full p-6 rounded-lg text-center">
                <>
                  <h2 className="text-xl text-yellow-400 font-bold">
                    Enviar convite
                  </h2>
                  <FormSendEmail />
                </>
              </div>
            )}
          </>
        ) : null}

      </div>
    </div>
  );
}
