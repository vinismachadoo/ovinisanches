import * as React from 'react';
import { WorldCupSimulator } from '@/app/projects/world-cup-26/components/simulator';

export default async function Page() {
  return (
    <React.Suspense>
      <WorldCupSimulator />
    </React.Suspense>
  );
}
