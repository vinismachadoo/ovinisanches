"use client"

import { Button } from "@/registry/default/ui/button"
import {
  DoubleSidebar,
  DoubleSidebarContent,
  DoubleSidebarInset,
  DoubleSidebarProvider,
  DoubleSidebarTrigger,
} from "@/components/ui/double-sidebar"
import { NumberInput } from "@/components/ui/number-input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/default/ui/tabs"
import { cn } from "@/lib/utils"
import { LayoutGrid, Trophy, Volleyball } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"
import * as React from "react"
import ReactCountryFlag from "react-country-flag"
import {
  calculateStandings,
  generateGroupMatches,
  getTeamByCode,
  worldCup2026Teams,
  type GroupMatch,
  type GroupStanding,
  type Team,
} from "../data/world-cup"
import { GroupCard } from "./groups-card"
import { KnockoutBracket } from "./knockout-stage"

const STORAGE_KEY = "world-cup-26-group-matches"

export function WorldCupSimulator() {
  // const [groupStandings, setGroupStandings] = React.useState<Record<string, GroupStanding[]>>({});
  const [activeTab, setActiveTab] = React.useState("groups")
  const [showMatchesGroup, setShowMatchesGroup] = useQueryState(
    "showMatches",
    parseAsString
  )

  const selectedGroup = showMatchesGroup || ""
  const groupMatches = getGroupMatches()
  const selectedGroupMatches = selectedGroup
    ? groupMatches[selectedGroup] || []
    : []

  // Calculate standings from localStorage
  const calculateStandingsFromStorage = React.useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, GroupMatch[]>
        const standings: Record<string, GroupStanding[]> = {}

        Object.entries(parsed).forEach(([groupName, confirmedMatches]) => {
          const teams = worldCup2026Teams[groupName]
          if (teams) {
            standings[groupName] = calculateStandings(teams, confirmedMatches)
          }
        })
        return standings
      }
      return {}
    } catch (error) {
      console.error("Error calculating standings from localStorage:", error)
      return {}
    }
  }, [])

  const groupStandings = calculateStandingsFromStorage()

  // Calculate standings on mount
  // React.useEffect(() => {
  //   calculateStandingsFromStorage();
  // }, [calculateStandingsFromStorage]);

  // Listen for match confirmations and recalculate standings
  React.useEffect(() => {
    const handleMatchConfirmed = () => {
      calculateStandingsFromStorage()
    }

    window.addEventListener(
      "match-confirmed",
      handleMatchConfirmed as EventListener
    )

    return () => {
      window.removeEventListener(
        "match-confirmed",
        handleMatchConfirmed as EventListener
      )
    }
  }, [calculateStandingsFromStorage])

  const allGroupsComplete =
    Object.keys(groupStandings).length === 12 &&
    Object.values(groupStandings).every(
      (standings) => standings.length > 0 && standings[0].played === 3
    )

  return (
    <DoubleSidebarProvider
      defaultOpenRight={false}
      defaultWidthRight="32rem"
      openRight={!!showMatchesGroup}
      onOpenChangeRight={(open) => {
        if (!open) {
          setShowMatchesGroup(null)
        }
      }}
      className="[--header-height:4rem]"
    >
      <DoubleSidebarInset className="h-[calc(100vh)] min-w-0">
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="sticky top-0 z-50 flex h-(--header-height) items-center border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center gap-x-4">
                  <h1 className="text-xl font-bold tracking-tight">
                    FIFA WORLD CUP
                  </h1>
                  <p className="text-xs tracking-widest text-muted-foreground">
                    USA • CANADA • MEXICO 2026
                  </p>
                </div>
              </div>
              <div></div>

              <DoubleSidebarTrigger side="right">
                <Volleyball className="h-5 w-5 text-muted-foreground" />
              </DoubleSidebarTrigger>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex flex-1">
            <DoubleSidebarInset
              className={cn("h-[calc(100vh-var(--header-height))] min-w-0")}
            >
              <main className="container mx-auto py-6 lg:px-10">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <TabsList>
                      <TabsTrigger value="groups">
                        <LayoutGrid className="h-4 w-4" />
                        <span className="hidden sm:inline">Group Stage</span>
                        <span className="sm:hidden">Groups</span>
                      </TabsTrigger>
                      <TabsTrigger value="knockout">
                        <Trophy className="h-4 w-4" />
                        <span className="hidden sm:inline">Knockout Stage</span>
                        <span className="sm:hidden">Knockout</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="groups" className="mt-0 space-y-6">
                    <div className="hidden flex-col items-start gap-y-2 text-xs text-muted-foreground md:flex">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="font-medium">Qualifies</span>
                        <span>(Top 2 teams of each group advance)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-yellow-500" />
                        <span className="font-medium">3rd Place</span>
                        <span>(Top 2 + best 8 third-place teams advance)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {Object.entries(worldCup2026Teams).map(
                        ([groupName, teams]) => {
                          const groupMatches = getGroupMatches()
                          const confirmedMatches =
                            groupMatches[groupName]?.filter(
                              (m) => m.confirmed
                            ) || []
                          return (
                            <GroupCard
                              key={groupName}
                              groupName={groupName}
                              teams={teams}
                              matches={confirmedMatches}
                            />
                          )
                        }
                      )}
                    </div>

                    {allGroupsComplete && (
                      <div className="py-6 text-center">
                        <Button
                          size="lg"
                          onClick={() => setActiveTab("knockout")}
                          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <Trophy className="h-5 w-5" />
                          Proceed to Knockout Stage
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="knockout" className="mt-0">
                    <div className="mb-8 text-center">
                      <h2 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">
                        KNOCKOUT STAGE
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Enter match scores to determine winners. In case of a
                        tie, enter the winner&apos;s score higher (after
                        penalties).
                      </p>
                    </div>

                    <KnockoutBracket groupStandings={groupStandings} />
                  </TabsContent>
                </Tabs>
              </main>

              {/* Footer */}
              <footer className="mt-12 border-t border-border py-6">
                <div className="container mx-auto text-center text-sm text-muted-foreground">
                  <p>
                    FIFA World Cup 2026 Simulator • Teams are illustrative and
                    may change
                  </p>
                </div>
              </footer>
            </DoubleSidebarInset>

            <DoubleSidebar
              side="right"
              className="top-(--header-height) z-30 h-[calc(100svh-var(--header-height))]!"
            >
              <DoubleSidebarContent className="gap-y-0 p-4">
                {selectedGroup && selectedGroupMatches.length > 0 ? (
                  <GroupMatches />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <p>Select a group to view matches</p>
                  </div>
                )}
              </DoubleSidebarContent>
            </DoubleSidebar>
          </div>
        </div>
      </DoubleSidebarInset>
    </DoubleSidebarProvider>
  )
}

const TeamFlag = ({ team }: { team: Team | undefined }) => {
  if (!team) return null
  if (team.isPlayoff) {
    return (
      <span className="flex h-4 w-6 items-center justify-center rounded bg-muted text-xs font-bold">
        ?
      </span>
    )
  }
  if (team.countryCode) {
    return (
      <ReactCountryFlag
        countryCode={team.countryCode}
        svg
        style={{
          width: "1.5em",
          height: "1.5em",
        }}
        title={team.name}
      />
    )
  }
  return null
}

const getGroupMatches = (): Record<string, GroupMatch[]> => {
  const saved = localStorage.getItem(STORAGE_KEY)

  const matches: Record<string, GroupMatch[]> = {}

  if (saved) {
    const parsed = JSON.parse(saved) as Record<string, GroupMatch[]>
    // Validate and merge with generated matches to ensure all groups exist
    Object.entries(worldCup2026Teams).forEach(([groupName, teams]) => {
      const savedMatches = parsed[groupName]
      if (savedMatches && Array.isArray(savedMatches)) {
        // Merge saved matches with generated structure to handle new matches
        const generated = generateGroupMatches(teams)
        const matchMap = new Map(
          savedMatches.map((m) => [
            m.id,
            {
              ...m,
              confirmed: true,
              // Normalize null values to 0 for backwards compatibility
              homeScore: m.homeScore ?? 0,
              awayScore: m.awayScore ?? 0,
            },
          ])
        )
        // Restore confirmed matches, and add unconfirmed generated matches
        matches[groupName] = generated.map((m) => {
          const savedMatch = matchMap.get(m.id)
          if (savedMatch) {
            return savedMatch // Use saved confirmed match
          }
          return m // Use new unconfirmed match
        })
      } else {
        matches[groupName] = generateGroupMatches(teams)
      }
    })
  } else {
    // Initialize matches for all groups if no saved data
    Object.entries(worldCup2026Teams).forEach(([groupName, teams]) => {
      matches[groupName] = generateGroupMatches(teams)
    })
  }
  return matches
}

const GroupMatches = () => {
  const [showMatchesGroup] = useQueryState("showMatches", parseAsString)

  const selectedGroup = showMatchesGroup || ""

  const groupMatches = getGroupMatches()
  const selectedGroupMatches = selectedGroup
    ? groupMatches[selectedGroup] || []
    : []

  return (
    <div className="flex flex-col items-center gap-y-4">
      <p className="text-lg font-bold tracking-wider">GROUP {selectedGroup}</p>

      <div className="flex w-full flex-col gap-y-2">
        {selectedGroupMatches.map((match) => (
          <SingleMatch key={match.id} match={match} />
        ))}
      </div>
    </div>
  )
}

const SingleMatch = ({ match }: { match: GroupMatch }) => {
  const [showMatchesGroup] = useQueryState("showMatches", parseAsString)
  const selectedGroup = showMatchesGroup || ""

  const saved = localStorage.getItem(STORAGE_KEY)
  const confirmedMatch = saved
    ? JSON.parse(saved)[selectedGroup]?.find(
        (m: GroupMatch) => m.id === match.id
      )
    : null

  // Local state for editing (not saved until confirmed)
  const [homeScore, setHomeScore] = React.useState<number>(
    confirmedMatch?.homeScore ?? match.homeScore ?? 0
  )
  const [awayScore, setAwayScore] = React.useState<number>(
    confirmedMatch?.awayScore ?? match.awayScore ?? 0
  )

  const home = getTeamByCode(match.homeTeam)
  const away = getTeamByCode(match.awayTeam)

  const localStorageResult =
    match.homeScore !== undefined && match.awayScore !== undefined
      ? `${match.homeScore}:${match.awayScore}`
      : ""
  const stateResult =
    homeScore !== undefined && awayScore !== undefined
      ? `${homeScore}:${awayScore}`
      : ""

  const isBothScoresSet = homeScore !== null && awayScore !== null

  const canConfirm = isBothScoresSet && localStorageResult !== stateResult
  const isConfirmed = isBothScoresSet && localStorageResult === stateResult

  const handleConfirm = () => {
    const matchToSave: GroupMatch = {
      ...match,
      homeScore,
      awayScore,
    }

    // Save to localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      const allMatches: Record<string, GroupMatch[]> = saved
        ? JSON.parse(saved)
        : {}

      if (!allMatches[selectedGroup]) {
        allMatches[selectedGroup] = []
      }

      // Remove old match if exists and add new confirmed match
      allMatches[selectedGroup] = allMatches[selectedGroup].filter(
        (m) => m.id !== match.id
      )
      allMatches[selectedGroup].push(matchToSave)

      localStorage.setItem(STORAGE_KEY, JSON.stringify(allMatches))

      // Dispatch custom event to notify parent to recalculate standings
      window.dispatchEvent(
        new CustomEvent("match-confirmed", {
          detail: { groupName: selectedGroup },
        })
      )
    } catch (error) {
      console.error("Error saving match to localStorage:", error)
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-3",
        isConfirmed
          ? "border-green-500/50 bg-green-500/10"
          : "border-border bg-muted/50"
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex w-20 min-w-0 flex-1 shrink-0 items-center justify-end gap-1.5">
          <span className="truncate text-sm font-medium">{home?.code}</span>
          <TeamFlag team={home} />
        </div>
        <NumberInput
          minValue={0}
          maxValue={20}
          value={homeScore}
          onChange={setHomeScore}
          className="w-32"
          aria-label="Home score"
        />
        <span className="text-sm text-muted-foreground">-</span>
        <NumberInput
          minValue={0}
          maxValue={20}
          value={awayScore}
          onChange={setAwayScore}
          className="w-32"
          aria-label="Away score"
        />
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <TeamFlag team={away} />
          <span className="truncate text-sm font-medium">{away?.code}</span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        {isConfirmed ? (
          <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400" />
            Confirmed
          </span>
        ) : (
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="h-7 text-xs"
            variant={canConfirm ? "default" : "outline"}
          >
            {isBothScoresSet ? "Confirm" : "Enter scores"}
          </Button>
        )}
      </div>
    </div>
  )
}
