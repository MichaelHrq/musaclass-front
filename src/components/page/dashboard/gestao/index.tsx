"use client";

import {
  aprovarFeedAction,
  getDataPostagensType,
  getPostagensAction,
  reprovarFeedAction,
} from "@/app/gestao/action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PostManagement() {
  const [posts, setPosts] = useState<getDataPostagensType[]>([]);
  const [loading, setLoading] = useState(true);
  const [approveModal, setApproveModal] = useState<{
    open: boolean;
    post: getDataPostagensType | null;
  }>({ open: false, post: null });
  const [rejectModal, setRejectModal] = useState<{
    open: boolean;
    post: getDataPostagensType | null;
  }>({ open: false, post: null });
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = (post: getDataPostagensType) => {
    setApproveModal({ open: true, post });
  };

  const confirmApprove = async () => {
    const res = await aprovarFeedAction(approveModal.post!.id);
    if (res.success) {
      setPosts(posts.filter((p) => p.id !== approveModal.post!.id));
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setApproveModal({ open: false, post: null });
  };

  const handleReject = (post: getDataPostagensType) => {
    console.log({ open: true, post });
    setRejectModal({ open: true, post });
    setRejectReason("");
  };

  const confirmReject = async () => {
    if (!rejectModal.post) {
      toast.error("Erro inesperado");
      setRejectModal({ open: false, post: null });
      return;
    }
    const res = await reprovarFeedAction(
      rejectModal.post.id, // <<-- CORREÇÃO PRINCIPAL AQUI
      rejectReason.trim()
    );
    if (res.success) {
      setPosts(posts.filter((p) => p.id !== rejectModal.post!.id));
      setRejectModal({ open: false, post: null });
      setRejectReason("");
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const fetchData = async () => {
    const res = await getPostagensAction();
    setPosts(res.data);
    setLoading(false);
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

        {loading ? (
          <div className="w-full flex justify-center items-center">
            <Image
              src="\assets\fade-stagger-circles-branco.svg"
              alt="Loading"
              width="30"
              height="30"
            />
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 bg-[#1E1E1E] rounded-lg p-4 sm:p-8 w-full max-w-[1256px]">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="bg-[#2A2A2A] border border-[#444444] rounded-md p-4 break-inside-avoid-column flex flex-col mb-6 gap-4 shadow-md"
              >
                {/* <div>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    Ver Anúncio
                  </button>
                </div> */}
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span className="font-medium">
                    {post.publicado_em.replace(
                      /.*(\d{2}\/\d{2}\/\d{4}).*/,
                      "Data: $1"
                    )}
                  </span>
                  <span className="font-medium">
                    {post.publicado_em.replace(
                      /.*(\d{2}:\d{2}):\d{2}.*/,
                      "Hora: $1"
                    )}
                  </span>
                </div>
                <div className="relative bg-gray-700 rounded-lg overflow-hidden">
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
                <div className="flex gap-2 items-center text-sm text-gray-400">
                  Status:
                  <span className="text-amber-400">{post.publish}</span>
                </div>

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
        )}
      </div>

      {/* Approve Modal */}
      <Dialog
        open={approveModal.open}
        onOpenChange={(open) => setApproveModal({ open, post: null })}
      >
        <DialogContent className="bg-[#2A2A2A] border border-[#444444] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {/* Aprovar Anúncio de {approveModal.post?.advertiser} */}
              Aprovar Anúncio
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 mb-6">
              Tem certeza de que deseja aprovar este anúncio?
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
        <DialogContent className="bg-[#2A2A2A] border border-[#444444] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {/* Reprovar Anúncio de {rejectModal.post?.advertiser} */}
              Reprovar Anúncio
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 mb-4">
              Você está reprovando o anúncio. Por favor, forneça o motivo
              abaixo.
            </p>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Escreva o motivo da reprovação (obrigatório)..."
              className="bg-[#2A2A2A] border-gray-600 text-white placeholder-gray-400 min-h-[100px] mb-6"
            />
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setRejectModal({ open: false, post: null })}
                variant="outline"
                className="bg-transparent border-[#444444] text-gray-300"
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
