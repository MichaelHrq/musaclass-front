"use client";

import { updateDadosAnuncio } from "@/app/anunciante/[anuncio]/action";
import ButtonPending from "@/components/ui/button/pending";
import { Form } from "@/components/ui/form";
import Input from "@/components/ui/input/input";
import InputMask from "@/components/ui/input/mask";
import InputTag from "@/components/ui/input/tag";
import MultipleSelector from "@/components/ui/select/multiple";
import Select from "@/components/ui/select/select";
import { phoneFormat } from "@/lib/format";
import { anuncioSchema, AnuncioType } from "@/schema/anuncio";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type PropsType = {
  edit: AnuncioType;
};

export default function FormAnuncio({ edit }: PropsType) {
  const [loading, setLoading] = React.useState({
    submit: false,
  });
  const form = useForm<AnuncioType>({
    resolver: zodResolver(anuncioSchema),
    defaultValues: edit,
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting: state, errors },
  } = form;

  async function onSubmit(data: AnuncioType) {
    setLoading((cur) => ({ ...cur, submit: true }));
    const resp = await updateDadosAnuncio(data);
    if (resp.sucess) {
      return toast.success(resp.message);
    }
    return toast.error(resp.message);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full"
      >
        <InputMask
          control={control}
          name="whatsapp_acompanhante"
          label="Digite seu telefone"
          error={errors.whatsapp_acompanhante?.message}
          {...phoneFormat}
        />

        <InputTag
          control={control}
          name="novoatendimento_acompanhante"
          label="Local"
          error={errors.novoatendimento_acompanhante?.message}
        />

        <Input
          control={control}
          name="cache_acompanhante"
          label="Cachê"
          error={errors.cache_acompanhante?.message}
        />

        <Select
          control={control}
          name="cartao_acompanhante"
          label="Aceita cartão"
          error={errors.cartao_acompanhante?.message}
          items={[
            { value: "Sim", label: "Sim" },
            { value: "Não", label: "Não" },
          ]}
        />

        <Input
          control={control}
          name="novoaltura_acompanhante"
          label="Altura (m)"
          error={errors.novoaltura_acompanhante?.message}
        />

        <Input
          control={control}
          name="novopeso_acompanhante"
          label="Peso (Kg)"
          error={errors.novopeso_acompanhante?.message}
        />

        <Input
          control={control}
          name="quadril_acompanhante"
          label="Manequim"
          error={errors.quadril_acompanhante?.message}
        />

        <Input
          control={control}
          name="novopes_acompanhante"
          label="Pés"
          error={errors.novopes_acompanhante?.message}
        />

        <MultipleSelector
          control={control}
          name="novoacompanha_acompanhante"
          label="Acompanha"
          error={errors.novoacompanha_acompanhante?.message}
          items={[
            { value: "Homens", label: "Homens" },
            { value: "Mulheres", label: "Mulheres" },
            { value: "Casais", label: "Casais" },
          ]}
        />

        <ButtonPending isPending={state} label="Salvar alterações" />
      </form>
    </Form>
  );
}
