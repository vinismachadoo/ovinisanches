'use client';

import { CommandMenuContent, CommandMenuKbd, CommandMenuProvider, CommandMenuTrigger } from '@/components/command-menu';
import { useIsMac } from '@/hooks/use-is-mac';
import { Image, Laptop, Moon, Sun, Truck } from 'lucide-react';
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
              router.push('/svg-animator');
            },
          },
          {
            label: 'Shipment Tracking',
            icon: Truck,
            action: () => {
              router.push('/shipment-tracking');
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
      <div className="flex items-center gap-x-1">
        Buscar projeto
        <CommandMenuKbd className="aspect-square text-xs">{isMac ? '⌘' : 'Ctrl'}</CommandMenuKbd>
        <CommandMenuKbd className="aspect-square">K</CommandMenuKbd>
      </div>
    </CommandMenuTrigger>
  );
};

export { MainCommandMenuProvider, MainCommandMenuContent, MainCommandMenuTrigger };
