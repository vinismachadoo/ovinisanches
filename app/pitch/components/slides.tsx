'use client';

import ShadesGithub2FA from '@/app/pitch/components/shades-github-2fa';
import ShadesNotifications from '@/app/pitch/components/shades-notifications';
import ShadesPriceFilter from '@/app/pitch/components/shades-price-filter';
import ShadesStorageUsage from '@/app/pitch/components/shades-storage-usage';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Kbd } from '@/components/ui/kbd';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useFullscreen } from '@/hooks/use-fullscreen';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Expand, Moon, Shrink, Sun, Undo2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

interface SlideContentProps extends React.ComponentProps<'div'> {
  active?: string;
}

const SLIDES_CONFIG = {
  watermark: (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground">Made by Vinicius Sanches</div>
  ),
  slides: [
    {
      content: ({ ...props }: SlideContentProps) => (
        <div className="flex items-center justify-center size-full" {...props}>
          <h1 className="text-5xl font-bold">Why me?</h1>
        </div>
      ),
    },
    {
      content: ({ ...props }: SlideContentProps) => (
        <div className="flex items-center justify-center size-full" {...props}>
          <h1 className="text-5xl font-bold">Projects</h1>
        </div>
      ),
    },
    {
      content: ({ active, ...props }: SlideContentProps) => (
        <div className="flex flex-col items-center justify-center size-full relative" {...props}>
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <h1 className="text-3xl font-bold ">Shades</h1>
            <p className="text-lg text-muted-foreground">A tool for generating balanced color palettes</p>
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
              data-open={active === 'true'}
              className={cn(
                'transition-opacity duration-1500 delay-300',
                'opacity-0 data-open:opacity-100',
                'has-data-open:*:animate-in has-data-open:*:fade-in-0 has-data-open:*:zoom-in-50 *:duration-1500',
                'has-data-closed:*:animate-out has-data-closed:*:fade-out-0 has-data-closed:*:zoom-out-50',
              )}
            >
              <ShadesStorageUsage
                data-open={active === 'true'}
                data-closed={active === 'false'}
                className="absolute top-12 left-12"
              />
              <ShadesGithub2FA
                data-open={active === 'true'}
                data-closed={active === 'false'}
                className="absolute bottom-12 left-12 w-100"
              />
              <ShadesNotifications
                data-open={active === 'true'}
                data-closed={active === 'false'}
                className="absolute top-20 right-12 w-100"
              />
              <ShadesPriceFilter
                data-open={active === 'true'}
                data-closed={active === 'false'}
                className="absolute bottom-20 right-12 w-130"
              />
            </div>
          </div>
        </div>
      ),
      showWatermark: false,
    },
  ],
};

const Slides = ({ className, ...props }: React.ComponentProps<typeof Card>) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const { ref, fullscreen, toggleFullscreen } = useFullscreen();
  useHotkeys('f', () => toggleFullscreen(), {
    enableOnFormTags: true,
    enableOnContentEditable: true,
  });

  const { resolvedTheme, setTheme } = useTheme();
  useHotkeys('d', () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'), {
    enableOnFormTags: true,
    enableOnContentEditable: true,
  });

  useHotkeys('r', () => api?.scrollTo(0), {
    enableOnFormTags: true,
    enableOnContentEditable: true,
  });

  useHotkeys('left', () => api?.scrollTo(current - 1), {
    enableOnFormTags: true,
    enableOnContentEditable: true,
  });

  useHotkeys('right', () => api?.scrollTo(current + 1), {
    enableOnFormTags: true,
    enableOnContentEditable: true,
  });

  return (
    <div
      className={cn('relative size-full [--controls-height:calc(var(--spacing)*16)]', className)}
      {...props}
      ref={ref}
    >
      <Carousel
        opts={{
          align: 'center',
        }}
        className={cn(
          'w-full',
          '*:data-[slot=carousel-content]:rounded-lg *:data-[slot=carousel-content]:border *:data-[slot=carousel-content]:bg-background *:data-[slot=carousel-content]:text-foreground',
          fullscreen
            ? 'h-full *:data-[slot=carousel-content]:h-full'
            : 'h-full *:data-[slot=carousel-content]:h-[calc(100%-var(--controls-height))] *:data-[slot=carousel-content]:rounded-b-none *:data-[slot=carousel-content]:border-b-0',
        )}
        setApi={setApi}
        id="slides"
      >
        <CarouselContent className="h-full ml-0">
          {SLIDES_CONFIG.slides.map((slide, index) => (
            <CarouselItem key={`slide-${index}`} className={cn('relative flex items-center justify-center p-4')}>
              {<slide.content active={current === index ? 'true' : 'false'} />}
              {slide.showWatermark !== false ? SLIDES_CONFIG.watermark : null}
            </CarouselItem>
          ))}
        </CarouselContent>

        <div
          className={cn(
            'flex items-center justify-between p-4',
            fullscreen
              ? 'absolute bottom-0 pb-4 opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out w-full inset-x-0'
              : 'w-full border rounded-b-lg bg-background',
          )}
        >
          <ButtonGroup>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => api?.scrollPrev()}
                    className={cn(!api?.canScrollPrev() && 'pointer-events-none [&_svg]:opacity-50')}
                  />
                }
              >
                <ChevronLeft />
              </TooltipTrigger>
              <TooltipContent>
                Previous <Kbd>←</Kbd>
              </TooltipContent>
            </Tooltip>

            <Button variant="outline" size="sm" className="pointer-events-none tabular-nums">
              {api?.scrollSnapList()?.length ? (
                <span>
                  {current + 1} / {api?.scrollSnapList()?.length}
                </span>
              ) : (
                <span>...</span>
              )}
            </Button>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => api?.scrollNext()}
                    className={cn(!api?.canScrollNext() && 'pointer-events-none [&_svg]:opacity-50')}
                  />
                }
              >
                <ChevronRight />
              </TooltipTrigger>
              <TooltipContent>
                Next <Kbd>→</Kbd>
              </TooltipContent>
            </Tooltip>
          </ButtonGroup>

          <ButtonGroup orientation="horizontal" aria-label="slides navigation">
            <ButtonGroup>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => api?.scrollTo(0)}
                      className={cn(current === 0 && 'pointer-events-none [&_svg]:opacity-50')}
                    />
                  }
                >
                  <Undo2 />
                </TooltipTrigger>
                <TooltipContent className="pe-2">
                  Restart <Kbd>R</Kbd>
                </TooltipContent>
              </Tooltip>
            </ButtonGroup>

            <ButtonGroup>
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline" size="icon-sm" onClick={toggleFullscreen} />}>
                  <Expand className={cn(fullscreen && 'hidden')} />
                  <Shrink className={cn(!fullscreen && 'hidden')} />
                </TooltipTrigger>
                <TooltipContent className="pe-2">
                  Fullscreen Mode <Kbd>F</Kbd>
                </TooltipContent>
              </Tooltip>
            </ButtonGroup>

            <ButtonGroup>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                    />
                  }
                >
                  <Sun className={cn('hidden dark:block')} />
                  <Moon className={cn('block dark:hidden')} />
                </TooltipTrigger>
                <TooltipContent className="pe-2">
                  Dark Mode <Kbd>D</Kbd>
                </TooltipContent>
              </Tooltip>
            </ButtonGroup>
          </ButtonGroup>
        </div>
      </Carousel>
    </div>
  );
};

export default Slides;
