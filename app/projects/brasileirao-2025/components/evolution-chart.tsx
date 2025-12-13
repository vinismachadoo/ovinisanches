'use client';

import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import * as React from 'react';
import { CartesianGrid, ComposedChart, Line, ReferenceArea, XAxis, YAxis } from 'recharts';
import { REFERENCE_AREAS, ReferenceAreaCode, ROUNDS, TEAMS, type TeamCode } from '../data/rounds';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

// Transform rounds data for the chart
const chartData = ROUNDS.map((round) => {
  const data: Record<string, number> = { round: round.round };
  Object.entries(round.positions).forEach(([team, position]) => {
    data[team] = position - 0.5;
  });
  return data;
});

// Color palette for teams (20 distinct colors)
const teamColors: Record<TeamCode, string> = {
  ATM: '#8B5CF6', // Purple
  BAH: '#EC4899', // Pink
  BOT: '#6B7280', // Gray
  CEA: '#10B981', // Green
  COR: '#EF4444', // Red
  CRU: '#3B82F6', // Blue
  FLA: '#DC2626', // Dark Red
  FLU: '#7C3AED', // Violet
  FOR: '#F59E0B', // Amber
  GRE: '#059669', // Emerald
  INT: '#F97316', // Orange
  JUV: '#6366F1', // Indigo
  MIR: '#14B8A6', // Teal
  PAL: '#06B6D4', // Cyan
  RBB: '#F43F5E', // Rose
  SAN: '#84CC16', // Lime
  SPA: '#0EA5E9', // Sky
  SPT: '#A855F7', // Fuchsia
  VAS: '#EC4899', // Pink
  VIT: '#22C55E', // Green
};

const referenceAreaColors: Record<ReferenceAreaCode, string> = {
  LIB: '#2563eb',
  LIB2: '#22c55e',
  SUL: '#f59e0b',
  REB: '#ef4444',
};

