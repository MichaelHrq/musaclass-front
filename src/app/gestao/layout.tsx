import Header from "@/components/header";

export default function GestaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const props = {
    logo: `/gestao`,
    nav: [
      { title: `Dashboard`, url: `/gestao` },
      { title: `Mídias`, url: `/gestao/midias` },
      { title: `Anunciante`, url: `/gestao/anunciante` },
      { title: `Perfil`, url: `/gestao/perfil` },
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
