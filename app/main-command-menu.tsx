'use client';

import { CommandMenuContent, CommandMenuKbd, CommandMenuProvider, CommandMenuTrigger } from '@/components/command-menu';
import { useIsMac } from '@/hooks/use-is-mac';
import { Banknote, Box, Image, Laptop, Moon, Puzzle, Receipt, Shield, Sun, Truck, Volleyball } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

const MainCommandMenuProvider = ({ children }: { children: React.ReactNode }) => {
  return <CommandMenuProvider>{children}</CommandMenuProvider>;
};

const MainCommandMenuContent = () => {
  const { setTheme } = useTheme();
  const router = useRouter();

  const COMMAND_MENU_CONFIG = {
    placeholder: 'Buscar projeto',
    notFoundLabel: 'Nenhum projeto encontrado',
    sections: [
      {
        title: 'Projetos',
        actions: [
          {
            label: 'SVG Animator',
            icon: Image,
            action: () => {
              router.push('/projects/svg-animator');
            },
          },
          {
            label: 'Shipment Tracking',
            icon: Truck,
            action: () => {
              router.push('/projects/shipment-tracking');
            },
          },
          {
            label: 'EverythingBox',
            icon: Box,
            action: () => {
              router.push('/projects/everythingbox');
            },
          },
          {
            label: "World Cup '26",
            icon: Volleyball,
            action: () => {
              router.push('/projects/world-cup-26');
            },
          },
          {
            label: 'Brasileirão 2025',
            icon: Shield,
            action: () => {
              router.push('/projects/brasileirao-2025');
            },
          },
          {
            label: 'Open Banking - Raidiam',
            icon: Banknote,
            action: () => {
              router.push('/projects/open-banking-raidiam');
            },
          },
          {
            label: 'Daily Sudoku',
            icon: Puzzle,
            action: () => {
              router.push('/projects/daily-sudoku');
            },
          },
        ],
      },
      {
        title: 'Tema',
        actions: [
          {
            label: 'Modo claro',
            icon: Sun,
            action: () => {
              setTheme('light');
            },
          },
          {
            label: 'Modo escuro',
            icon: Moon,
            action: () => {
              setTheme('dark');
            },
          },
          {
            label: 'Modo sistema',
            icon: Laptop,
            action: () => {
              setTheme('system');
            },
          },
        ],
      },
    ],
  };

  return (
    <CommandMenuContent
      placeholder={COMMAND_MENU_CONFIG.placeholder}
      notFoundLabel={COMMAND_MENU_CONFIG.notFoundLabel}
      sections={COMMAND_MENU_CONFIG.sections}
    />
  );
};

const MainCommandMenuTrigger = () => {
  const isMac = useIsMac();

  return (
    <CommandMenuTrigger>
      Buscar projeto
      <div className="flex items-center gap-x-1 font-mono">
        <CommandMenuKbd className="text-xs h-full">{isMac ? '⌘' : 'Ctrl'}</CommandMenuKbd>
        <CommandMenuKbd className="text-xs h-full">K</CommandMenuKbd>
      </div>
    </CommandMenuTrigger>
  );
};

export { MainCommandMenuProvider, MainCommandMenuContent, MainCommandMenuTrigger };
