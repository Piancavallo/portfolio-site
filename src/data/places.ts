import { albumPhotoCaptions } from './albumPhotoCaptions';

const allAlbumImages = import.meta.glob('/src/images/albums/*/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export type PlacePhoto = {
  src: string;
  caption: string;
};

export type PlaceEntry = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  years: string;
  /** Optional line shown under the year range on the timeline. */
  yearsNote?: string;
  photos: PlacePhoto[];
  title: string;
  role?: string;
  org?: string;
  narrative: string;
  locationLabel: string;
  geo: string;
  marker: { x: number; y: number };
  /** @deprecated use narrative */
  caption?: string;
};

export type PlaceCategory = 'lived' | 'trip';

export type TimelineEntry = {
  place: PlaceEntry;
  category: PlaceCategory;
  startYear: number | null;
  endYear: number | null;
};

export type MapPlace = PlaceEntry;

export function getAlbumPhotos(albumName: string): PlacePhoto[] {
  const captionsForAlbum = albumPhotoCaptions[albumName] ?? {};
  return Object.entries(allAlbumImages)
    .filter(([path]) => path.includes(`/src/images/albums/${albumName}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, url]) => {
      const filename = path.split('/').pop() ?? '';
      const stem = filename.replace(/\.[^.]+$/, '');
      const caption =
        captionsForAlbum[filename] ??
        captionsForAlbum[`${stem}.HEIC`] ??
        captionsForAlbum[`${stem}.heic`] ??
        '';
      return {
        src: url,
        caption,
      };
    });
}

export function extractYearRange(years?: string) {
  if (!years) return { startYear: null as number | null, endYear: null as number | null };

  const normalized = years.toLowerCase();
  const matches = years.match(/\d{4}/g) ?? [];
  const parsedYears = matches.map((value) => Number(value)).filter((value) => Number.isFinite(value));

  const startYear = parsedYears.length > 0 ? parsedYears[0] : null;
  let endYear = parsedYears.length > 1 ? parsedYears[parsedYears.length - 1] : startYear;
  if (normalized.includes('present')) {
    endYear = new Date().getFullYear();
  }

  return { startYear, endYear };
}

export function getTimelineEntryKey(entry: Pick<TimelineEntry, 'place' | 'category'>) {
  return `${entry.category}-${entry.place.id}`;
}

export function formatYearRange(years: string, startYear: number | null, endYear: number | null) {
  if (years.toLowerCase().includes('present') && endYear) {
    return startYear ? `${startYear} – Present` : years;
  }
  if (startYear && endYear && startYear !== endYear) {
    return `${startYear} – ${endYear}`;
  }
  if (startYear) return `${startYear}`;
  return years;
}

/** US state name, or country name when outside the US. */
export function formatPlaceRegion(place: PlaceEntry): string {
  const label = place.locationLabel.trim();
  const parts = label
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  // "CITY, STATE/COUNTRY" → STATE/COUNTRY; "KANSAS" / "SWITZERLAND" → as-is
  const region = parts.length > 1 ? parts[parts.length - 1]! : parts[0] ?? place.name;

  return region
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export const PLACES_LIVED: PlaceEntry[] = [
  {
    id: 'Denton',
    name: 'Denton, MD',
    lat: 38.9,
    lng: -75.8,
    years: '2024 - Present',
    photos: getAlbumPhotos('Denton'),
    title: 'Eastern Shore',
    role: 'Partner & Developer',
    narrative:
      'I live on Maryland\'s eastern shore with my partner. Quiet water, long walks, and a good desk setup for building things.',
    locationLabel: 'DENTON, MARYLAND',
    geo: 'US-MD',
    marker: { x: 0.78, y: 0.52 }, // Easton / Eastern Shore
  },
  {
    id: 'Arkansas',
    name: 'Fayetteville, AR',
    lat: 36.2,
    lng: -93.5,
    years: '2023',
    photos: getAlbumPhotos('Arkansas'),
    title: 'It Ain\'t Much',
    role: 'Farmhand',
    org: 'Dripping Springs Garden',
    narrative:
      'Worked as a volunteer farmhand through summer into late fall. Made some good memories and friends here.',
    locationLabel: 'FAYETTEVILLE, ARKANSAS',
    geo: 'US-AR',
    marker: { x: 0.42, y: 0.35 },
  },
  {
    id: 'Kansas',
    name: 'Kansas',
    lat: 38.37,
    lng: -97.66,
    years: '2021 - 2023',
    yearsNote: 'and over the years',
    photos: getAlbumPhotos('Kansas'),
    title: 'Home Base',
    role: 'Caregiver',
    narrative:
      'Moved back home to Kansas after the Air Force to take care of my mom. Quieter days, family close by, and a stretch of life that asked for patience more than anything else.',
    locationLabel: 'KANSAS',
    geo: 'US-KS',
    marker: { x: 0.52, y: 0.42 },
  },
  {
    id: 'Colo Springs',
    name: 'Peterson AFB, Colorado Springs',
    lat: 38.8,
    lng: -104.7,
    years: '2017 - 2021',
    photos: getAlbumPhotos('Colorado'),
    title: 'Air Force in Colorado',
    role: 'Space Systems Operator',
    org: 'United States Air Force',
    narrative:
      'Four years at Peterson AFB beneath Pikes Peak. Long shifts, cold mornings, and weekends exploring the Front Range.',
    locationLabel: 'COLORADO SPRINGS, COLORADO',
    geo: 'US-CO',
    marker: { x: 0.60, y: 0.54 }, // Colorado Springs
  },
  {
    id: 'Monterey',
    name: 'Monterey, CA',
    lat: 36.6,
    lng: -121.8,
    years: '2011-2014',
    photos: getAlbumPhotos('Monterey'),
    title: 'Coastal California',
    narrative:
      'Middle school on the Monterey Peninsula. Foggy mornings, tide pools, and the aquarium becoming a second home.',
    locationLabel: 'MONTEREY, CALIFORNIA',
    geo: 'US-CA',
    marker: { x: 0.20, y: 0.55 }, // Monterey coast
  },
  {
    id: 'Ohio',
    name: 'Centerville, OH',
    lat: 39.6,
    lng: -84.2,
    years: '2007 - 2011',
    photos: getAlbumPhotos('Ohio'),
    title: 'Midwest Roots',
    narrative:
      'Four years in Centerville. Soccer teams, snow days, and the kind of suburban childhood that feels permanent in memory.',
    locationLabel: 'CENTERVILLE, OHIO',
    geo: 'US-OH',
    marker: { x: 0.18, y: 0.62 }, // Dayton area
  },
  {
    id: 'Italy',
    name: 'San Martino Di Campagna, Italy',
    lat: 46,
    lng: 12.6,
    years: '2004 - 2007',
    photos: getAlbumPhotos('Italy'),
    title: 'Molti Amici',
    role: 'Student',
    narrative:
      'Attended local Italian school where I became fluent and made "molti amici"!',
    locationLabel: 'SAN MARTINO, ITALY',
    geo: 'IT',
    marker: { x: 0.62, y: 0.20 }, // slightly north of Venice
  },
  {
    id: 'Vegas',
    name: 'Las Vegas, NV',
    lat: 36.3,
    lng: -115.2,
    years: '2001 - 2004',
    photos: getAlbumPhotos('Vegas'),
    title: 'Desert Days',
    narrative:
      'Early elementary school in the Mojave. Pool parties, red rocks on weekends, and learning that 110°F is just weather.',
    locationLabel: 'LAS VEGAS, NEVADA',
    geo: 'US-NV',
    marker: { x: 0.78, y: 0.84 }, // Las Vegas
  },
  {
    id: 'TX',
    name: 'San Angelo, TX',
    lat: 31.4,
    lng: -100.4,
    years: '2000 - 2001',
    photos: getAlbumPhotos('San Angelo'),
    title: 'West Texas Year',
    narrative: 'Remember the Alamo. Wait thats in San Antonio...',
    locationLabel: 'SAN ANGELO, TEXAS',
    geo: 'US-TX',
    marker: { x: 0.42, y: 0.52 },
  },
  {
    id: 'Silver Spring',
    name: 'Silver Spring, MD',
    lat: 39,
    lng: -77,
    years: '1999 - 2000',
    photos: getAlbumPhotos('Maryland'),
    title: 'Capital Suburbs',
    narrative:
      'I always said my favorite monument was the washington monument and my favorite place was the "grassy mall". Mom and I took the metro every day to get me to daycare.',
    locationLabel: 'SILVER SPRING, MARYLAND',
    geo: 'US-MD',
    marker: { x: 0.40, y: 0.58 }, // DC / Silver Spring
  },
  {
    id: 'Wichita',
    name: 'Wichita, KS',
    lat: 37.6,
    lng: -97.2,
    years: '1998 - 1999',
    photos: getAlbumPhotos('Wichita'),
    title: 'Heartland Stopover',
    narrative:
      'A brief year in Wichita before the next PCS orders came through. Early memories of prairie skies and family close by.',
    locationLabel: 'WICHITA, KANSAS',
    geo: 'US-KS',
    marker: { x: 0.48, y: 0.55 },
  },
  {
    id: 'Alabama',
    name: 'Auburn, AL',
    lat: 32.6,
    lng: -85.4,
    years: '1997 - 1998',
    photos: getAlbumPhotos('Auburn'),
    title: 'Deep South Year',
    narrative:
      'Not really sure what went on here, to be honest! I was 2. And we were only here for like a year. Air Force stuff.',
    locationLabel: 'AUBURN, ALABAMA',
    geo: 'US-AL',
    marker: { x: 0.55, y: 0.38 },
  },
  {
    id: 'Germany',
    name: 'Wurzburg, Germany',
    lat: 50,
    lng: 10,
    years: 'Birth (1995) - 1996',
    photos: getAlbumPhotos('Germany'),
    title: 'The Beginning',
    narrative: 'I was born at a very early age, on a US base in Wurzburg, Germany.',
    locationLabel: 'WURZBURG, GERMANY',
    geo: 'DE',
    marker: { x: 0.52, y: 0.48 },
  },
];

export const PLACES_TRAVELED: PlaceEntry[] = [
  {
    id: 'San Antonio',
    name: 'San Antonio',
    lat: 29.42,
    lng: -98.49,
    years: 'Trip 2009 & USAF boot camp 2017',
    photos: getAlbumPhotos('San Antonio'),
    title: 'Boot Camp & Grandma',
    narrative:
      'My late grandma Becky lived in San Antonio, and also Air Force boot camp is based here.',
    locationLabel: 'SAN ANTONIO, TEXAS',
    geo: 'US-TX',
    marker: { x: 0.48, y: 0.72 },
  },
  {
    id: 'Michigan',
    name: 'Michigan trip',
    lat: 43.9,
    lng: -83.3,
    years: '2008',
    photos: getAlbumPhotos('Michigan trip'),
    title: 'Caseville Cousins',
    narrative: 'Vacation in Caseville, MI. Massive week for the cousins.',
    locationLabel: 'CASEVILLE, MICHIGAN',
    geo: 'US-MI',
    marker: { x: 0.42, y: 0.55 },
  },
  {
    id: 'Niagara Falls',
    name: 'Niagara trip',
    lat: 43.09,
    lng: -79.05,
    years: '2010',
    photos: getAlbumPhotos('Niagara'),
    title: 'Falls & Fear',
    narrative:
      'Family trip to Niagara falls while we lived in Ohio. My little brother kept trying to climb over the railings, had us all scared half to death.',
    locationLabel: 'NIAGARA FALLS, NEW YORK',
    geo: 'US-NY',
    marker: { x: 0.38, y: 0.42 },
  },
  {
    id: 'Normandy France',
    name: 'Normandy France',
    lat: 49.33,
    lng: -0.56,
    years: 'Trip 2007',
    photos: getAlbumPhotos('Normandy France'),
    title: 'Behind Enemy Lines',
    narrative:
      'Camping trip with my dad and friend Andrew. My dad is a WWII buff and we toured many of the historic sites of the war.',
    locationLabel: 'NORMANDY, FRANCE',
    geo: 'FR',
    marker: { x: 0.32, y: 0.38 },
  },
  {
    id: 'Paris',
    name: 'Paris',
    lat: 48.8582,
    lng: 2.2949,
    years: 'Trip 2007',
    photos: getAlbumPhotos('Paris'),
    title: 'City of Light',
    narrative: 'Visited France a couple of times, one for a wedding and again for the sights of Paris.',
    locationLabel: 'PARIS, FRANCE',
    geo: 'FR',
    marker: { x: 0.48, y: 0.42 },
  },
  {
    id: 'Switzerland',
    name: 'Switzerland trip',
    lat: 46.6598,
    lng: 7.8348,
    years: 'Trip 2006',
    photos: getAlbumPhotos('Switzerland'),
    title: 'Alpine Alive',
    narrative: 'These hills are, in fact, alive.',
    locationLabel: 'SWITZERLAND',
    geo: 'CH',
    marker: { x: 0.5, y: 0.5 },
  },
  {
    id: 'Venice',
    name: 'Venice',
    lat: 45.434126,
    lng: 12.339216,
    years: 'Multiple trips 2004-2007, and later in 2018',
    photos: getAlbumPhotos('Venice'),
    title: 'Enough Venice',
    narrative:
      'One of my most iconic quotes that my mom likes to laugh about is when we were deciding what we would do when my cousin came to visit us in Italy, and my mom said we should obviously take them to see Venice, to which I sighed and said, "I think I\'ve seen Venice enough times."',
    locationLabel: 'VENICE, ITALY',
    geo: 'IT',
    marker: { x: 0.52, y: 0.48 },
  },
  {
    id: 'Canary Islands',
    name: 'Canary Islands',
    lat: 28.291565,
    lng: -16.629129,
    years: 'Trip 2007',
    photos: getAlbumPhotos('Canary Islands'),
    title: 'Pool Drama',
    narrative:
      'Family vacation to the Canary Islands. Funnily enough, the main thing I remember about this trip is slipping on the pool stairs and landing on my shins and screaming "I\'m dead!!!"',
    locationLabel: 'CANARY ISLANDS, SPAIN',
    geo: 'ES',
    marker: { x: 0.22, y: 0.62 },
  },
  {
    id: 'Monterey trip',
    name: 'Monterey Trip, CA',
    lat: 36.598,
    lng: -121.896,
    years: '2003',
    photos: getAlbumPhotos('Monterey Trip'),
    title: 'Fish Feeder Dreams',
    narrative:
      'Came here when we were living in Las Vegas. Pivotal moment of my life where I decided I wanted to become a "fish feeder" when I grow up.',
    locationLabel: 'MONTEREY, CALIFORNIA',
    geo: 'US-CA',
    marker: { x: 0.20, y: 0.55 }, // Monterey coast
  },
  {
    id: 'Zion',
    name: 'Zion, UT',
    lat: 37.2978,
    lng: -113.0287,
    years: '2002',
    photos: getAlbumPhotos('Zion'),
    title: 'Red Rock Wonder',
    narrative:
      'Trip to Zion National Park. Somewhere I have more pictures of this trip, but for now here is exactly one I could find.',
    locationLabel: 'ZION, UTAH',
    geo: 'US-UT',
    marker: { x: 0.42, y: 0.35 },
  },
];

export function getTimelineEntries(): TimelineEntry[] {
  const livedEntries = PLACES_LIVED.map((place, originalIndex) => ({
    place,
    category: 'lived' as const,
    originalIndex,
    sourceOffset: 0,
    ...extractYearRange(place.years),
  }));
  const tripEntries = PLACES_TRAVELED.map((place, originalIndex) => ({
    place,
    category: 'trip' as const,
    originalIndex,
    sourceOffset: 1000,
    ...extractYearRange(place.years),
  }));

  return [...livedEntries, ...tripEntries]
    .sort((a, b) => {
      if (a.startYear !== null && b.startYear !== null && a.startYear !== b.startYear) {
        return a.startYear - b.startYear;
      }
      if (a.endYear !== null && b.endYear !== null && a.endYear !== b.endYear) {
        return a.endYear - b.endYear;
      }
      if (a.startYear === null && b.startYear !== null) return 1;
      if (a.startYear !== null && b.startYear === null) return -1;
      return a.originalIndex + a.sourceOffset - (b.originalIndex + b.sourceOffset);
    })
    .map(({ place, category, startYear, endYear }) => ({
      place,
      category,
      startYear,
      endYear,
    }));
}

/** Lived places only, newest first (for the /map editorial timeline). */
export function getLivedTimelineEntries(): TimelineEntry[] {
  return PLACES_LIVED.map((place, originalIndex) => ({
    place,
    category: 'lived' as const,
    originalIndex,
    ...extractYearRange(place.years),
  }))
    .sort((a, b) => {
      const aEnd = a.endYear ?? a.startYear ?? 0;
      const bEnd = b.endYear ?? b.startYear ?? 0;
      if (aEnd !== bEnd) return bEnd - aEnd;
      const aStart = a.startYear ?? 0;
      const bStart = b.startYear ?? 0;
      if (aStart !== bStart) return bStart - aStart;
      return a.originalIndex - b.originalIndex;
    })
    .map(({ place, category, startYear, endYear }) => ({
      place,
      category,
      startYear,
      endYear,
    }));
}

export type AlbumDrawerItem = {
  id: string;
  title: string;
  intro: string;
  images: PlacePhoto[];
  emptyFolderHint: string;
};

export function getAlbumDrawerItems(): AlbumDrawerItem[] {
  return getTimelineEntries().map((entry) => ({
    id: getTimelineEntryKey(entry),
    title: entry.place.title,
    intro: entry.place.narrative,
    images: entry.place.photos,
    emptyFolderHint: `src/images/albums/${entry.place.id}/`,
  }));
}

export function getLivedAlbumDrawerItems(): AlbumDrawerItem[] {
  return getLivedTimelineEntries().map((entry) => ({
    id: getTimelineEntryKey(entry),
    title: entry.place.title,
    intro: entry.place.narrative,
    images: entry.place.photos,
    emptyFolderHint: `src/images/albums/${entry.place.id}/`,
  }));
}

export const ME = {
  name: 'Conner Myers',
  home: { lat: 38.884, lng: -75.827 },
};
