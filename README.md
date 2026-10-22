# reyabolofia.com

Website of clarinetist Rey Abolofia, built with [Astro](https://astro.build) and
published to GitHub Pages.

## Working on the site

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run preview    # serve dist/ locally
```

## Updating content

Almost everything that changes over time lives in `src/data/`:

| File | What it holds |
| --- | --- |
| `site.ts` | Email, positions, instruments, education, navigation |
| `bios.ts` | Short, medium, and long bios (shown on About and the press kit) |
| `performances.ts` | Upcoming concerts. Past dates drop off by themselves |
| `recordings.ts` | Every recording, with titles, credits, and short notes |
| `resume.ts` | The résumé on /orchestral and /resume |
| `press.ts` | Press coverage and quotes |
| `students.json` | Étude and solo lists for the student pages |

Keep the copy evergreen: name years ("in 2026") instead of "this season" or
"recently", so nothing goes stale.

### Adding or replacing recordings

1. Put the mixed WAVs in a folder.
2. Edit the `TRACKS` list at the top of `scripts/encode-audio.sh` (file name →
   slug, plus an optional silence threshold and maximum length).
3. Run `npm run audio -- "/path/to/wav/folder"`. This writes MP3s to
   `public/audio/` and rebuilds the waveforms in `src/data/peaks.json`.
4. Add the track details to `src/data/recordings.ts` under the same slug.

Broadcast-quality WAVs are not published; the site offers them on request.

### Photos

Site photos live in `src/assets/photos/` (about 3200 px; Astro makes the
responsive sizes). Full-size press downloads live in `public/press/`, with the
photographer's credit in the file name. Portraits are by Norm Eder.

### Link preview, icons, and résumé PDF

These are drawn with headless Chrome so they match the site's fonts. With the
dev server running:

```bash
npm run render     # writes public/og.jpg, favicons, rey-abolofia-resume.pdf
```

Run it again after changing `src/data/resume.ts`.

## How the site is put together

- `src/layouts/Base.astro`: page shell, meta tags, fonts, and the audio player.
- `src/components/PlayerBar.astro` and `src/scripts/player.ts`: the site-wide
  player. Any element with `data-play="<slug>"` plays that recording, and the
  player keeps playing across page changes.
- `src/components/CounterpointRing.astro` and `src/scripts/ring.ts`: the
  *New York Counterpoint* ring. Scrolling tells the story; while the recording
  plays, each speaker lights up when its part is sounding, using the part timing
  in `src/data/nyc-parts.json` (from the score MIDI used to record the parts).
- `src/scripts/app.ts`: smooth scrolling (Lenis), the layered scroll effects
  (GSAP ScrollTrigger), the header and menu. Everything respects the visitor's
  reduced-motion setting.
- `src/styles/global.css`: colors, type, and layout. Bodoni Moda is used only at
  very large sizes; Newsreader is the reading face; Instrument Sans is for
  interface text.

Old addresses still work: `/music.html`, `/solos.html`, and `/tips.html`
redirect to the new student pages, and `/record` still points to the practice
recorder.

## Deploying

`.github/workflows/deploy.yml` builds and publishes the site on every push to
`main`. Before the first deploy, switch the repository's Pages source to GitHub
Actions (Settings → Pages → Build and deployment → Source: GitHub Actions). The
custom domain comes from `public/CNAME`.
