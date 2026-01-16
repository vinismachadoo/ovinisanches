import { MainCommandMenuContent, MainCommandMenuProvider } from '@/app/main-command-menu';
import ReactQueryProvider from '@/app/react-query-provider';
import { StyleSwitcher } from '@/components/style-switcher';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';

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

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
                if (localStorage.layout) {
                  document.documentElement.classList.add('layout-' + localStorage.layout)
                }
              } catch (_) {}
            `,
          }}
        />
        <meta name="theme-color" content={META_THEME_COLORS.light} />
      </head>
      <body className={cn('group/body overscroll-none antialiased', `${geistSans.variable} ${geistMono.variable}`)}>
        <ReactQueryProvider>
          <MainCommandMenuProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <NuqsAdapter>
                <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
                <StyleSwitcher />
                <TailwindIndicator />
                <Toaster />

                {/* open cmd+k in all pages */}
                <MainCommandMenuContent />
              </NuqsAdapter>
            </ThemeProvider>
          </MainCommandMenuProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
