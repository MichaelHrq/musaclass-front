import { Button } from "../button";
import Image from "next/image";

type PropsType = {
  isPending: boolean;
  label?: string;
} & React.ComponentProps<"button">;

export default function ButtonPending({
  isPending,
  label = "Enviar",
  ...rest
}: PropsType) {
  return (
    <>
      {!isPending ? (
        <Button {...rest} type="submit">
          <p>{label}</p>
        </Button>
      ) : (
        <div className="flex justify-center items-center h-9 px-4 py-2">
          <Image
            src="\assets\fade-stagger-circles-branco.svg"
            alt="Loading"
            width="30"
            height="30"
          />
        </div>
      )}
    </>
  );
}
