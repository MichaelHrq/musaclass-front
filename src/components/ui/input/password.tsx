"use client";

import React from "react";
import { Input } from "./input";

type InputPasswordProps = React.ComponentProps<"input"> 

export default function InputPassword(props : InputPasswordProps) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="w-full relative">
      <Input {...props} type={show ? "text" : "password"} />
      <span
        onClick={() => setShow(!show)}
        className="text-[12px] absolute right-3 top-[50%] translate-y-[-50%] cursor-pointer text-neutral-400 hover:text-neutral-500 transition-colors duration-200"
      >
        {show ? "Ocultar" : "Mostrar"}
      </span>
    </div>
  );
}
