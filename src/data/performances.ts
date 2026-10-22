// Upcoming concerts. Add new dates here; past dates drop off automatically
// (at build time, and again in the visitor's browser).
//
// `start` is local Pacific time in ISO format.

export interface Performance {
  start: string;
  ensemble: string;
  role?: string;
  title?: string;
  venue: string;
  city: string;
  url?: string;
  note?: string;
}

const salem = {
  ensemble: 'Salem Philharmonia Orchestra',
  role: 'Principal Clarinet',
  venue: 'East Salem Community Center',
  city: 'Salem, Oregon',
  url: 'https://salemphil.org',
};

const sunnyside = {
  ensemble: 'Sunnyside Symphony Orchestra',
  role: 'Bass clarinet',
  venue: 'Sunnyside Adventist Church',
  city: 'Portland, Oregon',
  note: 'Free admission',
};

export const performances: Performance[] = [
  { ...salem, start: '2026-11-21T14:00' },
  { ...salem, start: '2026-11-22T14:00' },
  { ...sunnyside, start: '2026-12-06T14:00' },
  { ...sunnyside, start: '2027-02-14T14:00' },
  { ...salem, start: '2027-02-20T19:00' },
  { ...salem, start: '2027-02-21T14:00' },
  { ...salem, start: '2027-04-10T19:00' },
  { ...salem, start: '2027-04-11T14:00' },
  { ...sunnyside, start: '2027-04-18T14:00' },
  { ...salem, start: '2027-05-29T19:00' },
  { ...salem, start: '2027-05-30T14:00' },
];

export const upcoming = (now = new Date()) =>
  performances
    .filter((p) => new Date(`${p.start}:00-08:00`) >= new Date(now.getTime() - 6 * 3600e3))
    .sort((a, b) => a.start.localeCompare(b.start));
