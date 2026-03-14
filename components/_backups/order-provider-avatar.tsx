import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface OrderProviderAvatarProps extends React.ComponentPropsWithoutRef<typeof Avatar> {
  order_integration_type: string;
}

const OrderProviderAvatar = React.forwardRef<React.ElementRef<typeof Avatar>, OrderProviderAvatarProps>(
  ({ order_integration_type, className, ...props }, ref) => {
    const order_provider_logo = `https://abbiamo-public.s3.amazonaws.com/integration-logos/${String(
      encodeURIComponent(order_integration_type),
    ).toUpperCase()}.png`;

    return (
      <Avatar
        ref={ref}
        {...props}
        className={cn('border-border/50 h-6 w-6 cursor-default select-none border shadow-md', className)}
      >
        <AvatarImage src={order_provider_logo} />
        <AvatarFallback className="text-xs">{order_integration_type?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
      </Avatar>
    );
  },
);
OrderProviderAvatar.displayName = 'OrderProviderAvatar';

export default OrderProviderAvatar;
