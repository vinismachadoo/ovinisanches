'use client';

import CommandMenu from '@/components/command-menu';
import { Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const MainCommandeMenu = () => {
  const { setTheme } = useTheme();

  return (
    <CommandMenu
      actions={[
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
      ]}
      placeholder="Buscar projeto"
      notFoundLabel="Nenhum projeto encontrado"
    />
  );
};

export default MainCommandeMenu;
