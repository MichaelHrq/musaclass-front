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
import { Textarea as Textarea_ } from "@/components/ui/textarea";

type PropsType<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
  description?: string;
} & React.ComponentProps<"textarea">;

export default function Textarea<T extends FieldValues>({
  control,
  name,
  label,
  description,
  error,
  ...rest
}: PropsType<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea_ {...field} {...rest} value={field.value ?? ""} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage>{error}</FormMessage>
        </FormItem>
      )}
    />
  );
}
