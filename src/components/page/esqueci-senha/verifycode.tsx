"use client";

import { verifyCodeAction } from "@/app/(auth)/esqueci-senha/action";
import ButtonPending from "@/components/ui/button/pending";
import { Form } from "@/components/ui/form";
import InputOTP from "@/components/ui/input/otp";
import { verifyCodeSchema, VerifyCodeType } from "@/schema/esqueci-senha";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TabForgotPassordType } from ".";

type PropsType = {
  onChangeStep: (step: TabForgotPassordType) => void;
};

export default function VerifyCode({ onChangeStep }: PropsType) {
  const form = useForm<VerifyCodeType>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting: state },
  } = form;

  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  async function onSubmit(data: VerifyCodeType) {
    const email = params.get("email");
    if (!email) {
      toast.error("Algum erro aconteceu, tente novamente!");
      return router.push("/esqueci-senha");
    }
    const resp = await verifyCodeAction({...data, email});
    if (resp.success) {
      const params = new URLSearchParams();
      params.set("email", email);
      params.set("code", data.code);
      router.replace(`${pathname}?${params.toString()}`);
      toast.success(resp.message);
      onChangeStep("reset");
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
        <InputOTP
          control={control}
          name="code"
          label="Código de verificação"
          error={errors.code?.message}
        />
        <ButtonPending label="Verificar código" isPending={state} />
      </form>
    </Form>
  );
}
