import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/album-gallery.css';

export type AlbumGalleryImage = {
  src: string;
  /** Optional larger URL for the lightbox; defaults to `src`. */
  fullSrc?: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
};

type Props = {
  images: AlbumGalleryImage[];
  emptyFolderHint?: string;
  variant?: 'default' | 'dark';
};

export default function AlbumGallery({
  images,
  emptyFolderHint = 'src/images/',
  variant = 'default',
}: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [imageReady, setImageReady] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const captionId = useId();
  const lightboxImgRef = useRef<HTMLImageElement>(null);
  const isDark = variant === 'dark';

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const openLightbox = useCallback(
    (index: number) => {
      if (index >= 0 && index < images.length) setLightboxIndex(index);
    },
    [images.length],
  );

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const handleLightboxImageLoad = useCallback(() => setImageReady(true), []);

  const activeImage = lightboxIndex !== null ? images[lightboxIndex] : null;
  const activeImageSrc = activeImage ? (activeImage.fullSrc ?? activeImage.src) : undefined;
  const activeCaption = activeImage?.caption?.trim();

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (lightboxIndex === null || !activeImageSrc) return;
    setImageReady(false);
    const img = lightboxImgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setImageReady(true);
    }
  }, [lightboxIndex, activeImageSrc]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const preload = (index: number) => {
      const image = images[index];
      const src = image ? (image.fullSrc ?? image.src) : undefined;
      if (!src) return;
      const img = new Image();
      img.src = src;
    };
    preload((lightboxIndex + 1) % images.length);
    preload((lightboxIndex - 1 + images.length) % images.length);
  }, [lightboxIndex, images]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        closeLightbox();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [lightboxIndex, closeLightbox, goNext, goPrev]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxIndex]);

  if (images.length === 0) {
    return (
      <p className={`album-gallery-empty ${isDark ? 'album-gallery-empty--dark' : ''}`}>
        No photos yet — add images to <code>{emptyFolderHint}</code>.
      </p>
    );
  }

  const revealClass = `transition-opacity duration-150 ${imageReady ? 'opacity-100' : 'opacity-0'}`;
  const gridClass = isDark
    ? 'album-gallery-grid album-gallery-grid--dark'
    : 'album-gallery-grid';
  const showNav = images.length > 1;

  const lightbox =
    activeImage && portalReady
      ? createPortal(
          isDark ? (
            <div
              className="album-lightbox album-lightbox--dark fixed inset-0 z-[20000] flex flex-col items-center justify-center cursor-pointer p-4 sm:p-6"
              onClick={(e) => {
                if (e.target === e.currentTarget) closeLightbox();
              }}
              role="presentation"
            >
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 text-[#ededed] text-3xl leading-none opacity-70 hover:opacity-100 px-2"
                aria-label="Close"
              >
                &times;
              </button>

              {showNav && (
                <>
                  <button
                    type="button"
                    className="album-lightbox__nav album-lightbox__nav--prev album-lightbox__nav--dark"
                    onClick={goPrev}
                    aria-label="Previous photo"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="album-lightbox__nav album-lightbox__nav--next album-lightbox__nav--dark"
                    onClick={goNext}
                    aria-label="Next photo"
                  >
                    ›
                  </button>
                </>
              )}

              <div
                className="flex flex-col items-center w-full max-w-[min(96vw,1100px)] max-h-[92vh] cursor-default overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  key={activeImageSrc}
                  ref={lightboxImgRef}
                  src={activeImageSrc}
                  alt={activeImage.alt ?? 'Enlarged photo'}
                  aria-describedby={activeCaption && imageReady ? captionId : undefined}
                  onLoad={handleLightboxImageLoad}
                  className={`max-w-full object-contain rounded shadow-2xl ${revealClass}`}
                  style={{ maxHeight: activeCaption ? '72vh' : '90vh' }}
                />
                {activeCaption ? (
                  <p
                    id={captionId}
                    className={`mt-5 mb-2 w-full max-w-[40rem] text-center text-[0.95rem] leading-relaxed text-[#c8c4bc] px-2 ${revealClass}`}
                  >
                    {imageReady ? activeCaption : null}
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <div
              className="album-lightbox fixed inset-0 z-[20000] flex items-center justify-center bg-black/85 cursor-pointer p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) closeLightbox();
              }}
              role="presentation"
            >
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 text-white text-3xl leading-none opacity-70 hover:opacity-100 px-2"
                aria-label="Close"
              >
                &times;
              </button>

              {showNav && (
                <>
                  <button
                    type="button"
                    className="album-lightbox__nav album-lightbox__nav--prev"
                    onClick={goPrev}
                    aria-label="Previous photo"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="album-lightbox__nav album-lightbox__nav--next"
                    onClick={goNext}
                    aria-label="Next photo"
                  >
                    ›
                  </button>
                </>
              )}

              {activeCaption ? (
                <div
                  className="flex flex-col sm:flex-row items-stretch max-w-[min(95vw,1100px)] max-h-[90vh] rounded-lg overflow-hidden shadow-2xl cursor-default"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-1 min-w-0 items-center justify-center bg-black/40 p-3 sm:p-4">
                    <img
                      key={activeImageSrc}
                      ref={lightboxImgRef}
                      src={activeImageSrc}
                      alt={activeImage.alt ?? 'Enlarged photo'}
                      aria-describedby={imageReady ? captionId : undefined}
                      onLoad={handleLightboxImageLoad}
                      className={`max-h-[50vh] sm:max-h-[85vh] max-w-full sm:max-w-[60vw] object-contain ${revealClass}`}
                    />
                  </div>
                  <div
                    id={captionId}
                    className={`w-full sm:w-72 lg:w-80 shrink-0 overflow-y-auto bg-[#fffdf8] text-[#3d4f3a] p-4 sm:p-5 text-sm leading-relaxed ${revealClass}`}
                  >
                    {imageReady ? activeCaption : null}
                  </div>
                </div>
              ) : (
                <img
                  key={activeImageSrc}
                  ref={lightboxImgRef}
                  src={activeImageSrc}
                  alt={activeImage.alt ?? 'Enlarged photo'}
                  onLoad={handleLightboxImageLoad}
                  className={`max-w-[90vw] max-h-[90vh] object-contain rounded shadow-2xl ${revealClass}`}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          ),
          document.body,
        )
      : null;

  return (
    <>
      <div className={gridClass}>
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => openLightbox(i)}
            className="album-gallery__thumb"
          >
            <img
              src={img.src}
              alt={img.alt ?? 'Photo'}
              width={img.width}
              height={img.height}
              loading={i < 8 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={i < 4 ? 'high' : 'auto'}
            />
          </button>
        ))}
      </div>

      {lightbox}
    </>
  );
}
