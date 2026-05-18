import { LayoutGroup } from 'framer-motion';
import { useState } from 'react';
import { LibraryBook } from './LibraryBook';
import { TomeDetail } from './TomeDetail';
import type { LibraryBookEntry } from './types';

type Props = {
  books: LibraryBookEntry[];
  noteThreshold: number;
};

export default function PersonalLibrary({ books, noteThreshold }: Props) {
  const [selected, setSelected] = useState<LibraryBookEntry | null>(null);

  return (
    <LayoutGroup>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {books.map((book) => (
          <LibraryBook
            key={book.id}
            book={book}
            onSelect={setSelected}
            dimmed={selected !== null && selected.id !== book.id}
            revealCover={selected?.id !== book.id}
            layoutCoverId={`cover-${book.id}`}
          />
        ))}
      </div>

      <TomeDetail
        book={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
        noteThreshold={noteThreshold}
      />
    </LayoutGroup>
  );
}
