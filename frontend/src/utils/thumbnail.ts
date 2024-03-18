import type { Airport } from "@/utils/airport";

import { THUMBNAILS_MAPPING, THUMBNAIL_TYPES } from "@/data/thumbnail-mapping";
enum ThumbnailStyle {
  Classic = "classic",
  Linux = "linux",
  Modern = "modern",
}
const thumbnailStyles = Object.values(ThumbnailStyle);

export function getThumbnailIconName(d: Airport) {
  const iconPrefix = d.iata_code.toLowerCase();

  let iconName: string | null = null;

  for (const style of thumbnailStyles) {
    const icon = iconPrefix + "-" + style;
    if (icon in THUMBNAILS_MAPPING) {
      iconName = icon;
      break;
    }
  }

  if (!iconName) {
    iconName = "fallback" + "-" + thumbnailStyles[0];
  }

  return iconName;
}

export const SPRITE_SHEET_URL = "assets/thumbnails-spritesheet/spritesheet.png";

export function getThumbnailSpriteSheetMapping(d: Airport) {
  const iconName = getThumbnailIconName(d);
  const iconMapping = THUMBNAILS_MAPPING[iconName];

  return iconMapping;
}

export function getThumbnailSpriteCSS(
  d: Airport,
  pixelSize: number | undefined = undefined,
) {
  const iconMapping = getThumbnailSpriteSheetMapping(d);

  if (!iconMapping) {
    return {};
  }

  const padding = 0;

  let { x, y, width: iconWidth, height: iconHeight } = iconMapping;

  x = x - padding;
  y = y - padding;
  iconWidth = iconWidth + padding * 2;
  iconHeight = iconHeight + padding * 2;

  const scale = pixelSize ? pixelSize / iconWidth : 1;

  return {
    background: `url(${SPRITE_SHEET_URL}) -${x}px -${y}px`,
    // backgroundSize: "contain",
    width: `${iconWidth}px`,
    height: `${iconHeight}px`,
    transform: `scale(${scale})`,
  };
}
