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
  confirmed: boolean;
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
    { name: 'Mexico', code: 'MEX', countryCode: 'mx' },
    { name: 'South Africa', code: 'RSA', countryCode: 'za' },
    { name: 'Korea Republic', code: 'KOR', countryCode: 'kr' },
    { name: 'FIFA WINNER PLAY-OFF D', code: 'PO-D', countryCode: null, isPlayoff: true, playoffLabel: 'PLAY-OFF D' },
  ],
  B: [
    { name: 'Canada', code: 'CAN', countryCode: 'ca' },
    { name: 'FIFA WINNER PLAY-OFF A', code: 'PO-A', countryCode: null, isPlayoff: true, playoffLabel: 'PLAY-OFF A' },
    { name: 'Qatar', code: 'QAT', countryCode: 'qa' },
    { name: 'Switzerland', code: 'SUI', countryCode: 'ch' },
  ],
  C: [
    { name: 'Brazil', code: 'BRA', countryCode: 'br' },
    { name: 'Morocco', code: 'MAR', countryCode: 'ma' },
    { name: 'Haiti', code: 'HAI', countryCode: 'ht' },
    { name: 'Scotland', code: 'SCO', countryCode: 'gb-sct' },
  ],
  D: [
    { name: 'USA', code: 'USA', countryCode: 'us' },
    { name: 'Paraguay', code: 'PAR', countryCode: 'py' },
    { name: 'Australia', code: 'AUS', countryCode: 'au' },
    { name: 'FIFA WINNER PLAY-OFF C', code: 'PO-C', countryCode: null, isPlayoff: true, playoffLabel: 'PLAY-OFF C' },
  ],
  E: [
    { name: 'Germany', code: 'GER', countryCode: 'de' },
    { name: 'Curaçao', code: 'CUW', countryCode: 'cw' },
    { name: "Côte d'Ivoire", code: 'CIV', countryCode: 'ci' },
    { name: 'Ecuador', code: 'ECU', countryCode: 'ec' },
  ],
  F: [
    { name: 'Netherlands', code: 'NED', countryCode: 'nl' },
    { name: 'Japan', code: 'JPN', countryCode: 'jp' },
    { name: 'FIFA WINNER PLAY-OFF B', code: 'PO-B', countryCode: null, isPlayoff: true, playoffLabel: 'PLAY-OFF B' },
    { name: 'Tunisia', code: 'TUN', countryCode: 'tn' },
  ],
  G: [
    { name: 'Belgium', code: 'BEL', countryCode: 'be' },
    { name: 'Egypt', code: 'EGY', countryCode: 'eg' },
    { name: 'IR Iran', code: 'IRN', countryCode: 'ir' },
    { name: 'New Zealand', code: 'NZL', countryCode: 'nz' },
  ],
  H: [
    { name: 'Spain', code: 'ESP', countryCode: 'es' },
    { name: 'Cabo Verde', code: 'CPV', countryCode: 'cv' },
    { name: 'Saudi Arabia', code: 'KSA', countryCode: 'sa' },
    { name: 'Uruguay', code: 'URU', countryCode: 'uy' },
  ],
  I: [
    { name: 'France', code: 'FRA', countryCode: 'fr' },
    { name: 'Senegal', code: 'SEN', countryCode: 'sn' },
    { name: 'FIFA WINNER PLAY-OFF 2', code: 'PO-2', countryCode: null, isPlayoff: true, playoffLabel: 'PLAY-OFF 2' },
    { name: 'Norway', code: 'NOR', countryCode: 'no' },
  ],
  J: [
    { name: 'Argentina', code: 'ARG', countryCode: 'ar' },
    { name: 'Algeria', code: 'ALG', countryCode: 'dz' },
    { name: 'Austria', code: 'AUT', countryCode: 'at' },
    { name: 'Jordan', code: 'JOR', countryCode: 'jo' },
  ],
  K: [
    { name: 'Portugal', code: 'POR', countryCode: 'pt' },
    { name: 'FIFA WINNER PLAY-OFF 1', code: 'PO-1', countryCode: null, isPlayoff: true, playoffLabel: 'PLAY-OFF 1' },
    { name: 'Uzbekistan', code: 'UZB', countryCode: 'uz' },
    { name: 'Colombia', code: 'COL', countryCode: 'co' },
  ],
  L: [
    { name: 'England', code: 'ENG', countryCode: 'gb-eng' },
    { name: 'Croatia', code: 'CRO', countryCode: 'hr' },
    { name: 'Ghana', code: 'GHA', countryCode: 'gh' },
    { name: 'Panama', code: 'PAN', countryCode: 'pa' },
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
        homeScore: 0,
        awayScore: 0,
        confirmed: false,
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
    if (match.confirmed && match.homeScore !== null && match.awayScore !== null) {
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
