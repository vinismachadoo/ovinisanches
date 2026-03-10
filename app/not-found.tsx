import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center h-svh w-full">
      <p className="text-4xl font-bold">Page not found</p>
      <p className="text-muted-foreground font-medium">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Button className="mt-4">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
