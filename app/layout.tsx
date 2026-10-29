import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "17º BPM — Gestão de Tasers e Cartuchos",
  description: "Sistema de Gestão de Armamento de Menor Potencial Ofensivo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#F8FAFC] text-slate-800 antialiased`}>
        <div className="flex min-h-screen lg:h-screen w-full overflow-x-hidden font-sans antialiased">
          {/* Sidebar Global (Com suporte a drawer móvel) */}
          <Sidebar />

          {/* Área Principal com adaptação de padding superior para o botão de menu mobile */}
          <main className="flex-1 flex flex-col min-w-0 overflow-y-auto lg:overflow-hidden pt-14 lg:pt-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}