'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { VariantProps, cva } from 'class-variance-authority';
import { Button } from '@/registry/button';
import { Input } from '@/registry/input';
import { Separator } from '@/registry/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/registry/sheet';
import { Skeleton } from '@/registry/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/registry/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

import { cn } from '@/lib/utils';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { mergeButtonRefs, useSidebarResize } from '@/hooks/use-sidebar-resize';
import { mergeProps, useRender } from '@base-ui/react';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

const MIN_SIDEBAR_WIDTH = '16rem';
const MAX_SIDEBAR_WIDTH = '50rem';

type SidebarState = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  toggleSidebar: () => void;
  width: string;
  setWidth: (width: string) => void;
  isDraggingRail: boolean;
  setIsDraggingRail: (isDraggingRail: boolean) => void;
};

type SidebarContextProps = {
  left: SidebarState;
  right: SidebarState;
  isMobile: boolean;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);
const SidebarInnerContext = React.createContext<'left' | 'right' | null>(null);

function useDoubleSidebar() {
  const context = React.useContext(SidebarContext);
  const side = React.useContext(SidebarInnerContext);

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  const currentSide = side || 'left';

  return {
    ...context[currentSide],
    isMobile: context.isMobile,
    side: currentSide,
  };
}

function useDoubleSidebarWithSide(side: 'left' | 'right') {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return {
    ...context[side],
    isMobile: context.isMobile,
    side,
  };
}

function DoubleSidebarProvider({
  defaultOpenLeft = true,
  defaultOpenRight = true,
  openLeft: openLeftProp,
  openRight: openRightProp,
  onOpenChangeLeft: setOpenLeftProp,
  onOpenChangeRight: setOpenRightProp,
  defaultOpen,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  defaultWidth = SIDEBAR_WIDTH,
  defaultWidthLeft,
  defaultWidthRight,
  ...props
}: React.ComponentProps<'div'> & {
  defaultOpenLeft?: boolean;
  defaultOpenRight?: boolean;
  openLeft?: boolean;
  openRight?: boolean;
  onOpenChangeLeft?: (open: boolean) => void;
  onOpenChangeRight?: (open: boolean) => void;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultWidth?: string;
  defaultWidthLeft?: string;
  defaultWidthRight?: string;
}) {
  const isMobile = useIsMobile();

  const [widthLeft, setWidthLeft] = React.useState(defaultWidthLeft || defaultWidth);
  const [widthRight, setWidthRight] = React.useState(defaultWidthRight || defaultWidth);

  const [isDraggingRailLeft, setIsDraggingRailLeft] = React.useState(false);
  const [isDraggingRailRight, setIsDraggingRailRight] = React.useState(false);

  const [openMobileLeft, setOpenMobileLeft] = React.useState(false);
  const [_openLeft, _setOpenLeft] = React.useState(() => {
    if (typeof window === 'undefined') return defaultOpenLeft ?? defaultOpen ?? false;
    const state = localStorage.getItem(`${SIDEBAR_COOKIE_NAME}_left`);
    return state ? state === 'true' : (defaultOpenLeft ?? defaultOpen ?? false);
  });
  const openLeft = openProp ?? openLeftProp ?? _openLeft;

  const [openMobileRight, setOpenMobileRight] = React.useState(false);
  const [_openRight, _setOpenRight] = React.useState(() => {
    if (typeof window === 'undefined') return defaultOpenRight ?? defaultOpen ?? false;
    const state = localStorage.getItem(`${SIDEBAR_COOKIE_NAME}_right`);
    return state ? state === 'true' : (defaultOpenRight ?? defaultOpen ?? false);
  });
  const openRight = openRightProp ?? _openRight;

  const setOpenLeft = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(openLeft) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else if (setOpenLeftProp) {
        setOpenLeftProp(openState);
      } else {
        _setOpenLeft(openState);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${SIDEBAR_COOKIE_NAME}_left`, String(openState));
      }
    },
    [setOpenProp, setOpenLeftProp, openLeft],
  );

  const setOpenRight = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(openRight) : value;
      if (setOpenRightProp) {
        setOpenRightProp(openState);
      } else {
        _setOpenRight(openState);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${SIDEBAR_COOKIE_NAME}_right`, String(openState));
      }
    },
    [setOpenRightProp, openRight],
  );

  const toggleSidebarLeft = React.useCallback(() => {
    return isMobile ? setOpenMobileLeft((open) => !open) : setOpenLeft((open) => !open);
  }, [isMobile, setOpenLeft]);

  const toggleSidebarRight = React.useCallback(() => {
    return isMobile ? setOpenMobileRight((open) => !open) : setOpenRight((open) => !open);
  }, [isMobile, setOpenRight]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        if (event.key === SIDEBAR_KEYBOARD_SHORTCUT) {
          event.preventDefault();
          toggleSidebarLeft();
        } else if (event.key === 'n') {
          event.preventDefault();
          toggleSidebarRight();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebarLeft, toggleSidebarRight]);

  const contextValue = React.useMemo<SidebarContextProps>(() => {
    const leftState: SidebarState = {
      state: openLeft ? 'expanded' : 'collapsed',
      open: openLeft,
      setOpen: setOpenLeft,
      openMobile: openMobileLeft,
      setOpenMobile: setOpenMobileLeft,
      toggleSidebar: toggleSidebarLeft,
      width: widthLeft,
      setWidth: setWidthLeft,
      isDraggingRail: isDraggingRailLeft,
      setIsDraggingRail: setIsDraggingRailLeft,
    };
    const rightState: SidebarState = {
      state: openRight ? 'expanded' : 'collapsed',
      open: openRight,
      setOpen: setOpenRight,
      openMobile: openMobileRight,
      setOpenMobile: setOpenMobileRight,
      toggleSidebar: toggleSidebarRight,
      width: widthRight,
      setWidth: setWidthRight,
      isDraggingRail: isDraggingRailRight,
      setIsDraggingRail: setIsDraggingRailRight,
    };
    return {
      left: leftState,
      right: rightState,
      isMobile,
    };
  }, [
    openLeft,
    setOpenLeft,
    openMobileLeft,
    setOpenMobileLeft,
    toggleSidebarLeft,
    widthLeft,
    setWidthLeft,
    isDraggingRailLeft,
    setIsDraggingRailLeft,
    openRight,
    setOpenRight,
    openMobileRight,
    setOpenMobileRight,
    toggleSidebarRight,
    widthRight,
    setWidthRight,
    isDraggingRailRight,
    setIsDraggingRailRight,
    isMobile,
  ]);

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              '--sidebar-width-left': widthLeft,
              '--sidebar-width-right': widthRight,
              '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn('group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar', className)}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

function DoubleSidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
}) {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error('Sidebar must be used within a SidebarProvider.');
  }

  const { state, openMobile, setOpenMobile, width, isDraggingRail } = context[side];
  const { isMobile } = context;

  if (collapsible === 'none') {
    return (
      <SidebarInnerContext.Provider value={side}>
        <div
          data-slot="sidebar"
          data-side={side}
          className={cn('flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground', className)}
          style={
            {
              '--sidebar-width': width,
            } as React.CSSProperties
          }
          {...props}
        >
          {children}
        </div>
      </SidebarInnerContext.Provider>
    );
  }

  if (isMobile) {
    return (
      <SidebarInnerContext.Provider value={side}>
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-slot="sidebar"
            data-mobile="true"
            className="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={
              {
                '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Sidebar</SheetTitle>
              <SheetDescription>Displays the mobile sidebar.</SheetDescription>
            </SheetHeader>
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      </SidebarInnerContext.Provider>
    );
  }

  return (
    <SidebarInnerContext.Provider value={side}>
      <div
        className="group peer hidden text-sidebar-foreground md:block"
        data-state={state}
        data-collapsible={state === 'collapsed' ? collapsible : ''}
        data-variant={variant}
        data-side={side}
        data-slot="sidebar"
        style={
          {
            '--sidebar-width': width,
          } as React.CSSProperties
        }
      >
        <div
          data-slot="sidebar-gap"
          className={cn(
            'relative w-(--sidebar-width) bg-transparent',
            {
              'transition-[width] duration-200 ease-linear': !isDraggingRail,
            },
            'group-data-[collapsible=offcanvas]:w-0',
            'group-data-[side=right]:rotate-180',
            variant === 'floating' || variant === 'inset'
              ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
              : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
          )}
        />
        <div
          data-slot="sidebar-container"
          className={cn(
            'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) md:flex',
            {
              'transition-[left,right,width] duration-200 ease-linear': !isDraggingRail,
            },
            side === 'left'
              ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
              : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
            variant === 'floating' || variant === 'inset'
              ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
              : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
            className,
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            data-slot="sidebar-inner"
            className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-sm group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm"
          >
            {children}
          </div>
        </div>
      </div>
    </SidebarInnerContext.Provider>
  );
}

function DoubleSidebarTrigger({
  className,
  onClick,
  side,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { side?: 'left' | 'right'; asChild?: boolean }) {
  const contextSide = React.useContext(SidebarInnerContext);
  const targetSide = side || contextSide || 'left';
  const { toggleSidebar, open } = useDoubleSidebarWithSide(targetSide);

  const Comp = asChild ? Slot : Button;

  return (
    <Comp
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      data-side={targetSide}
      variant="ghost"
      size="icon"
      className={cn(
        'group/sidebar-trigger data-[state=open]:bg-muted-foreground data-[state=open]:text-background h-6 w-6 rounded-sm [&>svg]:h-5 [&>svg]:w-5 size-7',
        className,
      )}
      onClick={(event) => {
        onClick?.(event as Parameters<NonNullable<React.ComponentProps<typeof Button>['onClick']>>[0]);
        toggleSidebar();
      }}
      {...props}
    >
      {children ? (
        children
      ) : open ? (
        <PanelLeftClose
          className={cn({
            'rotate-180': targetSide === 'right',
          })}
        />
      ) : (
        <PanelLeftOpen />
      )}
      <span className="sr-only">Toggle Sidebar</span>
    </Comp>
  );
}

interface DoubleSidebarRailProps extends React.ComponentPropsWithRef<typeof Button> {
  enableDrag?: boolean;
  minSidebarWidth?: string;
  maxSidebarWidth?: string;
}

function DoubleSidebarRail({
  className,
  enableDrag = true,
  minSidebarWidth = MIN_SIDEBAR_WIDTH,
  maxSidebarWidth = MAX_SIDEBAR_WIDTH,
  ref,
  ...props
}: DoubleSidebarRailProps) {
  const { toggleSidebar, setWidth, state, width, setIsDraggingRail, side } = useDoubleSidebar();

  const { dragRef, handleMouseDown } = useSidebarResize({
    direction: side === 'right' ? 'left' : 'right',
    enableDrag,
    onResize: setWidth!,
    onToggle: toggleSidebar,
    currentWidth: width!,
    isCollapsed: state === 'collapsed',
    minResizeWidth: minSidebarWidth,
    maxResizeWidth: maxSidebarWidth,
    setIsDraggingRail,
    widthCookieName: `sidebar:width:${side}`,
    widthCookieMaxAge: 60 * 60 * 24 * 7,
  });

  const combinedRef = React.useCallback<React.RefCallback<HTMLButtonElement>>(
    (node) => {
      if (!ref) {
        mergeButtonRefs([dragRef])(node);
        return;
      }
      mergeButtonRefs([ref, dragRef])(node);
    },
    [ref, dragRef],
  );

  return (
    <button
      ref={combinedRef}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      onMouseDown={handleMouseDown}
      title="Toggle Sidebar"
      className={cn(
        'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className,
      )}
      {...props}
    />
  );
}

function DoubleSidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        'relative flex w-full flex-1 flex-col',
        'md:peer-data-[variant=inset]:rounded-sm md:peer-data-[variant=inset]:p-1 md:peer-data-[variant=inset]:pl-0 md:peer-data-[variant=inset]:peer-data-[state=collapsed]:pl-1',
        className,
      )}
      {...props}
    />
  );
}

function DoubleSidebarInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn('h-8 w-full bg-background shadow-none', className)}
      {...props}
    />
  );
}

function DoubleSidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  );
}

function DoubleSidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  );
}

function DoubleSidebarSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn('mx-2 w-auto bg-sidebar-border dark:bg-sidebar-foreground/10', className)}
      {...props}
    />
  );
}

function DoubleSidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        className,
      )}
      {...props}
    />
  );
}

function DoubleSidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn('relative flex w-full min-w-0 flex-col', className)}
      {...props}
    />
  );
}

function DoubleSidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        'flex h-8 shrink-0 items-center rounded-sm px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
        className,
      )}
      {...props}
    />
  );
}

function DoubleSidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        'absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-sm p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        'after:absolute after:-inset-2 md:after:hidden',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  );
}

function DoubleSidebarGroupContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn('w-full text-sm', className)}
      {...props}
    />
  );
}

function DoubleSidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn('flex w-full min-w-0 flex-col gap-1', className)}
      {...props}
    />
  );
}

function DoubleSidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn('group/menu-item relative', className)}
      {...props}
    />
  );
}

const doubleSidebarMenuButtonVariants = cva(
  'ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground gap-2 rounded-md p-2 text-left text-sm transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 data-active:font-medium peer/menu-button flex w-full items-center overflow-hidden outline-hidden group/menu-button disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        outline:
          'bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function DoubleSidebarMenuButton({
  render,
  isActive = false,
  variant = 'default',
  size = 'default',
  tooltip,
  className,
  ...props
}: useRender.ComponentProps<'button'> &
  React.ComponentProps<'button'> & {
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  } & VariantProps<typeof doubleSidebarMenuButtonVariants>) {
  const { isMobile, state } = useDoubleSidebar();

  const comp = useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(
      {
        className: cn(doubleSidebarMenuButtonVariants({ variant, size }), className),
      },
      props,
    ),
    render: !tooltip ? render : TooltipTrigger,
    state: {
      slot: 'sidebar-menu-button',
      sidebar: 'menu-button',
      size,
      active: isActive,
    },
  });

  if (!tooltip) {
    return comp;
  }

  if (typeof tooltip === 'string') {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      {comp}
      <TooltipContent side="right" align="center" hidden={state !== 'collapsed' || isMobile} {...tooltip} />
    </Tooltip>
  );
}

function DoubleSidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean;
  showOnHover?: boolean;
}) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        'absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-sm p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        'after:absolute after:-inset-2 md:after:hidden',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        showOnHover &&
          'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground data-[state=open]:opacity-100 md:opacity-0',
        className,
      )}
      {...props}
    />
  );
}

function DoubleSidebarMenuBadge({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        'pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-sm px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none',
        'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  );
}

function DoubleSidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<'div'> & {
  showIcon?: boolean;
}) {
  const width = React.useState(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  });

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn('flex h-8 items-center gap-2 rounded-sm px-2', className)}
      {...props}
    >
      {showIcon && <Skeleton className="size-4 rounded-sm" data-sidebar="menu-skeleton-icon" />}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            '--skeleton-width': width,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

function DoubleSidebarMenuSub({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  );
}

function DoubleSidebarMenuSubItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn('group/menu-sub-item relative', className)}
      {...props}
    />
  );
}

function DoubleSidebarMenuSubButton({
  asChild = false,
  size = 'md',
  isActive = false,
  className,
  ...props
}: React.ComponentProps<'a'> & {
  asChild?: boolean;
  size?: 'sm' | 'md';
  isActive?: boolean;
}) {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-sm px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground',
        'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  );
}

export {
  DoubleSidebar,
  DoubleSidebarContent,
  DoubleSidebarFooter,
  DoubleSidebarGroup,
  DoubleSidebarGroupAction,
  DoubleSidebarGroupContent,
  DoubleSidebarGroupLabel,
  DoubleSidebarHeader,
  DoubleSidebarInput,
  DoubleSidebarInset,
  DoubleSidebarMenu,
  DoubleSidebarMenuAction,
  DoubleSidebarMenuBadge,
  DoubleSidebarMenuButton,
  DoubleSidebarMenuItem,
  DoubleSidebarMenuSkeleton,
  DoubleSidebarMenuSub,
  DoubleSidebarMenuSubButton,
  DoubleSidebarMenuSubItem,
  DoubleSidebarProvider,
  DoubleSidebarRail,
  DoubleSidebarSeparator,
  DoubleSidebarTrigger,
  useDoubleSidebar,
  useDoubleSidebarWithSide,
};
