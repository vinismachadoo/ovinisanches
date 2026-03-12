'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';

const ShadesStorageUsage = ({ className, ...props }: React.ComponentProps<typeof Card>) => {
  const [hoveredSource, setHoveredSource] = React.useState<string | null>(null);

  const data = [
    {
      source: 'Applications',
      color: 'var(--chart-1)',
      usage: 32,
    },
    {
      source: 'Photos',
      color: 'var(--chart-2)',
      usage: 24,
    },
    {
      source: 'Documents',
      color: 'var(--chart-3)',
      usage: 19,
    },
    {
      source: 'Music',
      color: 'var(--chart-4)',
      usage: 13,
    },
    {
      source: 'System Data',
      color: 'var(--chart-5)',
      usage: 10,
    },
  ];

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Storage Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <p>iPhone</p>
              <p className="text-sm text-muted-foreground">98 / 100 GB</p>
            </div>

            <div className="flex h-4 w-full overflow-hidden">
              {data.map(({ source, color, usage }) => (
                <div
                  key={source}
                  className="flex items-center not-last:pr-1 w-(--width)"
                  onMouseEnter={() => setHoveredSource(source)}
                  onMouseLeave={() => setHoveredSource(null)}
                  style={
                    {
                      '--bg-color': color,
                      '--width': `${usage}%`,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className={cn(
                      'rounded-xs bg-(--bg-color) w-full h-full',
                      hoveredSource && hoveredSource !== source && 'opacity-10',
                    )}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col">
            {data.map(({ source, color, usage }, idx) => (
              <div
                key={idx}
                className={cn('hover:bg-muted rounded-sm', hoveredSource && hoveredSource === source && 'bg-muted')}
                onMouseEnter={() => setHoveredSource(source)}
                onMouseLeave={() => setHoveredSource(null)}
              >
                <div
                  className={cn(
                    'grid grid-cols-[1fr_min-content] gap-x-24 p-1 px-2',
                    hoveredSource && hoveredSource !== source && 'opacity-10',
                  )}
                >
                  <div className="flex items-center gap-x-2 text-sm">
                    <span
                      className={cn('size-3 rounded-xs bg-(--color) shrink-0')}
                      style={
                        {
                          '--color': color,
                        } as React.CSSProperties
                      }
                    />
                    <span className="text-muted-foreground whitespace-nowrap select-all">{source}</span>
                  </div>
                  <div className="flex flex-col items-start min-w-fit">
                    <span className="font-medium tabular-nums">{usage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShadesStorageUsage;
