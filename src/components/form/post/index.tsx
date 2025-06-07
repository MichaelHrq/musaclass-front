"use client";

// import ButtonPending from "@/components/ui/button/pending";
import { Form } from "@/components/ui/form";
import Textarea from "@/components/ui/input/area";
import MediaPreviewInput from "@/components/ui/input/upload2";
import { PostFormData, postSchema } from "@/schema/post";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

export default function FormPost() {
  const [loading, setLoading] = React.useState({
    submit: false,
  });

  const form = useForm<PostFormData>({ resolver: zodResolver(postSchema) });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  async function onSubmit(data: PostFormData) {
    setLoading((cur) => ({ ...cur, submit: true }));
    const formData = new FormData();
    formData.append("post", data.post);
    formData.append("tipo", data.midia.type);
    if (data.midia) {
      formData.append("midia", data.midia);
    }
    console.log({ ...data, tipo: data.midia.type });
    setLoading((cur) => ({ ...cur, submit: false }));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full"
      >
        <Textarea
          control={control}
          label=""
          name="post"
          error={errors.post?.message}
          placeholder="Escreva algo..."
        />

        <MediaPreviewInput
          name="midia"
          control={control}
          accept="image/*,video/*,.mkv"
          
        />
      </form>

      {/* <ButtonPending isPending={loading.submit} /> */}
    </Form>
  );
}
