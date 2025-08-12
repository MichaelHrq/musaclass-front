import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageUp, XCircle } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
interface MediaPreviewInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  accept?: string;
}

export default function MediaPreviewInput<T extends FieldValues>({
  name,
  control,
  accept = "image/*,video/*",
}: MediaPreviewInputProps<T>) {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    const currentSrc = previewSrc;
    return () => {
      if (currentSrc && currentSrc.startsWith("blob:")) {
        URL.revokeObjectURL(currentSrc);
      }
    };
  }, [previewSrc]);

  const handleFileChange = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      fieldOnChange: (...event: any[]) => void
    ) => {
      const file = event.target.files?.[0];

      if (previewSrc && previewSrc.startsWith("blob:")) {
        URL.revokeObjectURL(previewSrc);
      }

      if (file) {
        fieldOnChange(event.target.files);
        setFileType(file.type);
        setPreviewSrc(URL.createObjectURL(file));
      } else {
        fieldOnChange(null);
        setPreviewSrc(null);
        setFileType(null);
      }
    },
    [previewSrc]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        useEffect(() => {
          if (!field.value && previewSrc) {
            setPreviewSrc(null);
            setFileType(null);
          }
        }, [field.value, previewSrc]);

        return (
          <div className="space-y-2 w-full">
            {previewSrc ? (
              <div className="relative group w-full border border-dashed border-[#444] rounded-lg p-2 flex flex-col items-center">
                {fileType?.startsWith("image/") ? (
                  <img
                    src={previewSrc}
                    alt="Preview"
                    className="max-h-96 w-auto object-contain rounded-md"
                  />
                ) : fileType?.startsWith("video/") ? (
                  <video
                    src={previewSrc}
                    controls
                    className="max-h-96 w-full rounded-md"
                  >
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tipo de arquivo não suportado para prévia.
                  </p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => document.getElementById(`file-input-${name}`)?.click()}
                >
                  Alterar Arquivo
                </Button>
              </div>
            ) : (
              <div
                className="mt-1 flex flex-col items-center justify-center bg-[#2A2A2A] px-4 sm:px-6 py-10 border-2 border-[#444] border-dashed rounded-md cursor-pointer hover:border-primary transition-colors text-center"
                onClick={() => document.getElementById(`file-input-${name}`)?.click()}
              >
                <ImageUp size={32} className="mx-auto mb-3 text-neutral-500" />
                <span className="block text-sm font-medium text-primary hover:text-primary-focus mb-1">
                  Carregar um arquivo
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, ou MP4
                </p>
              </div>
            )}
            <Input
              id={`file-input-${name}`}
              type="file"
              accept={accept}
              className="hidden"
              onClick={(e) => {
                (e.target as HTMLInputElement).value = "";
              }}
              onChange={(e) => handleFileChange(e, field.onChange)}
              ref={field.ref}
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
