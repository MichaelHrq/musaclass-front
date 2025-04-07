import Image from "next/image";
import React, { useRef } from "react";
import { Button } from "../button";

interface InputUploadProps {
  children: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: File | null;
}

type InputType = {
  url: string;
  type: string;
};

function ImagePost(url: string) {
  return (
    <div className="w-full h-full relative">
      <Image
        src={url}
        alt="imagem selecionada"
        fill
        style={{
          objectFit: "contain",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      />
    </div>
  );
}

function VideoPost(url: string) {
  return (
    <div className="w-full">
      <video controls className="w-full">
        <source src={url} type="video/mp4" />
        Seu navegador não suporta vídeo.
      </video>
    </div>
  );
}

function TypeMedia(media: InputType) {
  if (media.type.startsWith("image")) return ImagePost(media.url);
  if (media.type.startsWith("video")) return VideoPost(media.url);
  return <p className="text-sm text-gray-400">Tipo de mídia não suportado</p>;
}

export default function InputUpload({ children, onChange }: InputUploadProps) {
  const input = useRef<HTMLInputElement>(null);
  const [midia, setMidia] = React.useState<InputType>();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e);
    const file = e.target.files?.[0];
    if (file) {
      setMidia({
        url: URL.createObjectURL(file),
        type: file.type,
      });
    }
  }

  function onClick() {
    if (midia?.url) return;
    input.current?.click();
  }

  React.useEffect(() => {
    return () => {
      if (midia?.url) {
        URL.revokeObjectURL(midia.url);
      }
    };
  }, [midia]);

  return (
    <>
      <div
        onClick={onClick}
        className="cursor-pointer bg-gray-900/10 hover:bg-gray-900/20 flex flex-col justify-center items-center border-2 border-[#444] border-dashed rounded-2xl relative w-full h-[400px] overflow-hidden"
      >
        <input
          type="file"
          ref={input}
          hidden
          onChange={handleChange}
          accept="image/*,video/*"
        />

        {!midia ? (
          <div className="text-center p-4">
            <p className="text-gray-400">Clique para selecionar</p>
            <p className="text-gray-500 text-sm mt-2">
              Formatos suportados: JPG, PNG, MP4
            </p>
          </div>
        ) : (
          TypeMedia(midia)
        )}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        {midia && (
          <Button type="button" onClick={() => input.current?.click()}>
            Alterar arquivo
          </Button>
        )}
        {children}
      </div>
    </>
  );
}
