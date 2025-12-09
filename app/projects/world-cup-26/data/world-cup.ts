export interface Team {
  name: string;
  code: string;
  countryCode: string | null; // ISO 3166-1 alpha-2 country code, null for play-off teams
  isPlayoff?: boolean;
  playoffLabel?: string; // e.g., "PLAY-OFF A", "PLAY-OFF B"
}

export interface GroupMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
}

export interface GroupStanding {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface KnockoutMatch {
  id: string;
  round: 'R32' | 'R16' | 'QF' | 'SF' | 'FINAL';
  team1: string | null;
  team2: string | null;
  score1: number | null;
  score2: number | null;
  winner: string | null;
}

// World Cup 2026 will have 48 teams in 12 groups
export const worldCup2026Teams: Record<string, Team[]> = {
  A: [
    { name: 'Mexico', code: 'MEX', countryCode: 'MX' },
    { name: 'South Africa', code: 'RSA', countryCode: 'ZA' },
    { name: 'Korea Republic', code: 'KOR', countryCode: 'KR' },
    { name: 'FIFA WINNER PLAY-OFF D', code: 'PO-D', countryCode: null, isPlayoff: true, playoffLabel: 'PLAY-OFF D' },
  ],
  B: [
    { name: 'Canada', code: 'CAN', countryCode: 'CA' },
    { name: 'FIFA WINNER PLAY-OFF A', code: 'PO-A', countryCode: null, isPlayoff: true, playoffLabel: 'PLAY-OFF A' },
    { name: 'Qatar', code: 'QAT', countryCode: 'QA' },
    { name: 'Switzerland', code: 'SUI', countryCode: 'CH' },
  ],
  C: [
    { name: 'Brazil', code: 'BRA', countryCode: 'BR' },
    { name: 'Morocco', code: 'MAR', countryCode: 'MA' },
    { name: 'Haiti', code: 'HAI', countryCode: 'HT' },
    { name: 'Scotland', code: 'SCO', countryCode: 'GB' },
  ],
  D: [
    { name: 'USA', code: 'USA', countryCode: 'US' },
    { name: 'Paraguay', code: 'PAR', countryCode: 'PY' },
    { name: 'Australia', code: 'AUS', countryCode: 'AU' },
    { name: 'FIFA WINNER PLAY-OFF C', code: 'PO-C', countryCode: null, isPlayoff: true, playoffLabel: 'PLAY-OFF C' },
  ],
  E: [
    { name: 'Germany', code: 'GER', countryCode: 'DE' },
    { name: 'Curaçao', code: 'CUW', countryCode: 'CW' },
    { name: "Côte d'Ivoire", code: 'CIV', countryCode: 'CI' },
    { name: 'Ecuador', code: 'ECU', countryCode: 'EC' },
  ],
  F: [
    { name: 'Netherlands', code: 'NED', countryCode: 'NL' },
    { name: 'Japan', code: 'JPN', countryCode: 'JP' },
    { name: 'FIFA WINNER PLAY-OFF B', code: 'PO-B', countryCode: null, isPlayoff: true, playoffLabel: 'PLAY-OFF B' },
    { name: 'Tunisia', code: 'TUN', countryCode: 'TN' },
  ],
  G: [
    { name: 'Belgium', code: 'BEL', countryCode: 'BE' },
    { name: 'Egypt', code: 'EGY', countryCode: 'EG' },
    { name: 'IR Iran', code: 'IRN', countryCode: 'IR' },
    { name: 'New Zealand', code: 'NZL', countryCode: 'NZ' },
  ],
  H: [
    { name: 'Spain', code: 'ESP', countryCode: 'ES' },
    { name: 'Cabo Verde', code: 'CPV', countryCode: 'CV' },
    { name: 'Saudi Arabia', code: 'KSA', countryCode: 'SA' },
    { name: 'Uruguay', code: 'URU', countryCode: 'UY' },
  ],
  I: [
    { name: 'France', code: 'FRA', countryCode: 'FR' },
    { name: 'Senegal', code: 'SEN', countryCode: 'SN' },
    { name: 'FIFA WINNER PLAY-OFF 2', code: 'PO-2', countryCode: null, isPlayoff: true, playoffLabel: 'PLAY-OFF 2' },
    { name: 'Norway', code: 'NOR', countryCode: 'NO' },
  ],
  J: [
    { name: 'Argentina', code: 'ARG', countryCode: 'AR' },
    { name: 'Algeria', code: 'ALG', countryCode: 'DZ' },
    { name: 'Austria', code: 'AUT', countryCode: 'AT' },
    { name: 'Jordan', code: 'JOR', countryCode: 'JO' },
  ],
  K: [
    { name: 'Portugal', code: 'POR', countryCode: 'PT' },
    { name: 'FIFA WINNER PLAY-OFF 1', code: 'PO-1', countryCode: null, isPlayoff: true, playoffLabel: 'PLAY-OFF 1' },
    { name: 'Uzbekistan', code: 'UZB', countryCode: 'UZ' },
    { name: 'Colombia', code: 'COL', countryCode: 'CO' },
  ],
  L: [
    { name: 'England', code: 'ENG', countryCode: 'GB' },
    { name: 'Croatia', code: 'CRO', countryCode: 'HR' },
    { name: 'Ghana', code: 'GHA', countryCode: 'GH' },
    { name: 'Panama', code: 'PAN', countryCode: 'PA' },
  ],
};

export function generateGroupMatches(teams: Team[]): GroupMatch[] {
  const matches: GroupMatch[] = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({
        id: `${teams[i].code}-${teams[j].code}`,
        homeTeam: teams[i].code,
        awayTeam: teams[j].code,
        homeScore: null,
        awayScore: null,
      });
    }
  }
  return matches;
}

export function calculateStandings(teams: Team[], matches: GroupMatch[]): GroupStanding[] {
  const standings: Record<string, GroupStanding> = {};

  teams.forEach((team) => {
    standings[team.code] = {
      team: team.code,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  });

  matches.forEach((match) => {
    if (match.homeScore !== null && match.awayScore !== null) {
      const home = standings[match.homeTeam];
      const away = standings[match.awayTeam];

      home.played++;
      away.played++;
      home.goalsFor += match.homeScore;
      home.goalsAgainst += match.awayScore;
      away.goalsFor += match.awayScore;
      away.goalsAgainst += match.homeScore;

      if (match.homeScore > match.awayScore) {
        home.won++;
        home.points += 3;
        away.lost++;
      } else if (match.homeScore < match.awayScore) {
        away.won++;
        away.points += 3;
        home.lost++;
      } else {
        home.drawn++;
        away.drawn++;
        home.points++;
        away.points++;
      }

      home.goalDifference = home.goalsFor - home.goalsAgainst;
      away.goalDifference = away.goalsFor - away.goalsAgainst;
    }
  });

  return Object.values(standings).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
}

export function getTeamByCode(code: string): Team | undefined {
  for (const group of Object.values(worldCup2026Teams)) {
    const team = group.find((t) => t.code === code);
    if (team) return team;
  }
  return undefined;
}
