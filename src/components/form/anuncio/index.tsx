"use client";

import ButtonPending from "@/components/ui/button/pending";
import InputError from "@/components/ui/error/input";
import { Input } from "@/components/ui/input";
import { InputCurrency } from "@/components/ui/input/currency";
import InputField from "@/components/ui/inputField";
import { Label } from "@/components/ui/label";
import { SelectControl } from "@/components/ui/select/select-control";
import { anuncioSchema } from "@/schema/anuncio";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputMask } from "@react-input/mask";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Form from "..";

type FormData = z.infer<typeof anuncioSchema>;

export default function FormAnuncio() {
  const defaultValues = {
    telefone: "(92)98548-7210",
    local: "Sim",
    cache: 750.5,
    cartao: "Sim",
    altura: "1,70",
    peso: "70",
    manequim: "40",
    pes: "39",
    acompanha: "Mulheres",
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting: state, errors },
  } = useForm({
    resolver: zodResolver(anuncioSchema),
    defaultValues,
  });

  async function onSubmit(data: FormData) {
    const formData = new FormData();
    console.log(data);
  }

  return (
    <Form>
      <InputField>
        <Label htmlFor="phone">Telefone</Label>
        <InputMask
          component={Input}
          mask="(__)_____-____"
          replacement={{ _: /\d/ }}
          id="phone"
          autoComplete="off"
          {...register("telefone")}
        />
        <InputError error={errors?.telefone} />
      </InputField>
      <InputField>
        <Label>Com local</Label>
        <SelectControl
          control={control}
          name="local"
          items={[
            { value: "Sim", label: "Sim" },
            { value: "Não", label: "Não" },
          ]}
        />
        <InputError error={errors?.local} />
      </InputField>
      <InputField>
        <Label htmlFor="cache">Cachê</Label>
        <InputCurrency control={control} name="cache" />
        <InputError error={errors?.cache} />
      </InputField>
      <InputField>
        <Label>Aceita cartão</Label>
        <SelectControl
          control={control}
          name="cartao"
          items={[
            { value: "Sim", label: "Sim" },
            { value: "Não", label: "Não" },
          ]}
        />
        <InputError error={errors?.cartao} />
      </InputField>
      <InputField>
        <Label htmlFor="altura">Altura (m)</Label>
        <InputMask
          component={Input}
          mask="_,__"
          replacement={{ _: /\d/ }}
          id="altura"
          autoComplete="off"
          {...register("altura")}
        />
        <InputError error={errors?.altura} />
      </InputField>
      <InputField>
        <Label htmlFor="peso">Peso (Kg)</Label>
        <InputMask
          component={Input}
          mask="___"
          replacement={{ _: /\d/ }}
          id="peso"
          autoComplete="off"
          {...register("peso")}
        />
        <InputError error={errors?.peso} />
      </InputField>
      <InputField>
        <Label htmlFor="manequim">Manequim</Label>
        <InputMask
          component={Input}
          mask="__"
          replacement={{ _: /\d/ }}
          id="manequim"
          autoComplete="off"
          {...register("manequim")}
        />
        <InputError error={errors?.manequim} />
      </InputField>
      <InputField>
        <Label htmlFor="pes">Pés</Label>
        <InputMask
          component={Input}
          mask="__"
          replacement={{ _: /\d/ }}
          id="pes"
          autoComplete="off"
          {...register("pes")}
        />
        <InputError error={errors?.pes} />
      </InputField>
      <InputField>
        <Label>Acompanha</Label>
        <SelectControl
          control={control}
          name="acompanha"
          items={[
            { value: "Homens", label: "Homens" },
            { value: "Mulheres", label: "Mulheres" },
            { value: "Casal", label: "Casal" },
          ]}
        />
        <InputError error={errors?.acompanha} />
      </InputField>

      <ButtonPending
        onClick={handleSubmit(onSubmit)}
        isPending={state}
        label="Salvar alterações"
      />
    </Form>
  );
}
