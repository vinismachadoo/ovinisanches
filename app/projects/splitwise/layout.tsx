'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { GroupsSidebar } from './components/groups-sidebar';
import { QueryProvider } from './providers/query-provider';

export default function SplitwiseLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SidebarProvider className="[--header-height:3rem]">
        <GroupsSidebar />
        <SidebarInset className="flex flex-col">
          <div className="flex-1 overflow-auto">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </QueryProvider>
  );
}
