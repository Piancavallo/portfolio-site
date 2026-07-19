type ImageModule = { default: { src: string } };

export type AlbumImage = {
  src: string;
  alt?: string;
};

export function imagesFromGlob(
  glob: Record<string, ImageModule>,
  folderPath: string,
  alt = 'Photo',
): AlbumImage[] {
  return Object.entries(glob)
    .filter(([path]) => path.includes(folderPath))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, mod]) => ({ src: mod.default.src, alt }));
}
