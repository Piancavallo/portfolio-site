import type { LibraryBookEntry } from './types';

type Props = {
  book: LibraryBookEntry;
  onSelect: (book: LibraryBookEntry) => void;
  dimmed: boolean;
  theme?: 'light' | 'dark';
};

export function LibraryBook({ book, onSelect, dimmed, theme = 'light' }: Props) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => onSelect(book)}
      style={{
        display: 'block',
        width: '100%',
        padding: 0,
        border: 'none',
        background: 'transparent',
        textAlign: 'left',
        cursor: 'pointer',
        opacity: dimmed ? 0.45 : 1,
        filter: dimmed ? 'brightness(0.75)' : 'none',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: '2/3',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '2px',
          border: isDark ? '1px solid #3a3a3a' : '1px solid #d8cfc0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        {book.coverSrc ? (
          <img
            src={book.coverSrc}
            alt=""
            draggable={false}
            loading="lazy"
            decoding="async"
            style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '0.5rem',
              background: 'linear-gradient(145deg, #3a2620 0%, #1f1410 50%, #2a1814 100%)',
              color: '#d4c4a8',
              fontSize: '0.55rem',
              fontFamily: 'Georgia, serif',
            }}
          >
            <span>{book.title}</span>
            <span style={{ fontStyle: 'italic', color: '#a09078' }}>{book.author}</span>
          </div>
        )}
      </div>
      <p
        style={{
          margin: '0.4rem 0 0',
          textAlign: 'center',
          fontSize: '0.7rem',
          fontWeight: 600,
          color: isDark ? '#c8c4bc' : '#3e4b58',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {book.title}
      </p>
      <p
        style={{
          margin: 0,
          textAlign: 'center',
          fontSize: '0.6rem',
          color: isDark ? '#6e6a64' : '#6b7280',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {book.author}
      </p>
    </button>
  );
}
