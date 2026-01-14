'use client';

import * as React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { GroupsSidebar } from './components/groups-sidebar';

export default function SplitwiseLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="[--header-height:3rem]">
      <React.Suspense fallback={null}>
        <GroupsSidebar />
      </React.Suspense>
      <SidebarInset className="flex flex-col">
        <div className="flex-1 overflow-auto">
          <React.Suspense fallback={null}>{children}</React.Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
