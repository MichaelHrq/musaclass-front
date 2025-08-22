"use client";

import { createAnuncAction } from "@/app/(auth)/action";
import ButtonPending from "@/components/ui/button/pending";
import { Form } from "@/components/ui/form";
import Input from "@/components/ui/input/input";
import InputMask from "@/components/ui/input/mask";
import InputPassword from "@/components/ui/input/password";
import { cpfFormat } from "@/lib/format";
import { cadastroSchema } from "@/schema/cadastro";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
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
  const form = useForm<FormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      email,
      cpf: "",
      password: "",
      password_confirmation: "",
    },
  });

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const router = useRouter();

  async function onSubmit(data: FormData) {
    try {
      setLoading((curr) => ({ ...curr, submit: true }));
      const resp = await createAnuncAction(JSON.stringify(data));
      if (resp.success) {
        toast.success(resp.message);
        return router.push("/login");
      }
      return toast.error(resp.message);
    } finally {
      setLoading((curr) => ({ ...curr, submit: false }));
    }
  }

  const password = watch("password");

  const passwordRequirements = [
    { text: "Pelo menos 6 caracteres", met: password.length >= 6 },
    { text: "Uma letra maiúscula", met: /[A-Z]/.test(password) },
    { text: "Uma letra minúscula", met: /[a-z]/.test(password) },
    { text: "Um número", met: /\d/.test(password) },
    {
      text: "Um caractere especial !@#$%^&*",
      met: /[!@#$%^&*]/.test(password),
    },
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full"
      >
        <Input
          control={control}
          name="email"
          disabled
          label="Digite seu email"
          error={errors.email?.message}
        />

        <InputMask
          control={control}
          name="cpf"
          label="Digite seu CPF"
          error={errors.cpf?.message}
          {...cpfFormat}
        />

        <InputPassword
          control={control}
          name="password"
          label="Digite sua senha"
          error={errors.password?.message}
        />

        <InputPassword
          control={control}
          name="password_confirmation"
          label="Confirmação de senha"
          error={errors.password_confirmation?.message}
        />

        <div className="space-y-2">
          {passwordRequirements.map((req, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              {req.met ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-300" />
              )}
              <span className={req.met ? "text-green-700" : "text-gray-500"}>
                {req.text}
              </span>
            </div>
          ))}
        </div>

        <ButtonPending label="Salvar" isPending={loading.submit} />
      </form>
    </Form>
  );
}
