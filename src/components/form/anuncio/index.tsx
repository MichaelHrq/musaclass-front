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
          name="telefone"
          label="Digite seu telefone"
          error={errors.telefone?.message}
          {...phoneFormat}
        />

        <InputTag
          control={control}
          name="local"
          label="Local"
          error={errors.local?.message}
        />

        <Input
          control={control}
          name="cache"
          label="Cachê"
          error={errors.cache?.message}
        />

        <Select
          control={control}
          name="cartao"
          label="Aceita cartão"
          error={errors.cartao?.message}
          items={[
            { value: "Sim", label: "Sim" },
            { value: "Não", label: "Não" },
          ]}
        />

        <Input
          control={control}
          name="altura"
          label="Altura (m)"
          error={errors.altura?.message}
        />

        <Input
          control={control}
          name="peso"
          label="Peso (Kg)"
          error={errors.peso?.message}
        />

        <Input
          control={control}
          name="manequim"
          label="Manequim"
          error={errors.manequim?.message}
        />

        <Input
          control={control}
          name="pes"
          label="Pés"
          error={errors.pes?.message}
        />

        <MultipleSelector
          control={control}
          name="acompanha"
          label="Acompanha"
          error={errors.acompanha?.message}
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
