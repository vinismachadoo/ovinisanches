'use client';

import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useIsMac } from '@/hooks/use-is-mac';
import { useMutationObserver } from '@/hooks/use-mutation-observer';
import { cn } from '@/lib/utils';
import { LucideProps } from 'lucide-react';
import * as React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

interface ActionOptions {
  label: string;
  icon: React.ComponentType<LucideProps>;
  action: () => void;
  disabled?: boolean;
  soon?: boolean;
}

interface CommandMenuProps {
  sections: {
    title: string;
    actions: ActionOptions[];
  }[];
  placeholder: string;
  notFoundLabel: string;
}

// CommandMenuContext implementation
interface CommandMenuContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMac: boolean;
}

const CommandMenuContext = React.createContext<CommandMenuContextType | undefined>(undefined);

export const useCommandMenu = () => {
  const context = React.useContext(CommandMenuContext);
  if (!context) {
    throw new Error('useCommandMenu must be used within a CommandMenuProvider');
  }
  return context;
};

const CommandMenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  const isMac = useIsMac();

  const value = React.useMemo(() => ({ open, setOpen, isMac }), [open, isMac]);

  useHotkeys(['ctrl+k', 'meta+k'], () => setOpen((open) => !open), {
    preventDefault: true,
    enableOnFormTags: true,
    enableOnContentEditable: true,
  });

  return <CommandMenuContext.Provider value={value}>{children}</CommandMenuContext.Provider>;
};

const CommandMenuTrigger = ({ children }: { children: React.ReactNode }) => {
  const { setOpen } = useCommandMenu();

  return (
    <Button variant="outline" onClick={() => setOpen(true)}>
      {children}
    </Button>
  );
};

const CommandMenuContent = ({ placeholder, notFoundLabel, sections }: CommandMenuProps) => {
  const { open, setOpen } = useCommandMenu();

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen} className="max-w-[50%]">
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>{notFoundLabel}</CommandEmpty>
        {sections.map((section) => (
          <CommandGroup key={section.title} heading={section.title}>
            {section.actions.map((action) => (
              <CommandMenuItem
                key={action.label}
                value={action.label}
                onSelect={() => runCommand(() => action.action())}
                disabled={action.disabled || action.soon}
              >
                <action.icon className="h-4 w-4" />
                <span>{action.label}</span>
                {action.soon && <span className="text-muted-foreground text-xs">Em breve</span>}
              </CommandMenuItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
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
        'data-[selected=true]:border-input data-[selected=true]:bg-input/50 h-9 rounded-sm border border-transparent px-3! font-medium',
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

export { CommandMenuContent, CommandMenuItem, CommandMenuKbd, CommandMenuProvider, CommandMenuTrigger };
