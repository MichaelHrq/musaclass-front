// components/form/post.tsx
"use client";

import { createFeedAction } from "@/app/anunciante/[anuncio]/action";
import ButtonPending from "@/components/ui/button/pending";
import { Checkbox } from "@/components/ui/custom/checkbox";
import { RadioGroup } from "@/components/ui/custom/radio";
import { Form } from "@/components/ui/form";
import Textarea from "@/components/ui/input/area";
import MediaPreviewInput from "@/components/ui/input/upload2";
import { PostFormData, postSchema } from "@/schema/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type PropsType = {
  anuncioId: string;
};

export default function FormPost({ anuncioId }: PropsType) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const queryClient = useQueryClient();
  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      post_id: anuncioId,
      post: "",
      file: undefined,
      tipo: "post",
    },
  });
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  async function onSubmit(data: PostFormData) {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("post", data.post);
    formData.append("post_id", data.post_id);
    formData.append("tipo", data.tipo);

    if (data.file?.[0]) {
      formData.append("file", data.file[0]);
    }

    const res = await createFeedAction(formData, anuncioId);

    if (res.sucess) {
      toast.success("Salvo com sucesso!");
      reset();
      queryClient.invalidateQueries({ queryKey: ["feed", anuncioId] });
    } else {
      toast.error(res.message);
    }

    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-full"
      >
        <input type="hidden" value={anuncioId} {...register("post_id")} />

        {/* <RadioGroup
          items={[
            { label: "Galeria", value: "post" },
            { label: "Story", value: "story" },
          ]}
          control={control}
          name="tipo"
          label="Tipo de publicação"
          error={errors.tipo?.message}
          className="flex-row gap-5"
        /> */}

        <Textarea
          control={control}
          label=""
          name="post"
          error={errors.post?.message}
          placeholder="Escreva algo..."
        />

        <MediaPreviewInput
          name="file"
          control={control}
          accept="image/jpeg,image/jpg,image/png,video/mp4,video/quicktime"
        />
        <ButtonPending type="submit" isPending={isSubmitting} />
      </form>
    </Form>
  );
}
