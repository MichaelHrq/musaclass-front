import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeClosed } from "lucide-react";
import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { Input as Input_ } from "../input";

type PropsType<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  error?: string | undefined;
} & React.ComponentProps<"input">;

export default function InputPassword<T extends FieldValues>({
  control,
  name,
  label,
  description,
  error,
  ...rest
}: PropsType<T>) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="w-full relative">
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="relative">
                <Input_
                  type={show ? 'text' : 'password'}
                  {...field}
                  {...rest}
                  value={field.value ?? ""}
                />
                <span
                  onClick={() => setShow(!show)}
                  className="text-[12px] absolute right-3 top-[50%] translate-y-[-50%] cursor-pointer text-neutral-400 hover:text-neutral-500 transition-colors duration-200"
                >
                  {!show ? <EyeClosed /> : <Eye />}
                </span>
              </div>
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage>{error}</FormMessage>
          </FormItem>
        )}
      />
    </div>
  );
}
