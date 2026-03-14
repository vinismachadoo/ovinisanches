'use client';

import Motionvg from '@/app/pitch/components/motionvg';
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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import * as React from 'react';

import bmwLogo from '@/public/logos/bmw-logo.svg';
import amazonLogo from '@/public/logos/amazon-logo.svg';
import edgeLogo from '@/public/logos/edge-logo.svg';
import metamaskLogo from '@/public/logos/metamask-logo.svg';
import openclawLogo from '@/public/logos/openclaw-logo.svg';
import watiLogo from '@/public/logos/wati-logo.svg';
import livupLogo from '@/public/logos/livup-logo.svg';
import raspberrypiLogo from '@/public/logos/raspberry-pi-logo.svg';
import microsoftTeamsLogo from '@/public/logos/microsoft-teams-logo.svg';
import openAiLogo from '@/public/logos/openai-logo.svg';

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
      <div className="py-10 flex flex-col items-center justify-center gap-y-3">
        <img
          src="data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='36' height='36' rx='8' fill='%23D8B4FE'/%3E%3Cpath d='M20 8V14C19.9999 14.3355 20.0841 14.6656 20.245 14.96L25.755 25.04C25.9217 25.3446 26.0062 25.6874 26.0002 26.0345C25.9942 26.3817 25.8979 26.7213 25.7208 27.02C25.5437 27.3187 25.2919 27.5661 24.9902 27.7379C24.6885 27.9098 24.3472 28.0001 24 28H12C11.6528 28.0001 11.3115 27.9098 11.0098 27.7379C10.7081 27.5661 10.4563 27.3187 10.2792 27.02C10.1021 26.7213 10.0058 26.3817 9.99983 26.0345C9.99384 25.6874 10.0783 25.3446 10.245 25.04L15.755 14.96C15.9159 14.6656 16.0001 14.3355 16 14V8' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M12.453 21H23.547' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M14.5 8H21.5' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A"
          alt="Labs Shades Light"
          className="size-10 dark:hidden"
        />
        <img
          src="data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='36' height='36' rx='8' fill='%236B21A8'/%3E%3Cpath d='M20 8V14C19.9999 14.3355 20.0841 14.6656 20.245 14.96L25.755 25.04C25.9217 25.3446 26.0062 25.6874 26.0002 26.0345C25.9942 26.3817 25.8979 26.7213 25.7208 27.02C25.5437 27.3187 25.2919 27.5661 24.9902 27.7379C24.6885 27.9098 24.3472 28.0001 24 28H12C11.6528 28.0001 11.3115 27.9098 11.0098 27.7379C10.7081 27.5661 10.4563 27.3187 10.2792 27.02C10.1021 26.7213 10.0058 26.3817 9.99984 26.0345C9.99384 25.6874 10.0783 25.3446 10.245 25.04L15.755 14.96C15.9159 14.6656 16.0001 14.3355 16 14V8' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M12.453 21H23.547' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M14.5 8H21.5' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A"
          alt="Labs Shades Dark"
          className="size-10 hidden dark:block"
        />
        <h1 className="text-3xl font-bold ">Labs Shades</h1>
        <p className="text-lg text-muted-foreground text-balance text-center w-[60%]">
          A tool for generating balanced color palettes that matches your brand guidelines and feels modern
        </p>
        <Button>
          <Link href="https://labs.ovinisanches.com/shades" target="_blank" rel="noopener noreferrer">
            Try it out
          </Link>
        </Button>
      </div>
      <div className="h-full w-7/10 rounded-t-lg overflow-hidden border border-b-0 border-border/50 -mb-4">
        <img src="/labs-shades-dark.png" alt="Labs Shades Dark" className="hidden dark:block" />
        <img src="/labs-shades-light.png" alt="Labs Shades Light" className="block dark:hidden" />
      </div>

      <div
        style={
          {
            '--shades-50': '#F0E2FE',
            '--shades-100': '#E6CEFD',
            '--shades-200': '#D2A7FB',
            '--shades-300': '#BC7BF9',
            '--shades-400': '#A855F7',
            '--shades-500': '#9129F5',
            '--shades-600': '#780BE0',
            '--shades-700': '#6008B4',
            '--shades-800': '#460684',
            '--shades-900': '#2F0458',
            '--shades-950': '#22033F',
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

const Slide4 = () => {
  return (
    <PresentationSlide className="relative flex-col">
      <div className="py-10 flex flex-col items-center justify-center gap-y-3">
        <img
          src="data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='36' height='36' rx='8' fill='%237DD3FC'/%3E%3Cpath d='M11 13L9 11' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M15 12V9' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M19 13L21 11' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M15 22C16.6569 22 18 20.6569 18 19C18 17.3431 16.6569 16 15 16C13.3431 16 12 17.3431 12 19C12 20.6569 13.3431 22 15 22Z' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M17.83 18H26C26.5304 18 27.0391 18.2107 27.4142 18.5858C27.7893 18.9609 28 19.4696 28 20V24C28 24.5304 27.7893 25.0391 27.4142 25.4142C27.0391 25.7893 26.5304 26 26 26H10C9.46957 26 8.96086 25.7893 8.58579 25.4142C8.21071 25.0391 8 24.5304 8 24V20C8 19.4696 8.21071 18.9609 8.58579 18.5858C8.96086 18.2107 9.46957 18 10 18H12.17' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M22 22H24' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A"
          alt="PresentX Light"
          className="size-10 dark:hidden"
        />
        <img
          src="data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='36' height='36' rx='8' fill='%23075985'/%3E%3Cpath d='M11 13L9 11' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M15 12V9' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M19 13L21 11' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M15 22C16.6569 22 18 20.6569 18 19C18 17.3431 16.6569 16 15 16C13.3431 16 12 17.3431 12 19C12 20.6569 13.3431 22 15 22Z' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M17.83 18H26C26.5304 18 27.0391 18.2107 27.4142 18.5858C27.7893 18.9609 28 19.4696 28 20V24C28 24.5304 27.7893 25.0391 27.4142 25.4142C27.0391 25.7893 26.5304 26 26 26H10C9.46957 26 8.96086 25.7893 8.58579 25.4142C8.21071 25.0391 8 24.5304 8 24V20C8 19.4696 8.21071 18.9609 8.58579 18.5858C8.96086 18.2107 9.46957 18 10 18H12.17' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M22 22H24' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A"
          alt="PresentX Dark"
          className="size-10 hidden dark:block"
        />
        <h1 className="text-3xl font-bold ">presentx</h1>
        <p className="text-lg text-muted-foreground text-balance text-center w-[60%]">
          OSS Component Library for creating shareable presentations on the web. Supports fullscreen mode, keyboard
          shortcuts and dark/light themes
        </p>
        <Button>
          <Link href="https://presentx.ovinisanches.com" target="_blank" rel="noopener noreferrer">
            Try it out
          </Link>
        </Button>
      </div>
    </PresentationSlide>
  );
};

const Slide5 = () => {
  const { current, fullscreen } = usePresentation();

  return (
    <PresentationSlide className="relative">
      <div key="motionvg-logos-left" className={cn('size-full', fullscreen && 'py-40')}>
        <div className="relative size-full">
          <Motionvg key={`${current}-metamask`} src={metamaskLogo.src} className="absolute size-64 top-16 left-16" />
          <Motionvg
            key={`${current}-microsoft-teams`}
            src={microsoftTeamsLogo.src}
            className="absolute size-56 top-10 right-16"
          />
          <Motionvg
            key={`${current}-amazon`}
            src={amazonLogo.src}
            className="absolute size-72 bottom-1/2 translate-y-1/2 left-1/2 -translate-x-1/2 dark:[&_*[fill*='#221F1F']]:fill-white!"
          />
          <Motionvg
            key={`${current}-openai`}
            src={openAiLogo.src}
            className="absolute size-56 bottom-16 left-16 dark:[&_path]:fill-white!"
          />

          <Motionvg key={`${current}-livup`} src={livupLogo.src} className="absolute size-56 bottom-10 right-16" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-y-3 min-w-1/5">
        <img
          src="data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='36' height='36' rx='8' fill='%23CBD5E1'/%3E%3Cpath d='M13 9.50001C18 7.50001 20 12 16 13.5C7.5 16 8 21 11 22C16 24 20 12 25 15C30 18 25.5 28.5 21 27C16 24.5 21.5 16 27 25' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A"
          alt="Motionvg Light"
          className="size-10 dark:hidden"
        />
        <img
          src="data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='36' height='36' rx='8' fill='%231E293B'/%3E%3Cpath d='M13 9.50001C18 7.50001 20 12 16 13.5C7.5 16 8 21 11 22C16 24 20 12 25 15C30 18 25.5 28.5 21 27C16 24.5 21.5 16 27 25' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A"
          alt="Motionvg Dark"
          className="size-10 hidden dark:block"
        />
        <h1 className="text-3xl font-bold ">Motionvg</h1>
        <p className="text-lg text-muted-foreground text-balance text-center w-full">
          Animate SVGs with ease using the power of React and Tailwind CSS
        </p>
        <Button>
          <Link href="https://motionvg.ovinisanches.com" target="_blank" rel="noopener noreferrer">
            Try it out
          </Link>
        </Button>
      </div>

      <div key="motionvg-logos-right" className={cn('size-full', fullscreen && 'py-40')}>
        <div className="relative size-full">
          <Motionvg
            key={`${current}-raspberrypi`}
            src={raspberrypiLogo.src}
            className="absolute size-56 top-10 left-16 dark:[&_*:not([fill])]:fill-white!"
          />
          <Motionvg key={`${current}-edge`} src={edgeLogo.src} className="absolute size-56 top-16 right-16" />

          <Motionvg
            key={`${current}-wati`}
            src={watiLogo.src}
            className="absolute size-72 bottom-1/2 translate-y-1/2 right-1/2 translate-x-1/2 dark:[&_*[class*='cls-2']]:fill-white!"
          />

          <Motionvg key={`${current}-openclaw`} src={openclawLogo.src} className="absolute size-56 bottom-10 left-16" />
          <Motionvg
            key={`${current}-bmw`}
            src={bmwLogo.src}
            pathDelay={0.08}
            className="absolute size-56 bottom-16 right-16"
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
          <Slide4 />
          <Slide5 />
        </PresentationContent>
        <PresentationControls />
      </Presentation>
    </PresentationProvider>
  );
};

export default Slides;
