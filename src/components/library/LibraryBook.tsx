import { motion } from 'framer-motion';
import type { LibraryBookEntry } from './types';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type Props = {
  book: LibraryBookEntry;
  onSelect: (book: LibraryBookEntry) => void;
  dimmed: boolean;
  /** When false, cover is a static placeholder so TomeDetail can own `layoutId` for shared layout. */
  revealCover: boolean;
  layoutCoverId: string;
};

export function LibraryBook({ book, onSelect, dimmed, revealCover, layoutCoverId }: Props) {
  const reduced = usePrefersReducedMotion();

  const coverInner =
    book.coverSrc ? (
      <img src={book.coverSrc} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" draggable={false} />
    ) : (
      <div
        className="flex h-full w-full flex-col justify-between bg-[#2a1814] p-2"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 120% 80% at 30% 20%, rgba(90, 50, 40, 0.45) 0%, transparent 50%),
            linear-gradient(145deg, #3a2620 0%, #1f1410 50%, #2a1814 100%)
          `,
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)',
        }}
      >
        <div className="pointer-events-none font-serif text-[0.55rem] font-semibold uppercase leading-tight tracking-wide text-[#d4c4a8]/90 line-clamp-4">
          {book.title}
        </div>
        <div className="pointer-events-none text-[0.5rem] italic text-[#a09078]/85 line-clamp-2">{book.author}</div>
      </div>
    );

  const coverMotion =
    book.coverSrc ? (
      <motion.img layoutId={layoutCoverId} src={book.coverSrc} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" draggable={false} />
    ) : (
      <motion.div
        layoutId={layoutCoverId}
        className="flex h-full w-full flex-col justify-between bg-[#2a1814] p-2"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 120% 80% at 30% 20%, rgba(90, 50, 40, 0.45) 0%, transparent 50%),
            linear-gradient(145deg, #3a2620 0%, #1f1410 50%, #2a1814 100%)
          `,
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)',
        }}
      >
        <span className="pointer-events-none font-serif text-[0.55rem] font-semibold uppercase leading-tight tracking-wide text-[#d4c4a8]/90 line-clamp-4">
          {book.title}
        </span>
        <span className="pointer-events-none text-[0.5rem] italic text-[#a09078]/85 line-clamp-2">{book.author}</span>
      </motion.div>
    );

  return (
    <motion.button
      type="button"
      layout
      onClick={() => onSelect(book)}
      className="group relative text-left outline-none focus-visible:ring-2 focus-visible:ring-[#c96f4a] focus-visible:ring-offset-2"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '900px',
      }}
      whileHover={
        reduced
          ? {}
          : {
              z: 28,
              rotateY: -5,
              rotateX: 2,
              scale: 1.04,
            }
      }
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      animate={{ opacity: dimmed ? 0.45 : 1, filter: dimmed ? 'brightness(0.75)' : 'brightness(1)' }}
    >
      <div
        className="relative aspect-[2/3] w-full overflow-hidden rounded-sm border border-[#d8cfc0] shadow-md transition-shadow duration-300 group-hover:shadow-xl"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {revealCover ? coverMotion : coverInner}
        <div
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-soft-light"
          style={{
            background:
              'linear-gradient(125deg, rgba(255,255,255,0.5) 0%, transparent 38%, transparent 62%, rgba(0,0,0,0.2) 100%)',
          }}
        />
      </div>
      <p className="mt-1.5 truncate text-center text-[0.7rem] font-medium text-[#3e4b58] group-hover:text-[#c96f4a] transition-colors">{book.title}</p>
      <p className="truncate text-center text-[0.6rem] text-[#6b7280]">{book.author}</p>
    </motion.button>
  );
}
