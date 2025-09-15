import TabForgotPassword from "@/components/page/esqueci-senha";
import Link from "next/link";

export default function ForgotPassword() {
  return (
    <main className="h-dvh bg-gradient-to-br from-[#121212] to-[#1E1E1E] flex items-center justify-center p-4 flex-col">
      <div className="max-w-md w-full p-4 sm:p-8 rounded-xl bg-[#1E1E1E]/90 backdrop-blur-sm border border-[#444] shadow-2xl">
        <h1 className="text-xl sm:text-2xl font-semibold text-center text-neutral-100 mb-2">
          Esqueci senha
        </h1>
        <TabForgotPassword />
      </div>
      <Link
        href={"/login"}
        className="flex items-center text-sm text-neutral-400 hover:text-neutral-200 transition-colors mt-4 gap-2"
      >
        Gostaria de voltar para a tela de login?
      </Link>
    </main>
  );
}
