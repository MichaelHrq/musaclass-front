import ButtonPending from "@/components/ui/button/pending";
import { Input } from "@/components/ui/input/input";
import InputField from "@/components/ui/inputField";
import { Label } from "@/components/ui/label";
import { SearchCpfSchema, SearchCpfType } from "@/schema/searchCpf";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputMask } from "@react-input/mask";
import { useForm } from "react-hook-form";
import InputError from "@/components/ui/error/input";
import React from "react";
import { SearchCPF } from "@/app/gestao/anunciante/action";

type PropType = {
  setAnuncios: React.Dispatch<React.SetStateAction<any>>;
};

export default function FormSearchCpf({ setAnuncios }: PropType) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting: state, errors },
  } = useForm<SearchCpfType>({
    resolver: zodResolver(SearchCpfSchema),
  });

  async function onSubmit(data: SearchCpfType) {
    const formData = new FormData();
    formData.append("cpf", data.cpf);
    const res = await SearchCPF(formData);
    if (!res.success) {
      return setError("submit", { type: "manual", message: res.message });
    }
    setAnuncios(res.data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full mt-4 gap-6"
    >
      <InputField>
        <Label htmlFor="cpf" className="text-left mb-2">
          Buscar por CPF
        </Label>
        <InputMask
          component={Input}
          mask="___.___.___-__"
          replacement={{ _: /\d/ }}
          id="cpf"
          {...register("cpf")}
          autoComplete="off"
        />
        <InputError error={errors?.cpf} />
      </InputField>
      <InputError error={errors?.submit} />
      <ButtonPending isPending={state} />
    </form>
  );
}
