import chroma from 'chroma-js';
import * as React from 'react';

interface PalleteSwatch {
  stop: number;
  hex: string;
  h: number;
  hScale: number;
  s: number;
  sScale: number;
  l: number;
}

export const ALL_SHADES_STOPS = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000];

export function isValidHexColor(color: string): boolean {
  return (color.startsWith('#') && color.length === 7) || (!color.startsWith('#') && color.length === 6);
}

/**
 * Chroma-js based implementation for stable palette generation
 * Uses HSLuv for perceived mode and direct HSL manipulation for linear mode
 */
export function createSwatches({ color }: { color: string }): {
  palette: PalleteSwatch[];
  isValid: boolean;
  reason: string | null;
  shadesStyles: React.CSSProperties;
} {
  const isHexColor = isValidHexColor(color);
  if (!isHexColor) {
    return {
      palette: [],
      isValid: false,
      reason: `invalid hex color: ${color}`,
      shadesStyles: {},
    };
  }

  const value = color.startsWith('#') ? color.replace('#', '') : color;
  const valueStop = calculateStopFromColor(value);
  // All available stops (including 0 and 1000 for calculation of black and white)

  // Create base color from input
  let baseColor: chroma.Color;
  try {
    baseColor = chroma(`#${value}`);
  } catch (e) {
    return {
      palette: [],
      isValid: false,
      reason: (e as Error)?.message,
      shadesStyles: {},
    };
  }

  const [baseH, baseS, baseL] = baseColor.hsl();

  // Handle grayscale colors (NaN hue) by setting a default hue
  const normalizedBaseH = isNaN(baseH) ? 0 : baseH;

  // 1. Create hue scale
  const valueStopIndex = ALL_SHADES_STOPS.indexOf(valueStop);
  if (valueStopIndex === -1) {
    throw new Error(`Invalid valueStop: ${valueStop}`);
  }

  const hueScale = ALL_SHADES_STOPS.map((stop) => {
    const stopIndex = ALL_SHADES_STOPS.indexOf(stop);
    const diff = Math.abs(stopIndex - valueStopIndex);
    return { stop, tweak: 0 };
  });

  // 2. Create saturation scale
  const saturationScale = ALL_SHADES_STOPS.map((stop) => {
    const stopIndex = ALL_SHADES_STOPS.indexOf(stop);
    const diff = Math.abs(stopIndex - valueStopIndex);
    return { stop, tweak: Math.min(0, 100) };
  });

  const lightnessValue = baseL * 100;

  // Create the three anchor points
  const distributionAnchors = [
    { stop: 0, tweak: 98 },
    { stop: valueStop, tweak: lightnessValue },
    { stop: 1000, tweak: 8 },
  ];

  // Interpolate for missing stops
  const distributionScale = ALL_SHADES_STOPS.map((stop) => {
    // If it's an anchor point, use the anchor value
    const anchor = distributionAnchors.find((a) => a.stop === stop);
    if (anchor) {
      return anchor;
    }

    // Otherwise interpolate between anchor points
    let leftAnchor, rightAnchor;

    if (stop < valueStop) {
      leftAnchor = distributionAnchors[0]; // stop 0
      rightAnchor = distributionAnchors[1]; // valueStop
    } else {
      leftAnchor = distributionAnchors[1]; // valueStop
      rightAnchor = distributionAnchors[2]; // stop 1000
    }

    // Linear interpolation
    const range = rightAnchor.stop - leftAnchor.stop;
    const position = stop - leftAnchor.stop;
    const ratio = position / range;
    const tweak = leftAnchor.tweak + (rightAnchor.tweak - leftAnchor.tweak) * ratio;

    return { stop, tweak: Math.round(tweak) };
  });

  const swatches = ALL_SHADES_STOPS
    // filter out 0 and 1000 to avoid blacks and whites
    // .filter((stop) => stop !== 0 && stop !== 1000)
    .map((stop, stopIndex) => {
      if (stop === valueStop) {
        // Preserve exact input color
        const inputColor = chroma(`#${value.toUpperCase()}`);
        const [finalH, finalS, finalL] = inputColor.hsl();

        return {
          stop,
          hex: `#${value.toUpperCase()}`,
          h: isNaN(finalH) ? 0 : finalH,
          hScale: 0,
          s: isNaN(finalS) ? 0 : finalS * 100,
          sScale: (isNaN(finalS) ? 0 : finalS * 100) - 50,
          l: isNaN(finalL) ? 0 : finalL * 100,
        };
      }

      // Get tweaks for this stop
      const hTweak = hueScale[stopIndex].tweak;
      const sTweak = saturationScale[stopIndex].tweak;
      const lTweak = distributionScale[stopIndex].tweak;

      const newH = (normalizedBaseH + hTweak) % 360;
      const newS = Math.max(0, Math.min(100, baseS * 100 + sTweak));
      const newL = Math.max(0, Math.min(100, lTweak));

      const newColor: chroma.Color = chroma.hsl(newH, newS / 100, newL / 100);

      const [finalH, finalS, finalL] = newColor.hsl();

      return {
        stop,
        hex: newColor.hex().toUpperCase(),
        h: isNaN(finalH) ? 0 : finalH,
        hScale: ((((hTweak + 180) % 360) - 180) / 180) * 50,
        s: isNaN(finalS) ? 0 : finalS * 100,
        sScale: (isNaN(finalS) ? 0 : finalS * 100) - 50,
        l: isNaN(finalL) ? 0 : finalL * 100,
      };
    });

  const palette = swatches.filter((swatch) => swatch.stop !== 0 && swatch.stop !== 1000);

  const shades = palette.reduce(
    (acc, p) => {
      acc[`--shades-${p.stop}`] = p.hex;
      return acc;
    },
    {} as Record<string, string>,
  );

  const shadesStyles = {
    ...shades,
    '--primary': 'var(--shades-500)',
    '--primary-foreground': 'lch(from var(--primary) round((100 - l), 100) 0 0)',
    '--ring': 'var(--shades-300)',
    '--chart-1': 'var(--shades-500)',
    '--chart-2': 'var(--shades-200)',
    '--chart-3': 'var(--shades-700)',
    '--chart-4': 'var(--shades-400)',
    '--chart-5': 'var(--shades-900)',
    '--sidebar-primary': 'var(--shades-500)',
    '--sidebar-primary-foreground': 'lch(from var(--primary) round((100 - l), 100) 0 0)',
    '--sidebar-ring': 'var(--shades-300)',
  } as React.CSSProperties;

  return {
    palette: swatches.filter((swatch) => swatch.stop !== 0 && swatch.stop !== 1000),
    isValid: true,
    reason: null,
    shadesStyles,
  };
}

