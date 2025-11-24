'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CommandGroup,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandDialog,
  CommandItem,
} from '@/components/ui/command';
import { useIsMac } from '@/hooks/use-is-mac';
import { useMutationObserver } from '@/hooks/use-mutation-observer';
import { cn } from '@/lib/utils';
import { LucideProps } from 'lucide-react';
import * as React from 'react';
import { useHotkeys, useHotkeysContext } from 'react-hotkeys-hook';

interface ActionOptions {
  label: string;
  icon: React.ComponentType<LucideProps>;
  action: () => void;
  disabled?: boolean;
  soon?: boolean;
}

interface CommandMenuProps {
  actions: ActionOptions[];
  placeholder: string;
  notFoundLabel: string;
}

const CommandMenu = ({ actions, placeholder, notFoundLabel }: CommandMenuProps) => {
  const isMac = useIsMac();

  const [open, setOpen] = React.useState(false);

  const { disableScope, enableScope } = useHotkeysContext();

  React.useEffect(() => {
    if (open) {
      enableScope('command-menu');
    } else {
      disableScope('command-menu');
    }
  }, [open, disableScope, enableScope]);

  useHotkeys(['ctrl+k', 'meta+k'], () => setOpen((open) => !open), {
    preventDefault: true,
    enableOnFormTags: true,
    enableOnContentEditable: true,
  });

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <React.Fragment>
      <Button variant="outline" onClick={() => setOpen(true)}>
        {placeholder}
        <div className="flex items-center gap-x-1">
          <CommandMenuKbd className="aspect-square text-xs">{isMac ? '⌘' : 'Ctrl'}</CommandMenuKbd>
          <CommandMenuKbd className="aspect-square">K</CommandMenuKbd>
        </div>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} className="max-w-[50%]">
        <CommandInput placeholder={placeholder} />
        <CommandList>
          <CommandEmpty>{notFoundLabel}</CommandEmpty>
          <CommandGroup>
            {actions.map((option) => (
              <CommandMenuItem
                key={option.label}
                value={option.label}
                onSelect={() => runCommand(() => option.action())}
                disabled={option.disabled || option.soon}
              >
                <option.icon className="h-4 w-4" />
                <span>{option.label}</span>
                {option.soon && <span className="text-muted-foreground text-xs">Em breve</span>}
              </CommandMenuItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </React.Fragment>
  );
};

function CommandMenuItem({
  children,
  className,
  onHighlight,
  ...props
}: React.ComponentProps<typeof CommandItem> & {
  onHighlight?: () => void;
  'data-selected'?: string;
  'aria-selected'?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  useMutationObserver(ref, (mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'aria-selected' &&
        ref.current?.getAttribute('aria-selected') === 'true'
      ) {
        onHighlight?.();
      }
    });
  });

  return (
    <CommandItem
      ref={ref}
      className={cn(
        'data-[selected=true]:border-input data-[selected=true]:bg-input/50 h-9 rounded-md border border-transparent px-3! font-medium',
        className
      )}
      {...props}
    >
      {children}
    </CommandItem>
  );
}

function CommandMenuKbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      className={cn(
        'bg-muted text-muted-foreground pointer-events-none flex select-none items-center rounded border px-1.5 font-sans text-xs',
        className
      )}
      {...props}
    />
  );
}

export default CommandMenu;
