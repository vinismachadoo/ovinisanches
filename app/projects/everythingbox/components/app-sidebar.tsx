import {
  BOOKSTORES_PLACES,
  CHOPP_PLACES,
  COFFEE_PLACES,
  TOBACCONIST_PLACES,
} from '@/app/projects/everythingbox/components/places';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DoubleSidebar,
  DoubleSidebarContent,
  DoubleSidebarGroup,
  DoubleSidebarHeader,
  DoubleSidebarMenu,
  DoubleSidebarMenuButton,
  DoubleSidebarMenuItem,
} from '@/components/ui/double-sidebar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import * as React from 'react';

const AppSidebar = ({ className, ...props }: React.ComponentProps<typeof DoubleSidebar>) => {
  return (
    <DoubleSidebar {...props} className={cn('z-30', className)}>
      <DoubleSidebarHeader className="h-(--header-height) border-b border-dashed">
        <DoubleSidebarMenu>
          <DoubleSidebarMenuItem>
            <div className="flex items-center justify-between gap-x-2">
              <DoubleSidebarMenuButton asChild>
                <Link href="/projects/everythingbox">
                  <Avatar className="border-border/50 aspect-square h-6 w-6 rounded-md border p-0.5">
                    <AvatarFallback>EB</AvatarFallback>
                  </Avatar>
                </Link>
              </DoubleSidebarMenuButton>
            </div>
          </DoubleSidebarMenuItem>
        </DoubleSidebarMenu>
      </DoubleSidebarHeader>
      <DoubleSidebarContent className="gap-y-0">
        <div>
          <CategoryItem category={COFFEE_PLACES} />
          <CategoryItem category={TOBACCONIST_PLACES} />
          <CategoryItem category={CHOPP_PLACES} />
          <CategoryItem category={BOOKSTORES_PLACES} />
        </div>
      </DoubleSidebarContent>
    </DoubleSidebar>
  );
};

const CategoryItem = ({ category }: { category: typeof COFFEE_PLACES }) => {
  return (
    <DoubleSidebarGroup>
      <DoubleSidebarMenuItem style={{ '--event-color': category.color } as React.CSSProperties}>
        <DoubleSidebarMenuButton asChild tooltip={category.title}>
          <Link href={`/projects/everythingbox/${category.title.toLowerCase()}`}>
            <span className="h-2 w-2 rounded-full bg-(--event-color)" />
            <span>{category.title}</span>
            {category.places.length}
          </Link>
        </DoubleSidebarMenuButton>
      </DoubleSidebarMenuItem>
    </DoubleSidebarGroup>
  );
};
export { AppSidebar };
