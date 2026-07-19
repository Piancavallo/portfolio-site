// src/components/PortfolioMap.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import GalleryPopoutDialog from './media/GalleryPopoutDialog';
import AlbumGallery from './media/AlbumGallery';
import { usePrefersReducedMotion } from './library/usePrefersReducedMotion';
import {
  ME,
  PLACES_LIVED,
  PLACES_TRAVELED,
  extractYearRange,
  getTimelineEntryKey,
  type MapPlace,
  type PlaceCategory,
  type TimelineEntry,
} from '../data/places';

function getPinTooltipLabel(place: { name: string; years?: string }) {
  return place.years ? `${place.name} · ${place.years}` : place.name;
}

function bindPinTooltip(marker: any, place: { name: string; years?: string }) {
  marker.bindTooltip(getPinTooltipLabel(place), {
    direction: 'top',
    offset: [0, -36],
    opacity: 1,
    className: 'map-pin-tooltip',
  });
}

const ZOOM_START = 3;
const ZOOM_HOME = 5;
const PREVIEW_FLY_DURATION = 2.2;
const PREVIEW_DWELL_MS = 6000;
const PREVIEW_START_DELAY_MS = 10000;

type ExpandMode = 'fullscreen' | 'modal';

type PortfolioMapProps = {
  expandMode?: ExpandMode;
  embedded?: boolean;
};

type WaypointPanDetail = {
  lat: number;
  lng: number;
  zoom?: number;
};

