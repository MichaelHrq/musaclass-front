"use client";

import { logoutAction } from "@/app/(auth)/action";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type PropsType = {
  logo: string;
  nav: {
    title: string;
    url: string;
  }[];
};

export default function Header({ logo, nav }: PropsType) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-[#1E1E1E] text-neutral-100 border-b border-[#444] z-50 transition-all ${
          isScrolled ? "shadow-lg" : ""
        }`}
      >
        <Link href="/gestao" className="hover:text-gray-400 z-50">
          <Image
            src={`https://musaclass.com.br/wp-content/themes/2022/assets/images/logomc23.png`}
            alt="logo"
            width={128}
            height={0}
          />
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {nav.map((item) => (
              <li key={item.title}>
                <Link href={item.url} className="hover:text-gray-400">
                  {item.title}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={() => logoutAction()}
                className="hover:text-gray-400 cursor-pointer"
              >
                Sair
              </button>
            </li>
          </ul>
        </nav>

        {/* Botão Mobile */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Sidebar Mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "opacity-70 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } md:hidden`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-[#1E1E1E] z-40 shadow-xl transform transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="p-4 border-b border-[#444] flex justify-end">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-2xl focus:outline-none"
            aria-label="Fechar menu"
          >
            <X />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-4">
            {nav.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.url}
                  className="block pb-4 ps-2 hover:text-gray-400 text-sm border-b border-neutral-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              </li>
            ))}
            <li>
              <button
                className="block pb-4 ps-2 hover:text-gray-400 cursor-pointer w-full text-left  text-sm"
                onClick={() => {
                  logoutAction();
                  setIsMobileMenuOpen(false);
                }}
              >
                Sair
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Espaço para o header fixo */}
      <div className="h-16"></div>
    </>
  );
}
