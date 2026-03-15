import { Avatar, AvatarFallback, AvatarImage } from '@/registry/avatar';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface CarrierAvatarProps extends React.ComponentPropsWithoutRef<typeof Avatar> {
  carrier_name: string;
}

const CarrierAvatar = React.forwardRef<React.ElementRef<typeof Avatar>, CarrierAvatarProps>(
  ({ carrier_name, className, ...props }, ref) => {
    const isUnassigned = carrier_name === 'ABBIAMO' || carrier_name === 'PRIVATE-FLEET';

    const carrier_logo = `https://abbiamo-public.s3.amazonaws.com/carrier-logos/${String(
      encodeURIComponent(carrier_name),
    ).toUpperCase()}.png`;

    return isUnassigned ? (
      <div className={cn('h-6 w-6 select-none cursor-default border border-dashed rounded-full', className)} />
    ) : (
      <Avatar
        ref={ref}
        {...props}
        style={
          {
            '--avatar-bg': 'transparent',
          } as React.CSSProperties
        }
        className={cn(
          'h-6 w-6 select-none cursor-default bg-(--avatar-bg)] border shadow-md',
          isUnassigned && 'border-dashed',
          className,
        )}
      >
        <AvatarImage src={carrier_logo} />
        <AvatarFallback className="text-xs">{carrier_name?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
      </Avatar>
    );
  },
);
CarrierAvatar.displayName = 'CarrierAvatar';

export default CarrierAvatar;
