import React from "react";

export default function Form({ children }: { children: React.ReactNode }) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-full flex flex-col gap-7"
    >
      {children}
    </form>
  );
}
