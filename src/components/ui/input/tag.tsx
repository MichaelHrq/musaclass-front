import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputTags } from "@/components/ui/input-tags";
import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";

type PropsType<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
  description?: string;
} & React.ComponentProps<"input">;


export default function InputTag<T extends FieldValues>({
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
            <InputTags
              value={field.value}
              onChange={field.onChange}
              placeholder="Digite valores, separados por vírgula ou enter..."
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage>{error}</FormMessage>
        </FormItem>
      )}
    />
  );
}
