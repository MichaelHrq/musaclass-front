import Header from "@/components/header";

export default function GestaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const props = {
    logo: `/anunciante`,
    nav: [
      { title: `Meus anúncios`, url: `/anunciante` },
      { title: `Perfil`, url: `/anunciante/perfil` },
    ],
  };
  return (
    <>
      <Header {...props} />
      <main className="flex flex-col p-4 sm:p-8 w-full items-center justify-center">
        {children}
      </main>
    </>
  );
}
