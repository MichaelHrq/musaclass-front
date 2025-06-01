import { InputMask as InputMask_, InputMaskProps } from "@react-input/mask";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldValues, Path } from "react-hook-form";

type PropsType<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
  description?: string;
} & InputMaskProps;

export default function InputMask<T extends FieldValues>({
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
            <InputMask_
              component={Input}
              autoComplete="off"
              {...field}
              {...rest}
              value={field.value ?? ""}
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage>{error}</FormMessage>
        </FormItem>
      )}
    />
  );
}
