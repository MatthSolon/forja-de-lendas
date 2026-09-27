import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cinzel, Spectral } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-cinzel",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
});

export const metadata: Metadata = {
  title: "Forja de Lendas — Sistema Completo de RPG de Mesa",
  description:
    "Sistema de RPG inspirado em D&D: classes e subclasses, rolagem de dados, tabuleiro tático para o mestre, 60 mapas, bestiário escalável e campanhas épicas de 20 capítulos.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${cinzel.variable} ${spectral.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
