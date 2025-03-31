"use client";

import { Input } from "@/components/ui/input/input";
import InputPassword from "@/components/ui/input/password";
import InputField from "@/components/ui/inputField";
import { Label } from "@/components/ui/label";
import React from "react";
import { loginAction } from "./action";
import { z } from "zod";
import { loginSchema } from "@/schema/login";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ButtonPending from "@/components/ui/button/pending";
import InputError from "@/components/ui/error/input";
import { toast } from "sonner";

type FormData = z.infer<typeof loginSchema>;

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting: state, errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: FormData) {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const res = await loginAction(formData);
    if (!res.success) {
      return toast.error(res.message)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-[400px] w-full p-8 rounded-lg bg-[#1E1E1E] flex flex-col justify-around items-center">
        <h2 className="text-3xl font-[500] mb-4">Login</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full"
        >
          <InputField>
            <Label htmlFor="email" className="text-left mb-2">
              Email
            </Label>
            <Input autoComplete="off" {...register("email")} id="email" />
            <InputError error={errors?.email}/>
          </InputField>

          <InputField>
            <Label htmlFor="password" className="text-left mb-2">
              Senha
            </Label>
            <InputPassword {...register("password")} id="password" />
            <InputError error={errors?.password}/>
          </InputField>

          <InputError error={errors?.submit}/>

          <div className="flex justify-end cursor-pointer">
            <p className="text-sm text-neutral-400 hover:underline">
              Esqueceu sua senha?
            </p>
          </div>

          <ButtonPending label="Entrar" isPending={state} />
        </form>
      </div>
    </main>
  );
}
