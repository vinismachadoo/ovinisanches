import React from 'react';
import Slides from './components/slides';

const HirePage = () => {
  return (
    <div className="h-full w-full p-10">
      <React.Suspense>
        <Slides />
      </React.Suspense>
    </div>
  );
};

export default HirePage;
