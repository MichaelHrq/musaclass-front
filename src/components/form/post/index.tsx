// components/form/post.tsx
"use client";

import { createFeedAction } from "@/app/anunciante/[anuncio]/action";
import ButtonPending from "@/components/ui/button/pending";
import { Form } from "@/components/ui/form";
import Textarea from "@/components/ui/input/area";
import MediaPreviewInput from "@/components/ui/input/upload2";
import { PostFormData, postSchema } from "@/schema/post";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type PropsType = {
  postId: string;
  fetchData: () => Promise<void>;
};

export default function FormPost({ postId, fetchData }: PropsType) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      post_id: postId,
      post: "",
      file: undefined,
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

    if (data.file?.[0]) {
      formData.append("file", data.file[0]);
      formData.append("tipo", data.file[0].type);
    }

    const res = await createFeedAction(formData, postId);

    if (res.sucess) {
      toast.success("Salvo com sucesso!");
      reset(); // Reseta para os defaultValues
      await fetchData(); // Atualiza a lista de posts com o novo item
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
        <input type="hidden" value={postId} {...register("post_id")} />

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
          accept="image/jpeg,image/jpg,image/png,video/mp4"
        />
        <ButtonPending type="submit" isPending={isSubmitting} />
      </form>
    </Form>
  );
}
