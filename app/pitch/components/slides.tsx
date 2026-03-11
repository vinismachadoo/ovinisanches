'use client';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Kbd } from '@/components/ui/kbd';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useFullscreen } from '@/hooks/use-fullscreen';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Expand, Maximize2, Shrink, Undo2 } from 'lucide-react';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

const SLIDE_COLORS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
];

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

  useHotkeys('r', () => api?.scrollTo(0), {
    enableOnFormTags: true,
    enableOnContentEditable: true,
  });

  useHotkeys('f', () => toggleFullscreen(), {
    enableOnFormTags: true,
    enableOnContentEditable: true,
  });

  return (
    <div className={cn('relative size-full', className)} {...props} ref={ref}>
      <Carousel
        opts={{
          align: 'center',
        }}
        className="size-full *:data-[slot=carousel-content]:h-full *:data-[slot=carousel-content]:rounded-lg"
        setApi={setApi}
      >
        <CarouselContent className="h-full ml-0">
          {SLIDE_COLORS.map((c) => (
            <CarouselItem
              key={c}
              style={{ '--color': c } as React.CSSProperties}
              className={cn('flex items-center justify-center bg-(--color)')}
            >
              {c}
            </CarouselItem>
          ))}
        </CarouselContent>

        <div
          className={cn(
            'absolute',
            fullscreen
              ? 'bottom-0 pb-4 opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out w-full inset-x-0 flex justify-center'
              : 'w-fit inset-x-1/2 -translate-x-1/2 -bottom-2',
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
