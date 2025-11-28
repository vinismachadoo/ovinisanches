import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-sm border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive:
          'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
        warning:
          'bg-[theme(colors.yellow.400/.1)] text-[theme(colors.yellow.500)] border-[theme(colors.yellow.300)] [&>svg]:text-[theme(colors.yellow.500)]  selection:bg-[theme(colors.yellow.500/.2)] selection:text-[theme(colors.yellow.900)] dark:selection:text-[theme(colors.yellow.200)]',
        info: 'bg-[theme(colors.blue.400/.1)] text-[theme(colors.blue.500)] border-[theme(colors.blue.300)] [&>svg]:text-[theme(colors.blue.500)] selection:bg-[theme(colors.blue.500/.2)] selection:text-[theme(colors.blue.900)] dark:selection:text-[theme(colors.blue.200)]',
        success:
          'bg-[theme(colors.green.400/.1)] text-[theme(colors.green.500)] border-[theme(colors.green.300)] [&>svg]:text-[theme(colors.green.500)] selection:bg-[theme(colors.green.500/.2)] selection:text-[theme(colors.green.900)] dark:selection:text-[theme(colors.green.200)]',
        error:
          'bg-[theme(colors.red.400/.1)] text-[theme(colors.red.500)] border-[theme(colors.red.300)] [&>svg]:text-[theme(colors.red.500)] selection:bg-[theme(colors.red.500/.2)] selection:text-[theme(colors.red.900)] dark:selection:text-[theme(colors.red.200)]',
        neutral:
          'bg-[theme(colors.gray.400/.1)] text-[theme(colors.gray.500)] border-[theme(colors.gray.300)] [&>svg]:text-[theme(colors.gray.500)] selection:bg-[theme(colors.gray.500/.2)] selection:text-[theme(colors.gray.900)] dark:selection:text-[theme(colors.gray.200)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Alert({ className, variant, ...props }: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('col-start-2 line-clamp-1 min-h-4 font-semibold tracking-tight', className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn('col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
