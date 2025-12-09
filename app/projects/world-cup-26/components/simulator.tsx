'use client';

import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Users, LayoutGrid } from 'lucide-react';
import { GroupCard } from './groups-card';
import { KnockoutBracket } from './knockout-phase';
import { worldCup2026Teams, type GroupStanding } from '../data/world-cup';

export function WorldCupSimulator() {
  const [groupStandings, setGroupStandings] = useState<Record<string, GroupStanding[]>>({});
  const [activeTab, setActiveTab] = useState('groups');

  const handleStandingsChange = useCallback((groupName: string, standings: GroupStanding[]) => {
    setGroupStandings((prev) => ({ ...prev, [groupName]: standings }));
  }, []);

  const allGroupsComplete =
    Object.keys(groupStandings).length === 12 &&
    Object.values(groupStandings).every((standings) => standings.length > 0 && standings[0].played === 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">FIFA WORLD CUP</h1>
                <p className="text-xs text-muted-foreground tracking-widest">USA • CANADA • MEXICO 2026</p>
              </div>
            </div>
            <Badge variant="outline" className="hidden sm:flex gap-1 text-xs">
              <Users className="w-3 h-3" />
              48 TEAMS
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
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
            <div className="text-center mb-8 flex flex-col items-center gap-y-4">
              <p className="text-2xl md:text-3xl font-bold tracking-tight">GROUP STAGE</p>
              <p className="text-muted-foreground text-sm">
                Click &quot;MATCHES&quot; on each group to enter scores. Top 2 + best 8 third-place teams advance.
              </p>
              <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  Qualifies
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  3rd Place
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.entries(worldCup2026Teams).map(([groupName, teams]) => (
                <GroupCard
                  key={groupName}
                  groupName={groupName}
                  teams={teams}
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
                Enter match scores to determine winners. In case of a tie, enter the winner&apos;s score higher (after
                penalties).
              </p>
            </div>

            <KnockoutBracket groupStandings={groupStandings} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>FIFA World Cup 2026 Simulator • Teams are illustrative and may change</p>
        </div>
      </footer>
    </div>
  );
}
