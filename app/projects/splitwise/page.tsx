import { SplitwiseApp } from './components/splitwise-app';
import * as React from 'react';

export default function SplitwisePage() {
  return (
    <React.Suspense>
      <SplitwiseApp />
    </React.Suspense>
  );
}
