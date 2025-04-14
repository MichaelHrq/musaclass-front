// hooks/useToastFetch.ts
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ActionResponse = {
    status: number;
    error?: string;
    data?: any;
  };
  
  type ToastFetchProps = {
    messageSuccess: string;
    redirectSuccessTo?: string;
  };

export default function useToastFetch() {
  const router = useRouter();

  const handleResponse = (
    response: ActionResponse,
    toastProps: ToastFetchProps
  ) => {
    const { status, data, error } = response;
    const { messageSuccess, redirectSuccessTo } = toastProps;

    switch (status) {
      case 200:
        toast.success(messageSuccess);
        if (redirectSuccessTo) router.push(redirectSuccessTo);
        return data;
      case 400:
        toast.error(error || "Requisição inválida");
        break;
      case 401:
        toast.info("Sessão expirada");
        router.push("/");
        break;
      case 403:
        toast.warning("Sem autorização para esta ação");
        break;
      case 500:
        toast.error("Erro no servidor");
        break;
      default:
        toast.error(error || "Erro desconhecido");
    }

    return null;
  };

  const toastFetch = async <T extends ActionResponse>(
    action: Promise<T>,
    messageSuccess: string,
    redirectSuccessTo?: string
  ) => {
    try {
      const response = await action;
      return handleResponse(response, { messageSuccess, redirectSuccessTo });
    } catch (error) {
      toast.error("Erro ao processar requisição");
      return null;
    }
  };

  return { toastFetch };
}
