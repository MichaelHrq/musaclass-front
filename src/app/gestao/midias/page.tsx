"use client";

import Loading from "@/components/loading";
import { cities } from "@/constants/cities";
import React, { useState } from "react";
import { toast } from "sonner";

import { deleteMidiaAction } from "@/app/anunciante/[anuncio]/action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Play, Trash, X } from "lucide-react";
import {
  getApprovedMidiasByCity,
  getDataApprovedMidiasByCityType,
} from "./action";

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
    [],
  );
  const [loading, setLoading] = React.useState({
    city: false,
    more_cities: false,
    delete: false,
  });

  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

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
    const res = await deleteMidiaAction(dialog.midia.id);
    setLoading((prev) => ({ ...prev, delete: false }));
    if (!res.sucess) {
      toast.error("Falha ao deletar mídia");
      return;
    }
    toast.success("Mídia deletada com sucesso");
    setDialog({ open: false, midia: undefined });
    setMidias((prev) => prev.filter((midia) => midia.id !== dialog.midia?.id));
  };

  function handlePlayClick(e: React.MouseEvent, url: string) {
    e.stopPropagation();
    e.preventDefault();
    setPreviewVideo(url);
  }

  return (
    <div className="container flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <h2 className="text-xl md:text-2xl text-center font-bold mb-4">
          Gestão de mídias aprovadas
        </h2>

        <section className="mb-4 w-full">
          <div className="flex items-center gap-2 mb-4 text-neutral-200">
            <MapPin size={18} />
            <h2 className="text-base font-semibold">Selecione uma cidade:</h2>
          </div>

          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-[#333] w-full grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
            {cities?.map((city) => (
              <button
                key={city.slug}
                onClick={() => handleClickCity(city.slug)}
                className={`
                  p-3 text-sm font-medium rounded-lg border transition-all duration-200 ease-out
                  ${
                    city.slug === slug
                      ? "bg-neutral-100 text-black border-neutral-100 shadow-md transform scale-[1.02]"
                      : "bg-[#2a2a2a] text-neutral-400 border-[#333] hover:bg-[#333] hover:text-white hover:border-neutral-500"
                  }
                `}
              >
                {city.name}
              </button>
            ))}
          </div>
        </section>

        {loading.city && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start gap-2 w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="relative animate-pulse bg-neutral-800 aspect-[6/8] rounded-md">
                <div className="bg-neutral-700 absolute animate-pulse h-6 w-24 top-2 left-2 rounded-md"></div>
                <div className="bg-neutral-700 absolute animate-pulse h-6 w-16 top-2 right-2 rounded-md"></div>
                <div className="bg-neutral-700 absolute animate-pulse h-9 w-48 bottom-4 left-2 rounded-md"></div>
                <div className="bg-neutral-700 absolute animate-pulse h-8 w-8 bottom-4 right-2 rounded-full"></div>
              </div>
            ))}
          </div>
        )}

        {slug && !loading.city && midias.length === 0 && (
          <p className="text-center mt-4">
            Nenhuma mídia aprovada nesta cidade.
          </p>
        )}

        {slug && !loading.city && midias.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start gap-2 w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {midias.map((item) => (
              <Card
                key={item.id}
                className="group border-none relative rounded-md p-0 flex flex-col gap-4 shadow-md overflow-hidden"
              >
                <span className="font-medium text-[10px] absolute top-2 left-2 bg-black/50 px-2 py-1 rounded-md z-10">
                  {item.publicado_em.replace(
                    /.*(\d{4})-(\d{2})-(\d{2}).*/,
                    "Data: $1/$2/$3",
                  )}
                </span>
                <span className="font-medium text-[10px] absolute top-2 right-2 bg-black/50 px-2 py-1 rounded-md z-10">
                  {item.publicado_em.replace(
                    /.*(\d{2}:\d{2}):\d{2}.*/,
                    "Hora: $1",
                  )}
                </span>

                <div className="bg-gray-700 rounded-lg overflow-hidden">
                  {item.midia[0].tipo === "image" && (
                    <img
                      src={item.midia[0].url}
                      alt="Post media"
                      className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                  )}
                  {item.midia[0].tipo === "video" && (
                    <div>
                      <video
                        src={item.midia[0].url}
                        className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                        muted
                        playsInline
                        preload="metadata"
                      >
                        Seu navegador não suporta a tag de vídeo.
                      </video>
                      <button
                        type="button"
                        onClick={(e) => handlePlayClick(e, item.midia[0].url)}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 hover:scale-110 transition-all p-4 rounded-full backdrop-blur-sm cursor-pointer z-20 group-hover:bg-amber-500/80"
                        title="Visualizar vídeo"
                      >
                        <Play size={24} className="text-white fill-white" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

                <h1 className="absolute bottom-4 left-2 text-xl font-semibold z-10">
                  {item.nome}
                </h1>

                <div
                  className="absolute bottom-4 right-2 bg-red-600/60 hover:bg-red-600 duration-200 p-2 z-10 rounded-full backdrop-blur shadow-lg cursor-pointer pointer-events-auto"
                  onClick={() => setDialog({ open: true, midia: item })}
                >
                  <Trash size={18} />
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

      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
          <button
            onClick={() => setPreviewVideo(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all z-50"
          >
            <X size={32} />
          </button>

          <div className="relative w-auto max-h-[90vh] bg-black rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 mx-4">
            <video
              src={previewVideo}
              className="max-h-[90vh] w-auto"
              controls
              autoPlay
            />
          </div>

          <div
            className="absolute inset-0 -z-10"
            onClick={() => setPreviewVideo(null)}
          />
        </div>
      )}

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
