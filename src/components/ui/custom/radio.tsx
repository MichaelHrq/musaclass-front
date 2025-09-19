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
  RadioGroup as RadioGroup_,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Control, FieldValues, Path } from "react-hook-form";

type PropsType<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
  description?: string;
  items: {
    value: string;
    label: string;
  }[];
} & React.ComponentProps<typeof RadioGroupPrimitive.Root>;

export function RadioGroup<T extends FieldValues>({
  control,
  name,
  label,
  description,
  error,
  items,
  className,
  ...rest
}: PropsType<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          {label && <FormLabel className="text-base">{label}</FormLabel>}
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <RadioGroup_
              onValueChange={field.onChange}
              value={field.value}
              className={cn("flex flex-col gap-2", className)}
              {...rest}
            >
              {items.map((item) => (
                <FormItem key={item.value} className="flex items-center gap-2">
                  <FormControl>
                    <RadioGroupItem value={item.value} />
                  </FormControl>
                  <FormLabel className="font-normal">{item.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup_>
          </FormControl>
          {error && <FormMessage>{error}</FormMessage>}
        </FormItem>
      )}
    />
  );
}
