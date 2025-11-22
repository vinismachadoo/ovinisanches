import AppSidebar from '@/app/svg-animator/components/app-sidebar';
import SvgBoard from '@/app/svg-animator/components/svg-board';
import * as React from 'react';

export default async function Page() {
  return (
    <main className="flex flex-col items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)] min-h-0 h-[calc(100vh-3.5rem)]">
      <aside className="flex h-fit top-14 md:z-30 w-full md:h-full shrink-0 border-r border-border/40 dark:border-border md:sticky md:block">
        <React.Suspense>
          <AppSidebar />
        </React.Suspense>
      </aside>
      <React.Suspense>
        <SvgBoard />
      </React.Suspense>
    </main>
  );
}
