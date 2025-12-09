'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NumberInput } from '@/components/ui/number-input';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import {
  type GroupMatch,
  type GroupStanding,
  type Team,
  calculateStandings,
  generateGroupMatches,
  getTeamByCode,
} from '../data/world-cup';

interface GroupCardProps {
  groupName: string;
  teams: Team[];
  onStandingsChange: (groupName: string, standings: GroupStanding[]) => void;
}

export function GroupCard({ groupName, teams, onStandingsChange }: GroupCardProps) {
  const [matches, setMatches] = useState<GroupMatch[]>(() => generateGroupMatches(teams));
  const [standings, setStandings] = useState<GroupStanding[]>([]);
  const [showMatches, setShowMatches] = useState(false);

  useEffect(() => {
    const newStandings = calculateStandings(teams, matches);
    setStandings(newStandings);
    onStandingsChange(groupName, newStandings);
  }, [matches, teams, groupName, onStandingsChange]);

  const updateScore = (matchId: string, isHome: boolean, value: string) => {
    const score = value === '' ? null : Math.max(0, Number.parseInt(value) || 0);
    setMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, [isHome ? 'homeScore' : 'awayScore']: score } : m))
    );
  };

  const getTeam = (code: string) => getTeamByCode(code);

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
    <Card className="bg-card border-border overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold tracking-wider">GROUP {groupName}</CardTitle>
          <Button onClick={() => setShowMatches(!showMatches)} className="text-xs">
            {showMatches ? 'STANDINGS' : 'MATCHES'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {!showMatches ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">#</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">TEAM</th>
                  <th className="text-center py-2 px-2 font-medium text-muted-foreground">P</th>
                  <th className="text-center py-2 px-2 font-medium text-muted-foreground">W</th>
                  <th className="text-center py-2 px-2 font-medium text-muted-foreground">D</th>
                  <th className="text-center py-2 px-2 font-medium text-muted-foreground">L</th>
                  <th className="text-center py-2 px-2 font-medium text-muted-foreground">GD</th>
                  <th className="text-center py-2 px-3 font-medium text-muted-foreground">PTS</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((s, idx) => {
                  const team = getTeam(s.team);
                  const qualified = idx < 2;
                  const thirdPlace = idx === 2;
                  return (
                    <tr
                      key={s.team}
                      className={`border-b border-border/50 transition-colors ${
                        qualified ? 'bg-green-500/10' : thirdPlace ? 'bg-yellow-500/10' : ''
                      }`}
                    >
                      <td className="py-2 px-3">
                        <span
                          className={cn(
                            'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                            qualified ? 'bg-green-500' : thirdPlace ? 'bg-yellow-500' : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <TeamFlag team={team} />
                          <span className="font-medium">{team?.code}</span>
                        </div>
                      </td>
                      <td className="text-center py-2 px-2 text-muted-foreground">{s.played}</td>
                      <td className="text-center py-2 px-2 text-muted-foreground">{s.won}</td>
                      <td className="text-center py-2 px-2 text-muted-foreground">{s.drawn}</td>
                      <td className="text-center py-2 px-2 text-muted-foreground">{s.lost}</td>
                      <td className="text-center py-2 px-2">
                        <span
                          className={
                            s.goalDifference > 0
                              ? 'text-green-500'
                              : s.goalDifference < 0
                              ? 'text-red-500'
                              : 'text-muted-foreground'
                          }
                        >
                          {s.goalDifference > 0 ? '+' : ''}
                          {s.goalDifference}
                        </span>
                      </td>
                      <td className="text-center py-2 px-3">
                        <span className="font-bold">{s.points}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {matches.map((match) => {
              const home = getTeam(match.homeTeam);
              const away = getTeam(match.awayTeam);
              return (
                <div key={match.id} className="flex items-center gap-2 p-2 rounded bg-muted/30">
                  <div className="flex items-center gap-1.5 flex-1 justify-end">
                    <span className="text-xs font-medium">{home?.code}</span>
                    <TeamFlag team={home} />
                  </div>
                  <NumberInput
                    minValue={0}
                    maxValue={20}
                    value={match.homeScore ?? 0}
                    onChange={(value) => updateScore(match.id, true, value.toString())}
                  />
                  <span className="text-muted-foreground text-xs">-</span>
                  <NumberInput
                    minValue={0}
                    maxValue={20}
                    value={match.awayScore ?? 0}
                    onChange={(value) => updateScore(match.id, false, value.toString())}
                  />
                  <div className="flex items-center gap-1.5 flex-1">
                    <TeamFlag team={away} />
                    <span className="text-xs font-medium">{away?.code}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
