import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import type { LibraryBookEntry } from './types';

type Props = {
  book: LibraryBookEntry | null;
  open: boolean;
  onClose: () => void;
  noteThreshold: number;
  theme?: 'light' | 'dark';
};

export function TomeDetail({ book, open, onClose, noteThreshold, theme = 'light' }: Props) {
  const titleId = useId();
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) setExpanded(false);
  }, [open, book?.id]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!mounted || !open || !book) return null;

  const longNote = book.note.length >= noteThreshold;
  const showToggle = longNote;
  const noteClamped = showToggle && !expanded;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          border: 'none',
          cursor: 'default',
          background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(10,9,8,0.75)',
          backdropFilter: 'blur(4px)',
        }}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '32rem',
          maxHeight: 'min(92vh, 820px)',
          overflowY: 'auto',
          borderRadius: '2px',
          border: isDark ? '1px solid #3a3a3a' : '2px solid #3d2818',
          background: isDark
            ? '#121212'
            : 'linear-gradient(165deg, #2a1814 0%, #1a0f0c 40%, #140a08 100%)',
          boxShadow: '0 28px 80px rgba(0,0,0,0.65)',
        }}
      >
        <div
          style={{
            margin: '0.75rem',
            padding: '1.25rem',
            border: isDark ? '1px solid #2e2e2e' : '1px solid rgba(92,67,48,0.6)',
            background: isDark
              ? '#1a1a1a'
              : 'linear-gradient(178deg, #f4ead8 0%, #ebe4d0 45%, #e2d8c8 100%)',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '6.75rem',
                flexShrink: 0,
                overflow: 'hidden',
                borderRadius: '2px',
                border: isDark ? '1px solid #3a3a3a' : '1px solid #2a1810',
              }}
            >
              {book.coverSrc ? (
                <img
                  src={book.coverSrc}
                  alt=""
                  style={{ display: 'block', width: '100%', aspectRatio: '2/3', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    aspectRatio: '2/3',
                    padding: '0.5rem',
                    background: '#2a1814',
                    color: '#d4c4a8',
                    fontSize: '0.5rem',
                  }}
                >
                  {book.title}
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: '10rem' }}>
              <h2
                id={titleId}
                style={{
                  margin: 0,
                  fontFamily: 'Georgia, serif',
                  fontSize: '1.35rem',
                  color: isDark ? '#ededed' : '#1e1410',
                }}
              >
                {book.title}
              </h2>
              <p
                style={{
                  margin: '0.35rem 0 0',
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                  fontSize: '0.9rem',
                  color: isDark ? '#8a8680' : '#5c4a38',
                }}
              >
                {book.author}
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: isDark ? '1px solid #2e2e2e' : '1px solid rgba(201,184,160,0.7)',
            }}
          >
            <p
              style={{
                margin: 0,
                whiteSpace: 'pre-wrap',
                fontFamily: 'Georgia, serif',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                color: isDark ? '#c8c4bc' : '#2a2218',
                display: noteClamped ? '-webkit-box' : 'block',
                WebkitLineClamp: noteClamped ? 10 : undefined,
                WebkitBoxOrient: noteClamped ? 'vertical' : undefined,
                overflow: noteClamped ? 'hidden' : undefined,
              }}
            >
              {book.note}
            </p>
            {showToggle && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                style={{
                  marginTop: '0.75rem',
                  padding: 0,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Georgia, serif',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  color: isDark ? '#14b8a6' : '#8b2725',
                }}
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>

          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1rem',
              borderTop: isDark ? '1px solid #2e2e2e' : '1px solid rgba(201,184,160,0.5)',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                border: isDark ? '1px solid #3a3a3a' : '1px solid #5c4330',
                background: isDark ? '#121212' : '#3d2818',
                color: isDark ? '#ededed' : '#f4ead8',
                padding: '0.5rem 1rem',
                fontFamily: 'Georgia, serif',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
