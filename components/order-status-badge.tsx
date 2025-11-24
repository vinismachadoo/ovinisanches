import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import colors from 'tailwindcss/colors';

export enum OrderTypes {
  TAKEOUT = 'TAKEOUT',
  DELIVERY = 'DELIVERY',
  SUPLY = 'SUPPLY',
  RETURN = 'RETURN',
}

export enum OrderStatus {
  CREATED = 'CREATED',
  DISPATCHED = 'DISPATCHED',
  START_DELIVERY = 'START_DELIVERY',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
  // VISIT_LATER = 'VISIT_LATER',
  PENDING = 'PENDING',
  // TREATED = 'TREATED',
  HANDLING = 'HANDLING',
  COLLECTED = 'COLLECTED',
  RETURNING = 'RETURNING',
  RETURNED = 'RETURNED',
  IN_TRANSIT = 'IN_TRANSIT',
  ORDER_FAILED = 'ORDER_FAILED',
  MANUAL_HANDLE = 'MANUAL_HANDLE',
  ON_HOLD = 'ON_HOLD',
  SCHEDULED = 'SCHEDULED',
}

const orderStatusBadgeVariants = cva(
  'flex flex-row gap-x-1 text-xs leading-none py-1 px-1 rounded-sm whitespace-nowrap w-fit items-center border uppercase font-medium',
  {
    variants: {
      variant: {
        [OrderStatus.CREATED]:
          'bg-[theme(colors.yellow.400/.1)] text-[theme(colors.yellow.500)] border-[theme(colors.yellow.300)] selection:bg-[theme(colors.yellow.500/.2)] selection:text-[theme(colors.yellow.900)] dark:selection:text-[theme(colors.yellow.200)]',
        [OrderStatus.DISPATCHED]:
          'bg-[theme(colors.teal.400/.1)] text-[theme(colors.teal.500)] border-[theme(colors.teal.300)] selection:bg-[theme(colors.teal.500/.2)] selection:text-[theme(colors.teal.900)] dark:selection:text-[theme(colors.teal.200)]',
        [OrderStatus.PENDING]:
          'bg-[theme(colors.pink.400/.1)] text-[theme(colors.pink.500)] border-[theme(colors.pink.300)] selection:bg-[theme(colors.pink.500/.2)] selection:text-[theme(colors.pink.900)] dark:selection:text-[theme(colors.pink.200)]',
        [OrderStatus.COLLECTED]:
          'bg-[theme(colors.violet.400/.1)] text-[theme(colors.violet.500)] border-[theme(colors.violet.300)] selection:bg-[theme(colors.violet.500/.2)] selection:text-[theme(colors.violet.900)] dark:selection:text-[theme(colors.violet.200)]',
        [OrderStatus.START_DELIVERY]:
          'bg-[theme(colors.cyan.400/.1)] text-[theme(colors.cyan.500)] border-[theme(colors.cyan.300)] selection:bg-[theme(colors.cyan.500/.2)] selection:text-[theme(colors.cyan.900)] dark:selection:text-[theme(colors.cyan.200)]',
        [OrderStatus.SUCCESSFUL]:
          'bg-[theme(colors.green.400/.1)] text-[theme(colors.green.500)] border-[theme(colors.green.300)] selection:bg-[theme(colors.green.500/.2)] selection:text-[theme(colors.green.900)] dark:selection:text-[theme(colors.green.200)]',
        [OrderStatus.FAILED]:
          'bg-[theme(colors.rose.400/.1)] text-[theme(colors.rose.500)] border-[theme(colors.rose.300)] selection:bg-[theme(colors.rose.500/.2)] selection:text-[theme(colors.rose.900)] dark:selection:text-[theme(colors.rose.200)]',
        [OrderStatus.IN_TRANSIT]:
          'bg-[theme(colors.sky.400/.1)] text-[theme(colors.sky.500)] border-[theme(colors.sky.300)] selection:bg-[theme(colors.sky.500/.2)] selection:text-[theme(colors.sky.900)] dark:selection:text-[theme(colors.sky.200)]',
        [OrderStatus.RETURNING]:
          'bg-[theme(colors.orange.400/.1)] text-[theme(colors.orange.500)] border-[theme(colors.orange.300)] selection:bg-[theme(colors.orange.500/.2)] selection:text-[theme(colors.orange.900)] dark:selection:text-[theme(colors.orange.200)]',
        [OrderStatus.RETURNED]:
          'bg-[theme(colors.indigo.400/.1)] text-[theme(colors.indigo.500)] border-[theme(colors.indigo.300)] selection:bg-[theme(colors.indigo.500/.2)] selection:text-[theme(colors.indigo.900)] dark:selection:text-[theme(colors.indigo.200)]',
        [OrderStatus.MANUAL_HANDLE]:
          'bg-[theme(colors.slate.400/.1)] text-[theme(colors.slate.500)] border-[theme(colors.slate.300)] selection:bg-[theme(colors.slate.500/.2)] selection:text-[theme(colors.slate.900)] dark:selection:text-[theme(colors.slate.200)]',
        [OrderStatus.HANDLING]:
          'bg-[theme(colors.fuchsia.400/.1)] text-[theme(colors.fuchsia.500)] border-[theme(colors.fuchsia.300)] selection:bg-[theme(colors.fuchsia.500/.2)] selection:text-[theme(colors.fuchsia.900)] dark:selection:text-[theme(colors.fuchsia.200)]',
        [OrderStatus.ORDER_FAILED]:
          'bg-[theme(colors.red.400/.1)] text-[theme(colors.red.500)] border-[theme(colors.red.300)] selection:bg-[theme(colors.red.500/.2)] selection:text-[theme(colors.red.900)] dark:selection:text-[theme(colors.red.200)]',
        [OrderStatus.CANCELED]:
          'bg-[theme(colors.gray.400/.1)] text-[theme(colors.gray.500)] border-[theme(colors.gray.300)] selection:bg-[theme(colors.gray.500/.2)] selection:text-[theme(colors.gray.900)] dark:selection:text-[theme(colors.gray.200)]',
        [OrderStatus.ON_HOLD]:
          'bg-[theme(colors.amber.400/.1)] text-[theme(colors.amber.500)] border-[theme(colors.amber.300)] selection:bg-[theme(colors.amber.500/.2)] selection:text-[theme(colors.amber.900)] dark:selection:text-[theme(colors.amber.200)]',
        [OrderStatus.SCHEDULED]:
          'bg-[theme(colors.blue.400/.1)] text-[theme(colors.blue.500)] border-[theme(colors.blue.300)] selection:bg-[theme(colors.blue.500/.2)] selection:text-[theme(colors.blue.900)] dark:selection:text-[theme(colors.blue.200)]',
      },
    },
    defaultVariants: {
      variant: OrderStatus.CREATED,
    },
  }
);

