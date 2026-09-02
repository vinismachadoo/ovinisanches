import React from "react"
import { SiteHeader } from "@/components/site-header"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div data-slot="layout" className="flex flex-col">
      <SiteHeader />
      <main className="flex h-[calc(100svh-var(--main-nav-height))] w-screen flex-col">
        {children}
      </main>
    </div>
  )
}
