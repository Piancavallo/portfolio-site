import usaMap from '@svg-maps/usa';
import worldMap from '@svg-maps/world';
import { svgPathBbox } from 'svg-path-bbox';

export type GeoOutline = {
  viewBox: string;
  d: string;
  label: string;
};

function cropViewBox(path: string, pad = 10): string {
  const [minX, minY, maxX, maxY] = svgPathBbox(path);
  return `${minX - pad} ${minY - pad} ${maxX - minX + 2 * pad} ${maxY - minY + 2 * pad}`;
}

function usaOutline(stateId: string): GeoOutline {
  const loc = usaMap.locations.find((l) => l.id === stateId);
  if (!loc) throw new Error(`Unknown US state: ${stateId}`);
  return {
    viewBox: cropViewBox(loc.path),
    d: loc.path,
    label: loc.name,
  };
}

function worldOutline(countryId: string): GeoOutline {
  const loc = worldMap.locations.find((l) => l.id === countryId);
  if (!loc) throw new Error(`Unknown country: ${countryId}`);
  return {
    viewBox: cropViewBox(loc.path, 8),
    d: loc.path,
    label: loc.name,
  };
}

export const geoOutlines: Record<string, GeoOutline> = {
  'US-MD': usaOutline('md'),
  'US-AR': usaOutline('ar'),
  'US-KS': usaOutline('ks'),
  'US-CO': usaOutline('co'),
  'US-CA': usaOutline('ca'),
  'US-OH': usaOutline('oh'),
  'US-NV': usaOutline('nv'),
  'US-TX': usaOutline('tx'),
  'US-AL': usaOutline('al'),
  'US-MI': usaOutline('mi'),
  'US-NY': usaOutline('ny'),
  'US-UT': usaOutline('ut'),
  DE: worldOutline('de'),
  IT: worldOutline('it'),
  FR: worldOutline('fr'),
  ES: worldOutline('es'),
  CH: worldOutline('ch'),
};

export function getGeoOutline(key: string): GeoOutline | undefined {
  return geoOutlines[key];
}
