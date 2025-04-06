import HeaderAnunciante from "@/components/header/anunciante";

export default function GestaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderAnunciante />
      <main className="flex flex-col p-4 sm:p-8 w-full items-center justify-center">
        {children}
      </main>
    </>
  );
}
