export type LibraryBookEntry = {
  id: string;
  title: string;
  author: string;
  note: string;
  /** Optional cover image URL (e.g. `/images/book-covers/foo.jpg` or HTTPS). */
  coverSrc?: string;
};
