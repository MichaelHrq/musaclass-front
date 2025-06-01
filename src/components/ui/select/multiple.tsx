"use client";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  MultipleSelector as MultipleSelector_,
  MultipleSelectorProps,
  MultipleSelectorRef,
} from "@/components/ui/multiple-selector";
import { Control, FieldValues, Path } from "react-hook-form";

type PropsType<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  items: { value: string; label: string }[];
  error?: string;
  description?: string;
} & MultipleSelectorProps;

function MultipleSelector<T extends FieldValues>({
  control,
  name,
  label,
  items,
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
            <MultipleSelector_
              {...field}
              {...rest}
              defaultOptions={items}
              onChange={field.onChange}
              value={field.value}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                  Nenhem resultado encontrado
                </p>
              }
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage>{error}</FormMessage>
        </FormItem>
      )}
    />
  );
}

export default MultipleSelector;
