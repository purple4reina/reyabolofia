// Renders the files that are drawn rather than written, using headless Chrome
// so they match the site's own fonts:
//
//   public/og.jpg                  link-preview image (1200 x 630)
//   public/favicon-32.png          favicon for browsers without SVG icons
//   public/apple-touch-icon.png    home-screen icon (180 x 180)
//   public/rey-abolofia-resume.pdf the /resume page, printed
//
// Usage: npm run dev (in another terminal), then npm run render
// Optional: npm run render -- http://127.0.0.1:4321   (dev or preview URL)
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const base = process.argv[2] || 'http://127.0.0.1:4321';
const chrome =
  process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const work = mkdtempSync(join(tmpdir(), 'rey-render-'));
const file = (p) => pathToFileURL(join(root, p)).href;

const fonts = `
  @font-face { font-family: Bodoni; src: url(${file('node_modules/@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-standard-normal.woff2')}) format('woff2'); font-weight: 400 900; }
  @font-face { font-family: News; font-style: italic; src: url(${file('node_modules/@fontsource-variable/newsreader/files/newsreader-latin-standard-italic.woff2')}) format('woff2'); font-weight: 200 800; }
  @font-face { font-family: Sans; src: url(${file('node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2')}) format('woff2'); font-weight: 400 700; }
`;

function ring(size, live = '#bba6e4', dots = '#ece7f1') {
  const pts = Array.from({ length: 11 }, (_, i) => {
    const a = (i / 11) * Math.PI * 2 - Math.PI / 2;
    const x = (Math.cos(a) * 9).toFixed(3);
    const y = (Math.sin(a) * 9).toFixed(3);
    return i === 0
      ? `<circle cx="${x}" cy="${y}" r="2.1" fill="${live}"/>`
      : `<circle cx="${x}" cy="${y}" r="1.15" fill="${dots}"/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="-12 -12 24 24">${pts}</svg>`;
}

function shoot(html, name, width, height) {
  const page = join(work, `${name}.html`);
  writeFileSync(page, html);
  const png = join(work, `${name}.png`);
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=${width},${height}`,
    `--screenshot=${png}`,
    '--virtual-time-budget=4000',
    pathToFileURL(page).href,
  ], { stdio: 'ignore' });
  return png;
}

// ---- link preview ----
// Same arrangement as the home page: "Abolofia" steps left of "Rey" along the
// line of the raised arm, and the small text sits centered beneath it.
const og = shoot(
  `<!doctype html><html><head><style>${fonts}
    html,body{margin:0;width:1200px;height:630px;background:#070707;overflow:hidden}
    .photo{position:absolute;inset:0 270px 0 -210px;background:url(${file('src/assets/photos/eder-horizontal-color.jpg')}) 38% 42%/cover no-repeat;
      -webkit-mask-image:linear-gradient(to left,transparent,#000 24%)}
    .block{position:absolute;left:540px;bottom:46px;display:grid;width:fit-content;color:#ece7f1}
    .name{font-family:Bodoni;font-size:116px;line-height:.86;letter-spacing:-.025em;margin:0}
    .name span{display:block}.name span:first-child{margin-left:200px}
    .sub{justify-self:center;display:grid;margin-top:14px}
    .role{font-family:News;font-style:italic;font-size:34px;color:#bba6e4}
    .post{font-family:Sans;font-size:19px;color:#a9a1b4;margin-top:2px}
  </style></head><body><div class="photo"></div>
  <div class="block"><p class="name"><span>Rey</span><span>Abolofia</span></p>
  <div class="sub"><span class="role">Clarinet</span><span class="post">Principal Clarinet, Salem Philharmonia Orchestra</span></div></div>
  </body></html>`,
  'og',
  1200,
  630,
);
execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '88', og, '--out', join(root, 'public', 'og.jpg')], {
  stdio: 'ignore',
});

// ---- icons ----
const iconPage = (size, pad) =>
  `<!doctype html><html><body style="margin:0;width:${size}px;height:${size}px;background:#070707;display:grid;place-items:center">${ring(size - pad * 2)}</body></html>`;
execFileSync('cp', [shoot(iconPage(180, 26), 'touch', 180, 180), join(root, 'public', 'apple-touch-icon.png')]);
execFileSync('cp', [shoot(iconPage(32, 2), 'fav', 32, 32), join(root, 'public', 'favicon-32.png')]);
writeFileSync(
  join(root, 'public', 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 24 24"><style>circle.d{fill:#1b1522}@media (prefers-color-scheme:dark){circle.d{fill:#ece7f1}}</style>${Array.from(
    { length: 11 },
    (_, i) => {
      const a = (i / 11) * Math.PI * 2 - Math.PI / 2;
      const x = (Math.cos(a) * 9).toFixed(3);
      const y = (Math.sin(a) * 9).toFixed(3);
      return i === 0
        ? `<circle cx="${x}" cy="${y}" r="2.4" fill="#8f73c9"/>`
        : `<circle class="d" cx="${x}" cy="${y}" r="1.35"/>`;
    },
  ).join('')}</svg>\n`,
);

// ---- résumé PDF ----
try {
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--virtual-time-budget=6000',
    `--print-to-pdf=${join(root, 'public', 'rey-abolofia-resume.pdf')}`,
    `${base}/resume`,
  ], { stdio: 'ignore' });
  console.log('résumé PDF written');
} catch {
  console.warn(`Could not print ${base}/resume. Is the dev server running?`);
}

rmSync(work, { recursive: true, force: true });
console.log('rendered og.jpg, favicon.svg, favicon-32.png, apple-touch-icon.png');
