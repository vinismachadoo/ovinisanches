import { DoubleSidebarInset, DoubleSidebarProvider } from '@/components/ui/double-sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Where I've been?",
  description: 'A map of the places I have been to',
  icons: {
    icon: {
      url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🗺️</text></svg>',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <DoubleSidebarProvider defaultOpenRight={false} defaultWidthRight="32rem" className="[--header-height:2.5rem]">
      {/* <AppSidebar /> */}
      <DoubleSidebarInset className="h-[calc(100vh)] min-w-0">{children}</DoubleSidebarInset>
    </DoubleSidebarProvider>
  );
}