/**
 * Calculate the appropriate stop value (50-950) based on a color's properties
 * @param color - The hex color value (with or without #)
 * @param colorMode - The current color mode ('linear' or 'perceived')
 * @returns The nearest available stop value (50, 100, 200, etc.)
 */
export function calculateStopFromColor(color: string): number {
  const hexColor = color.startsWith('#') ? color : `#${color}`;

  // In linear mode, use HSL lightness (0-100)
  let l = 0;
  try {
    [, , l] = chroma(hexColor).hsl();
  } catch (e) {
    console.error(e);
    return 500;
  }
  const value = l * 100; // Convert to 0-100 range

  // Choose the correct baseline palette
  // BASELINE_LINEAR_PALETTE_1E70F6_STOP500
  const baseline = [
    { stop: 0, hex: '#FFFFFF', h: 0, hScale: 0, s: 0, sScale: 0, l: 100 }, // Not used in final output
    { stop: 50, hex: '#E6F0FE', h: 0, hScale: 0, s: 0, sScale: 0, l: 95 },
    { stop: 100, hex: '#D3E3FD', h: 0, hScale: 0, s: 0, sScale: 0, l: 90 },
    { stop: 200, hex: '#A7C7FB', h: 0, hScale: 0, s: 0, sScale: 0, l: 80 },
    { stop: 300, hex: '#76A8FA', h: 0, hScale: 0, s: 0, sScale: 0, l: 70 },
    { stop: 400, hex: '#4A8CF8', h: 0, hScale: 0, s: 0, sScale: 0, l: 60 },
    { stop: 500, hex: '#1E70F6', h: 0, hScale: 0, s: 0, sScale: 0, l: 50 }, // Input color
    { stop: 600, hex: '#0856D3', h: 0, hScale: 0, s: 0, sScale: 0, l: 40 },
    { stop: 700, hex: '#06409D', h: 0, hScale: 0, s: 0, sScale: 0, l: 30 },
    { stop: 800, hex: '#042C6C', h: 0, hScale: 0, s: 0, sScale: 0, l: 20 },
    { stop: 900, hex: '#021636', h: 0, hScale: 0, s: 0, sScale: 0, l: 10 },
    { stop: 950, hex: '#010A19', h: 0, hScale: 0, s: 0, sScale: 0, l: 5 },
    { stop: 1000, hex: '#000000', h: 0, hScale: 0, s: 0, sScale: 0, l: 0 }, // Not used in final output
  ];

  // Find the stop whose palette color's value is closest to the input color's value
  let closestStop = baseline[0].stop;
  let smallestDiff = Infinity;
  for (const swatch of baseline) {
    const [, , l] = chroma(swatch.hex).hsl();
    const swatchValue = l * 100;

    const diff = Math.abs(swatchValue - value);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestStop = swatch.stop;
    }
  }
  return closestStop;
}

export function useShadesStyles({ palette }: { palette: PalleteSwatch[] }): { shadesStyles: React.CSSProperties } {
  const shades = React.useMemo(() => {
    return palette.reduce(
      (acc, p) => {
        acc[`--shades-${p.stop}`] = p.hex;
        return acc;
      },
      {} as Record<string, string>,
    );
  }, [palette]);

  const shadesStyles = React.useMemo(() => {
    return {
      ...shades,
      '--primary': 'var(--shades-500)',
      '--primary-foreground': 'lch(from var(--primary) round((100 - l), 100) 0 0)',
      '--ring': 'var(--shades-300)',
      '--chart-1': 'var(--shades-500)',
      '--chart-2': 'var(--shades-200)',
      '--chart-3': 'var(--shades-700)',
      '--chart-4': 'var(--shades-400)',
      '--chart-5': 'var(--shades-900)',
      '--sidebar-primary': 'var(--shades-500)',
      '--sidebar-primary-foreground': 'lch(from var(--primary) round((100 - l), 100) 0 0)',
      '--sidebar-ring': 'var(--shades-300)',
    } as React.CSSProperties;
  }, [shades]);

  return { shadesStyles };
}
