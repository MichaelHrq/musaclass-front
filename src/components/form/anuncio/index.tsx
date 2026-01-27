"use client";

import { Button } from "@/components/ui/button";
import ButtonPending from "@/components/ui/button/pending";
import { Checkbox } from "@/components/ui/checkbox";
import { Checkbox as CheckboxCustom } from "@/components/ui/custom/checkbox";
import { Form, FormMessage } from "@/components/ui/form";
import InputCurrency from "@/components/ui/input/currency";
import Input from "@/components/ui/input/input";
import InputMask from "@/components/ui/input/mask";
import { Label } from "@/components/ui/label";
import Select from "@/components/ui/select/select";
import { phoneDDDFormat, phoneFormat } from "@/lib/format";
import { anuncioSchema, AnuncioType } from "@/schema/anuncio";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React, { useId } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type PropsType = {
  edit: AnuncioType;
};

export default function FormAnuncio({ edit }: PropsType) {
  const [loading, setLoading] = React.useState({
    submit: false,
  });

  // const naorespCacheId = useId();
  const naorespAlturaId = useId();
  const naorespPesoId = useId();
  const naorespQuadrilId = useId();
  const naorespPesId = useId();

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
    formState: { errors },
  } = form;

  async function onSubmit(data: AnuncioType) {
    alert(JSON.stringify(data, null, 2));
    // setLoading((cur) => ({ ...cur, submit: true }));
    // const resp = await updateDadosAnuncio(data);
    // setLoading((cur) => ({ ...cur, submit: false }));
    // if (resp.sucess) {
    //   return toast.success(resp.message);
    // }
    // return toast.error(resp.message);
  }

  function handleCheck(field: keyof AnuncioType) {
    const check = getValues()?.[field];
    setValue(field, !check);
  }

  // const isComb = watch("combinar");
  const naorespAltura = watch("novoaltura_esconder");
  const naorespPeso = watch("novopeso_esconder");
  const naorespQuadril = watch("quadril_esconder");
  const naorespPes = watch("novopes_esconder");
  // const naorespCache = watch("cache_acompanhante_esconder");

  function handleTryWhatsapp() {
    const { ddi_acompanhante, whatsapp_acompanhante } = getValues();
    if (!ddi_acompanhante || !whatsapp_acompanhante) {
      return toast.error("Preencha o DDD e o Telefone");
    }
    const url = `https://api.whatsapp.com/send?phone=${ddi_acompanhante}${whatsapp_acompanhante.replace(
      /\D/g,
      "",
    )}`;
    window.open(url, "_blank");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full"
      >
        <div className="flex gap-2">
          <div className="flex-1/3 sm:flex-1/5">
            <InputMask
              control={control}
              name="ddi_acompanhante"
              label="DDI"
              error={errors.ddi_acompanhante?.message}
              inputMode="numeric"
              {...phoneDDDFormat}
            />
          </div>
          <InputMask
            control={control}
            name="whatsapp_acompanhante"
            label="Tel/Whatsapp"
            error={errors.whatsapp_acompanhante?.message}
            inputMode="numeric"
            {...phoneFormat}
          />
        </div>

        <div>
          <Button
            type="button"
            onClick={handleTryWhatsapp}
            className="bg-green-700 hover:bg-green-800"
          >
            Testar Whatsapp
          </Button>
        </div>

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
            // disabled={naorespCache}
            inputMode="numeric"
          />
          <FormMessage className="mt-2">
            {errors.cache_acompanhante?.message}
          </FormMessage>
          {/* <div className="flex items-start gap-3 mt-1">
            <Checkbox
              id={naorespCacheId}
              checked={naorespCache}
              onCheckedChange={() => handleCheck("cache_acompanhante_esconder")}
            />
            <div className="grid gap-2 items-end">
              <Label htmlFor={naorespCacheId} className="text-xs md:text-sm">
                Não responder
              </Label>
            </div>
          </div> */}
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

        <div>
          <Input
            control={control}
            name="novoaltura_acompanhante"
            label="Altura (m)"
            error={errors.novoaltura_acompanhante?.message}
            type="number"
            step="0.01"
            disabled={naorespAltura}
          />
          <div className="flex items-start gap-3 mt-1">
            <Checkbox
              id={naorespAlturaId}
              checked={naorespAltura}
              onCheckedChange={() => handleCheck("novoaltura_esconder")}
            />
            <div className="grid gap-2 items-end">
              <Label htmlFor={naorespAlturaId} className="text-xs md:text-sm">
                Não responder
              </Label>
            </div>
          </div>
        </div>

        <div>
          <Input
            control={control}
            name="novopeso_acompanhante"
            label="Peso (Kg)"
            error={errors.novopeso_acompanhante?.message}
            type="number"
            disabled={naorespPeso}
          />
          <div className="flex items-start gap-3 mt-1">
            <Checkbox
              id={naorespPesoId}
              checked={naorespPeso}
              onCheckedChange={() => handleCheck("novopeso_esconder")}
            />
            <div className="grid gap-2 items-end">
              <Label htmlFor={naorespPesoId} className="text-xs md:text-sm">
                Não responder
              </Label>
            </div>
          </div>
        </div>

        <div>
          <Input
            control={control}
            name="quadril_acompanhante"
            label="Manequim"
            error={errors.quadril_acompanhante?.message}
            type="number"
            disabled={naorespQuadril}
          />
          <div className="flex items-start gap-3 mt-1">
            <Checkbox
              id={naorespQuadrilId}
              checked={naorespQuadril}
              onCheckedChange={() => handleCheck("quadril_esconder")}
            />
            <div className="grid gap-2 items-end">
              <Label htmlFor={naorespQuadrilId} className="text-xs md:text-sm">
                Não responder
              </Label>
            </div>
          </div>
        </div>

        <div>
          <Input
            control={control}
            name="novopes_acompanhante"
            label="Pés"
            error={errors.novopes_acompanhante?.message}
            type="number"
            disabled={naorespPes}
          />
          <div className="flex items-start gap-3 mt-1">
            <Checkbox
              id={naorespPesId}
              checked={naorespPes}
              onCheckedChange={() => handleCheck("novopes_esconder")}
            />
            <div className="grid gap-2 items-end">
              <Label htmlFor={naorespPesId} className="text-xs md:text-sm">
                Não responder
              </Label>
            </div>
          </div>
        </div>

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

        <div className="flex justify-center items-center gap-3">
          <Link href={`/anunciante`}>
            <Button type="button" variant={"secondary"}>
              <ChevronLeft />
              Voltar
            </Button>
          </Link>
          <ButtonPending isPending={loading.submit} label="Salvar alterações" />
        </div>
      </form>
    </Form>
  );
}
