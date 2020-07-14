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

export function getBestFitUnit(duration: number): durationUnit {
  // Bei gesetzter Dauer in Minuten größtmögliche Einheit festelgen
  // und die Minuten-Dauer in die neue Einheit umrechen
  // --> Einheiten müssen nach Dauer (ASC) sortiert sein
  var units = getAllUnits().sort((a, b) => a.minutes - b.minutes);
  var unit: durationUnit;
  for (let u of units) {
    if (duration % u.minutes > 0) break;
    unit = u;
  }

  return unit;
}
