'use client';

import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';
import * as React from 'react';
import { Button, Group, Input, NumberField, NumberFieldProps } from 'react-aria-components';

interface NumberInputProps extends NumberFieldProps {
  placeholder?: number;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(({ ...props }, ref) => {
  return (
    <NumberField {...props} ref={ref}>
      <Group
        className={cn(
          'relative inline-flex h-8 w-full items-center overflow-hidden whitespace-nowrap rounded-sm border border-input text-xs',
          'hover:border-ring/30 disabled:hover:border-border'
        )}
      >
        <Button
          slot="decrement"
          className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-sm border border-input text-sm text-muted-foreground/80 ring-offset-background transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Minus className="size-4" aria-hidden="true" />
        </Button>
        <Input className="w-full grow px-3 py-2 text-center tabular-nums bg-background focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring" />
        <Button
          slot="increment"
          className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-sm border border-input text-sm text-muted-foreground/80 ring-offset-background transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="size-4" aria-hidden="true" />
        </Button>
      </Group>
    </NumberField>
  );
});
NumberInput.displayName = 'NumberInput';

export { NumberInput };
