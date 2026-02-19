import { toast } from "sonner";

export function handleTestWhatsapp({
  ddi,
  whatsapp,
}: {
  ddi: string;
  whatsapp: string;
}) {
  if (!ddi || !whatsapp) {
    return toast.error("Preencha o DDD e o Telefone");
  }

  const url = `https://api.whatsapp.com/send?phone=${ddi}${whatsapp.replace(
    /\D/g,
    "",
  )}`;
  window.open(url, "_blank");
}
