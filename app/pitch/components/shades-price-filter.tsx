'use client';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';
import * as React from 'react';
import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts';

const AirbnbPriceFilter = ({ className, ...props }: React.ComponentProps<typeof Card>) => {
  const [priceRange, setPriceRange] = React.useState<number[]>([280, 580]);

  const bins = [
    { bin: 100, amount: 12 },
    { bin: 120, amount: 23 },
    { bin: 140, amount: 38 },
    { bin: 160, amount: 8 },
    { bin: 180, amount: 41 },
    { bin: 200, amount: 33 },
    { bin: 220, amount: 29 },
    { bin: 240, amount: 17 },
    { bin: 260, amount: 39 },
    { bin: 280, amount: 19 },
    { bin: 300, amount: 47 },
    { bin: 320, amount: 7 },
    { bin: 340, amount: 45 },
    { bin: 360, amount: 21 },
    { bin: 380, amount: 34 },
    { bin: 400, amount: 10 },
    { bin: 420, amount: 31 },
    { bin: 440, amount: 48 },
    { bin: 460, amount: 3 },
    { bin: 480, amount: 28 },
    { bin: 500, amount: 26 },
    { bin: 520, amount: 13 },
    { bin: 540, amount: 35 },
    { bin: 560, amount: 27 },
    { bin: 580, amount: 16 },
    { bin: 600, amount: 44 },
    { bin: 620, amount: 18 },
    { bin: 640, amount: 32 },
    { bin: 660, amount: 40 },
    { bin: 680, amount: 24 },
    { bin: 700, amount: 4 },
    { bin: 720, amount: 22 },
    { bin: 740, amount: 43 },
    { bin: 760, amount: 37 },
    { bin: 780, amount: 5 },
    { bin: 800, amount: 14 },
    { bin: 820, amount: 9 },
    { bin: 840, amount: 25 },
    { bin: 860, amount: 42 },
    { bin: 880, amount: 36 },
    { bin: 900, amount: 11 },
    { bin: 920, amount: 30 },
    { bin: 940, amount: 46 },
    { bin: 960, amount: 15 },
    { bin: 980, amount: 20 },
  ];

  const chartConfig = {
    bin: {
      label: 'Price',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Price Range</CardTitle>
        <CardDescription>Try filtering like Airbnb</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-2">
            <ChartContainer config={chartConfig} className="aspect-video max-h-24 -mt-4">
              <BarChart accessibilityLayer data={bins}>
                <XAxis dataKey="bin" hide />
                <YAxis dataKey="amount" hide />
                <Bar dataKey="amount" fill="var(--color-bin)" radius={2}>
                  {bins.map((entry) => (
                    <Cell
                      key={entry.bin}
                      className={cn(
                        entry.bin >= priceRange[0] && entry.bin < priceRange[1] ? 'opacity-100' : 'opacity-10',
                      )}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as number[])}
              min={100}
              max={1000}
              step={20}
            />
          </div>

          <div className="flex gap-x-2 items-center">
            <ButtonGroup>
              <InputGroup>
                <InputGroupInput
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  min={100}
                  max={1000}
                />
                <InputGroupAddon>
                  <span>Min: $</span>
                </InputGroupAddon>
              </InputGroup>

              <Button variant="outline" size="icon" onClick={() => setPriceRange([priceRange[0] - 20, priceRange[1]])}>
                <Minus className="size-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setPriceRange([priceRange[0] + 20, priceRange[1]])}>
                <Plus className="size-4" />
              </Button>
            </ButtonGroup>

            <span>-</span>

            <ButtonGroup>
              <InputGroup>
                <InputGroupInput
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  min={100}
                  max={1000}
                />
                <InputGroupAddon>
                  <span>Max: $</span>
                </InputGroupAddon>
              </InputGroup>
              <Button variant="outline" size="icon" onClick={() => setPriceRange([priceRange[0], priceRange[1] - 20])}>
                <Minus className="size-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setPriceRange([priceRange[0], priceRange[1] + 20])}>
                <Plus className="size-4" />
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AirbnbPriceFilter;
