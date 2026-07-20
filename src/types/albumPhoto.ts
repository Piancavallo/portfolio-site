export type OptimizedPhoto = {
  src: string;
  srcSet: string;
  sizes: string;
  fullSrc: string;
  width: number;
  height: number;
  caption: string;
};

export type AlbumPhotoManifest = Record<string, OptimizedPhoto[]>;
