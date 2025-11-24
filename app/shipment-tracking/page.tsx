import { ViewOrderPage } from '@/app/shipment-tracking/components/tracking';
import * as React from 'react';

export default async function Page() {
  return (
    <React.Suspense>
      <ViewOrderPage />
    </React.Suspense>
  );
}
