"use client"

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
  fetchData: () => Promise<void>
};

export default function FormPost({ postId, fetchData }: PropsType) {
  const [loading, setLoading] = React.useState({
    submit: false,
  });

  const form = useForm<PostFormData>({ resolver: zodResolver(postSchema) });
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  async function onSubmit(data: PostFormData) {
    setLoading((cur) => ({ ...cur, submit: true }));
    const formData = new FormData();
    formData.append("post", data.post);
    formData.append("tipo", data.file[0].type);
    formData.append("post_id", data.post_id);
    if (data.file) {
      formData.append("file", data.file[0]);
    }
    const res = await createFeedAction(formData, postId);
    setLoading((cur) => ({ ...cur, submit: false }));
    if (res.sucess) {
      reset({
        post_id: postId,
        post: "",
        file: undefined,
      });
      fetchData()
      return toast.success("Salvo com sucesso");
    }
    toast.error(res.message);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full"
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
        <ButtonPending type="submit" isPending={loading.submit} />
      </form>
    </Form>
  );
}
