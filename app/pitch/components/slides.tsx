'use client';

import ShadesGithub2FA from '@/app/pitch/components/shades-github-2fa';
import ShadesNotifications from '@/app/pitch/components/shades-notifications';
import ShadesPriceFilter from '@/app/pitch/components/shades-price-filter';
import ShadesStorageUsage from '@/app/pitch/components/shades-storage-usage';
import {
  Presentation,
  PresentationContent,
  PresentationControls,
  PresentationProvider,
  PresentationSlide,
  usePresentation,
} from '@/components/presentation';
import { cn } from '@/lib/utils';
import * as React from 'react';

const Slide1 = () => {
  return (
    <PresentationSlide>
      <h1 className="text-5xl font-bold">Why me?</h1>
    </PresentationSlide>
  );
};

const Slide2 = () => {
  return (
    <PresentationSlide>
      <h1 className="text-5xl font-bold">Projects</h1>
    </PresentationSlide>
  );
};

const Slide3 = () => {
  const { current } = usePresentation();

  return (
    <PresentationSlide className="relative flex-col">
      <div className="py-12 flex flex-col items-center justify-center gap-y-3">
        <h1 className="text-3xl font-bold ">Shades</h1>
        <p className="text-lg text-muted-foreground text-balance text-center w-[60%]">
          A tool for generating balanced color palettes that matches your brand guidelines and feels modern
        </p>
      </div>
      <div className="h-full w-7/10 rounded-t-lg overflow-hidden border border-b-0 border-border/50 -mb-4">
        <img src="/labs-shades-dark.png" alt="Labs Shades Dark" className="hidden dark:block" />
        <img src="/labs-shades-light.png" alt="Labs Shades Light" className="block dark:hidden" />
      </div>

      <div
        style={
          {
            '--shades-50': '#FEEDE1',
            '--shades-100': '#FEDEC8',
            '--shades-200': '#FCC39C',
            '--shades-300': '#FBA86F',
            '--shades-400': '#FA8D42',
            '--shades-500': '#F97316',
            '--shades-600': '#DB5D06',
            '--shades-700': '#AE4A04',
            '--shades-800': '#813703',
            '--shades-900': '#552402',
            '--shades-950': '#411B02',
            '--primary': 'var(--shades-500)',
            '--primary-foreground': 'lch(from var(--primary) round((100 - l), 100) 0 0)',
            '--ring': 'var(--shades-300)',
            '--chart-1': 'var(--shades-500)',
            '--chart-2': 'var(--shades-200)',
            '--chart-3': 'var(--shades-700)',
            '--chart-4': 'var(--shades-400)',
            '--chart-5': 'var(--shades-900)',
          } as React.CSSProperties
        }
      >
        <div
          data-open={current === 3}
          className={cn(
            'transition-opacity duration-1500 delay-300',
            'opacity-0 data-open:opacity-100',
            'has-data-open:*:animate-in has-data-open:*:fade-in-0 has-data-open:*:zoom-in-50 *:duration-1500',
            'has-data-closed:*:animate-out has-data-closed:*:fade-out-0 has-data-closed:*:zoom-out-50',
          )}
        >
          <ShadesStorageUsage
            data-open={current === 3}
            data-closed={current !== 3}
            className="absolute top-12 left-12"
          />
          <ShadesGithub2FA
            data-open={current === 3}
            data-closed={current !== 3}
            className="absolute bottom-12 left-12 w-100"
          />
          <ShadesNotifications
            data-open={current === 3}
            data-closed={current !== 3}
            className="absolute top-20 right-12 w-100"
          />
          <ShadesPriceFilter
            data-open={current === 3}
            data-closed={current !== 3}
            className="absolute bottom-20 right-12 w-130"
          />
        </div>
      </div>
    </PresentationSlide>
  );
};

const Slides = () => {
  return (
    <PresentationProvider>
      <Presentation>
        <PresentationContent>
          <Slide1 />
          <Slide2 />
          <Slide3 />
        </PresentationContent>
        <PresentationControls />
      </Presentation>
    </PresentationProvider>
  );
};

export default Slides;
