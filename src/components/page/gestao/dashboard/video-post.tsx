"use client";

import { useEffect, useRef } from "react";

export default function VideoPost({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && videoRef.current) {
          videoRef.current.src = url;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [url]);

  return (
    <div className="w-full">
      <video
        ref={videoRef}
        controls
        className="w-full rounded-md"
        preload="metadata"
        loop
        muted
      >
        Seu navegador não suporta vídeo.
      </video>
    </div>
  );
}
