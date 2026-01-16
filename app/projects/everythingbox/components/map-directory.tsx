'use client';

import { COFFEE_PLACES } from '@/app/projects/everythingbox/components/places';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { DoubleSidebarInset, DoubleSidebarTrigger } from '@/components/ui/double-sidebar';
import { Map as MapComponent, MapMarker, MapTileLayer } from '@/components/ui/leaflet-map';
import { cn } from '@/lib/utils';
import 'leaflet/dist/leaflet.css';
import { XIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

const MapDirectory = () => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="relative flex h-screen min-h-0 w-full min-w-0 flex-col items-center">
      <div className="min-h-svh flex w-full flex-col">
        {/* header */}
        <div className="flex h-(--header-height) w-full items-center justify-between border-b p-2">
          <div className="flex items-center gap-x-2">
            <DoubleSidebarTrigger />
            <span className="text-sm font-medium">Cafeterias</span>
          </div>
        </div>

        <div className="flex flex-1">
          <DoubleSidebarInset className={cn('h-[calc(100vh-var(--header-height))] min-w-0')}>
            <div className="h-12 flex items-center px-2 gap-x-2">
              Filtros:
              <FilterItem category="Bairro" operator="=" value="Flamengo" />
              <FilterItem category="Wifi" operator="=" value="Sim" />
              <FilterItem category="Pet Friendly" operator="=" value="Sim" />
              <Button size="sm" variant="outline">
                Limpar
              </Button>
            </div>
            <MapComponent
              center={[-22.9255953, -43.2328815]}
              zoom={15}
              className="z-5 h-full min-h-96 w-full focus-visible:outline-none [&_.leaflet-control-attribution]:hidden"
            >
              <MapTileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className={cn('grayscale', resolvedTheme === 'dark' && 'brightness-50')}
              />

              {/* Events Marker */}
              {COFFEE_PLACES.places?.map((place, index) => (
                <MapMarker
                  key={index}
                  className="event-marker"
                  position={[Number(place.location[0]), Number(place.location[1])]}
                  icon={
                    <span
                      style={
                        {
                          '--event-color': COFFEE_PLACES.color,
                        } as React.CSSProperties
                      }
                      className={cn('group relative flex h-6 w-6 items-center justify-center')}
                    >
                      <span className="absolute h-6 w-6 rounded-full bg-(--event-color) opacity-25" />
                      <span className="absolute h-3 w-3 rounded-full bg-(--event-color) border border-background" />
                      <div className="bg-foreground absolute -top-9 left-1/2 hidden -translate-x-1/2 rounded-sm p-1 transition-opacity group-hover:block">
                        <Badge>{place.name}</Badge>
                      </div>
                    </span>
                  }
                />
              ))}
            </MapComponent>
          </DoubleSidebarInset>
        </div>
      </div>
    </div>
  );
};

const FilterItem = ({ category, operator, value }: { category: string; operator: string; value: string }) => {
  return (
    <ButtonGroup>
      <Button size="sm" variant="outline">
        {category}
      </Button>
      <Button size="sm" variant="outline">
        {operator}
      </Button>
      <Button size="sm" variant="outline">
        {value}
      </Button>
      <Button size="sm" variant="outline">
        <XIcon />
      </Button>
    </ButtonGroup>
  );
};

export { MapDirectory };
