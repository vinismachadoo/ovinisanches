'use client';

import ModeToggle from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Citrus, Globe } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MainNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between w-full h-full gap-x-2 px-20 border-b **:data-active:bg-muted">
      <div className="flex items-center gap-x-2">
        <Link href="/">
          <div className="size-6 rounded-sm flex items-center justify-center bg-lime-300 dark:bg-lime-800 mr-2 extend-touch-target hit-area-2">
            <Citrus className="size-4" />
          </div>
        </Link>

        <Button variant="ghost" size="sm" data-active={pathname === '/resume'}>
          <Link href="/resume">Résumé</Link>
        </Button>

        <Button variant="ghost" size="sm" data-active={pathname === '/pitch'}>
          <Link href="/pitch">Pitch Deck</Link>
        </Button>

        <Button variant="ghost" size="sm" disabled data-active={pathname === '/writing'}>
          <Link href="/writing">Writing</Link>
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
