import About from "@/app/(root)/components/about"
import ProfileSidebar from "@/app/(root)/components/profile-sidebar"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <div className="flex h-full w-full flex-col items-center [--sidebar-profile:--spacing(140)]">
      <div
        className={cn(
          "mx-auto flex max-w-5xl flex-col border-x py-6",
          "min-h-min w-full flex-1 items-start gap-x-6 px-0"
        )}
      >
        {/* <ProfileSidebar /> */}
        <About />
      </div>
    </div>
  )
}
