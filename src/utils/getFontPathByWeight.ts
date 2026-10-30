import type { FontData } from "astro:assets";

export function getFontPathByWeight(
  fonts: FontData[],
  weight: number,
  options?: {
    style?: "normal" | "italic";
    format?: string;
  }
): string | undefined {
  const style = options?.style ?? "normal";
  const format = options?.format ?? "truetype";

  const matches = fonts.filter(
    font => font.weight === String(weight) && font.style === style
  );

  // A weight can be listed once per format (woff2 for the page, ttf for
  // satori), so look through every match for the requested format first.
  for (const font of matches) {
    const src = font.src.find(file => file.format === format);
    if (src) return src.url;
  }

  return matches[0]?.src[0]?.url;
}
