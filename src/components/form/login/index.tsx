"use client";

import { loginAction } from "@/app/(auth)/action";
import ButtonPending from "@/components/ui/button/pending";
import InputError from "@/components/ui/error/input";
import { Input } from "@/components/ui/input";
import InputPassword from "@/components/ui/input/password";
import InputField from "@/components/ui/inputField";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/schema/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormData = z.infer<typeof loginSchema>;

export default function FormLogin() {
  const router = useRouter();
  const [loading, setLoading] = React.useState({
    submit: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: FormData) {
    setLoading((curr) => ({ ...curr, submit: true }));
    const resp = await loginAction(JSON.stringify(data));
    setLoading((curr) => ({ ...curr, submit: false }));
    if (resp.sucess) {
      toast.success(resp.message);
      return router.push(resp.redirect);
    }
    return toast.error(resp.message);
  }

  return (
    <form
      className="flex flex-col gap-6 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputField>
        <Label htmlFor="email" className="text-left mb-2">
          Email
        </Label>
        <Input autoComplete="off" {...register("email")} id="email" />
        <InputError error={errors?.email} />
      </InputField>

      <InputField>
        <Label htmlFor="password" className="text-left mb-2">
          Senha
        </Label>
        <InputPassword {...register("password")} id="password" />
        <InputError error={errors?.password} />
      </InputField>

      <ButtonPending label="Entrar" isPending={loading.submit} />
    </form>
  );
}
