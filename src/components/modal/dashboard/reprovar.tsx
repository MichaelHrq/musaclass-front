"use client";

import { Button } from "@/components/ui/button";
import DialogCustom from "@/components/ui/dialog/index";
import InputError from "@/components/ui/error/input";
import { Textarea } from "@/components/ui/textarea";
import { reprovarSchema } from "@/schema/dialog"; // Seu schema Zod: z.object({ motivo: z.string().min(10, "Motivo muito curto") })
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition, useEffect } from "react";
import { useForm, SubmitHandler, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// import { reprovarPostAction } from "@/app/gestao/action"; // Sua Server Action

// Exemplo de Server Action (substitua pela sua implementação real)
async function reprovarPostAction(postId: string, motivo: string): Promise<{ success: boolean; message: string }> {
  console.log("Server Action: Reprovar Post ID:", postId, "Motivo:", motivo);
  if (motivo.length < 5) return { success: false, message: "O motivo precisa ter pelo menos 5 caracteres."}
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { success: true, message: "Post reprovado com sucesso." };
}


type ReprovarFormData = z.infer<typeof reprovarSchema>;

interface ReprovarDialogProps {
  postId: string;
  anunciante: string;
}

function TriggerButton({ onOpen, disabled }: { onOpen: () => void, disabled?: boolean }) {
  return <Button onClick={onOpen} variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50" disabled={disabled}>Reprovar</Button>;
}

interface ContentFormProps {
  form: UseFormReturn<ReprovarFormData>;
  anunciante: string;
}

function ContentForm({ form, anunciante }: ContentFormProps) {
  return (
    <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-300">
            Você está reprovando o anúncio do anunciante <span className="font-semibold">{anunciante}</span>.
            Por favor, forneça o motivo abaixo.
        </p>
        <Textarea
            {...form.register("motivo")}
            placeholder="Escreva o motivo da reprovação (obrigatório)..."
            className="w-full min-h-[120px] bg-neutral-800 border-[#444] focus:ring-[#444]"
            aria-invalid={form.formState.errors.motivo ? "true" : "false"}
        />
        <InputError error={form.formState.errors.motivo} />
    </div>
  );
}

interface FooterActionsProps {
  onClose: () => void;
  onSubmit: () => void; // Será form.handleSubmit(processarReprovacao)
  isLoading: boolean;
  isFormValid: boolean;
}

function FooterActions({ onClose, onSubmit, isLoading, isFormValid }: FooterActionsProps) {
  return (
    <div className="flex justify-end w-full gap-3">
      <Button onClick={onClose} variant="ghost" disabled={isLoading}>
        Cancelar
      </Button>
      <Button
        onClick={onSubmit}
        className="bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400"
        disabled={isLoading || !isFormValid} // Desabilita se carregando ou formulário inválido
      >
        {isLoading ? "Enviando..." : "Confirmar Reprovação"}
      </Button>
    </div>
  );
}

export default function ReprovarDialog({ postId, anunciante }: ReprovarDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ReprovarFormData>({
    resolver: zodResolver(reprovarSchema),
    defaultValues: { motivo: "" },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // Apenas reseta o formulário se o diálogo não estiver mais sendo renderizado (após fechar)
  };
  
  useEffect(() => {
    if (!open) {
      form.reset({ motivo: "" }); // Reseta o formulário quando o diálogo é fechado
    }
  }, [open, form]);


  const processarReprovacao: SubmitHandler<ReprovarFormData> = async (data) => {
    startTransition(async () => {
      try {
        const response = await reprovarPostAction(postId, data.motivo); // Chame sua Server Action
        if (response.success) {
          toast.success(response.message);
          handleClose();
          router.refresh();
        } else {
          toast.error(response.message || "Falha ao reprovar o anúncio.");
        }
      } catch (error) {
        toast.error("Ocorreu um erro inesperado ao tentar reprovar.");
        console.error("Erro ao reprovar:", error);
      }
    });
  };

  return (
    <DialogCustom
      Trigger={<TriggerButton onOpen={handleOpen} disabled={isPending || form.formState.isSubmitting} />}
      Content={<ContentForm form={form} anunciante={anunciante} />}
      Header={`Reprovar Anúncio de ${anunciante}`}
      Footer={
        <FooterActions
          onClose={handleClose}
          onSubmit={form.handleSubmit(processarReprovacao)}
          isLoading={isPending || form.formState.isSubmitting}
          isFormValid={form.formState.isValid}
        />
      }
      open={open}
      onOpenChange={(isOpen) => { // Permite que DialogCustom controle o fechamento
        setOpen(isOpen);
        // O useEffect acima já cuida do reset ao fechar
      }}
    />
  );
}