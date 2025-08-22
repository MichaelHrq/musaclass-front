"use client";

import { loginAction } from "@/app/(auth)/action";
import ButtonPending from "@/components/ui/button/pending";
import { Form } from "@/components/ui/form";
import Input from "@/components/ui/input/input";
import InputPassword from "@/components/ui/input/password";
import { loginSchema } from "@/schema/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormData = z.infer<typeof loginSchema>;

type PropsType = {
  redirectTo: string | undefined;
};

export default function FormLogin({ redirectTo }: PropsType) {
  const router = useRouter();
  const [loading, setLoading] = React.useState({
    submit: false,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  async function onSubmit(data: FormData) {
    try {
      setLoading((curr) => ({ ...curr, submit: true }));
      const resp = await loginAction(JSON.stringify(data), redirectTo);
    } catch (error:any) {
      if (error.digest?.includes("NEXT_REDIRECT")) {
        toast.success('Login realizado com sucesso');
        throw error;
      }
      toast.error(error.message || "Credenciais inválidas")
    } finally {
      setLoading((curr) => ({ ...curr, submit: false }));
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full"
      >
        <Input
          control={control}
          name="email"
          // autoComplete="off"
          label="Digite seu email"
          error={errors.email?.message}
        />

        <InputPassword
          control={control}
          name="password"
          label="Digite sua senha"
          error={errors.password?.message}
        />

        <ButtonPending label="Entrar" isPending={loading.submit} />
      </form>
    </Form>
  );
}
