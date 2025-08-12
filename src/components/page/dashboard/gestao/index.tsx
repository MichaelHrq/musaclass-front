"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Play,
  Volume2,
  VolumeX,
  Maximize,
  MoreVertical,
  X,
} from "lucide-react";
import getPostagensAction, { getDataPostagensType } from "@/app/gestao/action";

export default function PostManagement() {
  const [posts, setPosts] = useState<getDataPostagensType[]>([]);
  const [approveModal, setApproveModal] = useState<{
    open: boolean;
    post: getDataPostagensType | null;
  }>({ open: false, post: null });
  const [rejectModal, setRejectModal] = useState<{
    open: boolean;
    post: getDataPostagensType | null;
  }>({ open: false, post: null });
  const [rejectReason, setRejectReason] = useState("");
  const [videoStates, setVideoStates] = useState<
    Record<string, { playing: boolean; muted: boolean }>
  >({});

  const handleApprove = (post: getDataPostagensType) => {
    setApproveModal({ open: true, post });
  };

  const handleReject = (post: getDataPostagensType) => {
    setRejectModal({ open: true, post });
    setRejectReason("");
  };

  const confirmApprove = () => {
    if (approveModal.post) {
      setPosts(posts.filter((p) => p.id !== approveModal.post!.id));
    }
    setApproveModal({ open: false, post: null });
  };

  const confirmReject = () => {
    if (rejectModal.post && rejectReason.trim()) {
      setPosts(posts.filter((p) => p.id !== rejectModal.post!.id));
      setRejectModal({ open: false, post: null });
      setRejectReason("");
    }
  };

  const toggleVideo = (postId: string) => {
    setVideoStates((prev) => ({
      ...prev,
      [postId]: {
        playing: !prev[postId]?.playing,
        muted: prev[postId]?.muted ?? true,
      },
    }));
  };

  const toggleMute = (postId: string) => {
    setVideoStates((prev) => ({
      ...prev,
      [postId]: {
        playing: prev[postId]?.playing ?? false,
        muted: !prev[postId]?.muted,
      },
    }));
  };

  const fetchData = async () => {
    const res = await getPostagensAction();
    setPosts(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container flex flex-col items-center py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-medium mb-6 text-center">
          Gerenciar Postagens
        </h1>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 bg-[#1E1E1E] rounded-lg p-4 sm:p-8 w-full max-w-[1200px]">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="bg-[#2A2A2A] border border-[#444444] rounded-md p-4 mb-6 break-inside-avoid-column flex flex-col gap-4 shadow-md"
            >
              <div>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  Ver Anúncio
                </button>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                <span>
                  <span className="font-medium">Data:</span> {post.date}
                </span>
                <span>
                  <span className="font-medium">Hora:</span> {post.time}
                </span>
              </div>

              <div className="relative mb-4 bg-gray-700 rounded-lg overflow-hidden">
                {post.midia[0].tipo === "image" ? (
                  <img
                    src={post.midia[0].url}
                    alt="Post media"
                    className="w-full aspect-auto object-cover"
                  />
                ) : (
                  <div className="relative">
                    <video
                      src={post.midia[0].url}
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

              <p className="text-sm font-normal text-gray-300 whitespace-pre-line">
                {post.post}
              </p>


                <span className="text-sm font-semibold text-amber-400">Status:</span> {post.publish}


              <div className="flex gap-3">
                <Button
                  onClick={() => handleApprove(post)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white border-green-600"
                  variant="outline"
                >
                  Aprovar
                </Button>
                <Button
                  onClick={() => handleReject(post)}
                  className="flex-1 bg-transparent hover:bg-red-600 text-red-500 hover:text-white border-red-500 hover:border-red-600"
                  variant="outline"
                >
                  Reprovar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Approve Modal */}
      <Dialog
        open={approveModal.open}
        onOpenChange={(open) => setApproveModal({ open, post: null })}
      >
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Aprovar Anúncio de {approveModal.post?.advertiser}
            </DialogTitle>
            <button
              onClick={() => setApproveModal({ open: false, post: null })}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 mb-6">
              Tem certeza de que deseja aprovar este anúncio do anunciante{" "}
              <span className="font-semibold text-white">
                {approveModal.post?.advertiser}
              </span>
              ?
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setApproveModal({ open: false, post: null })}
                variant="outline"
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmApprove}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Confirmar Aprovação
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog
        open={rejectModal.open}
        onOpenChange={(open) => setRejectModal({ open, post: null })}
      >
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Reprovar Anúncio de {rejectModal.post?.advertiser}
            </DialogTitle>
            <button
              onClick={() => setRejectModal({ open: false, post: null })}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 mb-4">
              Você está reprovando o anúncio do anunciante{" "}
              <span className="font-semibold text-white">
                {rejectModal.post?.advertiser}
              </span>
              . Por favor, forneça o motivo abaixo.
            </p>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Escreva o motivo da reprovação (obrigatório)..."
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[100px] mb-6"
            />
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setRejectModal({ open: false, post: null })}
                variant="outline"
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmReject}
                disabled={!rejectReason.trim()}
                className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Reprovação
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
