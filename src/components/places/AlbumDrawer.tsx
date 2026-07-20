import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import AlbumGallery, { type AlbumGalleryImage } from '../media/AlbumGallery';

export type AlbumDrawerAlbum = {
  id: string;
  title: string;
  intro: string;
  albumFolder: string;
  emptyFolderHint?: string;
};

type Props = {
  albums: AlbumDrawerAlbum[];
};

declare global {
  interface Window {
    __placesPendingAlbumId?: string;
  }
}

export default function AlbumDrawer({ albums }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [images, setImages] = useState<AlbumGalleryImage[]>([]);
  const [portalReady, setPortalReady] = useState(false);

  const activeAlbum = openId ? albums.find((a) => a.id === openId) ?? null : null;

  const close = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string }>).detail;
      if (detail?.id) setOpenId(detail.id);
    };
    window.addEventListener('places:open-album', onOpen);

    if (window.__placesPendingAlbumId) {
      setOpenId(window.__placesPendingAlbumId);
      delete window.__placesPendingAlbumId;
    }

    return () => window.removeEventListener('places:open-album', onOpen);
  }, []);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openId, close]);

  useEffect(() => {
    if (!activeAlbum) {
      setImages([]);
      return;
    }

    let cancelled = false;
    void import('../../utils/loadAlbum').then(({ getAlbumPhotos }) => {
      if (!cancelled) {
        setImages(getAlbumPhotos(activeAlbum.albumFolder));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeAlbum]);

  const drawer = (
    <>
      <div
        className={`places-drawer__backdrop ${openId ? 'places-drawer__backdrop--open' : ''}`}
        onClick={close}
        aria-hidden={!openId}
      />

      <aside
        className={`places-drawer ${openId ? 'places-drawer--open' : ''}`}
        aria-hidden={!openId}
        aria-label={activeAlbum ? `${activeAlbum.title} photo album` : 'Photo album'}
      >
        {activeAlbum && (
          <>
            <header className="places-drawer__header">
              <h2 className="places-drawer__title">{activeAlbum.title}</h2>
              <button
                type="button"
                className="places-drawer__close"
                onClick={close}
                aria-label="Close album"
              >
                &times;
              </button>
            </header>

            <div className="places-drawer__content">
              <AlbumGallery
                images={images}
                emptyFolderHint={activeAlbum.emptyFolderHint}
                lightboxLayout="polaroid"
              />
            </div>
          </>
        )}
      </aside>
    </>
  );

  if (!portalReady) return null;

  return createPortal(drawer, document.body);
}
