import type { LibraryBookEntry } from '../components/library/types';

export const NOTE_EXPAND_THRESHOLD = 140;

const BOOK_COVER_ISBN: Record<string, string> = {
  'A City On Mars': '9781984881724',
  'Plant Partners': '9781635861334',
  'The Grow Your Own Food Handbook': '9781628738032',
  'Project Hail Mary': '9780593135204',
  'The Martian': '9780804139021',
  'Ikigai': '9780143130727',
  'Dune': '9780441172719',
  'Scythe (series)': '9781442472426',
  'Harry Potter (series)': '9780590353427',
  'Long Way Round': '9780743499347',
  'The Screwtape Letters': '9780060652937',
  'A Wrinkle in Time': '9780374386139',
  'World War Z': '9780307346605',
  'The Ballad of Songbirds and Snakes': '9781338635171',
  'Jurassic Park': '9780345538987',
  'Timeline': '9780345468260',
  'The Andromeda Strain': '9780061703157',
  'Prey': '9780061703089',
  'Rising Sun': '9780345380371',
  'Sphere': '978-0345353146',
  'Congo': '9780060541835',
  'Eaters of the Dead': '9780099222828',
  'The Great Train Robbery': '978-0804171281',
  'The Dark Tower: The Gunslinger': '9781501143519',
  'Pet Sematary': '9781982112394',
  'Contact': '9780671004101',
  'The Circle Series': '978-1595547316',
  'Hannibal': '978-1439102183',
  'The Lost City of Z': '9781400078455',
};

const BOOK_COVER_LOCAL: Record<string, string> = {
  'The Circle Series': 'circle series.jpg',
  'The Great Train Robbery': 'great train robbery.jpg',
  'The Grow Your Own Food Handbook': 'grow food handbook.jpg',
};

async function fetchIsbn(title: string, author: string): Promise<string | null> {
  try {
    const cleanTitle = title.replace(/\s*\(series\)\s*/i, '');
    const params = new URLSearchParams({ title: cleanTitle, author, limit: '1', fields: 'isbn' });
    const res = await fetch(`https://openlibrary.org/search.json?${params}`);
    if (!res.ok) return null;
    const data = await res.json();
    const isbns: string[] = data.docs?.[0]?.isbn ?? [];
    return isbns.find((i: string) => /^97[89]/.test(i)) ?? isbns[0] ?? null;
  } catch {
    return null;
  }
}

