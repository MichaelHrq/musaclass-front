import FormLogin from "@/components/form/login";
import { ToastErrorHandler } from "@/components/ui/toast/error";
import Image from "next/image";
import { Suspense } from "react";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="h-dvh bg-gradient-to-br from-[#121212] to-[#1E1E1E] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-xl bg-[#1E1E1E]/90 backdrop-blur-sm border border-[#444] shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <Image
            src={`https://musaclass.com.br/wp-content/themes/2022/assets/images/logomc23.png`}
            alt="Logo Musa Class"
            width={200}
            height={60}
            priority
            className="mb-6"
          />
          <h1 className="text-2xl font-semibold text-center text-neutral-100 mb-2">
            Bem-vindo de volta
          </h1>
          <p className="text-neutral-400 text-center">
            Faça login para acessar sua conta
          </p>
        </div>

        <FormLogin />

        <div className="mt-6 text-center text-sm text-neutral-400">
          <p className="mt-2">
            <Link
              href="/recuperar-senha"
              className="text-neutral-400 hover:text-neutral-500 transition-colors"
            >
              Esqueceu sua senha?
            </Link>
          </p>
        </div>
      </div>

      <Suspense fallback={null}>
        <ToastErrorHandler />
      </Suspense>
    </main>
  );
}