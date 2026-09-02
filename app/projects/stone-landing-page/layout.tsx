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
    "Coleta, fracionado, lotação e last mile na mesma plataforma. Um contato, um contrato e várias operações para entregar em todo o Brasil.",
  icons: [{ rel: "icon", url: "/stone-entrega/mark.png" }],
}

export default function StoneLandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      lang="pt-BR"
      className={cn(
        inter.variable,
        anton.variable,
        "min-h-full bg-white font-(family-name:--font-stone-sans) text-stone-ink antialiased",
        // Stone green as theme primary for shadcn form controls (radio, focus ring, etc.)
        "[--primary-foreground:#20252a] [--primary:#00cc2c] [--ring:#009420]"
      )}
    >
      {children}
    </div>
  )
}
