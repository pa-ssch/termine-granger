export type durationUnit = { key: string; label: string; minutes: number };

export function getAllUnits(): durationUnit[] {
  return [
    { key: "m", label: "Minute(n)", minutes: 1 },
    { key: "h", label: "Stunde(n)", minutes: 60 },
    { key: "d", label: "Tag(e)", minutes: 1440 },
    { key: "M", label: "Monat(e)", minutes: 44640 },
    { key: "a", label: "Jahr(e)", minutes: 535680 },
  ];
}
