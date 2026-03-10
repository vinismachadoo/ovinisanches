'use client';

import ModeToggle from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Globe } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MainNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between w-full h-full gap-x-2 px-20 border-b **:data-active:bg-muted">
      <div className="flex items-center gap-x-2">
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/" data-active={pathname === '/'} />}
          nativeButton={false}
        >
          Home
        </Button>

        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/resume" data-active={pathname === '/resume'} />}
          nativeButton={false}
        >
          Résumé
        </Button>

        <Button
          variant="ghost"
          size="sm"
          render={
            <Link href="/writings" data-active={pathname === '/writings'} className="pointer-events-none opacity-50" />
          }
          nativeButton={false}
        >
          Writings
        </Button>
      </div>

      <div className="flex items-center gap-x-2">
        <Tooltip>
          <TooltipTrigger render={<Button variant="ghost" />}>
            <Globe />
            PT-BR
            <span className="sr-only">Switch language</span>
          </TooltipTrigger>
          <TooltipContent>Switch language</TooltipContent>
        </Tooltip>

        <ModeToggle />
      </div>
    </nav>
  );
};

export default MainNav;
