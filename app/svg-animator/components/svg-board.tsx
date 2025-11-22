'use client';

import { AnimatedSvg } from '@/app/svg-animator/components/animated-svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSvgSearchParams } from '@/app/svg-animator/hooks/use-svg-search-params';
import { Play } from 'lucide-react';
import React from 'react';

const SvgBoard = () => {
  const { backgroundColor, padding } = useSvgSearchParams();

  const [svgContent, setSvgContent] = React.useState<string | null>(null);
  const [replayTimes, setReplayTimes] = React.useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSvgContent(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const replayAnimation = () => {
    setReplayTimes((prevKey) => prevKey + 1);
  };

  return (
    <div className="flex flex-col w-full h-full min-h-[500px] p-4 md:p-10 gap-y-2">
      <div className="flex gap-x-2">
        <Input
          id="svg-input"
          className="p-0 pe-3 file:me-3 file:border-0 file:border-e"
          type="file"
          accept=".svg"
          onChange={handleFileChange}
          aria-label="Select SVG file"
        />
        <Button onClick={replayAnimation}>
          <Play className="size-3" /> Replay
        </Button>
      </div>
      <div className="flex w-full h-full min-h-0 border border-dashed items-center justify-center rounded">
        <div
          className="flex w-full h-full p-0 md:p-12 rounded bg-(--chosen-background)"
          style={
            {
              '--chosen-background': backgroundColor,
            } as React.CSSProperties
          }
        >
          <div className="flex w-full h-full" style={{ padding: `${padding}rem` }}>
            {svgContent && <AnimatedSvg key={replayTimes} svgContent={svgContent} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SvgBoard;
