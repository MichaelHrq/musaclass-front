"use client";

import { updateDadosAnuncio } from "@/app/anunciante/[anuncio]/action";
import ButtonPending from "@/components/ui/button/pending";
import { Checkbox } from "@/components/ui/checkbox";
import { Checkbox as CheckboxCustom } from "@/components/ui/custom/checkbox";
import { Form, FormMessage } from "@/components/ui/form";
import InputCurrency from "@/components/ui/input/currency";
import Input from "@/components/ui/input/input";
import InputMask from "@/components/ui/input/mask";
import { Label } from "@/components/ui/label";
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
    setValue,
    getValues,
    watch,
    formState: { isSubmitting: state, errors },
  } = form;

  async function onSubmit(data: AnuncioType) {
    setLoading((cur) => ({ ...cur, submit: true }));
    // console.log(data);
    const resp = await updateDadosAnuncio(data);
    if (resp.sucess) {
      return toast.success(resp.message);
    }
    return toast.error(resp.message);
  }

  function handleCheckCache() {
    const check = getValues()?.combinar;
    setValue(`combinar`, !check);
  }

  const isComb = watch(`combinar`)

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
          inputMode="numeric"
          {...phoneFormat}
        />

        <CheckboxCustom
          control={control}
          name="novoatendimento_acompanhante"
          label="Local"
          error={errors.novoatendimento_acompanhante?.message}
          items={[{ value: "Flat próprio", label: "Flat próprio" }]}
        />

        <div>
          <InputCurrency
            control={control}
            name="cache_acompanhante"
            label="Cachê"
            disabled={isComb}
            inputMode="numeric"
          />
          <div className="flex items-start gap-3 mt-1">
            <Checkbox
              id="terms-2"
              checked={getValues()?.combinar}
              onClick={handleCheckCache}
            />
            <div className="grid gap-2 items-end">
              <Label htmlFor="terms-2">A Combinar</Label>
            </div>
          </div>
          <FormMessage className="mt-2">{errors.cache_acompanhante?.message}</FormMessage>
        </div>

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
          type="number"
          step="0.01"
        />

        <Input
          control={control}
          name="novopeso_acompanhante"
          label="Peso (Kg)"
          error={errors.novopeso_acompanhante?.message}
          type="number"
        />

        <Input
          control={control}
          name="quadril_acompanhante"
          label="Manequim"
          error={errors.quadril_acompanhante?.message}
          type="number"
        />

        <Input
          control={control}
          name="novopes_acompanhante"
          label="Pés"
          error={errors.novopes_acompanhante?.message}
          type="number"
        />

        <CheckboxCustom
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
