import * as React from 'react';
import { MapDirectory } from '@/app/projects/everythingbox/components/map-directory';

export default async function Page() {
  return (
    <React.Suspense>
      <MapDirectory />
    </React.Suspense>
  );
}
