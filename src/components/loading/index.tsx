import Image from "next/image";

type Props = {
  className?: string;
};

export default function Loading({ className }: Props) {
  return (
    <Image
      src="\assets\fade-stagger-circles-branco.svg"
      alt="Loading"
      width="30"
      height="30"
      className={className}
    />
  );
}
