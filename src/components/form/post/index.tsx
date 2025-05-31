"use client";

import { Button } from "@/components/ui/button";
import InputError from "@/components/ui/error/input";
import InputUpload from "@/components/ui/input/upload";
import InputField from "@/components/ui/inputField";
import { Textarea } from "@/components/ui/textarea";
import { postSchema } from "@/schema/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof postSchema>;

export default function FormPost() {
  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting: state, errors },
  } = useForm<FormData>({ resolver: zodResolver(postSchema) });

  async function onSubmit(data: FormData) {
    const formData = new FormData();
    formData.append("post", data.post);
    formData.append("tipo", data.midia.type);
    if (data.midia) {
      formData.append("midia", data.midia);
    }
    console.log({ ...data, tipo: data.midia.type });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full"
    >
      <InputField>
        <InputError error={errors?.post} />
        <Textarea
          placeholder="Escreva algo..."
          autoComplete="off"
          {...register("post")}
          id="post"
        />
      </InputField>

      <InputField>
        <InputError error={errors?.midia} />
        <Controller
          name="midia" // Nome do campo no seu formulário
          control={control}
          render={(
            { field: { onChange, value, name, ref } } // 'ref' do RHF pode ser passado para inputRef se necessário, mas geralmente não para este tipo de wrapper
          ) => (
            <InputUpload
              value={value} // Passa o File (ou null)
              onChange={onChange} // RHF espera que isso seja chamado com File ou null
              // Outras props como dropzoneText, etc.
            >
              <Button type="submit">Enviar Post</Button>
            </InputUpload>
          )}
        />
      </InputField>
    </form>
  );
}
