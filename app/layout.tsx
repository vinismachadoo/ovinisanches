import { MainCommandMenuContent, MainCommandMenuProvider } from '@/components/main-command-menu';
import ReactQueryProvider from '@/components/providers/react-query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { StyleSwitcher } from '@/components/style-switcher';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';
import MainNav from '@/components/main-nav';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Vinicius Sanches',
  description: 'Bem vindo ao meu site',
  icons: {
    icon: {
      url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥥</text></svg>',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'antialiased group/body overscroll-none [--main-nav-height:calc(var(--spacing)*14)]',
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ReactQueryProvider>
            <MainCommandMenuProvider>
              <NuqsAdapter>
                <TooltipProvider>
                  <div data-slot="layout" className="flex flex-col">
                    <header className="bg-background sticky top-0 z-50 w-full">
                      <div className="3xl:fixed:px-0">
                        <div className="3xl:fixed:container flex h-(--main-nav-height) items-center">
                          <MainNav />
                        </div>
                      </div>
                    </header>

                    <main className="flex flex-col h-[calc(100svh-var(--main-nav-height))] w-screen">{children}</main>
                  </div>
                </TooltipProvider>
                <StyleSwitcher />
                <TailwindIndicator />
                <Toaster />

                {/* open cmd+k in all pages */}
                {/* <MainCommandMenuContent /> */}
              </NuqsAdapter>
            </MainCommandMenuProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