export interface OrderStatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof orderStatusBadgeVariants> {
  asChild?: boolean;
}

export function OrderStatusBadge({ className, variant, ...props }: OrderStatusBadgeProps) {
  return <div className={cn(orderStatusBadgeVariants({ variant }), className)} {...props} />;
}

export const OrderStatusColors = {
  [OrderStatus.CREATED]: colors.yellow[500],
  [OrderStatus.PENDING]: colors.pink[500],
  [OrderStatus.DISPATCHED]: colors.teal[500],
  [OrderStatus.IN_TRANSIT]: colors.sky[500],
  [OrderStatus.COLLECTED]: colors.violet[500],
  [OrderStatus.START_DELIVERY]: colors.cyan[500],
  [OrderStatus.HANDLING]: colors.fuchsia[500],
  [OrderStatus.SUCCESSFUL]: colors.green[500],
  [OrderStatus.FAILED]: colors.rose[500],
  [OrderStatus.RETURNING]: colors.orange[500],
  [OrderStatus.RETURNED]: colors.indigo[500],
  [OrderStatus.MANUAL_HANDLE]: colors.slate[500],
  [OrderStatus.CANCELED]: colors.gray[500],
  [OrderStatus.ON_HOLD]: colors.amber[500],
  [OrderStatus.SCHEDULED]: colors.blue[500],
  [OrderStatus.ORDER_FAILED]: colors.red[500],
};
