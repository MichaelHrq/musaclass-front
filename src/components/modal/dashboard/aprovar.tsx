"use client";

import { Button } from "@/components/ui/button";
import DialogCustom from "@/components/ui/dialog/index"; // Seu componente de diálogo customizado
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Ou sua biblioteca de toast preferida
// import { aprovarPostAction } from "@/app/gestao/action"; // Sua Server Action

// Exemplo de Server Action (substitua pela sua implementação real)
async function aprovarPostAction(postId: string): Promise<{ success: boolean; message: string }> {
  // console.log("Server Action: Aprovar Post ID:", postId);
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simula latência
  // return { success: false, message: "Erro simulado ao aprovar." };
  return { success: true, message: "Post aprovado com sucesso!" };
}


interface AprovarDialogProps {
  postId: string;
  anunciante: string;
}

function TriggerButton({ onOpen, disabled }: { onOpen: () => void, disabled?: boolean }) {
  return <Button onClick={onOpen} variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white disabled:opacity-50" disabled={disabled}>Aprovar</Button>;
}

function ContentMessage({ anunciante }: { anunciante: string }) {
  return <p>Tem certeza de que deseja aprovar este anúncio do anunciante <span className="font-semibold">{anunciante}</span>?</p>;
}

function FooterActions({ onClose, onConfirm, isLoading }: { onClose: () => void; onConfirm: () => void; isLoading: boolean; }) {
  return (
    <div className="flex justify-end w-full gap-3">
      <Button onClick={onClose} variant="ghost" disabled={isLoading}>
        Cancelar
      </Button>
      <Button
        onClick={onConfirm}
        className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-emerald-400"
        disabled={isLoading}
      >
        {isLoading ? "Aprovando..." : "Confirmar Aprovação"}
      </Button>
    </div>
  );
}

export default function AprovarDialog({ postId, anunciante }: AprovarDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirmApproval = async () => {
    startTransition(async () => {
      try {
        const response = await aprovarPostAction(postId); // Chame sua Server Action aqui
        if (response.success) {
          toast.success(response.message);
          handleClose();
          router.refresh(); // Revalida os dados da página (Server Components)
                           // Alternativamente, sua action deve usar revalidatePath/revalidateTag
        } else {
          toast.error(response.message || "Falha ao aprovar o anúncio.");
        }
      } catch (error) {
        toast.error("Ocorreu um erro inesperado ao tentar aprovar.");
        console.error("Erro ao aprovar:", error);
      }
    });
  };

  return (
    <DialogCustom
      Trigger={<TriggerButton onOpen={handleOpen} disabled={isPending} />}
      Content={<ContentMessage anunciante={anunciante}/>}
      Header={`Aprovar Anúncio de ${anunciante}`}
      Footer={<FooterActions onClose={handleClose} onConfirm={handleConfirmApproval} isLoading={isPending} />}
      open={open}
      onOpenChange={setOpen} // Permite que DialogCustom controle o fechamento (ESC, clique fora)
    />
  );
}