import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/album-gallery.css';

export type AlbumGalleryImage = {
  src: string;
  /** Responsive srcset for gallery thumbnails. */
  srcSet?: string;
  /** Sizes hint paired with srcSet. */
  sizes?: string;
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
  lightboxLayout?: 'default' | 'polaroid';
};

export default function AlbumGallery({
  images,
  emptyFolderHint = 'src/images/',
  variant = 'default',
  lightboxLayout = 'default',
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

  const revealClass = `album-lightbox__reveal ${imageReady ? 'album-lightbox__reveal--ready' : ''}`;
  const gridClass = isDark
    ? 'album-gallery-grid album-gallery-grid--dark'
    : 'album-gallery-grid';
  const showNav = images.length > 1;

  const lightboxControls = (
    <>
      <button
        type="button"
        onClick={closeLightbox}
        className={`album-lightbox__close ${isDark ? 'album-lightbox__close--dark' : ''}`}
        aria-label="Close"
      >
        &times;
      </button>

      {showNav && (
        <>
          <button
            type="button"
            className={`album-lightbox__nav album-lightbox__nav--prev ${isDark ? 'album-lightbox__nav--dark' : ''}`}
            onClick={goPrev}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            type="button"
            className={`album-lightbox__nav album-lightbox__nav--next ${isDark ? 'album-lightbox__nav--dark' : ''}`}
            onClick={goNext}
            aria-label="Next photo"
          >
            ›
          </button>
        </>
      )}
    </>
  );

  const lightbox =
    activeImage && portalReady
      ? createPortal(
          isDark ? (
            <div
              className="album-lightbox album-lightbox--dark"
              onClick={(e) => {
                if (e.target === e.currentTarget) closeLightbox();
              }}
              role="presentation"
            >
              {lightboxControls}

              <div
                className="album-lightbox__dark-content"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  key={activeImageSrc}
                  ref={lightboxImgRef}
                  src={activeImageSrc}
                  alt={activeImage.alt ?? 'Enlarged photo'}
                  aria-describedby={activeCaption && imageReady ? captionId : undefined}
                  onLoad={handleLightboxImageLoad}
                  className={`album-lightbox__dark-image ${revealClass}`}
                  style={{ maxHeight: activeCaption ? '72vh' : '90vh' }}
                />
                {activeCaption ? (
                  <p id={captionId} className={`album-lightbox__dark-caption ${revealClass}`}>
                    {imageReady ? activeCaption : null}
                  </p>
                ) : null}
              </div>
            </div>
          ) : lightboxLayout === 'polaroid' ? (
            <div
              className="album-lightbox album-lightbox--polaroid"
              onClick={(e) => {
                if (e.target === e.currentTarget) closeLightbox();
              }}
              role="presentation"
            >
              {lightboxControls}

              <figure
                className={`album-lightbox__polaroid ${activeCaption ? '' : 'album-lightbox__polaroid--no-caption'}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="album-lightbox__polaroid-media">
                  <img
                    key={activeImageSrc}
                    ref={lightboxImgRef}
                    src={activeImageSrc}
                    alt={activeImage.alt ?? 'Enlarged photo'}
                    width={activeImage.width}
                    height={activeImage.height}
                    aria-describedby={activeCaption && imageReady ? captionId : undefined}
                    onLoad={handleLightboxImageLoad}
                    className={revealClass}
                  />
                </div>
                {activeCaption ? (
                  <figcaption id={captionId} className={`album-lightbox__polaroid-caption ${revealClass}`}>
                    {imageReady ? activeCaption : null}
                  </figcaption>
                ) : null}
              </figure>
            </div>
          ) : (
            <div
              className="album-lightbox album-lightbox--default"
              onClick={(e) => {
                if (e.target === e.currentTarget) closeLightbox();
              }}
              role="presentation"
            >
              {lightboxControls}

              {activeCaption ? (
                <div
                  className="album-lightbox__default-split"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="album-lightbox__default-media">
                    <img
                      key={activeImageSrc}
                      ref={lightboxImgRef}
                      src={activeImageSrc}
                      alt={activeImage.alt ?? 'Enlarged photo'}
                      aria-describedby={imageReady ? captionId : undefined}
                      onLoad={handleLightboxImageLoad}
                      className={revealClass}
                    />
                  </div>
                  <div id={captionId} className={`album-lightbox__default-caption ${revealClass}`}>
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
                  className={`album-lightbox__default-image ${revealClass}`}
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
              srcSet={img.srcSet}
              sizes={img.sizes}
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
