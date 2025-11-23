import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';
import * as React from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
  value: string;
  onValueChange(value: string): void;
  defaultValue?: string;
  colorOptions?: string[] | undefined;
  disabled?: boolean;
  className?: string;
  popoverContentClassName?: string;
  colorPickerClassname?: string;
}

const ColorPicker = ({
  colorOptions = ['#3b82f6', '#22c55e', '#fb923c', '#ef4444', '#a855f7', '#ec4899'],
  defaultValue = '#09090B',
  value,
  onValueChange,
  disabled,
  className,
  popoverContentClassName,
  colorPickerClassname,
}: ColorPickerProps) => {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={disabled} asChild>
        <Button
          size="icon"
          variant="ghost"
          className={cn('w-7 h-7 ring ring-(--selected-color)', className)}
          style={{ '--selected-color': value || defaultValue } as React.CSSProperties}
        >
          <Circle className="w-5 h-5 border rounded-full text-(--selected-color) fill-(--selected-color)" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" className={cn('p-2 rounded-md w-fit max-w-xs border-0', popoverContentClassName)}>
        <div
          className="flex flex-col gap-y-2"
          style={
            {
              '--selected-color': value,
            } as React.CSSProperties
          }
        >
          <div className="flex gap-2 flex-wrap w-full items-center justify-center">
            {colorOptions?.map((colorOption, colorIdx) => {
              return (
                <Button
                  key={colorIdx}
                  size="icon"
                  variant="outline"
                  className={cn('w-7 h-7 p-0.5', value === colorOption && 'border-(--selected-color)')}
                  onClick={() => onValueChange(colorOption.toUpperCase())}
                >
                  <div className="aspect-square w-full rounded-sm" style={{ backgroundColor: colorOption }} />
                </Button>
              );
            })}
          </div>
          <HexColorInput
            color={value || defaultValue}
            onChange={(value) => onValueChange(value.toUpperCase())}
            className="uppercase text-xs text-center rounded-sm w-full h-8 border"
          />
          <HexColorPicker color={value || defaultValue} onChange={onValueChange} className={cn(colorPickerClassname)} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { ColorPicker };
