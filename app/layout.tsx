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

export const metadata: Metadata = {
  title: "Vinicius Sanches",
  description: "Welcome to my website",
  icons: {
    icon: [
      {
        rel: "icon",
        url: "data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='36' height='35.99' rx='8' fill='%23BEF264'/%3E%3Cpath d='M27.6592 23.6608C27.7683 23.7648 27.8545 23.8906 27.9121 24.0299C27.9698 24.1692 27.9976 24.319 27.9938 24.4697C27.9901 24.6204 27.9548 24.7687 27.8903 24.9049C27.8257 25.0412 27.7334 25.1624 27.6192 25.2608C25.3166 27.1532 22.3922 28.121 19.4154 27.9758C16.4385 27.8306 13.6222 26.5828 11.5147 24.4753C9.40726 22.3678 8.15947 19.5515 8.01426 16.5747C7.86906 13.5978 8.83684 10.6734 10.7292 8.37085C10.8294 8.25771 10.9518 8.16642 11.0888 8.10267C11.2258 8.03893 11.3744 8.00409 11.5255 8.00034C11.6765 7.99659 11.8268 8.024 11.9668 8.08086C12.1068 8.13772 12.2335 8.22282 12.3392 8.33085L27.6592 23.6608Z' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M25.65 21.6535C24.1362 23.0886 22.1215 23.8758 20.0354 23.8472C17.9494 23.8187 15.9569 22.9767 14.483 21.5008C13.0091 20.0249 12.1703 18.0318 12.1454 15.9465C12.1206 13.8613 12.9117 11.8488 14.35 10.3382' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M20 15.9959L14.5 21.4936' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M20 23.8426V15.9959H12.15' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        url: "data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='36' height='35.99' rx='8' fill='%233F6212'/%3E%3Cpath d='M27.6592 23.6608C27.7683 23.7648 27.8545 23.8906 27.9121 24.0299C27.9698 24.1692 27.9976 24.319 27.9938 24.4697C27.9901 24.6204 27.9548 24.7687 27.8903 24.9049C27.8257 25.0412 27.7334 25.1624 27.6192 25.2608C25.3166 27.1532 22.3922 28.121 19.4154 27.9758C16.4385 27.8306 13.6222 26.5828 11.5147 24.4753C9.40726 22.3678 8.15947 19.5515 8.01426 16.5747C7.86906 13.5978 8.83684 10.6734 10.7292 8.37085C10.8294 8.25771 10.9518 8.16642 11.0888 8.10267C11.2258 8.03893 11.3744 8.00409 11.5255 8.00034C11.6765 7.99659 11.8268 8.024 11.9668 8.08086C12.1068 8.13772 12.2335 8.22282 12.3392 8.33085L27.6592 23.6608Z' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M25.65 21.6535C24.1362 23.0886 22.1215 23.8758 20.0354 23.8472C17.9493 23.8187 15.9569 22.9767 14.483 21.5008C13.0091 20.0249 12.1703 18.0318 12.1454 15.9465C12.1206 13.8613 12.9117 11.8488 14.35 10.3382' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M20 15.9959L14.5 21.4936' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M20 23.8426V15.9959H12.15' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A",
        media: "(prefers-color-scheme: dark)",
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
