import { useCallback, useEffect, useId, useState } from 'react';
import PersonalLibrary from '../library/PersonalLibrary';
import GalleryPopoutDialog from '../media/GalleryPopoutDialog';
import { type AlbumGalleryImage } from '../media/AlbumGallery';
import type { LibraryBookEntry } from '../library/types';

export type PopoutId =
  | 'usaf'
  | 'dripping-springs'
  | 'caretaker'
  | 'monterey-aquarium'
  | 'garden'
  | 'library'
  | 'tank-drivers-ed'
  | 'soccer';

export type GalleryPopoutId =
  | 'garden'
  | 'usaf'
  | 'dripping-springs'
  | 'caretaker'
  | 'monterey-aquarium';

export type GalleryPopoutContent = {
  title: string;
  intro: string;
  images: AlbumGalleryImage[];
  emptyFolderHint?: string;
};

export type SimplePopoutContent = {
  title: string;
  text: string;
  imageSrc?: string;
  playUrl?: string;
  playLabel?: string;
};

type Props = {
  galleryPopouts: Record<GalleryPopoutId, GalleryPopoutContent>;
  simpleContent: Record<Exclude<PopoutId, GalleryPopoutId | 'library'>, SimplePopoutContent>;
  libraryBooks: LibraryBookEntry[];
  libraryIntro: string;
  noteThreshold: number;
};

const POPOUT_OPEN_EVENT = 'home-popout:open';

function isGalleryPopoutId(id: PopoutId): id is GalleryPopoutId {
  return (
    id === 'garden' ||
    id === 'usaf' ||
    id === 'dripping-springs' ||
    id === 'caretaker' ||
    id === 'monterey-aquarium'
  );
}

export default function HomePopout({
  galleryPopouts,
  simpleContent,
  libraryBooks,
  libraryIntro,
  noteThreshold,
}: Props) {
  const [activeId, setActiveId] = useState<PopoutId | null>(null);
  const titleId = useId();

  const close = useCallback(() => setActiveId(null), []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ id: PopoutId }>).detail;
      if (detail?.id) setActiveId(detail.id);
    };
    window.addEventListener(POPOUT_OPEN_EVENT, handler);
    return () => window.removeEventListener(POPOUT_OPEN_EVENT, handler);
  }, []);

  useEffect(() => {
    if (!activeId || isGalleryPopoutId(activeId)) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [activeId, close]);

  if (!activeId) return null;

  const isLibrary = activeId === 'library';
  const gallery = isGalleryPopoutId(activeId) ? galleryPopouts[activeId] : null;
  const simple = !isLibrary && !gallery ? simpleContent[activeId] : null;

  if (gallery) {
    return (
      <GalleryPopoutDialog
        open
        onClose={close}
        title={gallery.title}
        intro={gallery.intro}
        images={gallery.images}
        emptyFolderHint={gallery.emptyFolderHint}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-[15000] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#1e3d24]/45 backdrop-blur-sm cursor-default"
        aria-label="Close"
        onClick={close}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[1] w-full max-w-[min(92vw,900px)] max-h-[85vh] overflow-y-auto rounded-2xl border border-[#c4b89a] bg-[#f5f0e6] shadow-[0_20px_60px_rgba(30,45,28,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#c4b89a] bg-[#fffdf8] text-[#1e3d24] text-xl leading-none hover:bg-[#ebe4d4] transition-colors"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="p-5 sm:p-7 pr-12">
          {isLibrary && (
            <>
              <h2 id={titleId} className="text-xl font-bold text-[#1e3d24] mb-2" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
                Books
              </h2>
              <p className="text-sm text-[#3d4f3a] leading-relaxed mb-4">{libraryIntro}</p>
              <PersonalLibrary books={libraryBooks} noteThreshold={noteThreshold} />
            </>
          )}

          {simple && (
            <>
              <h2 id={titleId} className="text-xl font-bold text-[#1e3d24] mb-3" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
                {simple.title}
              </h2>
              <p className="text-sm text-[#3d4f3a] leading-relaxed mb-4 whitespace-pre-line">{simple.text}</p>
              {simple.imageSrc ? (
                <div className="rounded-xl overflow-hidden border border-[#c4b89a] mb-4">
                  <img src={simple.imageSrc} alt="" className="w-full max-h-72 object-cover" />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[#a8b89a] bg-[#ebe4d4]/60 min-h-[160px] flex items-center justify-center mb-4">
                  <span className="text-sm text-[#5a6b52] italic">Image coming soon</span>
                </div>
              )}
              {simple.playUrl && (
                <a
                  href={simple.playUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#3d6b47] px-5 py-2.5 text-sm font-bold text-[#f5f0e6] hover:bg-[#2d5a3d] transition-colors"
                >
                  {simple.playLabel?.replace(/\s*→\s*$/, '') ?? 'Play game'}{' '}
                  <span className="text-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function openHomePopout(id: PopoutId) {
  window.dispatchEvent(new CustomEvent(POPOUT_OPEN_EVENT, { detail: { id } }));
}
