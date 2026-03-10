'use client';

import { formatHex, oklch } from 'culori';
import QR from 'qrcode';
import { type HTMLAttributes, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type QRCodeProps = HTMLAttributes<HTMLDivElement> & {
  data: string;
  foreground?: string;
  background?: string;
  robustness?: 'L' | 'M' | 'Q' | 'H';
};

const oklchRegex = /oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/;

const getOklch = (color: string, fallback: [number, number, number]) => {
  const oklchMatch = color.match(oklchRegex);

  if (!oklchMatch) {
    return { l: fallback[0], c: fallback[1], h: fallback[2] };
  }

  return {
    l: Number.parseFloat(oklchMatch[1]),
    c: Number.parseFloat(oklchMatch[2]),
    h: Number.parseFloat(oklchMatch[3]),
  };
};

export const QRCode = ({ data, foreground, background, robustness = 'M', className, ...props }: QRCodeProps) => {
  const [svg, setSVG] = useState<string | null>(null);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const newSvg = await QR.toString(data, {
          type: 'svg',
          width: 200,
          errorCorrectionLevel: robustness,
          margin: 0,
        }).then((svg) => {
          svg = svg
            .replace(/fill=".*?"/g, '')
            .replace(/stroke=".*?"/g, '')
            .replace(/\s+/g, ' ');
          return svg;
        });

        setSVG(newSvg);
      } catch (err) {
        console.error(err);
      }
    };

    generateQR();
  }, [data, foreground, background, robustness]);

  if (!svg) {
    return null;
  }

  return (
    <div
      className={cn(
        'size-full [&_svg]:size-full [&_svg]:fill-transparent',
        '**:[path]:first:stroke-0',
        '**:[path]:not-first:stroke-foreground',
        className,
      )}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: "Required for SVG"
      dangerouslySetInnerHTML={{ __html: svg }}
      {...props}
    />
  );
};
