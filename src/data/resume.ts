// Résumé entries, used on /orchestral and the printable /resume page
// (which is also saved as public/rey-abolofia-resume.pdf by `npm run resume:pdf`).

export interface Entry {
  what: string;
  where?: string;
  role?: string;
  when: string;
}

export const resume: { title: string; entries: Entry[] }[] = [
  {
    title: 'Orchestral positions',
    entries: [
      { what: 'Salem Philharmonia Orchestra', where: 'Salem, Oregon', role: 'Principal Clarinet', when: '2025–present' },
      {
        what: 'Sunnyside Symphony Orchestra',
        where: 'Portland, Oregon',
        role: 'Bass and auxiliary clarinet; substitute principal',
        when: '2022–present',
      },
    ],
  },
  {
    title: 'Other ensembles',
    entries: [
      {
        what: 'Rose City Wind Symphony',
        where: 'Portland, Oregon',
        role: 'Clarinet; former section leader',
        when: '2017–present',
      },
      { what: 'Beaverton Symphony Orchestra', where: 'Beaverton, Oregon', role: 'Clarinet', when: '2026' },
      { what: 'Portland Wind Symphony', where: 'Portland, Oregon', role: 'Clarinet', when: '2024' },
    ],
  },
  {
    title: 'Solo and recital',
    entries: [
      {
        what: 'The Jewish Clarinet',
        where: 'Eastside Jewish Commons, Portland',
        role: 'Solo recital, with Reich’s New York Counterpoint for clarinet and ten speakers',
        when: '2026',
      },
      { what: 'Guest artist', where: 'Eastern Province, Zambia', when: '2022' },
      { what: 'Buffet Clarinet Academy', where: 'Jacksonville, Florida', when: '2008' },
      { what: 'Hawaii Music Festival', where: 'Island of Hawaiʻi', when: '2008' },
      { what: 'Belgium Clarinet Academy', where: 'Ostend, Belgium', when: '2007' },
    ],
  },
  {
    title: 'Teaching',
    entries: [
      { what: 'Private clarinet studio', where: 'Portland, Oregon', when: '2001–present' },
      {
        what: 'Music Camps at Wallowa Lake',
        where: 'Joseph, Oregon',
        role: 'Music history faculty since 2023; senior counselor 2007–2016',
        when: '2007–present',
      },
      { what: 'Daraja Music Initiative', where: 'Moshi, Tanzania', role: 'Clarinet instructor', when: '2018–2019' },
    ],
  },
  {
    title: 'Education',
    entries: [
      { what: 'Louisiana State University', role: 'Doctoral studies, clarinet performance', when: '2009–2011' },
      { what: 'Eastman School of Music', role: 'Clarinet studies', when: '' },
      {
        what: 'Portland State University',
        role: 'Master of Music, clarinet performance, magna cum laude',
        when: '2008',
      },
      { what: 'Portland State University', role: 'Bachelor of Music, clarinet performance', when: '2004' },
    ],
  },
  {
    title: 'Honors',
    entries: [
      {
        what: 'President’s Award for Outstanding Community Engagement',
        where: 'Portland State University',
        when: '2008',
      },
    ],
  },
];
