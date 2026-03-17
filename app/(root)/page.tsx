import About from "@/app/(root)/components/about"
import Presentation from "@/app/(root)/components/presentation"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6 [--sidebar-profile:calc(var(--spacing)*140)]">
      {/* <Image src="/rio-isometric.png" alt="Logo" width={500} height={500} /> */}

      <div
        className={cn(
          "grid grid-cols-[var(--sidebar-profile)_minmax(0,1fr)]",
          "min-h-min w-full flex-1 items-start gap-x-6 px-0"
        )}
      >
        <Presentation />
        <About />
      </div>
    </div>
  )
}
