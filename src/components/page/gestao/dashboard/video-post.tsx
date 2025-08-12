"use client";

import { useEffect, useRef, useState } from "react";

interface VideoPostProps {
  url: string;
}

export default function VideoPost({ url }: VideoPostProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Ref para o contêiner do IntersectionObserver
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVideoVisible(true);
          observer.unobserve(entry.target); // Para de observar após se tornar visível
        }
      },
      { threshold: 0.1 } // Começa a carregar quando 10% está visível
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []); // Executa apenas uma vez na montagem para configurar o observer

  useEffect(() => {
    if (isVideoVisible && videoRef.current) {
      videoRef.current.src = url;
    }
  }, [isVideoVisible, url]); // Define o src quando o vídeo se torna visível ou a URL muda

  const handleVideoError = () => {
    setVideoError("Não foi possível carregar o vídeo.");
  };

  if (!url) {
    return <div className="w-full aspect-video bg-gray-700 rounded-md flex items-center justify-center text-gray-400">Vídeo não disponível</div>;
  }


  return (
    <div ref={containerRef} className="w-full aspect-video bg-black rounded-md relative">
      {isVideoVisible ? (
        videoError ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-400 p-2">
            {videoError}
          </div>
        ) : (
          <video
            ref={videoRef}
            controls
            className="w-full h-full rounded-md"
            preload="metadata"
            loop
            muted 
            playsInline
            onError={handleVideoError}
          >
            Seu navegador não suporta a tag de vídeo.
          </video>
        )
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          Carregando vídeo... {/* Poderia ser um spinner aqui */}
        </div>
      )}
    </div>
  );
}