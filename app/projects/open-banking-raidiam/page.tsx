import React from 'react';
import DashboardPage from './components/dashboard';

const page = () => {
  return (
    <React.Suspense>
      <DashboardPage />
    </React.Suspense>
  );
};

export default page;
