'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ColorPicker } from '@/components/color-picker';
import { Label } from '@/components/ui/label';
import { NumberInput } from '@/components/number-input';
import { Slider } from '@/components/ui/slider';

import { Undo2 } from 'lucide-react';
import * as React from 'react';
import { useSvgSearchParams } from '@/app/svg-animator/hooks/use-svg-search-params';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

const AppSidebar = () => {
  const {
    backgroundColor,
    setBackgroundColor,
    strokeColor,
    setStrokeColor,
    drawDuration,
    setDrawDuration,
    delay,
    setDelay,
    padding,
    setPadding,
    fillAfterEachPath,
    setFillAfterEachPath,
  } = useSvgSearchParams();

  // useEffect only runs on the client, so now we can safely show the UI
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="no-scrollbar flex flex-col gap-y-8 h-full overflow-auto px-4 py-4">
      <section className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-2">
          <Label>Cor de fundo</Label>
          <div className="flex gap-x-2 items-center">
            <InputGroup
              style={{ '--background-color': backgroundColor } as React.CSSProperties}
              className="border-(--background-color)"
            >
              <InputGroupInput placeholder={backgroundColor} disabled />
              <InputGroupAddon>
                <ColorPicker value={backgroundColor} onValueChange={setBackgroundColor} />
              </InputGroupAddon>
            </InputGroup>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setBackgroundColor(null)}>
                  <Undo2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redefinir</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <Label>Cor da linha</Label>
          <div className="flex gap-x-2 items-center">
            <ColorPicker value={strokeColor} onValueChange={setStrokeColor} />
            <Badge variant="outline" className="whitespace-nowrap font-normal rounded-sm h-full">
              {strokeColor}
            </Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setStrokeColor(null)}>
                  <Undo2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redefinir</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex gap-x-2 border rounded-sm p-2">
          <Checkbox
            id="fill-after-each-path"
            checked={fillAfterEachPath}
            onCheckedChange={(checked: boolean) => setFillAfterEachPath(checked)}
          />
          <Label htmlFor="fill-after-each-path">Preencher após cada caminho</Label>
        </div>

        <div className="flex flex-col gap-y-3">
          <div className="flex flex-col gap-y-2">
            <Label>Duração</Label>
            <p className="text-xs text-muted-foreground">Duração de cada pedaço do arquivo</p>
          </div>
          <NumberInput
            aria-label="draw-duration-input"
            value={drawDuration}
            onChange={setDrawDuration}
            step={0.5}
            minValue={0.5}
            formatOptions={{
              style: 'unit',
              unit: 'second',
              unitDisplay: 'short',
            }}
          />
        </div>
        <div className="flex flex-col gap-y-3">
          <div className="flex flex-col gap-y-2">
            <Label>Atraso</Label>
            <p className="text-xs text-muted-foreground">Atraso entre cada animação</p>
          </div>
          <NumberInput
            aria-label="draw-duration-input"
            value={delay}
            onChange={setDelay}
            step={0.5}
            minValue={0}
            formatOptions={{
              style: 'unit',
              unit: 'second',
              unitDisplay: 'short',
            }}
          />
        </div>
        <div className="flex flex-col gap-y-3">
          <Label>Espaçamento</Label>
          <div className="flex gap-x-2">
            <Slider
              defaultValue={[0]}
              max={24}
              min={0}
              step={1}
              value={[padding]}
              onValueChange={(value) => setPadding(value[0])}
            />
            <Badge variant="outline" className="whitespace-nowrap font-normal">
              {padding * 4} rem
            </Badge>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppSidebar;
