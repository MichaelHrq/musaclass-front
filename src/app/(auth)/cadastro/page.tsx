import FormCadastro from "@/components/form/cadastro";
import { redirect } from "next/navigation";

export default async function Home({ searchParams }: any) {
  const params = await searchParams;

  if (!params.email) redirect("/?error=invalid-invite");
  

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-4">
      <div className="max-w-[400px] w-full p-4 md:p-5 rounded-lg bg-[#1E1E1E] flex flex-col justify-around items-center">
        <h2 className="text-3xl font-[500] mb-4">Cadastro</h2>
        <FormCadastro {...params} />
      </div>
    </main>
  );
}
