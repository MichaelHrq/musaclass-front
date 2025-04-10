import { Button } from "../button";
import Image from "next/image";

type PropsType = {
  isPending: boolean;
  label?: string;
} & React.ComponentProps<'button'>;

export default function ButtonPending({
  isPending,
  label = "Enviar",
  ...rest
}: PropsType) {
  return (
    <div className="flex justify-center items-center w-full">
      {!isPending ? (
        <Button {...rest} type="submit">
          <p>{label}</p>
        </Button>
      ) : (
        <Image
          src="\assets\fade-stagger-circles-branco.svg"
          alt="Loading"
          width="30"
          height="30"
        />
      )}
    </div>
  );
}