const books = [
  { title: 'A City On Mars', author: 'Kelly and Zach Weinersmith', note: 'As someone who is endlessly fascinated with space and space exploration, I inhaled this book. Opened my mind to a lot of the various scientific, physiologic, and political problems that come with trying to settle in space. Authors are fluent in millienial humor, which, as a millenial, helped me digest.' },
  { title: 'Plant Partners', author: 'Jessica Walliser', note: 'Science-based companion planting strategies for a vegetable garden.  tldr; plant marigolds and basil and nasturtiums everywhere.' },
  { title: 'The Grow Your Own Food Handbook', author: 'Monte Burch', note: 'A handy back-to-basics guide to everything gardening, from planting to growing and harvesting. Lots of wisdom in here. Too bad I ended up googling most of it...' },
  { title: 'Project Hail Mary', author: 'Andy Weir', note: 'I read this before watching the movie, and loved both.' },
  { title: 'The Martian', author: 'Andy Weir', note: '"Botany isn\'t real science."' },
  { title: 'Ikigai', author: 'Hector Garcia & Francesc Miralles', note: 'So so good. Advice on lifestyle health and tales of happiness as told through stories and lessons from old geezers around the world\'s "Blue Zones".' },
  { title: 'Dune', author: 'Frank Herbert', note: 'Favorite sci-fi book hands down. Read 3 or 4 times now. The spice must flow.' },
  { title: 'Scythe (series)', author: 'Neal Shusterman', note: 'Love me a good YA sci-fi novel series, I like the way Neal delivers commentary on philosophy throughout the story, good stuff.' },
  { title: 'Harry Potter (series)', author: 'J.K. Rowling', note: 'Yer a wizard Harry' },
  { title: 'Long Way Round', author: 'Ewan McGregor', note: 'Obi-wan journeys 19,000 miles on a motorcycle from England to NYC with a friend, great read.' },
  { title: 'The Screwtape Letters', author: 'C.S. Lewis', note: 'A satirical Christian apologetic novel that makes you laugh and cry at the same time.' },
  { title: 'A Wrinkle in Time', author: 'Madeleine L\'Engle', note: 'Stranger Things brought me here. Still working on this one as of May 13 2026, I keep falling asleep...' },
  { title: 'World War Z', author: 'Max Brooks', note: 'I enjoyed the way this book told a story through oral accounts of survivors who experienced the unfolding of events from unique places and times, and seeing how it all connected. Big fan of this style of storytelling.' },
  { title: 'The Ballad of Songbirds and Snakes', author: 'Suzanne Collins', note: 'Snow always lands on top.' },
  { title: 'Jurassic Park', author: 'Michael Crighton', note: '"Clever girl" was never uttered in the book, 0/10.' },
  { title: 'Timeline', author: 'Michael Crighton', note: 'Time travel is by far my favorite flavor of sci-fi, and this one takes place in one of my favorite time periods, the medieval times, and also includes some of my favorite topics like archaeology and quantom technology, so... yeah, I really liked this book.' },
  { title: 'The Andromeda Strain', author: 'Michael Crighton', note: 'Realized from reading this that Crighton has a scary imagination, and also a great ability to blend science and science-fiction.' },
  { title: 'Prey', author: 'Michael Crighton', note: 'Aside from the tiring trope of marriage issues that seemed to leak from Crighton\'s personal life during this time period, I enjoyed this book. He kept me wondering what was actually going on until the later half of the book, which is fun.' },
  { title: 'Rising Sun', author: 'Michael Crighton', note: 'Crime thriller that explores the Japanese-American economic tensions of the time, which I found interesting... I think Crighton does a better job at creating sci-fis but I liked this one.' },
  { title: 'Sphere', author: 'Michael Crighton', note: 'I remember reading this one night and feeling genuinly sucked in to the point that I forgot where I was for hours. 10/10 psychological thriller meets fear of the ocean.' },
  { title: 'Congo', author: 'Michael Crighton', note: 'Rainforests, lost cities, and... a talking gorilla?' },
  { title: 'Eaters of the Dead', author: 'Michael Crighton', note: 'Crighton uses a real 10th-century journal of an Arab by the name Ahmad ibn Fadlan, and blends it with the epic poem Beowulf, and what results is one of my favorite books read in recent memory. Vikings and medieval history and Norse mythological terrors, oh my!' },
  { title: 'The Great Train Robbery', author: 'Michael Crighton', note: 'First Crighton book I ever picked up, and oh my did it set the bar high. Based on a true story of a crazy train robbery that took place in Victorian-era England. When I saw the movie I realized Sean Connery was basically how I imagined Edward Pierce.' },
  { title: 'The Dark Tower: The Gunslinger', author: 'Stephen King', note: 'Aside from one weird part early on that was overtly sexual, I liked it. Dark fantasy meets western meets post apocalypse.' },
  { title: 'Pet Sematary', author: 'Stephen King', note: "Picked up this book cause the cat on the cover looks like Figgy. Please don't haunt me when you're dead and gone, fluffy fuzz ball." },
  { title: 'Contact', author: 'Carl Sagan', note: "Hard science fiction, extraterrestrial contact, the 1980s, what's not to love? I admiteddly did not finish this one yet as it's quite dense-- one day!" },
  { title: 'The Circle Series', author: 'Ted Dekker', note: 'Really cool series where the last book is both a prequel and a sequel, hence the name of the series. Fun YA epic fantasy with allegory and spiritual themes from the Bible.' },
  { title: 'Hannibal', author: 'Patrick N. Hunt', note: "I'm not a \"war kid\" but after reading this biography of Hannibal I kinda get where they're coming from. What would the world look like if Hannibal sacked Rome? How different would modern western culture be today? This is the kind of stuff I lie awake in bed and think about at night." },
  { title: 'The Lost City of Z', author: 'David Grann', note: "Nonfiction book that recounts the adventures of British explorer Percy Fawcett, who vanished in 1925 while searching for an ancient civilization in the Amazon rainforest. What I especially liked about this was how the author interweaves Fawcett's historical quest with his own journey into the rainforest, where he discovers evidence that suggests maybe Fawcett discovered the lost city after all." },
];

export async function buildLibraryBooks(): Promise<LibraryBookEntry[]> {
  return Promise.all(
    books.map(async (b, i) => {
      const localCover = BOOK_COVER_LOCAL[b.title];
      const isbn = BOOK_COVER_ISBN[b.title] ?? await fetchIsbn(b.title, b.author);
      const coverSrc = localCover
        ? `/images/book-covers/${localCover}`
        : isbn
          ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
          : undefined;
      return {
        id: `book-${i}`,
        title: b.title,
        author: b.author,
        note: b.note,
        ...(coverSrc ? { coverSrc } : {}),
      };
    })
  );
}
