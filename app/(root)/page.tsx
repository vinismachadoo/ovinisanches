import MotionSignature from '@/app/(root)/components/motion-signature';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  ListTree,
  MailIcon,
  MessageCircleMore,
  PackageOpen,
  ToyBrick,
  TwitterIcon,
} from 'lucide-react';

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
            <Skeleton className="size-full rounded-lg h-44" />

            <div className="relative size-fit -mt-24 ms-12">
              <Avatar className="size-40 after:hidden border-4 border-background bg-muted">
                <AvatarImage src="https://github.com/vinismachadoo.png" />
                {/* <AvatarFallback>VS</AvatarFallback> */}
              </Avatar>
            </div>

            <div className="size-full p-4 gap-y-6 flex flex-col">
              <div className="flex flex-wrap gap-2 [&_span]:text-2xl [&_span]:font-medium [&_span]:leading-none [&_span]:h-fit">
                <span>The</span>
                <span>agentic</span>
                <span>way</span>
                <span>of</span>
                <div className="flex items-center justify-center rounded-sm bg-sky-500/20 size-7 p-1">
                  <MessageCircleMore className="size-full text-sky-500" />
                </div>
                <span>thinking,</span>
                <div className="flex items-center justify-center rounded-sm bg-emerald-500/20 size-7 p-1">
                  <ToyBrick className="size-full text-emerald-500" />
                </div>
                <span>building,</span>
                <div className="flex items-center justify-center rounded-sm bg-yellow-500/20 size-7 p-1">
                  <PackageOpen className="size-full text-yellow-500" />
                </div>
                <span>shipping</span>
                <span>and</span>
                <div className="flex items-center justify-center rounded-sm bg-purple-500/20 size-7 p-1">
                  <ListTree className="size-full text-purple-500" />
                </div>
                <span>managing</span>
                <span>products.</span>
              </div>

              <div>
                <p className="text-2xl">
                  I solidify bridges between business, design and engineering teams with my expertise in product
                  development and product lifecycle.
                </p>
              </div>

              <div className="h-full border border-dashed rounded-sm"></div>

              <div>
                <p className="text-lg">
                  Product <span className="line-through decoration-rose-500/60 decoration-double text-lg">Manager</span>{' '}
                  Engineer based in Rio de Janeiro, Brazil.
                </p>
              </div>
            </div>

            <div id="contact" className="flex items-center w-full justify-center gap-x-3 **:extend-touch-target">
              <Button variant="outline" size="icon-sm">
                <MailIcon />
              </Button>

              <Button variant="outline" size="icon-sm">
                <LinkedinIcon />
              </Button>

              <Button variant="outline" size="icon-sm">
                <GithubIcon />
              </Button>

              <Button variant="outline" size="icon-sm">
                <InstagramIcon />
              </Button>

              <Button variant="outline" size="icon-sm">
                <TwitterIcon />
              </Button>
            </div>
          </div>

          <div>
            <MotionSignature />
          </div>
        </div>

        <div className="size-full bg-muted rounded-lg flex flex-col items-center justify-center text-muted-foreground">
          Soon...
        </div>
      </div>
    </div>
  );
}
