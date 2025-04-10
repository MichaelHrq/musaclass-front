import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "../input";

type InputCurrencyProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  placeholder?: string;
};

export function InputCurrency<T extends FieldValues>({
  name,
  control,
  disabled = false,
  placeholder = "R$ 0,00",
}: InputCurrencyProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const formattedValue = field.value
          ? new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(field.value))
          : "";
        return (
          <Input
            {...field}
            value={formattedValue}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              const numericValue = parseFloat(rawValue) / 100;
              field.onChange(isNaN(numericValue) ? 0 : numericValue);
            }}
            id={name}
            disabled={disabled}
            placeholder={placeholder}
          />
        );
      }}
    />
  );
}
