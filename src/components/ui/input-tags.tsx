// input-tags.tsx

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import * as React from "react";

type InputTagsProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange"
> & {
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState("");

    React.useEffect(() => {
      if (pendingDataPoint.includes(",")) {
        // Remove duplicados e espaços em branco extras, e filtra strings vazias após o split
        const newValues = pendingDataPoint
          .split(",")
          .map((chunk) => chunk.trim())
          .filter(Boolean); // Filtra strings vazias

        if (newValues.length > 0) {
          const newDataPoints = new Set([...value, ...newValues]);
          onChange(Array.from(newDataPoints));
        }
        setPendingDataPoint("");
      }
    }, [pendingDataPoint, onChange, value]);

    const addPendingDataPoint = () => {
      const trimmedPendingDataPoint = pendingDataPoint.trim();
      if (trimmedPendingDataPoint) {
        // Verifica se o valor já não existe para evitar duplicados
        if (!value.includes(trimmedPendingDataPoint)) {
          const newDataPoints = new Set([...value, trimmedPendingDataPoint]);
          onChange(Array.from(newDataPoints));
        }
        setPendingDataPoint("");
      }
    };

    const removeTag = (itemToRemove: string) => {
      onChange(value.filter((i) => i !== itemToRemove));
    };

    return (
      <div
        className={cn(
          "file:text-foreground gap-1.5 text-neutral-100 bg-[#2A2A2A] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-[#444] flex flex-wrap min-h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", // Adicionado flex-wrap e mudado h-9 para min-h-9, ajustado gap
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[#666] focus-within:ring-[1px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        // Opcional: Adicionar um onClick para focar o input quando o container é clicado
        onClick={() => ref && typeof ref !== 'function' && ref.current?.focus()}
      >
        {value.map((item) => (
          <Badge
            key={item}
            variant="secondary"
            className="bg-neutral-700 whitespace-nowrap" // whitespace-nowrap para evitar que o texto da badge quebre
          >
            {item}
            <Button
              variant="ghost"
              size="icon"
              className="ml-1.5 h-3 w-3 shrink-0" // Ajustado margin e adicionado shrink-0
              onClick={(e) => {
                e.stopPropagation(); // Evita que o clique no botão propague para o div e foque o input desnecessariamente
                removeTag(item);
              }}
            >
              <XIcon className="w-3" />
            </Button>
          </Badge>
        ))}
        <input
          className="flex-grow bg-transparent outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400 min-w-[80px]" // Adicionado flex-grow e min-w para melhor responsividade do input
          value={pendingDataPoint}
          onChange={(e) => setPendingDataPoint(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addPendingDataPoint();
            } else if (
              e.key === "Backspace" &&
              pendingDataPoint.length === 0 &&
              value.length > 0
            ) {
              e.preventDefault();
              // Opcional: selecionar a última tag antes de remover, ou simplesmente remover
              // Para selecionar: focar na última badge ou adicionar um estado de 'selectedTag'
              removeTag(value[value.length - 1]);
            }
          }}
          {...props}
          ref={ref}
        />
      </div>
    );
  }
);

InputTags.displayName = "InputTags";

export { InputTags };