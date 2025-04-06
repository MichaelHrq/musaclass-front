"use client";

import { Button } from "@/components/ui/button";
import DialogCustom from "@/components/ui/dialog/index";
import React from "react";

function Trigger({ onOpen }: { onOpen: () => void }) {
  return <Button onClick={onOpen}>Aprovar</Button>;
}

function Content() {
  return <p>Tem certeza de que deseja aprovar este anúncio?</p>;
}

function Footer({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex justify-center w-full gap-2">
      <Button onClick={onOpen}>Cancelar</Button>
      <Button className="bg-emerald-700 hover:bg-emerald-800">Confirmar</Button>
    </div>
  );
}

export default function AprovarDialog({ id }: any) {
  const [open, setOpen] = React.useState(false);
  const onOpen = () => {
    setOpen(!open);
  };
  return (
    <DialogCustom
      Trigger={<Trigger onOpen={onOpen} />}
      Content={<Content />}
      Header="Confirmar Aprovação"
      Footer={<Footer onOpen={onOpen} />}
      open={open}
      onOpenChange={setOpen}
    />
  );
}
