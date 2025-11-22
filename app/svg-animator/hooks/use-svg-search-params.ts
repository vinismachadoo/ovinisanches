'use client';

import { useTheme } from 'next-themes';
import { parseAsBoolean, parseAsFloat, parseAsInteger, parseAsString, useQueryState } from 'nuqs';

export function useSvgSearchParams() {
  const { resolvedTheme } = useTheme();

  const [backgroundColor, setBackgroundColor] = useQueryState(
    'backgroundColor',
    parseAsString.withDefault(resolvedTheme === 'dark' ? '#09090B' : '#FFFFFF')
  );
  const [strokeColor, setStrokeColor] = useQueryState(
    'strokeColor',
    parseAsString.withDefault(resolvedTheme === 'dark' ? '#FFFFFF' : '#09090B')
  );
  const [drawDuration, setDrawDuration] = useQueryState('drawDuration', parseAsFloat.withDefault(2));
  const [delay, setDelay] = useQueryState('delay', parseAsFloat.withDefault(0));
  const [padding, setPadding] = useQueryState('padding', parseAsInteger.withDefault(0));

  const [fillAfterEachPath, setFillAfterEachPath] = useQueryState(
    'fillAfterEachPath',
    parseAsBoolean.withDefault(false)
  );

  return {
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
  };
}
