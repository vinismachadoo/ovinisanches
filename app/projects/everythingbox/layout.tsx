import { MainCommandMenuContent } from '@/app/main-command-menu';
import { AppSidebar } from '@/app/projects/everythingbox/components/app-sidebar';
import { DoubleSidebarInset, DoubleSidebarProvider } from '@/components/ui/double-sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EverythingBox',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <DoubleSidebarProvider defaultOpenRight={false} className="[--header-height:2.5rem]">
      <AppSidebar />
      <DoubleSidebarInset className="h-[calc(100vh)] min-w-0">
        {children}
        <MainCommandMenuContent />
      </DoubleSidebarInset>
    </DoubleSidebarProvider>
  );
}
