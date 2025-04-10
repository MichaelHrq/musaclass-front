"use client";

import { loginAction } from "@/app/action";
import ButtonPending from "@/components/ui/button/pending";
import InputError from "@/components/ui/error/input";
import { Input } from "@/components/ui/input";
import InputPassword from "@/components/ui/input/password";
import InputField from "@/components/ui/inputField";
import { Label } from "@/components/ui/label";
import useToastFetch from "@/hooks/use-fetch";
import { loginSchema } from "@/schema/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof loginSchema>;

export default function FormLogin() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting: state, errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();
  const { toastFetch } = useToastFetch();

  async function onSubmit(data: FormData) {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    await toastFetch(
      loginAction(formData),
      "Login realizado com sucesso!",
      '/anunciante'
    );
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

      <div className="flex justify-end cursor-pointer">
        <p className="text-sm text-neutral-400 hover:underline">
          Esqueceu sua senha?
        </p>
      </div>

      <ButtonPending label="Entrar" isPending={state} />
    </form>
  );
}
