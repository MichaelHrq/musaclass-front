"use client";

import { SendEmail } from "@/app/gestao/anunciante/action";
import ButtonPending from "@/components/ui/button/pending";
import InputError from "@/components/ui/error/input";
import { Input } from "@/components/ui/input";
import InputField from "@/components/ui/inputField";
import { Label } from "@/components/ui/label";
import { ChangeEmailSchema, ChangeEmailType } from "@/schema/searchCpf";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateEmailAnuncianteAction } from "./action";

export default function FormChangeEmail({ lastEmail }: { lastEmail: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangeEmailType>({
    resolver: zodResolver(ChangeEmailSchema),
  });

  async function onSubmit(data: ChangeEmailType) {
    // console.log(data);
    const res = await updateEmailAnuncianteAction(data);
    console.log(res)
    if (!res.success) {
      return toast.error(res.message);
    }
    return toast.success(res.message);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full gap-4"
    >
      <InputField>
        <Label htmlFor="email" className="text-left">
          Novo email
        </Label>
        <Input autoComplete="off" {...register("newEmail")} id="email" />
        <InputError error={errors?.newEmail} />
      </InputField>

      <input
        type="hidden"
        {...register("lastEmail")}
        value={lastEmail}
        id="lastEmail"
      />

      <ButtonPending isPending={isSubmitting} label="Alterar email" />
    </form>
  );
}
