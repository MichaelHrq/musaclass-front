"use client";

import { changePasswordAction } from "@/app/anunciante/perfil/action";
import ButtonPending from "@/components/ui/button/pending";
import { Form } from "@/components/ui/form";
import InputPassword from "@/components/ui/input/password";
import { resetSchema, ResetType } from "@/schema/esqueci-senha";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ChangePassword() {
  const form = useForm<ResetType>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors, isSubmitting: state },
  } = form;

  async function onSubmit(data: ResetType) {
    const resp = await changePasswordAction(data);
    if (resp.success) {
      toast.success(resp.message);
    } else {
      toast.error(resp.message);
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
        className="flex flex-col gap-4 w-full"
      >
        <InputPassword
          control={control}
          name="password"
          label="Senha"
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

        <ButtonPending label="Alterar senha" isPending={state} />
      </form>
    </Form>
  );
}
