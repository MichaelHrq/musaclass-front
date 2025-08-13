// components/ui/input/MediaPreviewInput.tsx (sugestão de novo caminho)
"use client";

import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageUp, Trash2, XCircle } from "lucide-react";
import React, { useEffect, useId, useMemo } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface MediaPreviewInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  accept?: string;
}

export default function MediaPreviewInput<T extends FieldValues>({
  name,
  control,
  accept = "image/*,video/*",
}: MediaPreviewInputProps<T>) {
  // Hook useId para gerar um ID único e conectar a label ao input, melhorando a acessibilidade.
  const inputId = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // Derivamos o estado diretamente do valor do formulário (`field.value`).
        // Isso evita problemas de sincronização com estados locais (useState).
        const file = field.value?.[0];

        const { previewUrl, fileType } = useMemo(() => {
          if (file instanceof File) {
            return {
              previewUrl: URL.createObjectURL(file),
              fileType: file.type,
            };
          }
          return { previewUrl: null, fileType: null };
        }, [file]);

        // Efeito para limpar o blob URL da memória quando o componente
        // for desmontado ou a URL mudar. Essencial para evitar memory leaks.
        useEffect(() => {
          return () => {
            if (previewUrl) {
              URL.revokeObjectURL(previewUrl);
            }
          };
        }, [previewUrl]);

        const handleRemoveFile = () => {
          // A forma correta de limpar o campo no react-hook-form
          field.onChange(null);
        };

        return (
          <div className="space-y-2 w-full">
            {previewUrl ? (
              // --- ESTADO COM ARQUIVO SELECIONADO ---
              <div className="relative group w-full border border-dashed border-[#444] rounded-lg p-2 flex flex-col items-center gap-3">
                {fileType?.startsWith("image/") ? (
                  <img
                    src={previewUrl}
                    alt="Pré-visualização"
                    className="max-h-96 w-auto object-contain rounded-md"
                  />
                ) : fileType?.startsWith("video/") ? (
                  <video
                    src={previewUrl}
                    controls
                    className="max-h-96 w-full rounded-md"
                  >
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                ) : (
                  <p className="text-sm text-neutral-400">
                    Prévia não disponível para este tipo de arquivo.
                  </p>
                )}

                <div className="flex items-center gap-3">
                  {/* Usar label é semanticamente melhor para acionar o input */}
                  <Button type="button" variant="outline" asChild>
                    <label htmlFor={inputId} className="cursor-pointer">
                      Alterar
                    </label>
                  </Button>
                  {/* Botão para remover o arquivo */}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={handleRemoveFile}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              // --- ESTADO SEM ARQUIVO (PLACEHOLDER) ---
              <label
                htmlFor={inputId}
                className="mt-1 flex flex-col items-center justify-center bg-[#2A2A2A] px-4 sm:px-6 py-10 border-2 border-[#444] border-dashed rounded-md cursor-pointer hover:border-primary transition-colors text-center"
              >
                <ImageUp size={32} className="mx-auto mb-3 text-neutral-500" />
                <span className="block text-sm font-medium text-primary mb-1">
                  Carregar um arquivo
                </span>
                <p className="text-xs text-neutral-500">PNG, JPG, ou MP4</p>
              </label>
            )}

            <Input
              id={inputId}
              type="file"
              accept={accept}
              className="hidden" // O input fica escondido, a UI é controlada pela label
              onChange={(e) => field.onChange(e.target.files)}
              ref={field.ref}
              // O `onClick` para limpar o valor foi removido pois a lógica de `field.onChange(null)`
              // já garante que o campo possa ser re-selecionado.
            />

            {error?.message && (
              <FormMessage>{error.message as React.ReactNode}</FormMessage>
            )}
          </div>
        );
      }}
    />
  );
}
