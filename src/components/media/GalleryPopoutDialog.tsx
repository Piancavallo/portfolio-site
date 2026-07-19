import { useEffect, useId } from 'react';
import AlbumGallery, { type AlbumGalleryImage } from './AlbumGallery';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  intro?: string;
  images: AlbumGalleryImage[];
  emptyFolderHint?: string;
};

export default function GalleryPopoutDialog({
  open,
  onClose,
  title,
  intro,
  images,
  emptyFolderHint,
}: Props) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[15000] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#1e3d24]/45 backdrop-blur-sm cursor-default"
        aria-label="Close"
        onClick={onClose}
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
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#c4b89a] bg-[#fffdf8] text-[#1e3d24] text-xl leading-none hover:bg-[#ebe4d4] transition-colors"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="p-5 sm:p-7 pr-12">
          <h2
            id={titleId}
            className="text-xl font-bold text-[#1e3d24] mb-2"
            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
          >
            {title}
          </h2>
          {intro ? (
            <p className="text-sm text-[#3d4f3a] leading-relaxed mb-4">{intro}</p>
          ) : null}
          <AlbumGallery images={images} emptyFolderHint={emptyFolderHint} />
        </div>
      </div>
    </div>
  );
}
