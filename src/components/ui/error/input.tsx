import { FieldError } from "react-hook-form";

type PropType = {
  error: FieldError | undefined
}

export default function InputError({error}:PropType) {
  return (
    <>
      {error && (
        <p className="text-red-500 text-sm mt-0.5 text-start">{error?.message}</p>
      )}
    </>
  );
}
