// src/components/PortfolioMap.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { albumPhotoCaptions } from '../data/albumPhotoCaptions';

const ME = {
  name: 'Conner Myers',
  title: 'Your Title / Tagline',
  photo: '/images/Me.jpg',
  home: { lat: 38.884, lng: -75.827 },
};

const allAlbumImages = import.meta.glob('/src/images/albums/*/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

function getAlbumPhotos(albumName: string) {
  const captionsForAlbum = albumPhotoCaptions[albumName] ?? {};
  return Object.entries(allAlbumImages)
    .filter(([path]) => path.includes(`/src/images/albums/${albumName}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, url]) => {
      const filename = path.split('/').pop() ?? '';
      return {
        src: url,
        caption: captionsForAlbum[filename] ?? '',
      };
    });
}

// Places I've lived
const PLACES_LIVED = [
  {
    id: 'Denton',
    name: 'Denton, MD',
    lat: 38.884,
    lng: -75.827,
    years: '2024 - Present',
    photos: getAlbumPhotos('Denton'),
  },
  {
    id: 'Arkansas',
    name: 'Fayetteville, AR',
    lat: 36.2,
    lng: -93.57,
    photos: getAlbumPhotos('Arkansas'),
    years: '2023',
    caption:
      'Worked as a volunteer farmhand through summer into late fall. Waking up at 3am on Saturdays for farmers markets was definitely worth it. Made some good friends, too.',
  },
  {
    id: 'Kansas',
    name: 'Kansas',
    lat: 38.3708,
    lng: -97.6642,
    years: 'Over the yars',
    photos: getAlbumPhotos('Kansas'),
    caption:
      'Visited here multiple times throughout my life for holidays. A lot of these pictures come from many 4th of Julys in my Aunt\'s backyard with a pool.',
  },
  {
    id: 'Colo Springs',
    name: 'Peterson AFB, Colorado Springs',
    lat: 38.828,
    lng: -104.708,
    years: '2017 - 2021',
    photos: getAlbumPhotos('Colorado'),
  },
  {
    id: 'Monterey',
    name: 'Monterey, CA',
    lat: 36.586,
    lng: -121.879,
    years: '2011-2014',
    photos: getAlbumPhotos('Monterey'),
  },
  {
    id: 'Ohio',
    name: 'Centerville, OH',
    lat: 39.643,
    lng: -84.195,
    years: '2007 - 2011',
    photos: getAlbumPhotos('Ohio'),
  },
  {
    id: 'Italy',
    name: 'San Martino Di Campagna, Italy',
    lat: 46.077,
    lng: 12.652,
    years: '2004 - 2007',
    photos: getAlbumPhotos('Italy'),
    caption: 'Attended local Italian school where I became fluent and made "molti amici"!',
  },
  {
    id: 'Vegas',
    name: 'Las Vegas, NV',
    lat: 36.303,
    lng: -115.2636,
    years: '2001 - 2004',
    photos: getAlbumPhotos('Vegas'),
  },
  {
    id: 'TX',
    name: 'San Angelo, TX',
    lat: 31.4307,
    lng: -100.4237,
    years: '2000 - 2001',
    photos: getAlbumPhotos('San Angelo'),
    caption: 'Remember the Alamo. Wait thats in San Antonio...',
  },
  {
    id: 'Maryland',
    name: 'Silver Spring, MD',
    lat: 38.9976,
    lng: -77.0398,
    years: '1999 - 2000',
    photos: getAlbumPhotos('Maryland'),
    caption: 'I always said my favorite monument was the washington monument and my favorite place was the "grassy mall". Mom and I took the metro every day to get me to daycare. I remember when family came to visit and I was showing them how to operate the metro ticket booth, they were rather impressed.',
  },
  {
    id: 'Wichita',
    name: 'Wichita, KS',
    lat: 37.666,
    lng: -97.22,
    years: '1998 - 1999',
    photos: getAlbumPhotos('Wichita'),
  },
  {
    id: 'Alabama',
    name: 'Auburn, AL',
    lat: 32.609,
    lng: -85.482,
    years: '1997 - 1998',
    photos: getAlbumPhotos('Auburn'),
    caption:
      'Not really sure what went on here, to be honest! I Was 2. And we were only here for like a year. Air Force stuff.',
  },
  {
    id: 'Germany',
    name: 'Wurzburg, Germany',
    lat: 49.8773,
    lng: 10.0875,
    years: 'Birth (1995) - 1996',
    photos: getAlbumPhotos('Germany'),
    caption: 'I was born at a very early age, on a US base in Wurzburg, Germany.',
  },
];

const PLACES_TRAVELED = [
  {
    id: 'San Antonio',
    name: 'San Antonio',
    lat: 29.422887,
    lng: -98.486266,
    years: 'Trip 2009 & USAF boot camp 2017',
    photos: getAlbumPhotos('San Antonio'),
    caption: 'My late grandma Becky lived in San Antonio, and also Air Force boot camp is based here.',
  },
  {
    id: 'Michigan',
    name: 'Michigan trip',
    lat: 43.949154,
    lng: -83.276714,
    years: '2008',
    photos: getAlbumPhotos('Michigan trip'),
    caption: 'Vacation in Caseville, MI. Massive week for the cousins.',
  },

  {
    id: 'Niagara Falls',
    name: 'Niagara trip',
    lat: 43.09,
    lng: -79.047,
    years: '2010',
    photos: getAlbumPhotos('Niagara'),
    caption: 'Family trip to Niagara falls while we lived in Ohio. My little brother kept trying to climb over the railings, had us all scared half to death.',
  },
  {
    id: 'Normandy France',
    name: 'Normandy France',
    lat: 49.334080,
    lng: -0.563171,
    years: 'Trip 2007',
    photos: getAlbumPhotos('Normandy France'),
    caption: 'Camping trip with my dad and friend Andrew. My dad is a WWII buff and we toured many of the historic sites of the war. Here is me and Andrew crawling behind enemy lines.',
  },
  {
    id: 'Paris',
    name: 'Paris',
    lat: 48.858210,
    lng: 2.294948,
    years: 'Trip 2007',
    photos: getAlbumPhotos('Paris'),
    caption: 'Visited France a couple of times, one for a wedding and again for the sights of Paris.',
  },
  {
    id: 'Switzerland',
    name: 'Switzerland trip',
    lat: 46.6598,
    lng: 7.8348,
    years: 'Trip 2006',
    photos: getAlbumPhotos('Switzerland'),
    caption: 'These hills are, in fact, alive.',
  },
  {
    id: 'Venice',
    name: 'Venice',
    lat: 45.434126,
    lng: 12.339216,
    years: 'Multiple trips 2004-2007, and later in 2018',
    photos: getAlbumPhotos('Venice'),
    caption: 'One of my most iconic quotes that my mom likes to laugh about is when we were deciding what we would do when my cousin came to visit us in Italy, and my mom said we should obviously take them to see Venice, to which I sighed and said, "I think I\'ve seen Venice enough times."',
  },
  {
    id: 'Canary Islands',
    name: 'Canary Islands',
    lat: 28.291565,
    lng: -16.629129,
    years: 'Trip 2007',
    photos: getAlbumPhotos('Canary Islands'),
    caption: 'Family vacation to the Canary Islands. Funnily enough, the main thing I remember about this trip is slipping on the pool stairs and landing on my shins and screaming "I\'m dead!!!", a dramatic performance that everyone within earshot gathered to witness.',
  },
  {
    id: 'Monterey trip',
    name: 'Monterey Trip, CA',
    lat: 36.598,
    lng: -121.896,
    years: '2003',
    photos: getAlbumPhotos('Monterey Trip'),
    caption: 'Came here when we were living in Las Vegas. Pivotal moment of my life where I decided I wanted to become a "fish feeder" when I grow up, referring to the scuba diver who performed a fish feeding show for us in the kelp forest exhibit at the Monterey Bay Aquarium.',
  },
  {
    id: 'Zion',
    name: 'Zion, UT',
    lat: 37.2978,
    lng: -113.0287,
    years: '2002',
    photos: getAlbumPhotos('Zion'),
    caption: 'Trip to Zion National Park. Somewhere I have more pictures of this trip, but for now here is exactly one I could find.',
  },
];

const ZOOM_START = 3;
const ZOOM_HOME = 5;
type MapPlace = (typeof PLACES_LIVED)[number] | (typeof PLACES_TRAVELED)[number];
type PlaceCategory = 'lived' | 'trip';
type TimelineEntry = {
  place: MapPlace;
  category: PlaceCategory;
};
type WaypointPanDetail = {
  lat: number;
  lng: number;
  zoom?: number;
};

function getTimelineEntryKey(entry: TimelineEntry) {
  return `${entry.category}-${entry.place.id}`;
}

function extractYearRange(years?: string) {
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

function useESTClock() {
  const [time, setTime] = useState('');
  const [isDaytime, setIsDaytime] = useState(true);

  useEffect(() => {
    const tick = () => {
      const now = new Date();

      const est = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(now);

      const hour = parseInt(
        new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/New_York',
          hour: 'numeric',
          hour12: false,
        }).format(now)
      );

      setTime(est + ' EST');
      setIsDaytime(hour >= 6 && hour < 20);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return { time, isDaytime };
}

export default function PortfolioMap() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const expandedRef = useRef(false);
  const thumbnailRowRef = useRef<HTMLDivElement>(null);
  const thumbnailButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const timelineRowRef = useRef<HTMLDivElement>(null);
  const timelineCardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [expanded, setExpanded] = useState(false);
  const [activePlace, setActivePlace] = useState<MapPlace | null>(null);
  const [activePlaceCategory, setActivePlaceCategory] = useState<PlaceCategory>('lived');
  const [panelVisible, setPanelVisible] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  const { time, isDaytime } = useESTClock();
  const timelineEntries = useMemo(() => {
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
        return (a.originalIndex + a.sourceOffset) - (b.originalIndex + b.sourceOffset);
      })
      .map((entry): TimelineEntry => ({ place: entry.place, category: entry.category }));
  }, []);

  const timelineStartEntry =
    timelineEntries.find((entry) => entry.place.id === 'Germany') ?? timelineEntries[0] ?? null;
  const activeTimelineKey = activePlace ? `${activePlaceCategory}-${activePlace.id}` : null;
  const activeTimelineIndex = activeTimelineKey
    ? timelineEntries.findIndex((entry) => getTimelineEntryKey(entry) === activeTimelineKey)
    : -1;

  function setMapInteractivity(isInteractive: boolean) {
    const map = mapRef.current;
    if (!map) return;

    const methodNames = [
      'dragging',
      'touchZoom',
      'doubleClickZoom',
      'scrollWheelZoom',
      'boxZoom',
      'keyboard',
    ];

    methodNames.forEach((methodName) => {
      const handler = map[methodName];
      if (!handler) return;
      if (isInteractive) {
        handler.enable?.();
      } else {
        handler.disable?.();
      }
    });

    if (map.tap) {
      if (isInteractive) {
        map.tap.enable?.();
      } else {
        map.tap.disable?.();
      }
    }
  }

  useEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);

  useEffect(() => {
    document.body.classList.toggle('map-expanded', expanded);
    return () => {
      document.body.classList.remove('map-expanded');
    };
  }, [expanded]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    if (expanded) {
      el.style.position = 'fixed';
      el.style.inset = '0';
      el.style.height = '100vh';
      el.style.zIndex = '9999';
    } else {
      el.style.position = 'relative';
      el.style.inset = '';
      el.style.height = '';
      el.style.zIndex = '';
    }

    setTimeout(() => mapRef.current?.invalidateSize(), 50);
    setMapInteractivity(expanded);
  }, [expanded]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('map-styles')) {
      const style = document.createElement('style');
      style.id = 'map-styles';
      style.textContent = `
        @keyframes mapPulse {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(3.5); opacity: 0;   }
        }
        .pulse-ring {
          animation: mapPulse 1.8s ease-out infinite;
          transform-origin: 25px 25px;
        }
        .leaflet-container {
          background: #eef2ef;
        }
      `;
      document.head.appendChild(style);
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.onload = () => initMap();
    document.head.appendChild(script);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  function initMap() {
    const L = (window as any).L;
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: [ME.home.lat, ME.home.lng],
      zoom: ZOOM_START,
      zoomControl: false,
      attributionControl: false,
    });

    mapRef.current = map;
    setMapInteractivity(false);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      crossOrigin: true,
    }).addTo(map);

    setTimeout(() => {
      map.flyTo([ME.home.lat, ME.home.lng], ZOOM_HOME, {
        animate: true,
        duration: 2.8,
        easeLinearity: 0.15,
      });
    }, 1800);

    map.once('moveend', () => {
      addHomeDot(L, map);
      addPlacePins(L, map);
      addTripPins(L, map);
    });
  }

  function addHomeDot(L: any, map: any) {
    const icon = L.divIcon({
      className: '',
      iconSize: [50, 50],
      iconAnchor: [25, 25],
      html: `
        <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" overflow="visible">
          <circle class="pulse-ring" cx="25" cy="25" r="8" fill="#3b82f6" opacity="0.4"/>
          <circle cx="25" cy="25" r="8" fill="#3b82f6"/>
          <circle cx="25" cy="25" r="8" fill="none" stroke="white" stroke-width="2.5"/>
        </svg>`,
    });

    const marker = L.marker([ME.home.lat, ME.home.lng], { icon }).addTo(map);

    marker.on('click', () => {
      if (!expandedRef.current) return;
      const home = PLACES_LIVED.find((p) => p.lat === ME.home.lat && p.lng === ME.home.lng);
      if (home) {
        focusPlace(home, 'lived');
      }
    });

    const el = marker.getElement();
    if (el) {
      el.style.cursor = 'pointer';
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.4s ease';
      requestAnimationFrame(() => {
        el.style.opacity = '1';
      });
    }
  }

  function addPlacePins(L: any, map: any) {
    PLACES_LIVED.forEach((place) => {
      if (place.lat === ME.home.lat && place.lng === ME.home.lng) return;

      const icon = L.divIcon({
        className: '',
        iconSize: [24, 32],
        iconAnchor: [12, 32],
        html: `
          <svg width="24" height="32" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20S24 21 24 12C24 5.373 18.627 0 12 0z" fill="#8b2725"/>
            <circle cx="12" cy="12" r="5" fill="white" opacity="0.9"/>
          </svg>`,
      });

      const marker = L.marker([place.lat, place.lng], { icon }).addTo(map);

      marker.on('click', () => {
        if (!expandedRef.current) return;
        focusPlace(place, 'lived');
      });

      const el = marker.getElement();
      if (el) {
        el.style.cursor = 'pointer';
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.4s ease';
        requestAnimationFrame(() => {
          el.style.opacity = '1';
        });
      }
    });
  }

  function addTripPins(L: any, map: any) {
    PLACES_TRAVELED.forEach((place) => {
      const icon = L.divIcon({
        className: '',
        iconSize: [24, 32],
        iconAnchor: [12, 32],
        html: `
          <svg width="24" height="32" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20S24 21 24 12C24 5.373 18.627 0 12 0z" fill="#3b82f6"/>
            <circle cx="12" cy="12" r="5" fill="white" opacity="0.9"/>
          </svg>`,
      });

      const marker = L.marker([place.lat, place.lng], { icon }).addTo(map);

      marker.on('click', () => {
        if (!expandedRef.current) return;
        focusPlace(place, 'trip');
      });

      const el = marker.getElement();
      if (el) {
        el.style.cursor = 'pointer';
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.4s ease';
        requestAnimationFrame(() => {
          el.style.opacity = '1';
        });
      }
    });
  }

  function closePanel() {
    setPanelVisible(false);
    setGalleryOpen(false);
    setSelectedPhoto(null);
    setTimeout(() => setActivePlace(null), 300);
  }

  function openGallery() {
    if (activePlace && 'photos' in activePlace && activePlace.photos.length > 0) {
      setSelectedPhoto(activePlace.photos[0]);
      setGalleryOpen(true);
    }
  }

  function handleThumbnailWheel(e: React.WheelEvent<HTMLDivElement>) {
    if (!thumbnailRowRef.current) return;
  
    e.preventDefault();
    thumbnailRowRef.current.scrollLeft += e.deltaY;
  }

  function showNextPhoto() {
    if (!activePlace || !('photos' in activePlace) || !selectedPhoto) return;
  
    const currentIndex = activePlace.photos.indexOf(selectedPhoto);
    const nextIndex = (currentIndex + 1) % activePlace.photos.length;
  
    setSelectedPhoto(activePlace.photos[nextIndex]);
  }
  
  function showPreviousPhoto() {
    if (!activePlace || !('photos' in activePlace) || !selectedPhoto) return;
  
    const currentIndex = activePlace.photos.indexOf(selectedPhoto);
    const previousIndex =
      (currentIndex - 1 + activePlace.photos.length) % activePlace.photos.length;
  
    setSelectedPhoto(activePlace.photos[previousIndex]);
  }

  function focusPlace(place: MapPlace, category: PlaceCategory = 'lived') {
    setActivePlace(place);
    setActivePlaceCategory(category);
    setPanelVisible(true);
    setGalleryOpen(false);
    setSelectedPhoto(null);

    mapRef.current?.flyTo([place.lat, place.lng], 10, {
      animate: true,
      duration: 1.2,
    });
  }

  function panToPlace(place: MapPlace, category: PlaceCategory = 'lived') {
    setActivePlace(place);
    setActivePlaceCategory(category);
    mapRef.current?.flyTo([place.lat, place.lng], 10, {
      animate: true,
      duration: 1.2,
    });
  }

  function navigatePlaces(direction: 1 | -1) {
    if (!timelineEntries.length) return;
    const startIndex = timelineStartEntry
      ? timelineEntries.findIndex((entry) => entry.place.id === timelineStartEntry.place.id)
      : 0;
    const safeStartIndex = startIndex >= 0 ? startIndex : 0;
    const lastIndex = timelineEntries.length - 1;

    const currentIndex = activePlace
      ? timelineEntries.findIndex((entry) => entry.place.id === activePlace.id)
      : safeStartIndex;

    if (currentIndex < 0) return;

    if (direction === -1 && currentIndex <= safeStartIndex) {
      return;
    }

    const nextIndex = direction === 1
      ? currentIndex >= lastIndex
        ? safeStartIndex
        : currentIndex + 1
      : currentIndex - 1;
    const nextEntry = timelineEntries[nextIndex];
    if (!nextEntry) return;

    panToPlace(nextEntry.place, nextEntry.category);
  }

  function handleTimelineWheel(e: React.WheelEvent<HTMLDivElement>) {
    if (!timelineRowRef.current) return;
    e.preventDefault();
    timelineRowRef.current.scrollLeft += e.deltaY;
  }

  function nudgeTimeline(direction: 1 | -1) {
    if (!timelineRowRef.current) return;
    timelineRowRef.current.scrollBy({ left: direction * 180, behavior: 'smooth' });
  }

  function handleExpandClick() {
    setExpanded(true);
  }

  useEffect(() => {
    function handleWaypointPan(event: Event) {
      const customEvent = event as CustomEvent<WaypointPanDetail>;
      const detail = customEvent.detail;
      if (!detail || typeof detail.lat !== 'number' || typeof detail.lng !== 'number') return;

      const targetZoom = detail.zoom ?? (expandedRef.current ? 6.8 : ZOOM_HOME);
      mapRef.current?.flyTo([detail.lat, detail.lng], targetZoom, {
        animate: true,
        duration: 1.05,
        easeLinearity: 0.2,
      });
    }

    window.addEventListener('waypoint:pan-map', handleWaypointPan as EventListener);
    return () => {
      window.removeEventListener('waypoint:pan-map', handleWaypointPan as EventListener);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!expandedRef.current) return;

      if (galleryOpen && e.key === 'Escape') {
        setGalleryOpen(false);
        return;
      }

      if (galleryOpen && e.key === 'ArrowRight') {
        e.preventDefault();
        showNextPhoto();
        return;
      }

      if (galleryOpen && e.key === 'ArrowLeft') {
        e.preventDefault();
        showPreviousPhoto();
        return;
      }

      if (!galleryOpen && e.key === 'ArrowRight') {
        e.preventDefault();
        navigatePlaces(1);
        return;
      }

      if (!galleryOpen && e.key === 'ArrowLeft') {
        e.preventDefault();
        navigatePlaces(-1);
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [galleryOpen, activePlace, selectedPhoto, timelineEntries]);

  useEffect(() => {
    if (!expanded || activeTimelineIndex < 0) return;
    const entry = timelineEntries[activeTimelineIndex];
    if (!entry) return;
    const cardKey = getTimelineEntryKey(entry);
    const activeCard = timelineCardRefs.current[cardKey];
    activeCard?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [expanded, activeTimelineIndex, timelineEntries]);

  useEffect(() => {
    if (!galleryOpen || !selectedPhoto?.src) return;
    const thumb = thumbnailButtonRefs.current[selectedPhoto.src];
    thumb?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [galleryOpen, selectedPhoto]);

  return (
    <>
      <div ref={wrapperRef} className="relative w-full h-72">
      {expanded && (
        <div className="absolute top-4 left-4 right-4 z-30 flex items-start gap-3">
          <button
            onClick={() => setExpanded(false)}
            className="h-11 w-11 shrink-0 rounded-full border-2 border-[#8b2725] bg-[#f6dfd7]/95 text-[#8b2725] shadow-[0_8px_18px_rgba(79,32,29,0.24),inset_0_0_0_1px_rgba(255,244,240,0.85),inset_0_0_0_3px_rgba(139,39,37,0.15)] hover:bg-[#f3d0c3] hover:text-[#c96f4a] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c96f4a] flex items-center justify-center"
            aria-label="Close map"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="min-w-0 flex-1 rounded-[2px] border border-[#2a3a4a] px-4 py-5 shadow-[0_10px_22px_rgba(42,36,28,0.12),inset_0_0_0_1px_rgba(255,252,244,0.85),inset_0_0_0_3px_#f0e4cf,inset_0_0_0_4px_#2a3a4a]"
            style={{
              backgroundColor: '#f4ead8',
              backgroundImage: 'linear-gradient(165deg, #f7ecd7 0%, #efe2c8 55%, #e8d9b8 100%)',
            }}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => nudgeTimeline(-1)}
                className="h-12 w-12 shrink-0 rounded-full border border-[#bfcee4] text-[#456488] hover:border-[#3b82f6] hover:bg-[#edf5ff] hover:text-[#245ea2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b82f6]"
                aria-label="Scroll timeline left"
              >
                ←
              </button>
              <div
                ref={timelineRowRef}
                onWheel={handleTimelineWheel}
                className="flex-1 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none]"
              >
                <div className="flex gap-3 min-w-max">
                  {timelineEntries.map((entry) => {
                    const cardKey = getTimelineEntryKey(entry);
                    const isActive = activeTimelineKey === cardKey;
                    return (
                      <button
                        key={cardKey}
                        ref={(el) => {
                          timelineCardRefs.current[cardKey] = el;
                        }}
                        type="button"
                        onClick={() => focusPlace(entry.place, entry.category)}
                        aria-current={isActive ? 'true' : undefined}
                        className={`shrink-0 rounded-lg border px-4 py-5 text-left transition ${
                          isActive
                            ? entry.category === 'trip'
                              ? 'border-[#3b82f6] bg-[#edf5ff] shadow-[0_0_0_1px_rgba(59,130,246,0.35),0_10px_20px_rgba(37,99,235,0.2)] ring-1 ring-[#3b82f6]/40'
                              : 'border-[#c96f4a] bg-[#fff7ee] shadow-[0_0_0_1px_rgba(201,111,74,0.35),0_10px_20px_rgba(201,111,74,0.18)] ring-1 ring-[#c96f4a]/40'
                            : 'border-[#d8cfc0] bg-[#fffdf8] hover:border-[#bfcee4] hover:bg-[#f4f8ff]'
                        }`}
                      >
                        <p className={`text-xs uppercase tracking-wider ${isActive ? 'text-[#4c5c6a]' : 'text-[#6b7280]'}`}>
                          {entry.place.years ?? 'Unknown years'}
                        </p>
                        <p className={`mt-1 text-sm font-semibold ${isActive ? 'text-[#1f2f3e]' : 'text-[#2f3a45]'}`}>
                          {entry.place.name}
                        </p>
                        <p className={`mt-1 text-xs font-semibold ${entry.category === 'trip' ? 'text-[#3b82f6]' : 'text-[#8b2725]'}`}>
                          {entry.category === 'trip' ? 'Visited' : 'Lived'}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
              <button
                type="button"
                onClick={() => nudgeTimeline(1)}
                className="h-12 w-12 shrink-0 rounded-full border border-[#bfcee4] text-[#456488] hover:border-[#3b82f6] hover:bg-[#edf5ff] hover:text-[#245ea2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b82f6]"
                aria-label="Scroll timeline right"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Map */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* Clock — top left, mini only */}
      {!expanded && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-[#fffdf8]/85 backdrop-blur-sm rounded-full px-3 py-1.5 border border-[#bfcee4] shadow-sm">
          <span className="text-base">{isDaytime ? '🌞' : '🌛'}</span>
          <span className="text-xs font-medium text-[#2c567f] tabular-nums">{time}</span>
        </div>
      )}

      {/* Search bar — bottom center, clicks to expand */}
      {!expanded && (
        <button
          onClick={handleExpandClick}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-20"
        >
          <div className="flex items-center gap-2 rounded-full bg-[#fffdf8] shadow-xl px-10 py-3.5 border-2 border-[#2a3a4a] hover:border-[#c96f4a] hover:shadow-2xl transition-shadow cursor-pointer">
            <svg
              className="w-4 h-4 text-[#3b82f6] shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="flex-1 text-base text-[#2f3a45] text-left">See where I've been</span>
          </div>
        </button>
      )}

      {/* Slide-in panel */}
      <div
        className={`absolute top-0 right-0 h-full w-80 bg-[#fffdf8] shadow-2xl z-40 flex flex-col transition-transform duration-300 border-l border-[#d8cfc0] ${
          panelVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {activePlace && (
          <>
            {'photos' in activePlace && activePlace.photos.length > 0 ? (
              <button onClick={openGallery} className="relative h-52 bg-[#ebe4d8] shrink-0 group text-left">
                <img src={activePlace.photos[0].src} alt={activePlace.name} className="w-full h-full object-cover" />

                <div className="absolute inset-0 bg-[#2f3a45]/35 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="text-[#fffdf8] text-sm font-medium">
                    View {activePlace.photos.length} photos
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closePanel();
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#fffdf8]/85 text-[#2f3a45] flex items-center justify-center hover:bg-[#fff7ee] transition-colors text-lg leading-none border border-[#d8cfc0]"
                >
                  ×
                </button>
              </button>
            ) : (
              <div className="relative h-52 bg-[#ebe4d8] shrink-0">
                <img
                  src={'photo' in activePlace && activePlace.photo ? activePlace.photo : '/images/Me.jpg'}
                  alt={activePlace.name}
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={closePanel}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#fffdf8]/85 text-[#2f3a45] flex items-center justify-center hover:bg-[#fff7ee] transition-colors text-lg leading-none border border-[#d8cfc0]"
                >
                  ×
                </button>
              </div>
            )}

            <div className="p-6 flex flex-col gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#6b7280] mb-1">
                  📍 {activePlaceCategory === 'trip' ? 'Visited here' : 'Lived here'}
                </p>
                <h2 className="text-xl font-bold text-[#2f3a45]">{activePlace.name}</h2>
                <p className="text-sm text-[#6b7280] mt-0.5">{activePlace.years}</p>
              </div>

              <p className="text-sm text-[#495563] leading-relaxed">{activePlace.caption}</p>

              {'photos' in activePlace && activePlace.photos.length > 0 && (
                <button
                  onClick={openGallery}
                  className="mt-2 rounded-full bg-[#c96f4a] text-[#fffdf8] text-sm font-medium py-2 hover:bg-[#b86340] transition"
                >
                  Open photo album
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Gallery modal */}
      {galleryOpen && activePlace && 'photos' in activePlace && (
        <div className="fixed inset-0 z-[10000] bg-[#2f3a45]/35 backdrop-blur-sm flex justify-center overflow-y-auto p-6">
          <div className="relative mt-10 mb-10 w-full max-w-6xl bg-[#fffdf8] rounded-2xl shadow-2xl border border-[#d8cfc0] grid grid-cols-1 md:grid-cols-[1fr_320px]">
  <button
    onClick={() => setGalleryOpen(false)}
    className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-[#fffdf8]/90 text-[#2f3a45] flex items-center justify-center hover:bg-[#fff7ee] transition-colors text-xl leading-none border border-[#d8cfc0]"
    aria-label="Close gallery"
  >
    ×
  </button>
  <div className="bg-[#f6f2ea] grid grid-rows-[1fr_auto] p-4 gap-4 h-[75vh]">
  <div className="flex items-center justify-center min-h-0">
    {selectedPhoto && (
      <img
        src={selectedPhoto.src}
        alt={selectedPhoto.caption || `${activePlace.name} photo`}
        className="max-h-full max-w-full object-contain rounded-lg"
      />
    )}
  </div>

  <div
  ref={thumbnailRowRef}
  onWheel={handleThumbnailWheel}
  className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
>
    {activePlace.photos.map((photo) => (
      <button
        key={photo.src}
        ref={(el) => {
          thumbnailButtonRefs.current[photo.src] = el;
        }}
        onClick={() => setSelectedPhoto(photo)}
        className={`shrink-0 rounded-lg overflow-hidden border transition ${
          selectedPhoto?.src === photo.src ? 'border-[#c96f4a]' : 'border-[#d8cfc0] hover:border-[#c96f4a]'
        }`}
      >
        <img
          src={photo.src}
          alt={`${activePlace.name} thumbnail`}
          className="w-24 aspect-square object-cover"
          loading="lazy"
        />
      </button>
    ))}
  </div>
</div>

            <aside className="p-5 border-l border-[#d8cfc0] flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#6b7280]">Photo album</p>
                <h3 className="text-lg font-bold text-[#2f3a45]">{activePlace.name}</h3>
                <p className="text-sm text-[#6b7280]">{activePlace.years}</p>
              </div>

              <div className="rounded-xl bg-[#f6f2ea] border border-[#d8cfc0] p-4 min-h-40">
  <p className="text-sm text-[#495563] leading-relaxed">
    {selectedPhoto?.caption ?? ''}
  </p>
</div>

              <button
                onClick={() => setGalleryOpen(false)}
                className="mt-auto rounded-full bg-[#c96f4a] text-[#fffdf8] text-sm font-medium py-2 hover:bg-[#b86340] transition"
              >
                Close gallery
              </button>
            </aside>
          </div>
        </div>
      )}

      {panelVisible && !galleryOpen && <div onClick={closePanel} className="absolute inset-0 z-30 bg-[#2f3a45]/20" />}
      </div>
    </>
  );
}