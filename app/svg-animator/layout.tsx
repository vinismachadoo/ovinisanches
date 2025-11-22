import { Header } from '@/app/svg-animator/components/header';
import type { Metadata, Viewport } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SVG animator',
};

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}

      <div className="hidden md:flex absolute bottom-4 w-full justify-center">
        <span className="flex text-xs text-muted-foreground bg-background gap-x-1 rounded-full ring ring-muted py-2 px-4">
          <span>built with 💚 by</span>
          <Link href="https://x.com/ovinisanches" target="_blank" className="text-foreground">
            @ovinisanches
          </Link>
          <span> © 2024</span>
        </span>
      </div>
    </div>
  );
}
