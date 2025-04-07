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
    console.log({...data, tipo: data.midia.type});
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full"
    >
      <InputField>
        <InputError error={errors?.post} />
        <Textarea autoComplete="off" {...register("post")} id="post" />
      </InputField>

      <InputField>
        <InputError error={errors?.midia} />
        <Controller
          name="midia"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <InputUpload
              onChange={(e) => {
                onChange(e.target.files?.[0]);
              }}
              {...field}
            >
              <Button type="submit">Publicar</Button>
            </InputUpload>
          )}
        />
      </InputField>
    </form>
  );
}
