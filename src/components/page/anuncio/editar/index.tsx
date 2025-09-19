"use client";

import { getAnuncioInfos } from "@/app/anunciante/[anuncio]/action";
import FormAnuncio from "@/components/form/anuncio";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

type PropsType = {
  anuncioId: string;
};

export default function EditarAnuncioPage({ anuncioId }: PropsType) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    infos: {} as any,
    edit: {} as any,
  });
  useEffect(() => {
    (async () => {
      const { edit, infos } = await getAnuncioInfos(anuncioId);
      setData({
        edit,
        infos,
      });
      setLoading(false);
    })();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between items-center w-full">
            <span className="text-lg md:text-xl text-gray-400">
              {data.infos.titulo}
            </span>
            {data.infos.url && (
              <Link href={data.infos.url} target="_blank">
                <Button>Visualizar anúncio</Button>
              </Link>
            )}
          </div>
          <FormAnuncio edit={data.edit} />
        </>
      )}
    </>
  );
}
