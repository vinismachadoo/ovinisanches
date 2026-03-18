import { NextResponse } from "next/server"
import { fetchDataForAllYears } from "@/lib/github"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get("username") || "vinismachadoo"
    const years = searchParams.get("years")?.split(",") || []

    const data = await fetchDataForAllYears(username, "flat", years)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[github-activity] Error fetching data:", error)
    return NextResponse.json(
      { error: "Failed to fetch GitHub activity data." },
      { status: 500 }
    )
  }
}
