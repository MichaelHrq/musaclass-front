"use client";

import { sendCodeAction } from "@/app/(auth)/esqueci-senha/action";
import ButtonPending from "@/components/ui/button/pending";
import { Form } from "@/components/ui/form";
import Input from "@/components/ui/input/input";
import { sendCodeSchema, SendCodeType } from "@/schema/esqueci-senha";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TabForgotPassordType } from ".";
import { useRouter, usePathname } from "next/navigation";

type PropsType = {
  onChangeStep: (step: TabForgotPassordType) => void;
};

export default function SendCode({ onChangeStep }: PropsType) {
  const { replace } = useRouter();
  const pathname = usePathname();

  const form = useForm<SendCodeType>({
    resolver: zodResolver(sendCodeSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting: state },
  } = form;

  async function onSubmit(data: SendCodeType) {
    const resp = await sendCodeAction(data);
    if (resp.success) {
      const params = new URLSearchParams();
      params.set("email", data.email);
      replace(`${pathname}?${params.toString()}`);
      toast.success(resp.message);
      onChangeStep("verifycode");
    } else {
      toast.error(resp.message);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full"
      >
        <Input
          control={control}
          name="email"
          autoComplete="off"
          label="Email"
          error={errors.email?.message}
        />

        <ButtonPending label="Enviar código" isPending={state} />
      </form>
    </Form>
  );
}
