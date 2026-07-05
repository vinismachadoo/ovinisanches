import ReactQueryProvider from "@/components/providers/react-query-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { cn } from "@/lib/utils"
import { Toaster } from "@/registry/default/ui/sonner"
import { TooltipProvider } from "@/registry/default/ui/tooltip"
import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import Script from "next/script"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const defaultUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export const metadata: Metadata = {
  title: "Vinicius Sanches",
  description: "Welcome to my website",
  metadataBase: new URL(defaultUrl),
  icons: {
    icon: [
      {
        url: "/favicon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(inter.variable, geistSans.variable, geistMono.variable)}
      suppressHydrationWarning
    >
      <head>
        {/* Traffic Source Analytics */}
        <Script
          defer
          src="https://traffic-source-production-fb43.up.railway.app/t.js"
          data-site="2"
        />
      </head>
      <body className="group/body overscroll-none antialiased [--main-nav-height:--spacing(14)]">
        <ThemeProvider>
          <ReactQueryProvider>
            <NuqsAdapter>
              <TooltipProvider>
                <NextIntlClientProvider>
                  <div data-slot="layout" className="flex flex-col">
                    <SiteHeader />
                    <main className="flex h-[calc(100svh-var(--main-nav-height))] w-screen flex-col">
                      {children}
                    </main>
                  </div>
                </NextIntlClientProvider>
              </TooltipProvider>
              <TailwindIndicator />
              <Toaster richColors />
            </NuqsAdapter>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
