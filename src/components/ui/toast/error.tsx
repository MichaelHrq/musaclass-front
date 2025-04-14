// components/ToastErrorHandler.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function ToastErrorHandler() {
  const searchParams = useSearchParams();

  function typeError(type: string) {
    switch (type) {
      case "unauthorized":
        toast.info("Tempo de sessão expirou. Por favor, faça login novamente.");
        break;
      case "invalid-invite":
        toast.error("Link de convite inválido!");
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      typeError(error);
    }
  }, []);

  return null;
}
