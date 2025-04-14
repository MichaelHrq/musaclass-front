"use server";

import getBase64 from "@/lib/plaiceholder";
import Image from "next/image";

export default async function ImagePost({ url }: { url: string }) {
  return (
    <div className="relative w-full h-64">
      <Image
        src={url}
        alt="Imagem do post"
        fill
        className="object-cover rounded-md"
        placeholder="blur"
        blurDataURL={await getBase64(url)}
      />
    </div>
  );
}