export function EvolutionChart() {
  const [selectedTeams, setSelectedTeams] = useQueryState('teams', parseAsArrayOf(parseAsString).withDefault([]));
  const [visibleZones, setVisibleZones] = useQueryState('zones', parseAsArrayOf(parseAsString).withDefault([]));

  const onTeamToggle = React.useCallback(
    (team: TeamCode) => {
      const currentTeams = (selectedTeams || []) as TeamCode[];
      const newTeams = currentTeams.includes(team) ? currentTeams.filter((t) => t !== team) : [...currentTeams, team];
      setSelectedTeams(newTeams.length > 0 ? newTeams : null); // null removes from URL
    },
    [selectedTeams, setSelectedTeams]
  );

  const onZoneToggle = React.useCallback(
    (zone: ReferenceAreaCode) => {
      const currentZones = (visibleZones || []) as ReferenceAreaCode[];
      const newZones = currentZones.includes(zone) ? currentZones.filter((z) => z !== zone) : [...currentZones, zone];
      setVisibleZones(newZones.length > 0 ? newZones : null);
    },
    [visibleZones, setVisibleZones]
  );

  const allTeams = React.useMemo(() => Object.keys(TEAMS) as TeamCode[], []);

  const allReferenceAreaCodes = React.useMemo(() => Object.keys(REFERENCE_AREAS) as ReferenceAreaCode[], []);

  const chartConfig = React.useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};
    allTeams.forEach((team) => {
      config[team] = {
        label: TEAMS[team],
        color: teamColors[team],
      };
    });
    return config;
  }, [allTeams]);

  const isTeamSelected = React.useCallback(
    (team: TeamCode) => {
      // If no teams are selected, show all teams as selected (full opacity)
      const teams = (selectedTeams || []) as TeamCode[];
      if (teams.length === 0) return true;
      return teams.includes(team);
    },
    [selectedTeams]
  );

  const isZoneVisible = React.useCallback(
    (zone: ReferenceAreaCode) => {
      const zones = (visibleZones || []) as ReferenceAreaCode[];
      return zones.includes(zone);
    },
    [visibleZones]
  );

  return (
    <div className="flex flex-col gap-y-4 min-h-0 h-full">
      {/* Legend for Reference Areas */}
      <div className="flex gap-x-6 justify-center items-center">
        {allReferenceAreaCodes.map((zone) => {
          const visible = isZoneVisible(zone);

          const zoneLabels: Record<ReferenceAreaCode, string> = {
            LIB: 'Fase de Grupos Libertadores',
            LIB2: 'Segunda Fase Libertadores',
            SUL: 'Fase de Grupos Sul-Americana',
            REB: 'Zona de Rebaixamento',
          };
          return (
            <Button key={zone} onClick={() => onZoneToggle(zone)} variant="outline" className="flex items-center gap-2">
              <span
                className={cn('inline-block w-4 h-1 rounded-sm border bg-(--bg-color) border-(--border-color)')}
                style={
                  {
                    '--zone-color': referenceAreaColors[zone],
                    '--bg-color': 'hsl(from var(--zone-color) h s 80%)',
                    '--border-color': 'hsl(from var(--zone-color) h s 50%)',
                  } as React.CSSProperties
                }
              />
              <span>{zoneLabels[zone]}</span>
              <Eye className={cn('size-4', visible ? 'hidden' : 'block')} />
              <EyeOff className={cn('size-4', visible ? 'block' : 'hidden')} />
            </Button>
          );
        })}
      </div>

      <ChartContainer config={chartConfig} className="h-full w-full min-h-0">
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          {/* Reference Areas - conditionally rendered based on visibility */}
          <ReferenceArea
            x1={1}
            x2={38}
            y1={0}
            y2={5}
            fill={isZoneVisible('LIB') ? `hsl(from ${referenceAreaColors['LIB']} h s 75%)` : 'transparent'}
          />

          <ReferenceArea
            x1={1}
            x2={38}
            y1={5}
            y2={7}
            fill={isZoneVisible('LIB2') ? `hsl(from ${referenceAreaColors['LIB2']} h s 75%)` : 'transparent'}
          />
          <ReferenceArea
            x1={1}
            x2={38}
            y1={7}
            y2={14}
            fill={isZoneVisible('SUL') ? `hsl(from ${referenceAreaColors['SUL']} h s 75%)` : 'transparent'}
          />
          <ReferenceArea
            x1={1}
            x2={38}
            y1={16}
            y2={20}
            fill={isZoneVisible('REB') ? `hsl(from ${referenceAreaColors['REB']} h s 75%)` : 'transparent'}
          />
          <XAxis
            dataKey="round"
            label={{ value: 'Rodada', position: 'insideBottom', offset: -10 }}
            tickFormatter={(value) => `${value}ª`}
            interval={'equidistantPreserveStart'}
          />
          <YAxis
            reversed
            tickFormatter={(value) => `${value + 0.5}º`}
            includeHidden={true}
            ticks={[0.5, 4.5, 9.5, 14.5, 19.5]}
          />
          <ChartTooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || !payload.length) return null;

              const selectedTeams = payload.filter((entry) => isTeamSelected(entry.dataKey as TeamCode));

              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="mb-2 font-medium">Rodada {label}ª</div>
                  <div className="space-y-1">
                    {selectedTeams
                      .sort((a, b) => (a.value as number) - (b.value as number))
                      .map((entry, index) => {
                        const team = entry.dataKey as TeamCode;
                        const position = entry.value as number;
                        const selected = isTeamSelected(team);
                        return (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{
                                backgroundColor: entry.color,
                                opacity: selected ? 1 : 0.3,
                              }}
                            />
                            <span className={`text-sm ${selected ? '' : 'opacity-50'}`}>
                              {TEAMS[team]}: {position}º
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            }}
          />
          {allTeams.map((team) => {
            const selected = isTeamSelected(team);
            const opacity = selected ? 1 : 0.3;
            return (
              <Line
                key={team}
                type="monotone"
                dataKey={team}
                stroke={teamColors[team]}
                strokeWidth={selected ? 2 : 1.5}
                strokeOpacity={opacity}
                dot={{ r: selected ? 3 : 0 }}
                activeDot={{ r: selected ? 5 : 0 }}
                opacity={opacity}
              />
            );
          })}
        </ComposedChart>
      </ChartContainer>

      {/* Legend */}
      <div className="grid grid-cols-10 gap-3 justify-center">
        {allTeams.map((team) => {
          const selected = isTeamSelected(team);
          return (
            <Button key={team} onClick={() => onTeamToggle(team)} variant={selected ? 'default' : 'outline'}>
              <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: teamColors[team] }} />
              <span className="text-sm whitespace-nowrap">{TEAMS[team]}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
