// UN demographic relative birth frequencies
export const COUNTRY_WEIGHTS: Record<string, number> = {
  India: 46,
  China: 18,
  Nigeria: 15,
  Pakistan: 13,
  Indonesia: 9,
  "United States of America": 8,
  "Dem. Rep. Congo": 7,
  Ethiopia: 6,
  Bangladesh: 6,
  Brazil: 5,
  Philippines: 4,
  Egypt: 4,
};

// Convert standard country name to Emoji Flag
export function getCountryFlag(countryName: string): string {
  const flags: Record<string, string> = {
    India: "🇮🇳",
    China: "🇨🇳",
    Nigeria: "🇳🇬",
    Pakistan: "🇵🇰",
    Indonesia: "🇮🇩",
    "United States of America": "🇺🇸",
    "Dem. Rep. Congo": "🇨🇩",
    Ethiopia: "🇪🇹",
    Bangladesh: "🇧🇩",
    Brazil: "🇧🇷",
    Philippines: "🇵🇭",
    Egypt: "🇪🇬",
    Russia: "🇷🇺",
    Mexico: "🇲🇽",
    Japan: "🇯🇵",
    Germany: "🇩🇪",
    "United Kingdom": "🇬🇧",
    France: "🇫🇷",
    Italy: "🇮🇹",
    Canada: "🇨🇦",
    Australia: "🇦🇺",
  };
  return flags[countryName] || "🌐";
}