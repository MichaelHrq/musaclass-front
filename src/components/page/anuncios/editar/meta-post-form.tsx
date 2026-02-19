"use client";

import {
  getAdminFormAnucioMetaType,
  updateFormPostAnuncioById,
} from "@/app/gestao/anuncios/action";
import { Button } from "@/components/ui/button";
import { Checkbox as CheckboxCustom } from "@/components/ui/custom/checkbox";
import { Form, FormMessage } from "@/components/ui/form";
import InputCurrency from "@/components/ui/input/currency";
import Input from "@/components/ui/input/input";
import InputMask from "@/components/ui/input/mask";
import Select from "@/components/ui/select/select";
import { phoneDDDFormat, phoneFormat } from "@/lib/format";
import { metaAnuncioSchema, typeMetaAnucio } from "@/schema/meta-anuncio";
import { handleTestWhatsapp } from "@/utils/whatsapp";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "@react-input/mask";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type PropsType = {
  edit: getAdminFormAnucioMetaType;
  postId: string;
};

export default function MetaPostForm({ edit, postId }: PropsType) {
  const form = useForm<typeMetaAnucio>({
    resolver: zodResolver(metaAnuncioSchema),
    defaultValues: {
      ...edit,
      whatsapp_acompanhante: format(edit.whatsapp_acompanhante, phoneFormat),
      ddi_acompanhante: format(edit.ddi_acompanhante, phoneDDDFormat),
      cache_acompanhante:
        Number(edit?.cache_acompanhante?.replace("R$ ", "")) || null,
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    register,
    formState: { errors },
  } = form;

  async function onSubmit(data: typeMetaAnucio) {
    const toastId = toast.loading("Atualizando anúncio...");
    const submit = {
      ...edit,
      ...data,
      whatsapp_acompanhante: data.whatsapp_acompanhante.replace(/\D/g, ""),
      cache_acompanhante: data.cache_acompanhante?.toString(),
      termino_acompanhante: edit.termino_acompanhante.split(' ')[0]
    };
    console.log(submit)
    const resp = await updateFormPostAnuncioById(postId, submit);
    if (resp.success) {
      toast.success(resp.message, { id: toastId });
    } else {
      toast.error(resp.message, { id: toastId });
    }
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
          <Button
            type="button"
            onClick={() => {
              const ddi = getValues("ddi_acompanhante");
              const whatsapp = getValues("whatsapp_acompanhante");
              handleTestWhatsapp({ ddi, whatsapp });
            }}
            className="sm:flex-1/5 sm:flex mt-[22px] flex items-center justify-center gap-1 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 border border-green-500/20 hover:border-green-500/50 rounded-md transition-all text-xs sm:text-sm  whitespace-nowrap"
          >
            <span className="hidden sm:inline-block">Testar</span>
            <span>Whatsapp</span>
          </Button>
        </div>

        <input type="hidden" {...register("post_id")} value={postId} />

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
            // disabled={naorespAltura}
          />
          {/* <div className="flex items-start gap-3 mt-1">
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
          </div> */}
        </div>

        <div>
          <Input
            control={control}
            name="novopeso_acompanhante"
            label="Peso (Kg)"
            error={errors.novopeso_acompanhante?.message}
            type="number"
            // disabled={naorespPeso}
          />
          {/* <div className="flex items-start gap-3 mt-1">
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
          </div> */}
        </div>

        <div>
          <Input
            control={control}
            name="quadril_acompanhante"
            label="Manequim"
            error={errors.quadril_acompanhante?.message}
            type="number"
            // disabled={naorespQuadril}
          />
          {/* <div className="flex items-start gap-3 mt-1">
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
          </div> */}
        </div>

        <div>
          <Input
            control={control}
            name="novopes_acompanhante"
            label="Pés"
            error={errors.novopes_acompanhante?.message}
            type="number"
            // disabled={naorespPes}
          />
          {/* <div className="flex items-start gap-3 mt-1">
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
          </div> */}
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

        <Button
          type="submit"
          className="flex-1/3 sm:flex-1/5 sm:flex mt-[22px] flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:border-blue-500/50 rounded-md transition-all font-medium text-sm  whitespace-nowrap"
        >
          Atualizar Anúncio
        </Button>
      </form>
    </Form>
  );
}
