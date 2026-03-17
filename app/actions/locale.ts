"use server"

import { cookies } from "next/headers"

const LOCALE_COOKIE = "locale"
const MAX_AGE = 31536000 // 1 year

export async function setLocaleCookie(locale: string) {
  const store = await cookies()
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: MAX_AGE,
    sameSite: "lax",
  })
}