export default function PortfolioMap({ expandMode = 'fullscreen', embedded = false }: PortfolioMapProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const expandedRef = useRef(false);
  const timelineRowRef = useRef<HTMLDivElement>(null);
  const timelineCardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const previewIndexRef = useRef(-1);
  const tourStartedRef = useRef(false);

  const [expanded, setExpanded] = useState(false);
  const [activePlace, setActivePlace] = useState<MapPlace | null>(null);
  const [activePlaceCategory, setActivePlaceCategory] = useState<PlaceCategory>('lived');
  const [albumOpen, setAlbumOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(-1);
  const [previewHovered, setPreviewHovered] = useState(false);

  const prefersReducedMotion = usePrefersReducedMotion();
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

  const homePreviewPlace = PLACES_LIVED.find((place) => place.id === 'Denton') ?? null;
  const previewChipPlace =
    previewIndex >= 0 && timelineEntries[previewIndex]
      ? timelineEntries[previewIndex].place
      : homePreviewPlace;

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
    expandedRef.current = expanded || embedded;
    if (expanded) {
      tourStartedRef.current = false;
    } else if (!embedded) {
      setAlbumOpen(false);
      setActivePlace(null);
      if (expandMode === 'modal') {
        previewIndexRef.current = -1;
        setPreviewIndex(-1);
      }
    }
  }, [expanded, expandMode, embedded]);

  useEffect(() => {
    if (
      expanded ||
      embedded ||
      expandMode !== 'modal' ||
      !mapReady ||
      prefersReducedMotion ||
      previewHovered ||
      !timelineEntries.length
    ) {
      return;
    }

    let startTimeout: ReturnType<typeof setTimeout> | undefined;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const stepToIndex = (index: number) => {
      previewIndexRef.current = index;
      setPreviewIndex(index);
      const entry = timelineEntries[index];
      if (entry) flyToPreviewPlace(entry.place);
    };

    const advance = () => {
      const next = (previewIndexRef.current + 1) % timelineEntries.length;
      stepToIndex(next);
    };

    const beginInterval = () => {
      intervalId = setInterval(advance, PREVIEW_DWELL_MS);
    };

    if (!tourStartedRef.current) {
      startTimeout = setTimeout(() => {
        tourStartedRef.current = true;
        stepToIndex(0);
        beginInterval();
      }, PREVIEW_START_DELAY_MS);
    } else {
      beginInterval();
    }

    return () => {
      clearTimeout(startTimeout);
      clearInterval(intervalId);
    };
  }, [
    expanded,
    embedded,
    expandMode,
    mapReady,
    prefersReducedMotion,
    previewHovered,
    timelineEntries,
  ]);

  useEffect(() => {
    const useFullscreenBody = expanded && expandMode === 'fullscreen';
    const useModalBody = expanded && expandMode === 'modal';
    document.body.classList.toggle('map-expanded', useFullscreenBody);
    document.body.classList.toggle('map-modal-open', useModalBody);
    return () => {
      document.body.classList.remove('map-expanded');
      document.body.classList.remove('map-modal-open');
    };
  }, [expanded, expandMode]);

  useEffect(() => {
    if (!mapReady || !wrapperRef.current) return;
    wrapperRef.current.closest('.design-c__map-panel__inner')?.classList.add('map-ready');

    const panel = wrapperRef.current.closest('.design-c__map-panel__inner');
    if (!panel) return;

    const observer = new ResizeObserver(() => {
      mapRef.current?.invalidateSize();
    });
    observer.observe(panel);
    return () => observer.disconnect();
  }, [mapReady]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    if (expanded && expandMode === 'fullscreen') {
      el.style.position = 'fixed';
      el.style.inset = '0';
      el.style.top = '';
      el.style.left = '';
      el.style.transform = '';
      el.style.width = '';
      el.style.maxWidth = '';
      el.style.height = '100vh';
      el.style.maxHeight = '';
      el.style.zIndex = '9999';
      el.style.borderRadius = '';
      el.style.overflow = '';
      el.style.boxShadow = '';
    } else if (expanded && expandMode === 'modal') {
      el.style.position = 'fixed';
      el.style.inset = '';
      el.style.top = '50%';
      el.style.left = '50%';
      el.style.transform = 'translate(-50%, -50%)';
      el.style.width = 'min(94vw, 1000px)';
      el.style.maxWidth = 'min(94vw, 1000px)';
      el.style.height = 'min(82vh, 720px)';
      el.style.maxHeight = 'min(82vh, 720px)';
      el.style.zIndex = '9999';
      el.style.borderRadius = '16px';
      el.style.overflow = 'hidden';
      el.style.boxShadow = '0 24px 80px rgba(30, 45, 28, 0.35)';
    } else {
      el.style.position = '';
      el.style.inset = '';
      el.style.top = '';
      el.style.left = '';
      el.style.right = '';
      el.style.bottom = '';
      el.style.transform = '';
      el.style.width = '';
      el.style.maxWidth = '';
      el.style.height = '';
      el.style.maxHeight = '';
      el.style.zIndex = '';
      el.style.borderRadius = '';
      el.style.overflow = '';
      el.style.boxShadow = '';
    }

    setTimeout(() => mapRef.current?.invalidateSize(), 50);
    setMapInteractivity(expanded || embedded);
  }, [expanded, expandMode, embedded]);

  useEffect(() => {
    if (!expanded || expandMode !== 'modal') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !albumOpen) setExpanded(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded, expandMode, albumOpen]);

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
        .leaflet-tooltip.map-pin-tooltip {
          background: #f5f0e6;
          border: 1px solid #4a7c59;
          color: #1e3d24;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.35rem 0.65rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(44, 62, 42, 0.15);
        }
        .leaflet-tooltip-top.map-pin-tooltip::before {
          border-top-color: #4a7c59;
        }
      `;
      document.head.appendChild(style);
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.onload = () => initMap();
    script.onerror = () => {
      console.error('[PortfolioMap] Failed to load Leaflet from CDN');
    };
    document.head.appendChild(script);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setMapReady(false);
      tourStartedRef.current = false;
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
    setMapReady(true);
    setMapInteractivity(embedded);

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

    const home = PLACES_LIVED.find((p) => p.lat === ME.home.lat && p.lng === ME.home.lng);
    if (home) bindPinTooltip(marker, home);

    marker.on('click', () => {
      if (!expandedRef.current) return;
      if (home) {
        openPlaceAlbum(home, 'lived');
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
            <path d="M6 11.6 L12 6.5 L18 11.6 Z" fill="white"/>
            <rect x="7.6" y="11.2" width="8.8" height="6" fill="white"/>
            <rect x="10.6" y="13" width="2.8" height="4.2" fill="#8b2725"/>
          </svg>`,
      });

      const marker = L.marker([place.lat, place.lng], { icon }).addTo(map);
      bindPinTooltip(marker, place);

      marker.on('click', () => {
        if (!expandedRef.current) return;
        openPlaceAlbum(place, 'lived');
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
            <path d="M6 15 L7.4 11.4 H16.6 L18 15 Z" fill="white"/>
            <rect x="5.6" y="14.2" width="12.8" height="2.6" rx="0.7" fill="white"/>
            <circle cx="8.6" cy="16.8" r="1.5" fill="white"/>
            <circle cx="15.4" cy="16.8" r="1.5" fill="white"/>
            <circle cx="8.6" cy="16.8" r="0.65" fill="#3b82f6"/>
            <circle cx="15.4" cy="16.8" r="0.65" fill="#3b82f6"/>
          </svg>`,
      });

      const marker = L.marker([place.lat, place.lng], { icon }).addTo(map);
      bindPinTooltip(marker, place);

      marker.on('click', () => {
        if (!expandedRef.current) return;
        openPlaceAlbum(place, 'trip');
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

  function closeAlbum() {
    setAlbumOpen(false);
    setActivePlace(null);
  }

  function openPlaceAlbum(place: MapPlace, category: PlaceCategory = 'lived') {
    setActivePlace(place);
    setActivePlaceCategory(category);
    setAlbumOpen(true);
  }

  function panToPlace(place: MapPlace, category: PlaceCategory = 'lived') {
    setActivePlace(place);
    setActivePlaceCategory(category);
    const zoom = mapRef.current?.getZoom() ?? ZOOM_HOME;
    mapRef.current?.flyTo([place.lat, place.lng], zoom, {
      animate: true,
      duration: 1.2,
    });
  }

  function flyToPreviewPlace(place: MapPlace) {
    mapRef.current?.flyTo([place.lat, place.lng], ZOOM_HOME, {
      animate: true,
      duration: PREVIEW_FLY_DURATION,
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

      if (albumOpen && e.key === 'Escape') {
        closeAlbum();
        return;
      }

      if (!albumOpen && e.key === 'ArrowRight') {
        e.preventDefault();
        navigatePlaces(1);
        return;
      }

      if (!albumOpen && e.key === 'ArrowLeft') {
        e.preventDefault();
        navigatePlaces(-1);
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [albumOpen, activePlace, timelineEntries]);

  useEffect(() => {
    if (!(expanded || embedded) || activeTimelineIndex < 0) return;
    const entry = timelineEntries[activeTimelineIndex];
    if (!entry) return;
    const cardKey = getTimelineEntryKey(entry);
    const activeCard = timelineCardRefs.current[cardKey];
    activeCard?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [expanded, embedded, activeTimelineIndex, timelineEntries]);

  const albumImages = activePlace
    ? activePlace.photos.map((photo) => ({
        src: photo.src,
        alt: photo.caption || activePlace.name,
        ...(photo.caption ? { caption: photo.caption } : {}),
      }))
    : [];

  if (embedded) {
    const activeLabel = activePlace
      ? `${activePlace.name}${activePlace.years ? ` · ${activePlace.years}` : ''}`
      : 'Select a place on the timeline or map';

    return (
      <div className="pm-embedded">
        <div className="pm-embedded__timeline">
          <button
            type="button"
            className="pm-embedded__tl-arrow"
            onClick={() => nudgeTimeline(-1)}
            aria-label="Scroll timeline left"
          >
            ‹
          </button>
          <div ref={timelineRowRef} className="pm-embedded__timeline-scroll">
            <div className="pm-embedded__timeline-inner">
              {timelineEntries.map((entry) => {
                const cardKey = getTimelineEntryKey(entry);
                const isActive = activeTimelineKey === cardKey;
                return (
                  <div
                    key={cardKey}
                    ref={(el) => {
                      timelineCardRefs.current[cardKey] = el;
                    }}
                    className="pm-embedded__chip-group"
                  >
                    <span
                      className={`pm-embedded__chip-years ${isActive ? 'pm-embedded__chip-years--active' : ''}`}
                    >
                      {entry.place.years ?? 'Unknown years'}
                    </span>
                    <button
                      type="button"
                      onClick={() => panToPlace(entry.place, entry.category)}
                      aria-current={isActive ? 'true' : undefined}
                      className={`pm-embedded__chip ${isActive ? 'pm-embedded__chip--active' : ''}`}
                    >
                      <span className="pm-embedded__chip-name">{entry.place.name}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            className="pm-embedded__tl-arrow"
            onClick={() => nudgeTimeline(1)}
            aria-label="Scroll timeline right"
          >
            ›
          </button>
        </div>

        <p className="pm-embedded__label">{activeLabel}</p>

        <div className="pm-embedded__stage">
          <button
            type="button"
            className="pm-embedded__arrow"
            onClick={() => navigatePlaces(-1)}
            aria-label="Previous place"
          >
            ←
          </button>

          <div className="design-c__map-panel__inner pm-embedded__map">
            {!mapReady && (
              <div className="pm-embedded__loading" aria-hidden="true">Loading map…</div>
            )}
            <div ref={wrapperRef} className="absolute inset-0 w-full h-full min-h-0">
              <div ref={containerRef} className="absolute inset-0 z-0" />
            </div>
          </div>

          <button
            type="button"
            className="pm-embedded__arrow"
            onClick={() => navigatePlaces(1)}
            aria-label="Next place"
          >
            →
          </button>

          <div className="pm-embedded__album">
            {activePlace ? (
              <>
                <h3 className="pm-embedded__album-title">{activeLabel}</h3>
                {activePlace.narrative ? (
                  <p className="pm-embedded__album-intro">{activePlace.narrative}</p>
                ) : null}
                <AlbumGallery images={albumImages} emptyFolderHint={`src/images/albums/${activePlace.id}/`} />
              </>
            ) : (
              <p className="pm-embedded__album-empty">
                Tap a pin, a timeline place, or the arrows to see photos.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {expanded && expandMode === 'modal' && (
        <div
          className="fixed inset-0 z-[9998] bg-[#1e3d24]/45 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
          aria-hidden="true"
        />
      )}
      <div
        ref={wrapperRef}
        className={`absolute inset-0 w-full h-full min-h-0 ${expanded && expandMode === 'modal' ? 'pt-14' : ''}`}
        onMouseEnter={() => setPreviewHovered(true)}
        onMouseLeave={() => setPreviewHovered(false)}
      >
      {expanded && (
        <>
          <button
            onClick={() => setExpanded(false)}
            className={`absolute top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              expandMode === 'modal'
                ? 'right-4 border-2 border-[#4a7c59] bg-[#f5f0e6]/95 text-[#1e3d24] shadow-md hover:bg-[#ebe4d4] focus-visible:outline-[#4a7c59]'
                : 'left-4 border-2 border-[#8b2725] bg-[#f6dfd7]/95 text-[#8b2725] shadow-[0_8px_18px_rgba(79,32,29,0.24),inset_0_0_0_1px_rgba(255,244,240,0.85),inset_0_0_0_3px_rgba(139,39,37,0.15)] hover:bg-[#f3d0c3] hover:text-[#c96f4a] focus-visible:outline-[#c96f4a]'
            }`}
            aria-label="Close map"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className={`absolute z-30 flex items-center gap-2 ${
              expandMode === 'modal'
                ? 'top-3 left-3 right-14 px-1 py-1'
                : 'top-4 left-16 right-4 rounded-[2px] border border-[#2a3a4a] px-4 py-5 shadow-[0_10px_22px_rgba(42,36,28,0.12),inset_0_0_0_1px_rgba(255,252,244,0.85),inset_0_0_0_3px_#f0e4cf,inset_0_0_0_4px_#2a3a4a]'
            }`}
            style={
              expandMode === 'fullscreen'
                ? {
                    backgroundColor: '#f4ead8',
                    backgroundImage: 'linear-gradient(165deg, #f7ecd7 0%, #efe2c8 55%, #e8d9b8 100%)',
                  }
                : undefined
            }
          >
            <button
              type="button"
              onClick={() => nudgeTimeline(-1)}
              className={`shrink-0 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                expandMode === 'modal'
                  ? 'h-8 w-8 text-[#3d6b47] hover:text-[#1e3d24] focus-visible:outline-[#4a7c59]'
                  : 'h-12 w-12 rounded-full border border-[#bfcee4] text-[#456488] hover:border-[#3b82f6] hover:bg-[#edf5ff] hover:text-[#245ea2] focus-visible:outline-[#3b82f6]'
              }`}
              aria-label="Scroll timeline left"
            >
              ←
            </button>
            <div
              ref={timelineRowRef}
              onWheel={handleTimelineWheel}
              className="flex-1 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none]"
            >
              <div className={`flex min-w-max ${expandMode === 'modal' ? 'gap-4' : 'gap-3'}`}>
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
                      onClick={() => panToPlace(entry.place, entry.category)}
                      aria-current={isActive ? 'true' : undefined}
                      className={`shrink-0 text-left transition ${
                        expandMode === 'modal'
                          ? isActive
                            ? 'rounded-lg border border-[#4a7c59] bg-[#ebe4d4] px-2.5 py-1.5 shadow-sm ring-1 ring-[#4a7c59]/25'
                            : 'rounded-lg border border-[#c4b89a] bg-[#f5f0e6] px-2.5 py-1.5 shadow-sm hover:border-[#a8b89a] hover:bg-[#fffdf8]'
                          : `rounded-lg border px-4 py-5 ${
                              isActive
                                ? entry.category === 'trip'
                                  ? 'border-[#3b82f6] bg-[#edf5ff] shadow-[0_0_0_1px_rgba(59,130,246,0.35),0_10px_20px_rgba(37,99,235,0.2)] ring-1 ring-[#3b82f6]/40'
                                  : 'border-[#c96f4a] bg-[#fff7ee] shadow-[0_0_0_1px_rgba(201,111,74,0.35),0_10px_20px_rgba(201,111,74,0.18)] ring-1 ring-[#c96f4a]/40'
                                : 'border-[#d8cfc0] bg-[#fffdf8] hover:border-[#bfcee4] hover:bg-[#f4f8ff]'
                            }`
                      }`}
                    >
                      {expandMode === 'modal' ? (
                        <>
                          <p className={`text-xs ${isActive ? 'font-bold text-[#1e3d24]' : 'font-medium text-[#2c3e2a]'}`}>
                            {entry.place.name}
                          </p>
                          <p className={`text-[0.65rem] ${isActive ? 'text-[#2c3e2a]' : 'text-[#3d4f3a]'}`}>
                            {entry.place.years ?? 'Unknown years'}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className={`text-xs uppercase tracking-wider ${isActive ? 'text-[#4c5c6a]' : 'text-[#6b7280]'}`}>
                            {entry.place.years ?? 'Unknown years'}
                          </p>
                          <p className={`mt-1 text-sm font-semibold ${isActive ? 'text-[#1f2f3e]' : 'text-[#2f3a45]'}`}>
                            {entry.place.name}
                          </p>
                        </>
                      )}
                      {expandMode === 'fullscreen' && (
                        <p
                          className={`mt-1 text-xs font-semibold ${entry.category === 'trip' ? 'text-[#3b82f6]' : 'text-[#8b2725]'}`}
                        >
                          {entry.category === 'trip' ? 'Visited' : 'Lived'}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              type="button"
              onClick={() => nudgeTimeline(1)}
              className={`shrink-0 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                expandMode === 'modal'
                  ? 'h-8 w-8 text-[#3d6b47] hover:text-[#1e3d24] focus-visible:outline-[#4a7c59]'
                  : 'h-12 w-12 rounded-full border border-[#bfcee4] text-[#456488] hover:border-[#3b82f6] hover:bg-[#edf5ff] hover:text-[#245ea2] focus-visible:outline-[#3b82f6]'
              }`}
              aria-label="Scroll timeline right"
            >
              →
            </button>
          </div>
        </>
      )}
      {/* Map */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* Preview timeline chip — top, mini only */}
      {!expanded && expandMode === 'modal' && timelineEntries[previewIndex] && (
        <div
          className="pointer-events-none absolute top-3 left-3 z-20 w-fit max-w-[calc(100%-1.5rem)] transition-opacity duration-200"
          aria-live="polite"
        >
          <div className="design-c__map-place-card w-fit">
            <p className="design-c__map-place-card__title">
              {timelineEntries[previewIndex].place.name}
            </p>
            <p className="design-c__map-place-card__years">
              {timelineEntries[previewIndex].place.years ?? 'Unknown years'}
            </p>
          </div>
        </div>
      )}

      {/* Full-card click to expand (modal) or search bar (fullscreen) */}
      {!expanded && expandMode === 'modal' && (
        <button
          type="button"
          onClick={handleExpandClick}
          className="absolute inset-0 z-30 cursor-pointer"
          aria-label="Open map"
        />
      )}
      {!expanded && expandMode === 'fullscreen' && (
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

      </div>

      <GalleryPopoutDialog
        open={expanded && albumOpen && !!activePlace}
        onClose={closeAlbum}
        title={
          activePlace
            ? `${activePlace.name}${activePlace.years ? ` · ${activePlace.years}` : ''}`
            : ''
        }
        intro={activePlace?.narrative}
        images={albumImages}
        emptyFolderHint={
          activePlace ? `src/images/albums/${activePlace.id}/` : undefined
        }
      />
    </>
  );
}