import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldError, FieldValues, Path } from "react-hook-form";
import {
  Select as Select_,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

type PropsType<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
  items: { value: string; label: string }[];
  description?: string;
  onChange?: () => void;
} & React.ComponentProps<"select">;

export default function Select<T extends FieldValues>({
  control,
  name,
  label,
  description,
  error,
  items,
  onChange,
  ...rest
}: PropsType<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <Select_
            onValueChange={(value) => {
              field.onChange(value);
              if (onChange) onChange();
            }}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select_>
          <FormDescription>{description}</FormDescription>
          <FormMessage>{error}</FormMessage>
        </FormItem>
      )}
    />
  );
}
