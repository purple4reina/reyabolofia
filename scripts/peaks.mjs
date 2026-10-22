// Build waveform data for every MP3 in public/audio.
//
// Writes src/data/peaks.json: { [slug]: { duration, peaks: number[] } }, where
// peaks are 0–100 loudness values, one per bar the player draws.
import { execFileSync } from 'node:child_process';
import { readdirSync, writeFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const audioDir = join(root, 'public', 'audio');
const BARS = 240;
const RATE = 4000;

const out = {};
for (const file of readdirSync(audioDir).filter((f) => f.endsWith('.mp3')).sort()) {
  const slug = basename(file, '.mp3');
  const pcm = execFileSync(
    'ffmpeg',
    ['-loglevel', 'error', '-i', join(audioDir, file), '-ac', '1', '-ar', String(RATE), '-f', 's16le', '-'],
    { maxBuffer: 1 << 30 },
  );
  const samples = new Int16Array(pcm.buffer, pcm.byteOffset, pcm.length / 2);
  const per = Math.floor(samples.length / BARS);
  const rms = [];
  for (let b = 0; b < BARS; b++) {
    let sum = 0;
    for (let i = b * per; i < (b + 1) * per; i++) sum += samples[i] * samples[i];
    rms.push(Math.sqrt(sum / per) / 32768);
  }
  // Map to a perceptual (dB) scale so quiet passages still show shape.
  const db = rms.map((v) => 20 * Math.log10(Math.max(v, 1e-5)));
  const floor = -48;
  const max = Math.max(...db);
  const peaks = db.map((v) => Math.round(Math.max(4, Math.min(100, ((v - floor) / (max - floor)) * 100))));
  out[slug] = { duration: Math.round((samples.length / RATE) * 10) / 10, peaks };
  console.log(`peaks: ${slug} (${out[slug].duration}s)`);
}

writeFileSync(join(root, 'src', 'data', 'peaks.json'), JSON.stringify(out));
