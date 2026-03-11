'use client';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Kbd } from '@/components/ui/kbd';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useFullscreen } from '@/hooks/use-fullscreen';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Expand, Shrink, Undo2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

const SLIDES_CONFIG = {
  watermark: (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground">Made by Vinicius Sanches</div>
  ),
  slides: [
    {
      content: (
        <div className="flex items-center justify-center size-full">
          <h1 className="text-5xl font-bold">Why me?</h1>
        </div>
      ),
    },
    {
      content: (
        <div className="flex items-center justify-center size-full">
          <h1 className="text-5xl font-bold">Projects</h1>
        </div>
      ),
    },
    {
      content: (
        <div className="flex flex-col items-center justify-center size-full">
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <h1 className="text-3xl font-bold ">Shades</h1>
            <p className="text-lg text-muted-foreground">A tool for generating balanced color palettes</p>
          </div>
          <div className="h-full w-7/10 rounded-t-lg overflow-hidden border border-b-0 border-border/50 -mb-4">
            <img src="/labs-shades-dark.png" alt="Labs Shades Dark" className="hidden dark:block" />
            <img src="/labs-shades-light.png" alt="Labs Shades Light" className="block dark:hidden" />
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

  const { resolvedTheme, setTheme } = useTheme();

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

  useHotkeys('d', () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'), {
    enableOnFormTags: true,
    enableOnContentEditable: true,
  });

  useHotkeys('r', () => api?.scrollTo(0), {
    enableOnFormTags: true,
    enableOnContentEditable: true,
  });

  useHotkeys('f', () => toggleFullscreen(), {
    enableOnFormTags: true,
    enableOnContentEditable: true,
  });

  useHotkeys('left', () => api?.scrollPrev(), {
    enableOnFormTags: true,
    enableOnContentEditable: true,
  });

  useHotkeys('right', () => api?.scrollNext(), {
    enableOnFormTags: true,
    enableOnContentEditable: true,
  });

  return (
    <div
      className={cn('relative size-full [--controls-height:calc(var(--spacing)*8)]', className)}
      {...props}
      ref={ref}
    >
      <Carousel
        opts={{
          align: 'center',
        }}
        className={cn(
          'bg-background w-full *:data-[slot=carousel-content]:h-full *:data-[slot=carousel-content]:rounded-lg *:data-[slot=carousel-content]:border',
          fullscreen ? 'h-full' : 'h-[calc(100%-var(--controls-height))]',
        )}
        setApi={setApi}
      >
        <CarouselContent className="h-full ml-0">
          {SLIDES_CONFIG.slides.map((slide, index) => (
            <CarouselItem key={`slide-${index}`} className={cn('relative flex items-center justify-center p-4')}>
              {slide.content}
              {slide.showWatermark !== false ? SLIDES_CONFIG.watermark : null}
            </CarouselItem>
          ))}
        </CarouselContent>

        <div
          className={cn(
            'absolute',
            fullscreen
              ? 'bottom-0 pb-4 opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out w-full inset-x-0 flex justify-center'
              : 'w-fit inset-x-1/2 -translate-x-1/2 -bottom-12',
          )}
        >
          <ButtonGroup orientation="horizontal" aria-label="slides navigation">
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
          </ButtonGroup>
        </div>
      </Carousel>
    </div>
  );
};

export default Slides;
