import { DoubleSidebarInset, DoubleSidebarProvider } from '@/components/ui/double-sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rastreio de Envios',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <DoubleSidebarProvider
      defaultWidth="26rem"
      defaultWidthRight="40rem"
      defaultOpenRight={false}
      className="[--header-height:3rem]"
    >
      {/* <AppSidebar /> */}
      <DoubleSidebarInset className="h-[calc(100vh)] min-w-0">{children}</DoubleSidebarInset>
    </DoubleSidebarProvider>
  );
}
