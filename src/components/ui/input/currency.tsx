import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input as Input_ } from "@/components/ui/input";
import { Control, FieldValues, Path } from "react-hook-form";

type PropsType<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
  description?: string;
} & React.ComponentProps<"input">;

export default function InputCurrency<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = "R$ 0,00",
  error,
  ...rest
}: PropsType<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const formattedValue = field.value
          ? new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(field.value))
          : "";
        return (
          <FormItem className="w-full">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input_
                {...field}
                {...rest}
                value={formattedValue}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, "");
                  const numericValue = parseFloat(rawValue) / 100;
                  field.onChange(isNaN(numericValue) ? 0 : numericValue);
                }}
                id={name}
                placeholder={placeholder}
              />
            </FormControl>
            <FormDescription>{description}</FormDescription>
            {error && <FormMessage>{error}</FormMessage>}
          </FormItem>
        );
      }}
    />
  );
}
