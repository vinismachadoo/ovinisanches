'use client';

import { useState } from 'react';
import { EmojiPicker, EmojiPickerSearch, EmojiPickerContent, EmojiPickerFooter } from '@/components/ui/emoji-picker';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Smile } from 'lucide-react';

interface EmojiPickerFieldProps {
  value?: string;
  onChange: (emoji: string) => void;
  label?: string;
}

export function EmojiPickerField({ value, onChange, label }: EmojiPickerFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={<Button type="button" variant="outline" className="w-fit justify-start" />}>
          {value ? <span className="text-lg">{value}</span> : <Smile className="size-4" />}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <EmojiPicker
            className="h-[342px]"
            onEmojiSelect={(emoji) => {
              onChange(emoji.emoji);
              setOpen(false);
            }}
          >
            <EmojiPickerSearch />
            <EmojiPickerContent />
            <EmojiPickerFooter />
          </EmojiPicker>
        </PopoverContent>
      </Popover>
    </div>
  );
}
