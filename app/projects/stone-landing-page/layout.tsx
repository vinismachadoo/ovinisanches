import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Anton, Inter } from "next/font/google"

const inter = Inter({ variable: "--font-stone-sans", subsets: ["latin"] })

/** Stands in for ABC Gravity XCompressed, the condensed display face Stone uses. */
const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Stone Entrega — Logística para quem empreende",
  description:
    "Logística da coleta ao pós-venda, com contrato único, rastreio em tempo real e operações turbo, local e nacional para todo o Brasil.",
  icons: [{ rel: "icon", url: "/stone-entrega/mark.png" }],
}

export default function StoneLandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // The landing is light-only: `data-theme="light"` reloads the light tokens and
    // switches off every `dark:` variant inside, whatever theme the site is on.
    <div
      lang="pt-BR"
      data-theme="light"
      className={cn(
        inter.variable,
        anton.variable,
        "min-h-full scheme-light bg-white font-(family-name:--font-stone-sans) text-stone-ink antialiased"
      )}
    >
      {/* Nested so these win over the light tokens set on the element above. */}
      <div className="[--primary-foreground:#20252a] [--primary:#00cc2c] [--ring:#009420]">
        {children}
      </div>
    </div>
  )
}
