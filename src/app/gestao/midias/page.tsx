"use client";

import Loading from "@/components/loading";
import { cities } from "@/constants/cities";
import React from "react";
import { toast } from "sonner";

import {
  getApprovedMidiasByCity,
  getDataApprovedMidiasByCityType,
} from "./action";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { set } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteFeedAction } from "@/app/anunciante/[anuncio]/action";

export default function SearchMidias() {
  const [slug, setSlug] = React.useState<string>();
  const [dialog, setDialog] = React.useState({
    open: false,
    midia: {} as getDataApprovedMidiasByCityType | undefined,
  });
  const [page, setPage] = React.useState({
    current_page: 1,
    last_page: 1,
    per_page: 1,
    total: 0,
  });
  const [midias, setMidias] = React.useState<getDataApprovedMidiasByCityType[]>(
    []
  );
  const [loading, setLoading] = React.useState({
    city: false,
    more_cities: false,
    delete: false,
  });

  const handleClickCity = async (slug: string) => {
    setSlug(slug);
    setLoading((prev) => ({ ...prev, city: true }));
    const res = await getApprovedMidiasByCity(slug, 1, 10);
    setLoading((prev) => ({ ...prev, city: false }));
    if (!res.success) {
      toast.error(res.message);
      return setMidias([]);
    }
    setMidias(res.data.data);
    setPage(res.data.meta);
  };

  const handleClickMoreCities = async (slug: string) => {
    setSlug(slug);
    setLoading((prev) => ({ ...prev, more_cities: true }));
    const res = await getApprovedMidiasByCity(slug, page.current_page + 1, 10);
    setLoading((prev) => ({ ...prev, more_cities: false }));
    if (!res.success) {
      toast.error(res.message);
      return setMidias([]);
    }
    setMidias((prev) => [...prev, ...res.data.data]);
    setPage(res.data.meta);
  };

  const handleDeleteMidia = async () => {
    if (!dialog.midia) return;
    setLoading((prev) => ({ ...prev, delete: true }));
    const res = await deleteFeedAction(dialog.midia.id);
    setLoading((prev) => ({ ...prev, delete: false }));
    if (!res.sucess) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
    setDialog({ open: false, midia: undefined });
    setMidias((prev) => prev.filter((midia) => midia.id !== dialog.midia?.id));
  };

  return (
    <div className="container flex flex-col items-center">
      <div className="max-w-7xl">
        <h2 className="text-xl md:text-2xl text-center font-bold mb-4">
          Gestão de mídias aprovadas
        </h2>

        <div className="bg-[#1E1E1E] rounded-lg p-4 sm:p-8 w-full mb-4">
          <h2 className="text-sm md:text-base font-semibold mb-2">
            Selecione uma cidade:
          </h2>
          <div className="w-full grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {cities.map((city) => (
              <div
                key={city.slug}
                onClick={() => handleClickCity(city.slug)}
                className={`p-3 text-sm md:text-base text-center ${
                  slug === city.slug ? "bg-[#444444]" : "bg-[#2a2a2a]"
                } border border-[#444444] transition duration-150 ease-in-out rounded-md cursor-pointer hover:bg-[#444444]`}
              >
                {city.name}
              </div>
            ))}
          </div>
        </div>

        {loading.city && (
          <div className="w-full flex justify-center items-center mt-4">
            <Loading />
          </div>
        )}

        {slug && !loading.city && midias.length === 0 && (
          <p className="text-center mt-4">
            Nenhuma mídia aprovada nesta cidade.
          </p>
        )}

        {slug && !loading.city && midias.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 bg-[#1E1E1E] rounded-lg p-4 sm:p-8 w-full max-w-[1256px]">
            {midias.map((item) => (
              <Card
                key={item.id}
                className="bg-[#2A2A2A] border border-[#444444] rounded-md p-4 break-inside-avoid-column flex flex-col mb-6 gap-4 shadow-md"
              >
                <h1 className="text-xl font-semibold">{item.nome}</h1>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  {/* <Button asChild variant={"outline"}>
                    <Link target="_blank" href={post.posts_info.url}>
                      Ver Anúncio
                    </Link>
                  </Button> */}
                </div>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span className="font-medium">
                    {item.publicado_em.replace(
                      /.*(\d{4}-\d{2}-\d{2}).*/,
                      "Data: $1"
                    )}
                  </span>
                  <span className="font-medium">
                    {item.publicado_em.replace(
                      /.*(\d{2}:\d{2}):\d{2}.*/,
                      "Hora: $1"
                    )}
                  </span>
                </div>
                <div className="relative bg-gray-700 rounded-lg overflow-hidden">
                  {item.midia[0].tipo === "image" && (
                    <img
                      src={item.midia[0].url}
                      alt="Post media"
                      className="w-full aspect-auto object-cover"
                    />
                  )}
                  {item.midia[0].tipo === "video" && (
                    <div className="relative">
                      <video
                        src={item.midia[0].url}
                        controls
                        className="w-full h-full rounded-md"
                        preload="metadata"
                        loop
                        muted
                        playsInline
                      >
                        Seu navegador não suporta a tag de vídeo.
                      </video>
                    </div>
                  )}
                </div>
                {/* <p className="text-sm font-normal text-gray-300 whitespace-pre-line">
                  {item.post}
                </p> */}
                {/* <div className="flex gap-2 items-center text-sm text-gray-400">
                  Status:
                  <span className="text-amber-400">{post.publish}</span>
                </div> */}

                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-transparent hover:bg-red-600 text-red-500 hover:text-white border-red-500 hover:border-red-600"
                    variant="outline"
                    onClick={() => setDialog({ open: true, midia: item })}
                  >
                    Remover
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {page.current_page < page.last_page && (
          <div className="w-full flex justify-center mt-8">
            <Button
              onClick={() => handleClickMoreCities(slug!)}
              disabled={loading.more_cities}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {loading.more_cities ? <Loading /> : "Mostrar mais"}
            </Button>
          </div>
        )}
      </div>

      {/* Removing Modal */}

      <Dialog
        open={dialog.open}
        onOpenChange={() => setDialog({ open: false, midia: undefined })}
      >
        <DialogContent className="bg-[#2A2A2A] border border-[#444444] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Remover mídia
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 mb-4">
              Tem certeza que deseja remover esta mídia? Esta ação não pode ser
              desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                disabled={loading.delete}
                onClick={() => setDialog({ open: false, midia: undefined })}
              >
                Cancelar
              </Button>
              {loading.delete ? (
                <Button className="bg-red-700 hover:bg-red-800">
                  <Loading />
                </Button>
              ) : (
                <Button
                  onClick={handleDeleteMidia}
                  className="bg-red-700 hover:bg-red-800"
                >
                  Remover
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
