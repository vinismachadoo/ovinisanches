"use client"

import MotionSignature from "@/components/motion-signature"
import { Map, MapMarker, MarkerContent } from "@/components/ui/map"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/default/ui/button"
import {
  Check,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  ListTree,
  MailIcon,
  MessageCircleMore,
  PackageOpen,
  ToyBrick,
  TwitterIcon,
} from "lucide-react"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { toast } from "sonner"
import { Avatar, AvatarImage } from "@/registry/default/ui/avatar"
import { Badge } from "@/registry/default/ui/badge"

const RIO_DE_JANEIRO_CENTER = [-43.2104764711645, -22.95194069864799] as [
  number,
  number,
]

const ProfileSidebar = () => {
  const t = useTranslations("home-page.sidebar")

  return (
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
              {t("open-to-work")}
            </Badge>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex size-full flex-col gap-y-6 p-2"
        >
          <div className="flex flex-wrap gap-2 [&_span]:h-7 [&_span]:text-2xl [&_span]:leading-none [&_span]:font-medium">
            {t("headline")
              .split(" ")
              .map((word, index) => {
                switch (word) {
                  case "[icon-1]":
                    return (
                      <div
                        key={index}
                        className="flex size-7 items-center justify-center rounded-sm bg-sky-500/20 p-1"
                      >
                        <MessageCircleMore className="size-full text-sky-500" />
                      </div>
                    )
                  case "[icon-2]":
                    return (
                      <div
                        key={index}
                        className="flex size-7 items-center justify-center rounded-sm bg-pink-500/20 p-1"
                      >
                        <ToyBrick className="size-full text-pink-500" />
                      </div>
                    )
                  case "[icon-3]":
                    return (
                      <div
                        key={index}
                        className="flex size-7 items-center justify-center rounded-sm bg-yellow-500/20 p-1"
                      >
                        <PackageOpen className="size-full text-yellow-500" />
                      </div>
                    )
                  case "[icon-4]":
                    return (
                      <div
                        key={index}
                        className="flex size-7 items-center justify-center rounded-sm bg-purple-500/20 p-1"
                      >
                        <ListTree className="size-full text-purple-500" />
                      </div>
                    )
                  default:
                    return <span key={index}>{word}</span>
                }
              })}
          </div>

          <div className="flex flex-wrap gap-2 [&_span]:h-7 [&_span]:text-xl [&_span]:leading-none">
            {t("description")
              .split(" ")
              .map((word, index) => (
                <span key={index}>{word}</span>
              ))}
          </div>

          <Map
            center={RIO_DE_JANEIRO_CENTER}
            zoom={10}
            className="size-full rounded-sm"
          >
            <MapMarker
              longitude={RIO_DE_JANEIRO_CENTER[0]}
              latitude={RIO_DE_JANEIRO_CENTER[1]}
            >
              <MarkerContent>
                <div
                  className="group/marker relative flex items-center justify-center"
                  style={
                    {
                      "--trending-size": 0.5,
                      "--marker-color":
                        "oklch(calc(0.7 + (0.3 - 0.7) * var(--trending-size)) 0.214 259.815)",
                    } as React.CSSProperties
                  }
                >
                  <div className="pointer-events-none absolute size-14 animate-ping rounded-full bg-(--marker-color)/30 duration-300" />

                  <div
                    className={cn(
                      "size-4 cursor-pointer rounded-full border-2 border-white/50 bg-(--marker-color) shadow-lg transition-transform group-hover/marker:scale-110"
                    )}
                  />
                </div>
              </MarkerContent>
            </MapMarker>
          </Map>

          <div className="flex flex-col gap-y-2">
            <span className="text-lg">{t("role")}</span>
            <span className="text-base text-muted-foreground">
              {t("footer")}
            </span>
          </div>
        </motion.div>

        <SocialNetworks />
      </div>

      <div>
        <MotionSignature />
      </div>
    </div>
  )
}

const SocialNetworks = () => {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  const email = "vinismachado@gmail.com"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex w-full items-center justify-center gap-x-3 **:extend-touch-target"
    >
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => {
          copyToClipboard(email)
          toast.success(`Email '${email}' copied to clipboard`, {
            position: "top-center",
          })
        }}
      >
        {isCopied ? <Check /> : <MailIcon />}
      </Button>

      <Button
        variant="outline"
        size="icon-sm"
        render={
          <Link
            href="https://www.linkedin.com/in/vinismachadoo/"
            target="_blank"
            rel="noopener noreferrer"
          />
        }
        nativeButton={false}
      >
        <LinkedinIcon />
      </Button>

      <Button
        variant="outline"
        size="icon-sm"
        render={
          <Link
            href="https://github.com/vinismachadoo"
            target="_blank"
            rel="noopener noreferrer"
          />
        }
        nativeButton={false}
      >
        <GithubIcon />
      </Button>

      <Button
        variant="outline"
        size="icon-sm"
        render={
          <Link
            href="https://www.instagram.com/ovinisanches"
            target="_blank"
            rel="noopener noreferrer"
          />
        }
        nativeButton={false}
      >
        <InstagramIcon />
      </Button>

      <Button
        variant="outline"
        size="icon-sm"
        render={
          <Link
            href="https://x.com/ovinisanches"
            target="_blank"
            rel="noopener noreferrer"
          />
        }
        nativeButton={false}
      >
        <TwitterIcon />
      </Button>
    </motion.div>
  )
}

export default ProfileSidebar
