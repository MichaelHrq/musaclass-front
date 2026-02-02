"use client";

import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { CircleX, Link as Link_, MapPin, SquarePen, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useDeferredValue, useMemo, useState } from "react"; // Adicionado Suspense
import { getAllAnuncios, getAllAnunciosType } from "./action";

// 1. Renomeamos o componente original para AnunciosContent e removemos o 'export default'
function AnunciosContent() {
  // Otimização de Cache
  const { data, isLoading, isError } = useQuery<getAllAnunciosType[]>({
    queryKey: ["anuncios"],
    queryFn: () => getAllAnuncios(),
  });

  // Hooks de navegação (que causavam o erro sem o Suspense)
  const searchParams = useSearchParams();
  const slugCidade = searchParams.get("cidade");
  const router = useRouter();
  const pathname = usePathname();

  const [filter, setFilter] = useState<string>("");
  
  const deferredFilter = useDeferredValue(filter);

  const cidade = useMemo(() => {
    if (!data || !slugCidade) return undefined;
    return data.find((city) => city.slug === slugCidade);
  }, [data, slugCidade]);

  const anunciosFiltrados = useMemo(() => {
    if (!cidade?.anunciantes) return [];
    
    if (!deferredFilter) return cidade.anunciantes;

    const termo = deferredFilter.toLowerCase();
    return cidade.anunciantes.filter((anuncio) =>
      anuncio.title.toLowerCase().includes(termo)
    );
  }, [cidade, deferredFilter]);

  function handleClickCity(city: getAllAnunciosType) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("cidade", city.slug);
    setFilter(""); 
    router.push(`${pathname}?${params.toString()}`);
  }

  if (isError) {
    return <p className="text-red-500 text-center">Erro ao carregar dados.</p>;
  }

  return (
    <div className="container flex flex-col items-center">
      <div className="flex flex-col w-full max-w-6xl">
        <section className="mb-4">
          <div className="flex items-center gap-2 mb-4 text-neutral-200">
            <MapPin size={18} />
            <h2 className="text-base font-semibold">Selecione uma cidade:</h2>
          </div>

          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-[#333] w-full grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
            {isLoading
              ? Array(8)
                  .fill(null)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="animate-pulse h-[46px] bg-[#2a2a2a] w-full rounded-lg border border-[#333]"
                    ></div>
                  ))
              : data?.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleClickCity(city)}
                    className={`
                  p-3 text-sm font-medium rounded-lg border transition-all duration-200 ease-out cursor-pointer
                  ${
                    city.id === cidade?.id
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

        {cidade && (
          <section className="mb-4 relative w-full">
            <Input
              placeholder="Filtre pelo nome..."
              onChange={(e) => setFilter(e.target.value)}
              value={filter}
              className="pr-10 bg-[#1E1E1E] border-[#333] text-neutral-200 placeholder:text-neutral-500"
            />

            {filter && (
              <button
                onClick={() => setFilter("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors p-1 rounded-full hover:bg-neutral-800"
                title="Limpar filtro"
              >
                <X size={16} />
              </button>
            )}
          </section>
        )}

        {cidade && (
          <div
            key={cidade.id}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {anunciosFiltrados.map((anuncio) => (
              <div
                key={anuncio.id}
                className="group relative overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 shadow-lg aspect-[3/4]"
              >
                {anuncio.foto1 ? (
                  <>
                    <img
                      src={anuncio.foto1}
                      className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                      alt={anuncio.title}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
                  </>
                ) : (
                  <div className="w-full h-full flex justify-center items-center bg-neutral-800">
                    <div className="flex items-center flex-col gap-2 text-neutral-600">
                      <CircleX size={40} />
                      <span className="text-sm">Sem imagem</span>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 w-full p-4 flex items-end justify-between translate-y-1 transition-transform duration-300 group-hover:translate-y-0">
                  <div className="flex flex-col gap-1 w-full mr-2">
                    <p className="text-white font-medium text-lg truncate shadow-black drop-shadow-md">
                      {anuncio.title}
                    </p>
                    <span className="h-0.5 w-0 bg-white group-hover:w-1/3 transition-all duration-500 rounded-full"></span>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <Link
                      href={`anuncios/editar/${anuncio.id}?cidade=${cidade.slug}`}
                      className="
                        flex items-center justify-center 
                        bg-white/10 backdrop-blur-md text-white 
                        hover:bg-amber-400 hover:text-black hover:border-amber-400
                        border border-white/20 
                        rounded-full p-2 transition-all duration-300
                      "
                      title="Editar anúncio"
                    >
                      <SquarePen size={18} />
                    </Link>

                    <Link
                      target="_blank"
                      href={anuncio.link || "#"}
                      className="
                        flex items-center justify-center 
                        bg-white/10 backdrop-blur-md text-white 
                        hover:bg-white hover:text-black hover:border-white
                        border border-white/20 
                        rounded-full p-2 transition-all duration-300
                      "
                      title="Ver link externo"
                    >
                      <Link_ size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 2. Criamos o componente wrapper exportado
export default function Anuncios() {
  return (
    // O fallback é o que aparece enquanto o Next.js processa a URL
    <Suspense fallback={<div className="container flex justify-center p-10 text-neutral-500">Carregando...</div>}>
      <AnunciosContent />
    </Suspense>
  );
}