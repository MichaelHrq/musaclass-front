import { CheckCircle2, Clock, XCircle } from "lucide-react";

export const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "publicado":
      return (
        <div className="flex items-center gap-1.5 text-green-400">
          <CheckCircle2 size={16} />
          <span>Publicado</span>
        </div>
      );
    case "não publicado":
      return (
        <div className="flex items-center gap-1.5 text-red-400">
          <XCircle size={16} />
          <span>Não publicado</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-1.5 text-yellow-400">
          <Clock size={16} />
          <span>{status}</span>
        </div>
      );
  }
};
