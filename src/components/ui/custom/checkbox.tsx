"use client";

import { Checkbox as  Checkbox_} from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
} & React.ComponentProps<"input">;

export function Checkbox<T extends FieldValues>({
  control,
  name,
  label,
  description,
  error,
  items,
  ...rest
}: PropsType<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <div className="mb-1">
            <FormLabel className="text-base">{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          {items.map((item) => (
            <FormField
              key={item.value}
              control={control}
              name={name}
              render={({ field }) => {
                return (
                  <FormItem
                    key={item.value}
                    className="flex flex-row items-center gap-2"
                  >
                    <FormControl>
                      <Checkbox_
                        checked={field.value?.includes(item.value)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, item.value])
                            : field.onChange(
                                field.value?.filter(
                                  (value: string) => value !== item.value
                                )
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-xs md:text-sm font-normal">
                      {item.label}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
          <FormMessage>{error}</FormMessage>
        </FormItem>
      )}
    />
  );
}
