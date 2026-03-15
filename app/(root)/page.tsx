import MotionSignature from '@/app/(root)/components/motion-signature';
import Presentation from '@/app/(root)/components/presentation';
import SocialNetworks from '@/app/(root)/components/social-networks';
import { Avatar, AvatarImage } from '@/registry/avatar';
import { Badge } from '@/registry/badge';
import { Label } from '@/registry/label';
import { Skeleton } from '@/registry/skeleton';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-10 [--sidebar-profile:calc(var(--spacing)*140)]">
      {/* <Image src="/rio-isometric.png" alt="Logo" width={500} height={500} /> */}
      {/* <MainCommandMenuTrigger /> */}

      <div
        className={cn(
          'grid grid-cols-[var(--sidebar-profile)_minmax(0,1fr)]',
          'min-h-min flex-1 items-start px-0 w-full gap-x-6',
        )}
      >
        <div className="size-full flex flex-col items-center justify-between">
          <div className="flex flex-col size-full gap-y-3">
            <div className="relative size-full rounded-lg h-44 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1762503203666-1f188d6f6a0a?q=80&w=2083&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Photo by mymind on Unsplash"
                title="Photo by mymind on Unsplash"
                className="size-full object-cover brightness-140 dark:brightness-50 grayscale"
              />
              <div className="absolute inset-0 bg-lime-500 opacity-50 mix-blend-color" />
            </div>

            <div className="relative ms-12 flex gap-x-6">
              <Avatar className="size-40 -mt-16 after:hidden border-4 border-background bg-muted">
                <AvatarImage src="https://github.com/vinismachadoo.png" />
                {/* <AvatarFallback>VS</AvatarFallback> */}
              </Avatar>

              <div className="flex flex-col gap-y-1">
                <p className="text-lg font-medium">Vinicius Sanches Machado</p>
                <Badge className="bg-green-50 text-green-500 dark:bg-green-950 dark:text-green-300 border border-green-400">
                  Open to work
                </Badge>
              </div>
            </div>

            <Presentation />

            <SocialNetworks />
          </div>

          <div>
            <MotionSignature />
          </div>
        </div>

        <div className="size-full rounded-lg flex flex-col">
          <div className="flex flex-col gap-y-4">
            <Label className="text-base">Projects</Label>
            <div className="w-full grid grid-cols-5 gap-4 *:rounded-lg">
              <Skeleton className="h-40 flex items-center justify-center">labs</Skeleton>
              <Skeleton className="h-40 flex items-center justify-center">motionvg</Skeleton>
              <Skeleton className="h-40 flex items-center justify-center">presentx-ui</Skeleton>
              <Skeleton className="h-40 flex items-center justify-center">json-forms</Skeleton>
              <Skeleton className="h-40 flex items-center justify-center">charttier</Skeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
