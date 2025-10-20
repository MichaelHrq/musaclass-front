import type { Metadata } from "next";
import Provider from "./provider";
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: "Musa Class",
  description: "Acompanhantes de luxo, Garotas de Programa e Escorts Girls MUSACLASS",
  icons: `https://musaclass.com.br/wp-content/themes/2022/assets/icons/apple-touch-icon-57x57.png`
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
