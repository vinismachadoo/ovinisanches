'use client';

import { MessageCircleMore, ToyBrick, PackageOpen, ListTree } from 'lucide-react';
import { motion } from 'motion/react';
import { Map, MapMarker, MarkerContent } from '@/components/ui/map';
import { cn } from '@/lib/utils';

const RIO_DE_JANEIRO_CENTER = [-43.2104764711645, -22.95194069864799] as [number, number];

const Presentation = () => {
  const description =
    'I solidify bridges between business, design and engineering teams with my expertise in product development and product lifecycle';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="size-full p-2 gap-y-6 flex flex-col"
    >
      <div className="flex flex-wrap gap-2 [&_span]:text-2xl [&_span]:font-medium [&_span]:leading-none [&_span]:h-7">
        <span>The</span>
        <span>agentic</span>
        <span>way</span>
        <span>of</span>
        <div className="flex items-center justify-center rounded-sm bg-sky-500/20 size-7 p-1">
          <MessageCircleMore className="size-full text-sky-500" />
        </div>
        <span>thinking,</span>
        <div className="flex items-center justify-center rounded-sm bg-pink-500/20 size-7 p-1">
          <ToyBrick className="size-full text-pink-500" />
        </div>
        <span>building,</span>
        <div className="flex items-center justify-center rounded-sm bg-yellow-500/20 size-7 p-1">
          <PackageOpen className="size-full text-yellow-500" />
        </div>
        <span>shipping</span>
        <span>and</span>
        <div className="flex items-center justify-center rounded-sm bg-purple-500/20 size-7 p-1">
          <ListTree className="size-full text-purple-500" />
        </div>
        <span>managing</span>
        <span>products.</span>
      </div>

      <div className="flex flex-wrap gap-2 [&_span]:text-2xl [&_span]:leading-none [&_span]:h-7">
        {description.split(' ').map((word, index) => (
          <span key={index}>{word}</span>
        ))}
      </div>

      {/* <div className="h-full border border-dashed rounded-sm" /> */}

      <Map center={RIO_DE_JANEIRO_CENTER} zoom={10} className="size-full rounded-sm">
        <MapMarker longitude={RIO_DE_JANEIRO_CENTER[0]} latitude={RIO_DE_JANEIRO_CENTER[1]}>
          <MarkerContent>
            <div
              className="relative flex items-center justify-center group/marker"
              style={
                {
                  '--trending-size': 0.5,
                  '--marker-color': 'oklch(calc(0.7 + (0.3 - 0.7) * var(--trending-size)) 0.214 259.815)',
                } as React.CSSProperties
              }
            >
              <div className="absolute size-14 rounded-full bg-(--marker-color)/30 pointer-events-none animate-ping duration-300" />

              <div
                className={cn(
                  'size-4 rounded-full border-2 border-white/50 shadow-lg cursor-pointer transition-transform group-hover/marker:scale-110 bg-(--marker-color)',
                )}
              />
            </div>
          </MarkerContent>
        </MapMarker>
      </Map>

      <div className="flex flex-col gap-y-2">
        <span className="text-lg">Product Engineer based in Rio de Janeiro, Brazil.</span>
        <span className="text-base text-muted-foreground">
          Nor a product manager that oversees people who build... nor a software engineer that takes bussiness context
          for granted.
        </span>
      </div>
    </motion.div>
  );
};

export default Presentation;
