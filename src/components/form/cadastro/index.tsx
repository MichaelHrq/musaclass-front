"use client";

import ButtonPending from "@/components/ui/button/pending";
import InputError from "@/components/ui/error/input";
import { Input } from "@/components/ui/input";
import InputPassword from "@/components/ui/input/password";
import InputField from "@/components/ui/inputField";
import { Label } from "@/components/ui/label";
import useToastFetch from "@/hooks/use-fetch";
import { cadastroSchema } from "@/schema/cadastro";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof cadastroSchema>;

type PropsType = {
  email: string;
  token: string;
};

export default function FormCadastro({ email, token }: PropsType) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting: state, errors },
  } = useForm<FormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      email,
      token,
    },
  });

  const router = useRouter();
  const { toastFetch } = useToastFetch();

  async function onSubmit(data: FormData) {
    // await toastFetch(
    //   loginAction(data),
    //   "Login realizado com sucesso!",
    //   "/gestao"
    // );
    console.log(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full"
    >
      <InputField>
        <Label htmlFor="email" className="text-left mb-2">
          Email
        </Label>
        <Input disabled autoComplete="off" {...register("email")} id="email" />
        <InputError error={errors?.email} />
      </InputField>

      <InputField>
        <Label htmlFor="password" className="text-left mb-2">
          Senha
        </Label>
        <InputPassword {...register("password")} id="password" />
        <InputError error={errors?.password} />
      </InputField>

      <InputField>
        <Label htmlFor="confirmation" className="text-left mb-2">
          Confirmação de senha
        </Label>
        <InputPassword
          {...register("password_confirmation")}
          id="confirmation"
        />
        <InputError error={errors?.password_confirmation} />
      </InputField>

      <InputError error={errors?.token} />

      <ButtonPending label="Salvar" isPending={state} />
    </form>
  );
}
