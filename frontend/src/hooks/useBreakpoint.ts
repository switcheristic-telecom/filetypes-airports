/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { useMediaQuery } from "react-responsive";
import config from "../../tailwind.config"; // Your tailwind config
import resolveConfig from "tailwindcss/resolveConfig";

const fullConfig = resolveConfig(config);
const breakpoints = fullConfig.theme.screens;

type BreakpointKey = keyof typeof breakpoints;

export function useBreakpoint<K extends BreakpointKey>(breakpointKey: K) {
  const bool = useMediaQuery({
    query: `(min-width: ${breakpoints[breakpointKey]})`,
  });
  const capitalizedKey =
    breakpointKey[0]!.toUpperCase() + breakpointKey.substring(1);

  type Key = `is${Capitalize<K>}`;
  return {
    [`is${capitalizedKey}`]: bool,
  } as Record<Key, boolean>;
}
