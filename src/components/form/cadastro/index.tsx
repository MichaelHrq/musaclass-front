"use client";

import { createAnuncAction } from "@/app/(auth)/action";
import ButtonPending from "@/components/ui/button/pending";
import InputError from "@/components/ui/error/input";
import { Input } from "@/components/ui/input";
import InputPassword from "@/components/ui/input/password";
import InputField from "@/components/ui/inputField";
import { Label } from "@/components/ui/label";
import { cpfFormat } from "@/lib/format";
import { cadastroSchema } from "@/schema/cadastro";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputMask } from "@react-input/mask";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormData = z.infer<typeof cadastroSchema>;

type PropsType = {
  email: string;
  token: string;
};

export default function FormCadastro({ email, token }: PropsType) {
  const [loading, setLoading] = React.useState({
    submit: false,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      email,
      cpf: "",
      password: "",
      password_confirmation: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: FormData) {
    try {
      setLoading((curr) => ({ ...curr, submit: true }));
      const resp = await createAnuncAction(JSON.stringify(data));
      if (resp.sucess) {
        toast.success(resp.message);
        return router.push(resp.redirect);
      }
      return toast.error(resp.message);
    } finally {
      setLoading((curr) => ({ ...curr, submit: false }));
    }
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
        <Label htmlFor="cpf" className="text-left mb-2">
          CPF
        </Label>
        <InputMask
          component={Input}
          id="cpf"
          autoComplete="off"
          {...register("cpf")}
          {...cpfFormat}
        />
        <InputError error={errors?.password} />
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

      {/* <InputError error={errors?.token} /> */}

      <ButtonPending label="Salvar" isPending={loading.submit} />
    </form>
  );
}
