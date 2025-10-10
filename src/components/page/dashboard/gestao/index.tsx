"use client";

import {
  aprovarFeedAction,
  getDataPostagensType,
  getPostagensAction,
  reprovarFeedAction,
} from "@/app/gestao/action";
import Loading from "@/components/loading";
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
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

// Mensagem padrão para a reprovação
const defaultRejectReason = `A foto ou vídeo enviado não pôde ser publicado por não estar de acordo com as regras e diretrizes do site.

Para manter um ambiente seguro e adequado para todos, todo conteúdo precisa seguir nossas políticas. Recomendamos que você revise as Diretrizes da Comunidade antes de reenviar.

Agradecemos a compreensão.`;

export default function PostManagement() {
  const [approveModal, setApproveModal] = useState<{
    open: boolean;
    post: getDataPostagensType | null;
  }>({ open: false, post: null });
  const [rejectModal, setRejectModal] = useState<{
    open: boolean;
    post: getDataPostagensType | null;
  }>({ open: false, post: null });
  const [rejectReason, setRejectReason] = useState(defaultRejectReason);

  const queryClient = useQueryClient();

  const {
    data: postsData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["postagens"],
    queryFn: getPostagensAction,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.current_page < lastPage.last_page) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
  });

  const posts = postsData?.pages.flatMap((page) => page.data) ?? [];
  const approveMutation = useMutation({
    mutationFn: aprovarFeedAction,
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ["postagens"] });
      } else {
        toast.error(res.message);
      }
    },
    onError: (error) => {
      toast.error("Ocorreu um erro inesperado ao tentar aprovar.");
      console.error("Erro ao aprovar:", error);
    },
    onSettled: () => {
      setApproveModal({ open: false, post: null });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (variables: { id: number; motivo: string }) =>
      reprovarFeedAction(variables.id, variables.motivo),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ["postagens"] });
      } else {
        toast.error(res.message);
      }
    },
    onError: (error) => {
      toast.error("Ocorreu um erro inesperado ao tentar reprovar.");
      console.error("Erro ao reprovar:", error);
    },
    onSettled: () => {
      setRejectModal({ open: false, post: null });
      setRejectReason(defaultRejectReason);
    },
  });

  const handleApprove = (post: getDataPostagensType) => {
    setApproveModal({ open: true, post });
  };

  const confirmApprove = async () => {
    if (approveModal.post) {
      approveMutation.mutate(approveModal.post.id);
    }
  };

  const handleReject = (post: getDataPostagensType) => {
    setRejectModal({ open: true, post });
    // Define a mensagem padrão ao abrir o modal de rejeição
    setRejectReason(defaultRejectReason);
  };

  const confirmReject = async () => {
    if (rejectModal.post) {
      rejectMutation.mutate({
        id: rejectModal.post.id,
        motivo: rejectReason.trim(),
      });
    }
  };

  function handleItemTipo(tipo: string) {
    if (tipo === "story") {
      return "Story";
    }
    return "Galeria";
  }

  console.log(posts)

  return (
    <div className="container flex flex-col items-center">
      <div className="max-w-7xl">
        <h1 className="text-2xl sm:text-3xl font-medium mb-6 text-center">
          Gerenciar Postagens
        </h1>

        {isLoading ? (
          <div className="w-full flex justify-center items-center">
            <Image
              src="\assets\fade-stagger-circles-branco.svg"
              alt="Loading"
              width="30"
              height="30"
            />
          </div>
        ) : isError ? (
          <div className="bg-[#1E1E1E] rounded-lg p-4 sm:p-8 w-full max-w-[1256px] flex justify-center text-red-500">
            Falha ao carregar as postagens. Tente novamente mais tarde.
          </div>
        ) : posts.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 bg-[#1E1E1E] rounded-lg p-4 sm:p-8 w-full max-w-[1256px]">
            {posts?.map((post) => (
              <Card
                key={post.id}
                className="bg-[#2A2A2A] border border-[#444444] rounded-md p-4 break-inside-avoid-column flex flex-col mb-6 gap-4 shadow-md"
              >
                <h1 className="text-xl font-semibold">{post.posts_info.nome}</h1>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <p className="flex items-center gap-1"><MapPin size={16} className="text-gray-500" />{` `}{post.posts_info.cidade}</p>
                  <Button asChild variant={"outline"}>
                    <Link target="_blank" href={post.posts_info.url}>Ver Anúncio</Link>
                  </Button>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span className="font-medium">
                    <span className="text-[12px] rounded-lg bg-neutral-600 px-1.5 py-0.5 text-neutral-300 mr-1">
                      {handleItemTipo(post.tipo)}
                    </span>
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
                  {post.midia[0]?.tipo === "image" && (
                    <img
                      src={post.midia[0].url}
                      alt="Post media"
                      className="w-full aspect-auto object-cover"
                    />
                  )}
                  {post.midia[0]?.tipo === "video" && (
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
                    disabled={
                      approveMutation.isPending || rejectMutation.isPending
                    }
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white border-green-600"
                    variant="outline"
                  >
                    Aprovar
                  </Button>
                  <Button
                    onClick={() => handleReject(post)}
                    disabled={
                      approveMutation.isPending || rejectMutation.isPending
                    }
                    className="flex-1 bg-transparent hover:bg-red-600 text-red-500 hover:text-white border-red-500 hover:border-red-600"
                    variant="outline"
                  >
                    Reprovar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-[#1E1E1E] rounded-lg p-4 sm:p-8 w-full max-w-[1256px] flex justify-center">
            Nenhuma postagem encontrada
          </div>
        )}

        {hasNextPage && (
          <div className="w-full flex justify-center mt-8">
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {isFetchingNextPage ? <Loading /> : "Mostrar mais"}
            </Button>
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
                disabled={approveMutation.isPending}
                variant="outline"
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmApprove}
                disabled={approveMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {approveMutation.isPending
                  ? "Aprovando..."
                  : "Confirmar Aprovação"}
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
                disabled={rejectMutation.isPending}
                variant="outline"
                className="bg-transparent border-[#444444] text-gray-300"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmReject}
                disabled={!rejectReason.trim() || rejectMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {rejectMutation.isPending
                  ? "Reprovando..."
                  : "Confirmar Reprovação"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}