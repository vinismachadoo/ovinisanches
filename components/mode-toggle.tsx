'use client';

import * as React from 'react';
import { Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <Sun className="h-4 w-4 transition-all dark:hidden dark:-rotate-90 dark:scale-0" />
          <Moon className="h-4 w-4 transition-all hidden dark:block rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit min-w-fit">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun />
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon />
          Escuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Laptop />
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
