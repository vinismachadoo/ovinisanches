import * as React from 'react';
import MapDirectory from '@/app/places/components/map-directory';

export default async function Page() {
  return (
    <React.Suspense>
      <MapDirectory />
    </React.Suspense>
  );
}
