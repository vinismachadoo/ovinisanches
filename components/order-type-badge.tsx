import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { OrderTypes } from '@/components/order-status-badge';

export interface OrderTypeBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof orderTypeBadgeVariants> {}

function OrderTypeBadge({ className, variant, ...props }: OrderTypeBadgeProps) {
  return <div className={cn(orderTypeBadgeVariants({ variant }), className)} {...props} />;
}

const orderTypeBadgeVariants = cva(
  'flex flex-row gap-x-1 text-xs leading-none py-1 px-1.5 rounded-md whitespace-nowrap w-fit items-center border uppercase font-medium',
  {
    variants: {
      variant: {
        [OrderTypes.DELIVERY]:
          'bg-[theme(colors.violet.400/.1)] text-[theme(colors.violet.500)] border-[theme(colors.violet.300)]',
        [OrderTypes.RETURN]:
          'bg-[theme(colors.cyan.400/.1)] text-[theme(colors.cyan.500)] border-[theme(colors.cyan.300)]',
        [OrderTypes.TAKEOUT]:
          'bg-[theme(colors.orange.400/.1)] text-[theme(colors.orange.500)] border-[theme(colors.orange.300)]',
        [OrderTypes.SUPLY]:
          'bg-[theme(colors.emerald.400/.1)] text-[theme(colors.emerald.500)] border-[theme(colors.emerald.300)]',
      },
    },
    defaultVariants: {
      variant: OrderTypes.DELIVERY,
    },
  }
);

export { OrderTypeBadge, orderTypeBadgeVariants };
