import { searchCpfAction } from "@/app/gestao/anunciante/action";
import ButtonPending from "@/components/ui/button/pending";
import InputError from "@/components/ui/error/input";
import { Input } from "@/components/ui/input";
import InputField from "@/components/ui/inputField";
import { Label } from "@/components/ui/label";
import { cpfFormat } from "@/lib/format";
import { SearchCpfSchema, SearchCpfType } from "@/schema/searchCpf";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputMask } from "@react-input/mask";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
    const res = await searchCpfAction(data);
    if (!res.success) {
      console.log(123);
      return toast.error(res.message);
    }
    setAnuncios(res.data.data ?? []);
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
          id="cpf"
          autoComplete="off"
          {...register("cpf")}
          {...cpfFormat}
        />
        <InputError error={errors?.cpf} />
      </InputField>
      <ButtonPending isPending={state} />
    </form>
  );
}
