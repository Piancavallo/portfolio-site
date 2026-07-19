import { useCallback, useEffect, useState } from 'react';
import AlbumGallery, { type AlbumGalleryImage } from '../media/AlbumGallery';

export type AlbumDrawerAlbum = {
  id: string;
  title: string;
  intro: string;
  images: AlbumGalleryImage[];
  emptyFolderHint?: string;
};

type Props = {
  albums: AlbumDrawerAlbum[];
};

export default function AlbumDrawer({ albums }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const activeAlbum = openId ? albums.find((a) => a.id === openId) ?? null : null;

  const close = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string }>).detail;
      if (detail?.id) setOpenId(detail.id);
    };
    window.addEventListener('places:open-album', onOpen);
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

  return (
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
                images={activeAlbum.images}
                emptyFolderHint={activeAlbum.emptyFolderHint}
              />
            </div>
          </>
        )}
      </aside>
    </>
  );
}
