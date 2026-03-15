'use client';

import { Button } from '@/registry/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/card';
import { cn } from '@/lib/utils';
import { parseAsString, useQueryState } from 'nuqs';
import { CircleFlag } from 'react-circle-flags';
import { type GroupMatch, type Team, calculateStandings, getTeamByCode } from '../data/world-cup';
interface GroupCardProps {
  groupName: string;
  teams: Team[];
  matches: GroupMatch[];
}

export function GroupCard({ groupName, teams, matches }: GroupCardProps) {
  const [showMatchesGroup, setShowMatchesGroup] = useQueryState('showMatches', parseAsString);
  const showMatches = showMatchesGroup === groupName;

  const standings = calculateStandings(teams, matches);

  const getTeam = (code: string) => getTeamByCode(code);

  // Calculate match count (only confirmed matches)
  const confirmedMatches = matches.filter((m) => m.confirmed).length;
  const totalMatches = matches.length;
  const matchCountText = `${confirmedMatches}/${totalMatches}`;

  const TeamFlag = ({ team }: { team: Team | undefined }) => {
    if (!team) return null;
    if (team.isPlayoff) {
      return <span className="flex items-center justify-center w-6 h-4 bg-muted rounded text-xs font-bold">?</span>;
    }
    if (team.countryCode) {
      return <CircleFlag countryCode={team.countryCode} className="size-5" />;
    }
    return null;
  };

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold tracking-wider">GROUP {groupName}</CardTitle>
          <Button
            onClick={() => {
              if (showMatches) {
                setShowMatchesGroup(null);
              } else {
                setShowMatchesGroup(groupName);
              }
            }}
            className="text-xs"
            variant={showMatches ? 'default' : 'outline'}
          >
            PARTIDAS {matchCountText}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-center py-2 px-3 font-medium text-muted-foreground">#</th>
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
                    <td className="py-2 px-3 flex items-center justify-center">
                      <span
                        className={cn(
                          'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                          qualified ? 'bg-green-500' : thirdPlace ? 'bg-yellow-500' : 'bg-muted text-muted-foreground',
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
      </CardContent>
    </Card>
  );
}
