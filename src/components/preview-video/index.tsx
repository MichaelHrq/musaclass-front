import { X } from "lucide-react";

type PropsType = {
  previewVideo: string | null;
  setPreviewVideo: (url: string | null) => void;
};

export default function PreviewVideo({
  previewVideo,
  setPreviewVideo,
}: PropsType) {
  if (!previewVideo) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <button
        onClick={() => setPreviewVideo(null)}
        className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all z-50"
      >
        <X size={32} />
      </button>

      <div className="relative w-full max-w-sm aspect-[9/16] max-h-[90vh] bg-black rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 mx-4">
        <video
          src={previewVideo}
          className="w-full h-full object-cover"
          controls
          autoPlay
        />
      </div>

      <div
        className="absolute inset-0 -z-10"
        onClick={() => setPreviewVideo(null)}
      />
    </div>
  );
}
