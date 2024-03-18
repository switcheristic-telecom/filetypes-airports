import type { Airport } from "@/utils/airport";
import { cn } from "@/lib/utils";
import React from "react";
import { getThumbnailSpriteCSS } from "@/utils/thumbnail";

interface ThumbnailSpriteProps extends React.HTMLAttributes<HTMLDivElement> {
  airport: Airport;
  pixelSize?: number;
}

export default function ThumbnailSprite({
  airport,
  pixelSize,
  className,
}: ThumbnailSpriteProps) {
  const style = getThumbnailSpriteCSS(airport, pixelSize);
  return <div className={cn("bg-cover", className)} style={style}></div>;
}
