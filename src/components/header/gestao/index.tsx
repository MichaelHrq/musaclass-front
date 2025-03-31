'use client'

import { logoutAction } from "@/app/action";
import Link from "next/link";

export default function HeaderGestao() {
  return (
    <header className="flex items-center justify-between p-4 bg-[#1E1E1E] text-neutral-100">
      <h1 className="text-2xl font-bold">Gestão</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/gestao" className="hover:text-gray-400">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/gestao/anunciante" className="hover:text-gray-400">
              Anunciante
            </Link>
          </li>
          <li>
            <p
              className="hover:text-gray-400 cursor-pointer"
              onClick={logoutAction}
            >
              Logout
            </p>
          </li>
        </ul>
      </nav>
    </header>
  );
}
