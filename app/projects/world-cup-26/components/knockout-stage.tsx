'use client';

import { useState, useEffect, useCallback } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trophy, ChevronRight } from 'lucide-react';
import { type Team, type GroupStanding, getTeamByCode } from '../data/world-cup';

interface KnockoutTeam {
  code: string | null;
  score: number | null;
}

interface KnockoutMatchData {
  team1: KnockoutTeam;
  team2: KnockoutTeam;
}

interface KnockoutBracketProps {
  groupStandings: Record<string, GroupStanding[]>;
}

type RoundKey = 'r32' | 'r16' | 'qf' | 'sf' | 'final';

export function KnockoutBracket({ groupStandings }: KnockoutBracketProps) {
  const [r32, setR32] = useState<KnockoutMatchData[]>(
    Array(16)
      .fill(null)
      .map(() => ({
        team1: { code: null, score: null },
        team2: { code: null, score: null },
      }))
  );
  const [r16, setR16] = useState<KnockoutMatchData[]>(
    Array(8)
      .fill(null)
      .map(() => ({
        team1: { code: null, score: null },
        team2: { code: null, score: null },
      }))
  );
  const [qf, setQf] = useState<KnockoutMatchData[]>(
    Array(4)
      .fill(null)
      .map(() => ({
        team1: { code: null, score: null },
        team2: { code: null, score: null },
      }))
  );
  const [sf, setSf] = useState<KnockoutMatchData[]>(
    Array(2)
      .fill(null)
      .map(() => ({
        team1: { code: null, score: null },
        team2: { code: null, score: null },
      }))
  );
  const [final, setFinal] = useState<KnockoutMatchData>({
    team1: { code: null, score: null },
    team2: { code: null, score: null },
  });
  const [champion, setChampion] = useState<string | null>(null);

  // Get qualified teams from groups
  const getQualifiedTeams = useCallback(() => {
    const groups = Object.keys(groupStandings).sort();
    const qualified: { group: string; position: number; team: GroupStanding }[] = [];

    groups.forEach((group) => {
      const standings = groupStandings[group];
      if (standings && standings.length >= 2) {
        qualified.push({ group, position: 1, team: standings[0] });
        qualified.push({ group, position: 2, team: standings[1] });
      }
    });

    // Get best 3rd place teams (8 of them)
    const thirdPlace: { group: string; team: GroupStanding }[] = [];
    groups.forEach((group) => {
      const standings = groupStandings[group];
      if (standings && standings.length >= 3) {
        thirdPlace.push({ group, team: standings[2] });
      }
    });

    thirdPlace.sort((a, b) => {
      if (b.team.points !== a.team.points) return b.team.points - a.team.points;
      if (b.team.goalDifference !== a.team.goalDifference) return b.team.goalDifference - a.team.goalDifference;
      return b.team.goalsFor - a.team.goalsFor;
    });

    const bestThird = thirdPlace.slice(0, 8);

    return { qualified, bestThird };
  }, [groupStandings]);

  // Generate R32 matchups based on group standings
  useEffect(() => {
    const { qualified, bestThird } = getQualifiedTeams();
    if (qualified.length < 24 || bestThird.length < 8) return;

    // Create R32 bracket: 1st vs 3rd, 2nd vs 2nd from different groups
    const newR32: KnockoutMatchData[] = Array(16)
      .fill(null)
      .map(() => ({
        team1: { code: null, score: null },
        team2: { code: null, score: null },
      }));

    // Match 1st place teams with best 3rd place teams
    const firstPlace = qualified.filter((q) => q.position === 1);
    const secondPlace = qualified.filter((q) => q.position === 2);

    for (let i = 0; i < 8; i++) {
      if (firstPlace[i] && bestThird[7 - i]) {
        newR32[i] = {
          team1: { code: firstPlace[i].team.team, score: null },
          team2: { code: bestThird[7 - i].team.team, score: null },
        };
      }
    }

    // Match 2nd place teams with each other
    for (let i = 0; i < 8; i++) {
      if (secondPlace[i] && secondPlace[7 - i]) {
        newR32[8 + i] = {
          team1: { code: secondPlace[i].team.team, score: null },
          team2: { code: secondPlace[7 - i]?.team.team || null, score: null },
        };
      }
    }

    setR32(newR32);
  }, [groupStandings, getQualifiedTeams]);

  const getWinner = (match: KnockoutMatchData): string | null => {
    if (match.team1.score === null || match.team2.score === null) return null;
    if (match.team1.score > match.team2.score) return match.team1.code;
    if (match.team2.score > match.team1.score) return match.team2.code;
    return null; // Tie - need extra time/penalties
  };

  // Propagate winners through rounds
  useEffect(() => {
    const newR16 = r16.map((match, idx) => {
      const match1 = r32[idx * 2];
      const match2 = r32[idx * 2 + 1];
      return {
        team1: { code: getWinner(match1), score: match.team1.score },
        team2: { code: getWinner(match2), score: match.team2.score },
      };
    });
    setR16(newR16);
  }, [r32]);

  useEffect(() => {
    const newQf = qf.map((match, idx) => {
      const match1 = r16[idx * 2];
      const match2 = r16[idx * 2 + 1];
      return {
        team1: { code: getWinner(match1), score: match.team1.score },
        team2: { code: getWinner(match2), score: match.team2.score },
      };
    });
    setQf(newQf);
  }, [r16]);

  useEffect(() => {
    const newSf = sf.map((match, idx) => {
      const match1 = qf[idx * 2];
      const match2 = qf[idx * 2 + 1];
      return {
        team1: { code: getWinner(match1), score: match.team1.score },
        team2: { code: getWinner(match2), score: match.team2.score },
      };
    });
    setSf(newSf);
  }, [qf]);

  useEffect(() => {
    setFinal((prev) => ({
      team1: { code: getWinner(sf[0]) || null, score: prev.team1.score },
      team2: { code: getWinner(sf[1]) || null, score: prev.team2.score },
    }));
  }, [sf]);

  useEffect(() => {
    setChampion(getWinner(final));
  }, [final]);

  const updateScore = (round: RoundKey, matchIdx: number, isTeam1: boolean, value: string) => {
    const score = value === '' ? null : Math.max(0, Number.parseInt(value) || 0);

    const updateMatch = (matches: KnockoutMatchData[], idx: number) => {
      return matches.map((m, i) =>
        i === idx ? { ...m, [isTeam1 ? 'team1' : 'team2']: { ...m[isTeam1 ? 'team1' : 'team2'], score } } : m
      );
    };

    switch (round) {
      case 'r32':
        setR32((prev) => updateMatch(prev, matchIdx));
        break;
      case 'r16':
        setR16((prev) => updateMatch(prev, matchIdx));
        break;
      case 'qf':
        setQf((prev) => updateMatch(prev, matchIdx));
        break;
      case 'sf':
        setSf((prev) => updateMatch(prev, matchIdx));
        break;
      case 'final':
        setFinal((prev) => ({
          ...prev,
          [isTeam1 ? 'team1' : 'team2']: { ...prev[isTeam1 ? 'team1' : 'team2'], score },
        }));
        break;
    }
  };

  const TeamFlag = ({ team, size = 'base' }: { team: Team | null; size?: 'sm' | 'base' | 'lg' }) => {
    if (!team) {
      return <span className={size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-5xl' : 'text-base'}>❓</span>;
    }
    if (team.isPlayoff) {
      return (
        <span
          className={`${
            size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-5xl' : 'text-base'
          } flex items-center justify-center w-6 h-4 bg-muted rounded text-xs font-bold`}
        >
          ?
        </span>
      );
    }
    if (team.countryCode) {
      const flagSize = size === 'sm' ? '1em' : size === 'lg' ? '3em' : '1.5em';
      return (
        <ReactCountryFlag
          countryCode={team.countryCode}
          svg
          style={{
            width: flagSize,
            height: flagSize,
          }}
          title={team.name}
        />
      );
    }
    return <span className={size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-5xl' : 'text-base'}>❓</span>;
  };

  const MatchSlot = ({
    match,
    round,
    matchIdx,
    compact = false,
  }: {
    match: KnockoutMatchData;
    round: RoundKey;
    matchIdx: number;
    compact?: boolean;
  }) => {
    const team1 = match.team1.code ? getTeamByCode(match.team1.code) : null;
    const team2 = match.team2.code ? getTeamByCode(match.team2.code) : null;
    const winner = getWinner(match);

    return (
      <div className={`bg-card border border-border rounded ${compact ? 'text-xs' : 'text-sm'}`}>
        <div
          className={`flex items-center gap-2 p-2 border-b border-border/50 ${
            winner === match.team1.code ? 'bg-success/20' : ''
          }`}
        >
          <TeamFlag team={team1 ?? null} size={compact ? 'sm' : 'base'} />
          <span className="flex-1 font-medium truncate">{team1?.code || 'TBD'}</span>
          <Input
            type="number"
            min="0"
            max="20"
            value={match.team1.score ?? ''}
            onChange={(e) => updateScore(round, matchIdx, true, e.target.value)}
            className={`${compact ? 'w-8 h-6 text-xs' : 'w-10 h-7 text-sm'} text-center p-0 font-bold bg-background`}
            disabled={!team1}
          />
        </div>
        <div className={`flex items-center gap-2 p-2 ${winner === match.team2.code ? 'bg-success/20' : ''}`}>
          <TeamFlag team={team2 ?? null} size={compact ? 'sm' : 'base'} />
          <span className="flex-1 font-medium truncate">{team2?.code || 'TBD'}</span>
          <Input
            type="number"
            min="0"
            max="20"
            value={match.team2.score ?? ''}
            onChange={(e) => updateScore(round, matchIdx, false, e.target.value)}
            className={`${compact ? 'w-8 h-6 text-xs' : 'w-10 h-7 text-sm'} text-center p-0 font-bold bg-background`}
            disabled={!team2}
          />
        </div>
      </div>
    );
  };

  const championTeam = champion ? getTeamByCode(champion) : null;

  return (
    <div className="space-y-6">
      {/* Champion Display */}
      {champion && (
        <Card className="bg-gradient-to-r from-gold/20 via-accent/20 to-gold/20 border-gold/50">
          <CardContent className="p-6 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gold" />
            <h2 className="text-2xl font-bold mb-2">WORLD CHAMPION</h2>
            <div className="flex items-center justify-center gap-3">
              <TeamFlag team={championTeam ?? null} size="lg" />
              <span className="text-3xl font-bold">{championTeam?.name}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bracket */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[1200px]">
          <div className="grid grid-cols-9 gap-4 items-center">
            {/* R32 Left */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-muted-foreground mb-3 text-center">ROUND OF 32</h3>
              {r32.slice(0, 8).map((match, idx) => (
                <MatchSlot key={idx} match={match} round="r32" matchIdx={idx} compact />
              ))}
            </div>

            <div className="flex items-center justify-center">
              <ChevronRight className="text-muted-foreground" />
            </div>

            {/* R16 Left */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground mb-3 text-center">ROUND OF 16</h3>
              {r16.slice(0, 4).map((match, idx) => (
                <MatchSlot key={idx} match={match} round="r16" matchIdx={idx} compact />
              ))}
            </div>

            <div className="flex items-center justify-center">
              <ChevronRight className="text-muted-foreground" />
            </div>

            {/* QF + SF + Final */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-muted-foreground text-center">QUARTER-FINALS</h3>
              <div className="space-y-4">
                {qf.slice(0, 2).map((match, idx) => (
                  <MatchSlot key={idx} match={match} round="qf" matchIdx={idx} />
                ))}
              </div>
              <h3 className="text-xs font-bold text-muted-foreground text-center mt-6">SEMI-FINAL</h3>
              <MatchSlot match={sf[0]} round="sf" matchIdx={0} />

              <h3 className="text-xs font-bold text-primary text-center mt-6">🏆 FINAL</h3>
              <div className="bg-gradient-to-r from-gold/10 to-gold/10 p-1 rounded-lg">
                <MatchSlot match={final} round="final" matchIdx={0} />
              </div>

              <h3 className="text-xs font-bold text-muted-foreground text-center mt-6">SEMI-FINAL</h3>
              <MatchSlot match={sf[1]} round="sf" matchIdx={1} />
              <div className="space-y-4 mt-6">
                {qf.slice(2, 4).map((match, idx) => (
                  <MatchSlot key={idx} match={match} round="qf" matchIdx={idx + 2} />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ChevronRight className="text-muted-foreground rotate-180" />
            </div>

            {/* R16 Right */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground mb-3 text-center">ROUND OF 16</h3>
              {r16.slice(4, 8).map((match, idx) => (
                <MatchSlot key={idx} match={match} round="r16" matchIdx={idx + 4} compact />
              ))}
            </div>

            <div className="flex items-center justify-center">
              <ChevronRight className="text-muted-foreground rotate-180" />
            </div>

            {/* R32 Right */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-muted-foreground mb-3 text-center">ROUND OF 32</h3>
              {r32.slice(8, 16).map((match, idx) => (
                <MatchSlot key={idx} match={match} round="r32" matchIdx={idx + 8} compact />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
