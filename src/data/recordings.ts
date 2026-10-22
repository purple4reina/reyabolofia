// Every recording on the site. Each `slug` matches an MP3 in public/audio and a
// waveform entry in src/data/peaks.json (rebuilt by scripts/encode-audio.sh).
import peaks from './peaks.json';

export interface Track {
  slug: string;
  composer: string;
  composerDates?: string;
  work: string;
  /** Movement or excerpt name, shown after the work title. */
  part?: string;
  /** Title in the original language/script, shown on the program page. */
  original?: string;
  arranger?: string;
  with?: string[];
  note?: string;
}

export interface Album {
  id: string;
  title: string;
  subtitle: string;
  recorded: string;
  personnel: string[];
  tracks: Track[];
}

const pianist = 'Lee Melaugh, piano';

export const recital: Album = {
  id: 'jewish-clarinet',
  title: 'The Jewish Clarinet',
  subtitle: 'Live recital recording',
  recorded: 'Recorded live October 17, 2026, at the Eastside Jewish Commons, Portland, Oregon',
  personnel: ['Rey Abolofia, clarinet', pianist],
  tracks: [
    {
      slug: 'verdi-la-forza-del-destino',
      composer: 'Giuseppe Verdi',
      composerDates: '1813–1901',
      work: 'La forza del destino',
      part: '“La vita è inferno,” prelude',
      arranger: 'arr. for clarinet and piano',
      with: [pianist],
      note: 'Before the tenor sings a word, a solo clarinet sings his grief for him: one of the most famous clarinet solos in opera. Don Alvaro, fighting under an assumed name and believing his beloved Leonora dead, then begins: “Life is hell for the unhappy.”',
    },
    {
      slug: 'bellison-wedding-preparation',
      composer: 'Grzegorz Fitelberg',
      composerDates: '1879–1953',
      work: 'Four Hebraic Pictures',
      part: 'I. The Wedding: The Preparation of the Bride',
      original: 'צו דער חופָּה · כּלה-בּאזעצן',
      arranger: 'arr. Simeon Bellison',
      with: [pianist],
      note: 'Slow and free, the clarinet sings like a cantor rather than an opera tenor. Fitelberg dedicated The Wedding to Simeon Bellison, the New York Philharmonic’s principal clarinet from 1920 to 1948, who arranged these pictures from the music of the old Russian Empire.',
    },
    {
      slug: 'bellison-wedding-procession',
      composer: 'Grzegorz Fitelberg',
      composerDates: '1879–1953',
      work: 'Four Hebraic Pictures',
      part: 'I. The Wedding: Procession',
      original: 'פּראָצֶעסיֶע',
      arranger: 'arr. Simeon Bellison',
      with: [pianist],
      note: 'The second half of The Wedding: a graceful procession to the chuppah.',
    },
    {
      slug: 'bellison-canzonetta',
      composer: 'Jacob Weinberg',
      composerDates: '1879–1956',
      work: 'Four Hebraic Pictures',
      part: 'II. Canzonetta: Grandmother’s Tales',
      original: 'בָּאבֶּע מעשיות',
      arranger: 'arr. Simeon Bellison',
      with: [pianist],
      note: 'From Weinberg’s suite Bobe-mayses, Yiddish for “grandmother’s tales,” or old wives’ tales.',
    },
    {
      slug: 'bellison-hebrew-dance',
      composer: 'Boris Levenson',
      composerDates: '1884–1947',
      work: 'Four Hebraic Pictures',
      part: 'III. Hebrew Dance',
      original: 'פרֵיילַאכס',
      arranger: 'arr. Simeon Bellison',
      with: [pianist],
      note: 'A freylakhs: the joyful circle dance of the Jewish wedding.',
    },
    {
      slug: 'bellison-maypole',
      composer: 'Jacob Weinberg',
      composerDates: '1879–1956',
      work: 'Four Hebraic Pictures',
      part: 'IV. The Maypole',
      original: 'קינדער קַארַאהָאד',
      arranger: 'arr. Simeon Bellison',
      with: [pianist],
      note: 'A racing children’s round dance, also from Bobe-mayses.',
    },
    {
      slug: 'gershwin-prelude-1',
      composer: 'George Gershwin',
      composerDates: '1898–1937',
      work: 'Three Preludes',
      part: 'I. Allegro ben ritmato e deciso',
      arranger: 'arr. James Cohn',
      with: [pianist],
      note: 'Gershwin premiered the preludes himself, at the piano, in 1926. The first is jaunty and syncopated.',
    },
    {
      slug: 'gershwin-prelude-2',
      composer: 'George Gershwin',
      composerDates: '1898–1937',
      work: 'Three Preludes',
      part: 'II. Andante con moto e poco rubato',
      arranger: 'arr. James Cohn',
      with: [pianist],
      note: 'What Gershwin called “a sort of blues lullaby,” played here on the darker A clarinet.',
    },
    {
      slug: 'gershwin-prelude-3',
      composer: 'George Gershwin',
      composerDates: '1898–1937',
      work: 'Three Preludes',
      part: 'III. Allegro ben ritmato e deciso',
      arranger: 'arr. James Cohn',
      with: [pianist],
      note: 'A fiery finale.',
    },
    {
      slug: 'milhaud-duo-concertant',
      composer: 'Darius Milhaud',
      composerDates: '1892–1974',
      work: 'Duo concertant',
      with: [pianist],
      note: 'Sixteen years after fleeing France as a refugee, Milhaud wrote this as the competition piece for the clarinet students of the Paris Conservatoire. In a few short minutes it tests everything a clarinetist can do.',
    },
    {
      slug: 'reich-new-york-counterpoint',
      composer: 'Steve Reich',
      composerDates: 'b. 1936',
      work: 'New York Counterpoint',
      part: 'Fast – Slow – Fast',
      with: ['Cory Johannsen, sound design'],
      note: 'Eleven clarinets and bass clarinets in interlocking, repeating patterns: ten recorded in advance by Rey, one played live. Melodies seem to rise out of the texture, though no single clarinet is playing them.',
    },
  ],
};

