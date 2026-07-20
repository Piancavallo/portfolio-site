import type { OptimizedPhoto } from '../types/albumPhoto';
import manifest from '../generated/albumPhotos.manifest.json';

export type PlacePhoto = OptimizedPhoto;

const manifestByAlbum = manifest as Record<string, OptimizedPhoto[]>;

/** Album folder names that have a physical directory under src/images/albums/. */
export function listPhysicalAlbumFolders(): string[] {
  return Object.keys(manifestByAlbum).filter((key) => !key.startsWith('__'));
}

export function getAlbumPhotos(albumName: string): PlacePhoto[] {
  return manifestByAlbum[albumName] ?? [];
}

export function getGalleryPhotos(manifestKey: string): PlacePhoto[] {
  return manifestByAlbum[manifestKey] ?? [];
}

/** Maps place.id to the album folder name under src/images/albums/. */
const PLACE_ALBUM_FOLDER: Record<string, string> = {
  'Colo Springs': 'Colorado',
  TX: 'San Angelo',
  'Silver Spring': 'Maryland',
  Alabama: 'Auburn',
  Michigan: 'Michigan trip',
  'Niagara Falls': 'Niagara',
  'Monterey trip': 'Monterey Trip',
};

export function getPlaceAlbumFolder(placeId: string): string {
  return PLACE_ALBUM_FOLDER[placeId] ?? placeId;
}
