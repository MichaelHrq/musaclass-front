import HeaderAnunciante from "@/components/header/anunciante";


export default function GestaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderAnunciante />
      <main className="flex flex-col p-20 w-full">
        {children}
      </main>
    </>
  );
}
