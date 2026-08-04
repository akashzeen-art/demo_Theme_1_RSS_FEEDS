/**
 * Thumbnail helpers — public/portrait + public/landscape (no-space filenames).
 */

const SPECIAL: Record<string, string> = {
  'ESCAPE ROUTE 21': 'ESCAPEROUT21.jpg',
  'ESCAPEROUT21': 'ESCAPEROUT21.jpg',
  'ESCAPE ROUT 21': 'ESCAPEROUT21.jpg',
  'DEAD END MISSION': 'DEADENDMISSON.jpg',
  'MISSION DARKNIGHT': 'MISSSIONDARKNIGHT.jpg',
  'THE SECRET ROUTE EP1': 'THESECRETROUTEP1.jpg',
  'THE SECRET ROUTE EP2': 'THESECRETROUTEP2.jpg',
  'THE SECRET ROUT EP 1': 'THESECRETROUTEP1.jpg',
  'THE SECRET ROUT EP 2': 'THESECRETROUTEP2.jpg',
  'THE SECRET ROUTE EP 1': 'THESECRETROUTEP1.jpg',
  'THE SECRET ROUTE EP 2': 'THESECRETROUTEP2.jpg',
  'SILENT CHASE': 'SCILENTCHASE.jpg',
  'SILENT TRIGGER': 'SCILENTTRIGGER.jpg',
};

/** Normalize any title or old filename to portrait/landscape basename. */
export function thumbFile(nameOrTitle: string): string {
  let raw = nameOrTitle.trim();
  raw = raw.replace(/^\/+(?:Potrait-New_desi|Landscape-New-Desi|portrait|landscape)\//i, '');
  raw = raw.replace(/\.jpe?g$/i, '');

  const upper = raw.replace(/\s+/g, ' ').toUpperCase();
  if (SPECIAL[upper]) return SPECIAL[upper];

  // Collapse spaces; keep punctuation used in asset names (, &)
  const collapsed = upper.replace(/\s+/g, '');
  if (SPECIAL[collapsed]) return SPECIAL[collapsed];

  // Common OCR/spelling variants in asset pack
  const variants = [
    collapsed,
    collapsed.replace(/ROUTE/g, 'ROUT'),
    collapsed.replace(/MISSION/g, 'MISSON'),
    collapsed.replace(/EVIDENCE/g, 'EVEDENCE'),
    collapsed.replace(/SILENT/g, 'SCILENT'),
    collapsed.replace(/MISSIONDARK/g, 'MISSSIONDARK'),
  ];
  for (const v of variants) {
    if (SPECIAL[v]) return SPECIAL[v];
  }

  return `${collapsed}.jpg`;
}

export function portraitSrc(nameOrTitle: string): string {
  return `/portrait/${thumbFile(nameOrTitle)}`;
}

export function landscapeSrc(nameOrTitle: string): string {
  return `/landscape/${thumbFile(nameOrTitle)}`;
}

/** Rewrite legacy image paths to /portrait or /landscape. */
export function rewriteThumbPath(path: string, preferLandscape = false): string {
  if (!path) return '/logo.png';
  if (/^https?:\/\//i.test(path)) return path;

  let src = path.trim();
  const isLegacy =
    /\/(Potrait-New_desi|Landscape-New-Desi|potrait_new_desicontent|landscape_new_desicontent|portrait|landscape)\//i.test(
      src
    );

  if (isLegacy) {
    const base = src.split('/').pop() || src;
    src = preferLandscape || /landscape/i.test(path) ? landscapeSrc(base) : portraitSrc(base);
  } else if (preferLandscape && src.includes('/portrait/')) {
    src = src.replace('/portrait/', '/landscape/');
  }

  try {
    return encodeURI(src);
  } catch {
    return src;
  }
}
