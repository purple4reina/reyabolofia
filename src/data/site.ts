// Facts used across the site. Edit here and every page picks up the change.

export const site = {
  name: 'Rey Abolofia',
  instrument: 'Clarinet',
  url: 'https://reyabolofia.com',
  email: 'info@reyabolofia.com',
  home: 'Portland, Oregon',
  instagram: 'https://www.instagram.com/purple4reina/',
  description:
    'Rey Abolofia is a clarinetist based in Portland, Oregon: Principal Clarinet of the Salem Philharmonia Orchestra, recitalist, and music historian.',
  photoCredit: 'Norm Eder',
};

/** Prefilled email links, so every request arrives with a clear subject line. */
export const mail = {
  general: `mailto:${site.email}`,
  booking: `mailto:${site.email}?subject=${encodeURIComponent('Booking inquiry')}`,
  program: `mailto:${site.email}?subject=${encodeURIComponent('Booking: The Jewish Clarinet')}`,
  broadcast: `mailto:${site.email}?subject=${encodeURIComponent('Broadcast files request')}`,
  sub: `mailto:${site.email}?subject=${encodeURIComponent('Sub list / orchestral inquiry')}`,
  lessons: `mailto:${site.email}?subject=${encodeURIComponent('Lesson inquiry')}`,
  press: `mailto:${site.email}?subject=${encodeURIComponent('Press inquiry')}`,
};

export const positions = [
  {
    ensemble: 'Salem Philharmonia Orchestra',
    role: 'Principal Clarinet',
    since: 2025,
    url: 'https://salemphil.org',
  },
  {
    ensemble: 'Sunnyside Symphony Orchestra',
    role: 'Bass and auxiliary clarinet',
    since: 2022,
  },
];

/** Instruments Rey plays and brings to a gig. */
export const instruments = ['Clarinet in B♭ and A', 'E♭ clarinet', 'Bass clarinet'];

export const education = [
  {
    school: 'Louisiana State University',
    detail: 'Doctoral studies in clarinet performance',
    years: '2009–2011',
  },
  { school: 'Eastman School of Music', detail: 'Clarinet studies', years: '' },
  {
    school: 'Portland State University',
    detail: 'Master of Music, clarinet performance, magna cum laude, with Stan Stanford',
    years: '2008',
  },
  {
    school: 'Portland State University',
    detail: 'Bachelor of Music, clarinet performance, with Stan Stanford',
    years: '2004',
  },
];


export const nav = [
  { href: '/about', label: 'About' },
  { href: '/listen', label: 'Listen' },
  { href: '/the-jewish-clarinet', label: 'The Jewish Clarinet' },
  { href: '/teaching', label: 'Teaching' },
];
