import { useState } from 'react';
import { LibraryBook } from './LibraryBook';
import { TomeDetail } from './TomeDetail';
import type { LibraryBookEntry } from './types';

type Props = {
  books: LibraryBookEntry[];
  noteThreshold: number;
  theme?: 'light' | 'dark';
};

export default function PersonalLibrary({ books, noteThreshold, theme = 'light' }: Props) {
  const [selected, setSelected] = useState<LibraryBookEntry | null>(null);

  const openBook = (book: LibraryBookEntry) => {
    // Avoid the opening click landing on the new backdrop and closing immediately.
    window.setTimeout(() => setSelected(book), 0);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {books.map((book) => (
          <LibraryBook
            key={book.id}
            book={book}
            onSelect={openBook}
            dimmed={selected !== null && selected.id !== book.id}
            theme={theme}
          />
        ))}
      </div>

      <TomeDetail
        book={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
        noteThreshold={noteThreshold}
        theme={theme}
      />
    </>
  );
}
