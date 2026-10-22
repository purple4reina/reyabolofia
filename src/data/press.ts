// Press coverage, newest first.

export interface PressItem {
  outlet: string;
  author?: string;
  date: string;
  headline: string;
  url: string;
  quote?: string;
}

export const press: PressItem[] = [
  {
    outlet: 'The Jewish Review',
    author: 'Rockne Roll',
    date: '2026-10-08',
    headline: 'Abolofia brings “The Jewish Clarinet” to EJC',
    url: 'https://jewishportland.org/jewishreview/jr-stories/abolofia-brings-the-jewish-clarinet-to-ejc',
    quote: 'The instrument is so much more, as Portland’s Rey Abolofia can attest.',
  },
];

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
