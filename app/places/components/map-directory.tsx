'use client';

import { COFFEE_PLACES, PlaceProperties } from '@/app/places/data';
import {
  DoubleSidebar,
  DoubleSidebarContent,
  DoubleSidebarInset,
  useDoubleSidebarWithSide,
} from '@/components/ui/double-sidebar';
import { Map, MapClusterLayer, MapControls } from '@/components/ui/maplibre-map';
import { cn } from '@/lib/utils';
import { parseAsString, useQueryState } from 'nuqs';
import React from 'react';

type PlaceGeoJSONProperties = Omit<PlaceProperties, 'location'>;

const MapDirectory = () => {
  const [selectedPoint, setSelectedPoint] = useQueryState('selectedPoint', parseAsString.withDefault(''));

  const rightSidebar = useDoubleSidebarWithSide('right');

  React.useEffect(() => {
    rightSidebar.setOpen(Boolean(selectedPoint));
  }, [selectedPoint, rightSidebar]);

  // Convert places data to GeoJSON format
  const coffeePlacesGeojsonData = React.useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features: COFFEE_PLACES.places.map((place) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: place.location,
        },
        properties: {
          name: place.name,
          google_maps_url: place.google_maps_url,
        } satisfies PlaceGeoJSONProperties,
      })),
    };
  }, []);

  return (
    <div className="relative flex h-screen min-h-0 w-full min-w-0 flex-col items-center">
      <div className="min-h-svh flex w-full flex-col">
        <div className="flex flex-1">
          <DoubleSidebarInset className={cn('h-[calc(100vh)] min-w-0')}>
            <Map center={[-43.23, -22.92]} zoom={13} fadeDuration={0}>
              <MapClusterLayer<PlaceGeoJSONProperties>
                data={coffeePlacesGeojsonData}
                clusterRadius={50}
                clusterMaxZoom={14}
                clusterColors={['#22c55e', '#eab308', '#ef4444']}
                pointColor="#3b82f6"
                onPointClick={(feature) => {
                  setSelectedPoint(selectedPoint ? null : feature.properties.name);
                }}
              />
              <MapControls />
            </Map>
          </DoubleSidebarInset>

          <DoubleSidebar side="right">
            <DoubleSidebarContent>vini</DoubleSidebarContent>
          </DoubleSidebar>
        </div>
      </div>
    </div>
  );
};

export default MapDirectory;
