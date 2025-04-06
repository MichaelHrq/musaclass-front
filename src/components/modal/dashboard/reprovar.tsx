"use client";

import { Button } from "@/components/ui/button";
import DialogCustom from "@/components/ui/dialog/index";
import InputError from "@/components/ui/error/input";
import InputField from "@/components/ui/inputField";
import { Textarea } from "@/components/ui/textarea";
import { reprovarSchema } from "@/schema/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof reprovarSchema>;

function Trigger({ onOpen }: { onOpen: () => void }) {
  return <Button onClick={onOpen}>Reprovar</Button>;
}

function Content({ form }: { form: any }) {
  return (
    <InputField>
      <Textarea
        {...form.register("motivo")}
        placeholder="Escreva o motivo da reprovação..."
        className="w-full"
      />
      <InputError error={form.formState.errors.motivo} />
    </InputField>
  );
}

function Footer({
  onOpen,
  onSubmit,
}: {
  onOpen: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="flex justify-center w-full gap-2">
      <Button onClick={onOpen}>Cancelar</Button>
      <Button onClick={onSubmit}>Enviar</Button>
    </div>
  );
}

export default function ReprovarDialog({ id }: any) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(reprovarSchema),
  });

  const onOpen = () => {
    setOpen(!open);
  };

  async function onSubmit(data: FormData) {
    const formData = new FormData();
    formData.append("motivo", data.motivo);
    console.log(data);

    // const res = await reprovarAction(formData);
    // if (!res.success) {
    //   return toast.error(res.message);
    // }
    // toast.success(res.message);
  }

  return (
    <DialogCustom
      Trigger={<Trigger onOpen={onOpen} />}
      Content={<Content form={form} />}
      Header="Motivo da Reprovação"
      Footer={<Footer onOpen={onOpen} onSubmit={form.handleSubmit(onSubmit)} />}
      open={open}
      onOpenChange={setOpen}
    />
  );
}
