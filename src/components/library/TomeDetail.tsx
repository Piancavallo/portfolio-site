import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useId, useState } from 'react';
import type { LibraryBookEntry } from './types';

type Props = {
  book: LibraryBookEntry | null;
  open: boolean;
  onClose: () => void;
  noteThreshold: number;
};

export function TomeDetail({ book, open, onClose, noteThreshold }: Props) {
  const titleId = useId();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!open) setExpanded(false);
  }, [open, book?.id]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!book) return null;

  const longNote = book.note.length >= noteThreshold;
  const showToggle = longNote;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="tome"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-[#0a0908]/75 backdrop-blur-sm"
            aria-label="Close"
            onClick={onClose}
          />

          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative z-[1] max-h-[min(92vh,820px)] w-full max-w-lg overflow-y-auto rounded-sm border-2 border-[#3d2818] shadow-[0_28px_80px_rgba(0,0,0,0.65)]"
            style={{
              background: `
                linear-gradient(180deg, rgba(255,252,244,0.04) 0%, transparent 8%),
                linear-gradient(165deg, #2a1814 0%, #1a0f0c 40%, #140a08 100%)
              `,
              boxShadow:
                'inset 0 0 0 1px rgba(212, 175, 95, 0.15), inset 0 0 80px rgba(0,0,0,0.35), 0 28px 80px rgba(0,0,0,0.65)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Inner parchment */}
            <div
              className="m-3 border border-[#5c4330]/60 p-5 sm:m-4 sm:p-7"
              style={{
                background: `
                  radial-gradient(ellipse 100% 40% at 50% 0%, rgba(255, 248, 230, 0.12) 0%, transparent 55%),
                  linear-gradient(178deg, #f4ead8 0%, #ebe4d0 45%, #e2d8c8 100%)
                `,
                boxShadow: 'inset 0 0 60px rgba(90, 60, 40, 0.08)',
              }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="mx-auto w-[7.5rem] shrink-0 overflow-hidden rounded-[2px] border border-[#2a1810] shadow-lg sm:mx-0 sm:w-[6.75rem]">
                  {book.coverSrc ? (
                    <motion.img
                      layoutId={`cover-${book.id}`}
                      src={book.coverSrc}
                      alt=""
                      className="aspect-[2/3] w-full object-cover"
                    />
                  ) : (
                    <motion.div
                      layoutId={`cover-${book.id}`}
                      className="flex aspect-[2/3] w-full flex-col justify-between bg-[#2a1814] p-2"
                      style={{
                        backgroundImage: `
                          radial-gradient(ellipse 120% 80% at 30% 20%, rgba(90, 50, 40, 0.45) 0%, transparent 50%),
                          linear-gradient(145deg, #3a2620 0%, #1f1410 50%, #2a1814 100%)
                        `,
                      }}
                    >
                      <span className="font-serif text-[0.5rem] font-semibold uppercase leading-tight text-[#d4c4a8]/90 line-clamp-4">
                        {book.title}
                      </span>
                      <span className="text-[0.45rem] italic text-[#a09078]/85 line-clamp-2">{book.author}</span>
                    </motion.div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 id={titleId} className="font-serif text-xl font-semibold text-[#1e1410] sm:text-2xl">
                    {book.title}
                  </h2>
                  <p className="mt-1 font-serif text-sm italic text-[#5c4a38]">{book.author}</p>
                </div>
              </div>

              <div
                className="mt-6 border-t border-[#c9b8a0]/70 pt-5"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1.35rem, rgba(90, 72, 58, 0.06) 1.35rem, rgba(90, 72, 58, 0.06) 1.36rem)',
                }}
              >
                <p
                  className={`whitespace-pre-wrap font-serif text-sm leading-relaxed text-[#2a2218] ${
                    showToggle && !expanded ? 'line-clamp-[10]' : ''
                  }`}
                >
                  {book.note}
                </p>
                {showToggle && (
                  <button
                    type="button"
                    onClick={() => setExpanded((e) => !e)}
                    className="mt-3 text-left font-serif text-sm font-medium text-[#8b2725] underline decoration-[#c96f4a]/60 underline-offset-2 hover:text-[#c96f4a]"
                  >
                    {expanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>

              <div className="mt-8 flex justify-end border-t border-[#c9b8a0]/50 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-sm border border-[#5c4330] bg-[#3d2818] px-4 py-2 font-serif text-sm text-[#f4ead8] transition hover:bg-[#4a3224]"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
