import HeaderGestao from "@/components/header/gestao";

export default function GestaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderGestao />
      <main className="flex flex-col p-20 w-full">
        {children}
      </main>
    </>
  );
}