export const excerpts: Album = {
  id: 'excerpts',
  title: 'Orchestral excerpts',
  subtitle: 'Unaccompanied audition recording',
  recorded: 'Recorded January 2026',
  personnel: ['Rey Abolofia, clarinet'],
  tracks: [
    { slug: 'excerpt-mozart-concerto', composer: 'W. A. Mozart', work: 'Clarinet Concerto in A major, K. 622' },
    { slug: 'excerpt-beethoven-6', composer: 'Ludwig van Beethoven', work: 'Symphony No. 6, “Pastoral”', part: 'I and II' },
    { slug: 'excerpt-shostakovich-9', composer: 'Dmitri Shostakovich', work: 'Symphony No. 9' },
    { slug: 'excerpt-puccini-tosca', composer: 'Giacomo Puccini', work: 'Tosca' },
    { slug: 'excerpt-rossini-barber', composer: 'Gioachino Rossini', work: 'The Barber of Seville', part: 'Overture; Figaro’s cavatina' },
    { slug: 'excerpt-grofe-grand-canyon', composer: 'Ferde Grofé', work: 'Grand Canyon Suite', part: 'On the Trail; Cloudburst' },
    { slug: 'excerpt-verdi-aida', composer: 'Giuseppe Verdi', work: 'Aida' },
    { slug: 'excerpt-tchaikovsky-manfred', composer: 'Pyotr Ilyich Tchaikovsky', work: 'Manfred Symphony' },
  ],
};

export const albums = [recital, excerpts];

type PeakEntry = { duration: number; peaks: number[] };
const peakData = peaks as Record<string, PeakEntry>;

export const durationOf = (slug: string) => peakData[slug]?.duration ?? 0;
export const peaksOf = (slug: string) => peakData[slug]?.peaks ?? [];

export const formatTime = (seconds: number) => {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/** Track title as it reads in a list: "Work: Part". */
export const trackTitle = (t: Track) => (t.part ? `${t.work}: ${t.part}` : t.work);

/** Everything the global player needs, keyed by slug. */
export const playerCatalog = Object.fromEntries(
  albums.flatMap((album) =>
    album.tracks.map((t) => [
      t.slug,
      {
        src: `/audio/${t.slug}.mp3`,
        composer: t.composer,
        work: t.work,
        part: t.part ?? '',
        album: album.title,
        duration: durationOf(t.slug),
        peaks: peaksOf(t.slug),
      },
    ]),
  ),
);

export const featured = [
  'verdi-la-forza-del-destino',
  'bellison-hebrew-dance',
  'gershwin-prelude-2',
  'milhaud-duo-concertant',
  'reich-new-york-counterpoint',
];
