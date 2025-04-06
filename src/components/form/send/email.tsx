import ButtonPending from "@/components/ui/button/pending";
import { Input } from "@/components/ui/input";
import InputField from "@/components/ui/inputField";
import { Label } from "@/components/ui/label";
import { SendEmailSchema, SendEmailType } from "@/schema/searchCpf";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { SendEmail } from "@/app/gestao/anunciante/action";
import InputError from "@/components/ui/error/input";
import { toast } from "sonner";

export default function FormSendEmail() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting: state, errors },
  } = useForm<SendEmailType>({
    resolver: zodResolver(SendEmailSchema),
  });

  async function onSubmit(data: SendEmailType) {
    const formData = new FormData();
    formData.append("email", data.email);
    const res = await SendEmail(formData);
    if (!res.success) {
      return toast.error(res.message);
    }
    return toast.success(res.message);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full mt-4 gap-6"
    >
      <InputField>
        <Label htmlFor="email" className="text-left mb-2">
          Email
        </Label>
        <Input {...register("email")} id="email" />
        <InputError error={errors?.email} />
      </InputField>
      <ButtonPending isPending={state} />
    </form>
  );
}
