import MotionSignature from "@/app/(root)/components/motion-signature"
import Presentation from "@/app/(root)/components/presentation"
import SocialNetworks from "@/app/(root)/components/social-networks"
import { Avatar, AvatarImage } from "@/registry/default/ui/avatar"
import { Badge } from "@/registry/default/ui/badge"
import { Label } from "@/registry/default/ui/label"
import { Skeleton } from "@/registry/default/ui/skeleton"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-10 [--sidebar-profile:calc(var(--spacing)*140)]">
      {/* <Image src="/rio-isometric.png" alt="Logo" width={500} height={500} /> */}

      <div
        className={cn(
          "grid grid-cols-[var(--sidebar-profile)_minmax(0,1fr)]",
          "min-h-min w-full flex-1 items-start gap-x-6 px-0"
        )}
      >
        <div className="flex size-full flex-col items-center justify-between">
          <div className="flex size-full flex-col gap-y-3">
            <div className="relative size-full h-44 overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1762503203666-1f188d6f6a0a?q=80&w=2083&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Photo by mymind on Unsplash"
                title="Photo by mymind on Unsplash"
                className="size-full object-cover brightness-140 grayscale dark:brightness-50"
              />
              <div className="absolute inset-0 bg-lime-500 opacity-50 mix-blend-color" />
            </div>

            <div className="relative ms-12 flex gap-x-6">
              <Avatar className="-mt-16 size-40 border-4 border-background bg-muted after:hidden">
                <AvatarImage src="https://github.com/vinismachadoo.png" />
                {/* <AvatarFallback>VS</AvatarFallback> */}
              </Avatar>

              <div className="flex flex-col gap-y-1">
                <p className="text-lg font-medium">Vinicius Sanches Machado</p>
                <Badge className="border border-green-400 bg-green-50 text-green-500 dark:bg-green-950 dark:text-green-300">
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

        <div className="flex size-full flex-col rounded-lg">
          <div className="flex flex-col gap-y-4">
            <Label className="text-base">Projects</Label>
            <div className="grid w-full grid-cols-5 gap-4 *:rounded-lg">
              <Skeleton className="flex h-40 items-center justify-center">
                labs
              </Skeleton>
              <Skeleton className="flex h-40 items-center justify-center">
                motionvg
              </Skeleton>
              <Skeleton className="flex h-40 items-center justify-center">
                presentcn
              </Skeleton>
              <Skeleton className="flex h-40 items-center justify-center">
                json-forms
              </Skeleton>
              <Skeleton className="flex h-40 items-center justify-center">
                charttier
              </Skeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
