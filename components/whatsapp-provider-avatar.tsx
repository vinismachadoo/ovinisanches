import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface WhatsappAvatarProps extends React.ComponentPropsWithoutRef<typeof Avatar> {
  provider_name: string;
}

export const WhatsappProviderAvatar = React.forwardRef<React.ElementRef<typeof Avatar>, WhatsappAvatarProps>(
  ({ provider_name, className, ...props }, ref) => {
    const whatsapp_logo = `https://abbiamo-public.s3.amazonaws.com/whatsapp-provider-logos/${String(
      encodeURIComponent(provider_name)
    ).toUpperCase()}.png`;

    return (
      <Avatar
        ref={ref}
        {...props}
        className={cn('h-6 w-6 select-none cursor-default border border-border/50 shadow-md', className)}
      >
        <AvatarImage src={whatsapp_logo} />
        <AvatarFallback className="text-xs">{provider_name?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
      </Avatar>
    );
  }
);
WhatsappProviderAvatar.displayName = 'WhatsappProviderAvatar';
