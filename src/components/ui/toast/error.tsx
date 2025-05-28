"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ErrorType = 
  | "unauthorized"
  | "invalid-invite"
  | "invalid-credentials"
  | "email-not-verified"
  | "account-locked"
  | "server-error"
  | string;

export function ToastErrorHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleError = (errorType: ErrorType) => {
    const errorMessages: Record<ErrorType, { message: string; type: "error" | "info" | "success" | "warning" }> = {
      "unauthorized": {
        message: "Sessão expirada. Por favor, faça login novamente.",
        type: "info"
      },
      "invalid-invite": {
        message: "Link de convite inválido ou expirado!",
        type: "error"
      },
      "invalid-credentials": {
        message: "Credenciais inválidas. Verifique seu e-mail e senha.",
        type: "error"
      },
      "email-not-verified": {
        message: "E-mail não verificado. Verifique sua caixa de entrada.",
        type: "warning"
      },
      "account-locked": {
        message: "Conta temporariamente bloqueada. Tente novamente mais tarde.",
        type: "error"
      },
      "server-error": {
        message: "Erro no servidor. Por favor, tente novamente.",
        type: "error"
      },
      "default": {
        message: "Ocorreu um erro inesperado.",
        type: "error"
      }
    };

    const { message, type } = errorMessages[errorType] || errorMessages["default"];

    switch (type) {
      case "error":
        toast.error(message, {
          action: errorType === "unauthorized" ? {
            label: "Login",
            onClick: () => router.push("/login")
          } : undefined
        });
        break;
      case "info":
        toast.info(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      default:
        toast(message);
    }
  };

  useEffect(() => {
    const error = searchParams.get("error") as ErrorType | null;
    const success = searchParams.get("success");

    if (error) {
      handleError(error);
    }

    if (success) {
      toast.success("Operação realizada com sucesso!");
    }

    if (error || success) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("error");
      newParams.delete("success");
      
      const newUrl = [window.location.pathname, newParams.toString()].filter(Boolean).join("?");
      window.history.replaceState(null, "", newUrl);
    }
  }, [searchParams, router]);

  return null;
}