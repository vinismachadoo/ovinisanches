'use client';

import { Button } from '@/components/ui/button';
import {
  DoubleSidebar,
  DoubleSidebarContent,
  DoubleSidebarInset,
  DoubleSidebarProvider,
  DoubleSidebarTrigger,
} from '@/components/ui/double-sidebar';
import { NumberInput } from '@/components/ui/number-input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { LayoutGrid, Trophy, Volleyball, X } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useCallback, useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import {
  calculateStandings,
  generateGroupMatches,
  getTeamByCode,
  worldCup2026Teams,
  type GroupMatch,
  type GroupStanding,
  type Team,
} from '../data/world-cup';
import { GroupCard } from './groups-card';
import { KnockoutBracket } from './knockout-stage';

export function WorldCupSimulator() {
  const [groupStandings, setGroupStandings] = useState<Record<string, GroupStanding[]>>({});
  const [activeTab, setActiveTab] = useState('groups');
  const [showMatchesGroup, setShowMatchesGroup] = useQueryState('showMatches', parseAsString);
  const [groupMatches, setGroupMatches] = useState<Record<string, GroupMatch[]>>({});
  const [openRight, setOpenRight] = useState(false);

  // Initialize matches for all groups
  useEffect(() => {
    const matches: Record<string, GroupMatch[]> = {};
    Object.entries(worldCup2026Teams).forEach(([groupName, teams]) => {
      matches[groupName] = generateGroupMatches(teams);
    });
    setGroupMatches(matches);
  }, []);

  // Open/close sidebar based on URL parameter
  useEffect(() => {
    setOpenRight(!!showMatchesGroup);
  }, [showMatchesGroup]);

  const handleStandingsChange = useCallback((groupName: string, standings: GroupStanding[]) => {
    setGroupStandings((prev) => ({ ...prev, [groupName]: standings }));
  }, []);

  const handleMatchesChange = useCallback(
    (groupName: string, matches: GroupMatch[]) => {
      setGroupMatches((prev) => ({ ...prev, [groupName]: matches }));
      // Recalculate standings when matches change
      const teams = worldCup2026Teams[groupName];
      const standings = calculateStandings(teams, matches);
      handleStandingsChange(groupName, standings);
    },
    [handleStandingsChange]
  );

  const updateScore = useCallback(
    (groupName: string, matchId: string, isHome: boolean, value: number) => {
      const score = value === 0 ? null : value;
      setGroupMatches((prev) => {
        const groupMatches = prev[groupName] || [];
        const updatedMatches = groupMatches.map((m) =>
          m.id === matchId ? { ...m, [isHome ? 'homeScore' : 'awayScore']: score } : m
        );
        // Recalculate standings when matches change
        const teams = worldCup2026Teams[groupName];
        const standings = calculateStandings(teams, updatedMatches);
        handleStandingsChange(groupName, standings);
        return { ...prev, [groupName]: updatedMatches };
      });
    },
    [handleStandingsChange]
  );

  const allGroupsComplete =
    Object.keys(groupStandings).length === 12 &&
    Object.values(groupStandings).every((standings) => standings.length > 0 && standings[0].played === 3);

  const selectedGroup = showMatchesGroup || '';
  const selectedGroupMatches = selectedGroup ? groupMatches[selectedGroup] || [] : [];

  const TeamFlag = ({ team }: { team: Team | undefined }) => {
    if (!team) return null;
    if (team.isPlayoff) {
      return <span className="flex items-center justify-center w-6 h-4 bg-muted rounded text-xs font-bold">?</span>;
    }
    if (team.countryCode) {
      return (
        <ReactCountryFlag
          countryCode={team.countryCode}
          svg
          style={{
            width: '1.5em',
            height: '1.5em',
          }}
          title={team.name}
        />
      );
    }
    return null;
  };

  return (
    <DoubleSidebarProvider
      defaultOpenRight={false}
      defaultWidthRight="32rem"
      openRight={openRight}
      onOpenChangeRight={(open) => {
        setOpenRight(open);
        if (!open) {
          setShowMatchesGroup(null);
        }
      }}
      className="[--header-height:4rem]"
    >
      <DoubleSidebarInset className="h-[calc(100vh)] min-w-0">
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 flex items-center h-(--header-height)">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div className="flex gap-x-4 items-center">
                  <h1 className="text-xl font-bold tracking-tight">FIFA WORLD CUP</h1>
                  <p className="text-xs text-muted-foreground tracking-widest">USA • CANADA • MEXICO 2026</p>
                </div>
              </div>
              <div></div>

              <DoubleSidebarTrigger side="right">
                <Volleyball className="w-5 h-5 text-muted-foreground" />
              </DoubleSidebarTrigger>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex flex-1">
            <DoubleSidebarInset className={cn('h-[calc(100vh-var(--header-height))] min-w-0')}>
              <main className="container mx-auto py-6 lg:px-10">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <TabsList>
                      <TabsTrigger value="groups">
                        <LayoutGrid className="w-4 h-4" />
                        <span className="hidden sm:inline">Group Stage</span>
                        <span className="sm:hidden">Groups</span>
                      </TabsTrigger>
                      <TabsTrigger value="knockout">
                        <Trophy className="w-4 h-4" />
                        <span className="hidden sm:inline">Knockout Stage</span>
                        <span className="sm:hidden">Knockout</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="groups" className="space-y-6 mt-0">
                    <div className="hidden md:flex items-start gap-y-2 text-xs text-muted-foreground flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="font-medium">Qualifies</span>
                        <span>(Top 2 teams of each group advance)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span className="font-medium">3rd Place</span>
                        <span>(Top 2 + best 8 third-place teams advance)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(worldCup2026Teams).map(([groupName, teams]) => (
                        <GroupCard
                          key={groupName}
                          groupName={groupName}
                          teams={teams}
                          matches={groupMatches[groupName] || generateGroupMatches(teams)}
                          onMatchesChange={(matches) => handleMatchesChange(groupName, matches)}
                          onStandingsChange={handleStandingsChange}
                        />
                      ))}
                    </div>

                    {allGroupsComplete && (
                      <div className="text-center py-6">
                        <Button
                          size="lg"
                          onClick={() => setActiveTab('knockout')}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                        >
                          <Trophy className="w-5 h-5" />
                          Proceed to Knockout Stage
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="knockout" className="mt-0">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">KNOCKOUT STAGE</h2>
                      <p className="text-muted-foreground text-sm">
                        Enter match scores to determine winners. In case of a tie, enter the winner&apos;s score higher
                        (after penalties).
                      </p>
                    </div>

                    <KnockoutBracket groupStandings={groupStandings} />
                  </TabsContent>
                </Tabs>
              </main>

              {/* Footer */}
              <footer className="border-t border-border mt-12 py-6">
                <div className="container mx-auto text-center text-sm text-muted-foreground">
                  <p>FIFA World Cup 2026 Simulator • Teams are illustrative and may change</p>
                </div>
              </footer>
            </DoubleSidebarInset>

            <DoubleSidebar side="right" className="h-[calc(100svh-var(--header-height))]! top-(--header-height) z-30">
              <DoubleSidebarContent className="gap-y-0 p-4">
                {selectedGroup && selectedGroupMatches.length > 0 ? (
                  <div className="flex flex-col gap-y-4 items-center">
                    <p className="text-lg font-bold tracking-wider">GROUP {selectedGroup}</p>

                    <div className="flex flex-col gap-y-2">
                      {selectedGroupMatches.map((match) => {
                        const home = getTeamByCode(match.homeTeam);
                        const away = getTeamByCode(match.awayTeam);
                        return (
                          <div key={match.id} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-1.5 flex-1 justify-end min-w-0 w-20 shrink-0">
                              <span className="text-sm font-medium truncate">{home?.code}</span>
                              <TeamFlag team={home} />
                            </div>
                            <NumberInput
                              minValue={0}
                              maxValue={20}
                              value={match.homeScore ?? 0}
                              onChange={(value) => updateScore(selectedGroup, match.id, true, value)}
                              className="w-32"
                            />
                            <span className="text-muted-foreground text-sm">-</span>
                            <NumberInput
                              minValue={0}
                              maxValue={20}
                              value={match.awayScore ?? 0}
                              onChange={(value) => updateScore(selectedGroup, match.id, false, value)}
                              className="w-32"
                            />
                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                              <TeamFlag team={away} />
                              <span className="text-sm font-medium truncate">{away?.code}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>Select a group to view matches</p>
                  </div>
                )}
              </DoubleSidebarContent>
            </DoubleSidebar>
          </div>
        </div>
      </DoubleSidebarInset>
    </DoubleSidebarProvider>
  );
}
