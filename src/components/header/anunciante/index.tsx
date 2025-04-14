import { logoutAction } from "@/app/(auth)/action";
import Link from "next/link";

export default function HeaderAnunciante() {
  return (
    <header className="flex items-center justify-between p-4 bg-[#1E1E1E] text-neutral-100">
      <h1 className="text-2xl font-bold">Anunciante</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/anunciante" className="hover:text-gray-400">
              Meus Anúncios
            </Link>
          </li>
          <li>
            <form action={logoutAction}> 
              <button className="hover:text-gray-400 cursor-pointer">
                Logout
              </button>
            </form>
          </li>
        </ul>
      </nav>
    </header>
  );
}
