import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP as InputOTP_,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Control, FieldValues, Path } from "react-hook-form";

type PropsType<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
  description?: string;
};

export default function InputOTP<T extends FieldValues>({
  control,
  name,
  label,
  description,
  error,
}: PropsType<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <InputOTP_ maxLength={6} {...field}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP_>
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage>{error}</FormMessage>
        </FormItem>
      )}
    />
  );
}
