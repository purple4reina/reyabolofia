// Site-wide audio player. Any element with data-play="<slug>" plays that track;
// data-queue="a,b,c" sets what plays next. State is broadcast on `document` as
// `player:change` so other parts of the page (waveforms, the ring) can follow.

type Entry = {
  src: string;
  composer: string;
  work: string;
  part: string;
  album: string;
  duration: number;
  peaks: number[];
};

declare global {
  interface Window {
    reyPlayer?: {
      readonly slug: string | null;
      readonly time: number;
      readonly playing: boolean;
      play: (slug: string, queue?: string[]) => void;
      toggle: () => void;
    };
  }
}

const root = document.querySelector<HTMLElement>('[data-player]');

if (root && !window.reyPlayer) {
  const catalog: Record<string, Entry> = JSON.parse(
    root.querySelector('[data-player-catalog]')?.textContent || '{}',
  );
  const audio = root.querySelector<HTMLAudioElement>('[data-audio]')!;
  const $ = <T extends Element>(sel: string) => root.querySelector<T>(sel)!;
  const toggleBtn = $<HTMLButtonElement>('[data-p-toggle]');
  const composerEl = $<HTMLElement>('[data-p-composer]');
  const workEl = $<HTMLElement>('[data-p-work]');
  const partEl = $<HTMLElement>('[data-p-part]');
  const currentEl = $<HTMLElement>('[data-p-current]');
  const durationEl = $<HTMLElement>('[data-p-duration]');
  const seek = $<HTMLElement>('[data-p-seek]');
  const canvas = $<HTMLCanvasElement>('[data-p-canvas]');

  let queue: string[] = [];
  let index = -1;
  let current: string | null = null;
  let raf = 0;

  const fmt = (s: number) => {
    const t = Math.max(0, Math.floor(s || 0));
    return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
  };

  const duration = () => (current ? audio.duration || catalog[current].duration : 0);

  function setState(state: 'idle' | 'paused' | 'playing') {
    root!.dataset.state = state;
    document.documentElement.style.setProperty('--player-h', state === 'idle' ? '0px' : `${root!.offsetHeight}px`);
    toggleBtn.setAttribute('aria-label', state === 'playing' ? 'Pause' : 'Play');
    syncPage();
    document.dispatchEvent(
      new CustomEvent('player:change', { detail: { slug: current, playing: state === 'playing' } }),
    );
  }

  /** Reflect player state on every play button and waveform on the current page. */
  function syncPage() {
    const playing = !audio.paused && !audio.ended;
    document.querySelectorAll<HTMLElement>('[data-play]').forEach((btn) => {
      const on = btn.dataset.play === current;
      btn.classList.toggle('is-current', on);
      btn.classList.toggle('is-playing', on && playing);
      const title = btn.dataset.title || 'recording';
      if (!btn.querySelector('.text')) {
        btn.setAttribute('aria-label', `${on && playing ? 'Pause' : 'Play'} ${title}`);
      }
      btn.setAttribute('aria-pressed', String(on && playing));
    });
    document.querySelectorAll<HTMLElement>('[data-track-row]').forEach((row) => {
      row.classList.toggle('is-current', row.dataset.trackRow === current);
    });
    updateProgress();
  }

  function updateProgress() {
    const d = duration();
    const t = audio.currentTime || 0;
    const p = d ? Math.min(1, t / d) : 0;
    currentEl.textContent = fmt(t);
    durationEl.textContent = fmt(d);
    seek.setAttribute('aria-valuenow', String(Math.round(p * 100)));
    seek.setAttribute('aria-valuetext', `${fmt(t)} of ${fmt(d)}`);
    document.querySelectorAll<SVGElement>('[data-wave]').forEach((w) => {
      w.style.setProperty('--progress', w.dataset.wave === current ? String(p) : '0');
    });
    draw(p);
  }

  function draw(progress: number) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, w, h);
    const played = getComputedStyle(root!).getPropertyValue('--lilac').trim() || '#bba6e4';
    const rest = 'rgba(236,231,241,0.24)';

    if (rect.height < 32) {
      // Compact (phone) layout: a thin progress line along the top edge.
      const y = h / 2;
      const lh = 2 * dpr;
      ctx.fillStyle = rest;
      ctx.fillRect(0, y - lh / 2, w, lh);
      ctx.fillStyle = played;
      ctx.fillRect(0, y - lh / 2, w * progress, lh);
      return;
    }

    const peaks = current ? catalog[current].peaks : [];
    const barW = 2 * dpr;
    const gap = 2 * dpr;
    const count = Math.max(1, Math.floor((w + gap) / (barW + gap)));
    for (let i = 0; i < count; i++) {
      const v = peaks.length ? peaks[Math.floor((i / count) * peaks.length)] : 10;
      const bh = Math.max(2 * dpr, (v / 100) * h);
      const x = i * (barW + gap);
      ctx.fillStyle = i / count < progress ? played : rest;
      ctx.fillRect(x, (h - bh) / 2, barW, bh);
    }
  }

  function tick() {
    updateProgress();
    raf = audio.paused ? 0 : requestAnimationFrame(tick);
  }

  function load(slug: string) {
    const entry = catalog[slug];
    if (!entry) return false;
    current = slug;
    audio.src = entry.src;
    composerEl.textContent = entry.composer;
    workEl.textContent = entry.work;
    partEl.textContent = entry.part;
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: entry.part ? `${entry.work}: ${entry.part}` : entry.work,
        artist: `${entry.composer} · Rey Abolofia, clarinet`,
        album: entry.album,
        artwork: [{ src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
      });
    }
    return true;
  }

  function play(slug: string, nextQueue?: string[]) {
    if (slug === current) {
      toggle();
      return;
    }
    if (nextQueue && nextQueue.length) queue = nextQueue;
    else if (!queue.includes(slug)) queue = [slug];
    index = queue.indexOf(slug);
    if (!load(slug)) return;
    audio.play().catch(() => setState('paused'));
  }

  function toggle() {
    if (!current) return;
    if (audio.paused) audio.play().catch(() => undefined);
    else audio.pause();
  }

  function step(delta: number) {
    if (!queue.length) return;
    if (delta < 0 && audio.currentTime > 4) {
      audio.currentTime = 0;
      return;
    }
    const next = index + delta;
    if (next < 0 || next >= queue.length) return;
    index = next;
    if (load(queue[index])) audio.play().catch(() => undefined);
  }

  function close() {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    current = null;
    setState('idle');
  }

  audio.addEventListener('play', () => {
    setState('playing');
    if (!raf) raf = requestAnimationFrame(tick);
  });
  audio.addEventListener('pause', () => setState('paused'));
  audio.addEventListener('loadedmetadata', updateProgress);
  audio.addEventListener('ended', () => {
    if (index < queue.length - 1) step(1);
    else setState('paused');
  });

  toggleBtn.addEventListener('click', toggle);
  $('[data-p-prev]').addEventListener('click', () => step(-1));
  $('[data-p-next]').addEventListener('click', () => step(1));
  $('[data-p-close]').addEventListener('click', close);

  // Seeking: click or drag on the waveform, arrow keys when focused.
  const seekTo = (clientX: number) => {
    const r = seek.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    if (current) audio.currentTime = p * duration();
    updateProgress();
  };
  seek.addEventListener('pointerdown', (e) => {
    seek.setPointerCapture(e.pointerId);
    seekTo(e.clientX);
    const move = (ev: PointerEvent) => seekTo(ev.clientX);
    const up = () => {
      seek.removeEventListener('pointermove', move);
      seek.removeEventListener('pointerup', up);
    };
    seek.addEventListener('pointermove', move);
    seek.addEventListener('pointerup', up);
  });
  seek.addEventListener('keydown', (e) => {
    if (!current) return;
    if (e.key === 'ArrowRight') audio.currentTime = Math.min(duration(), audio.currentTime + 5);
    else if (e.key === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
    else return;
    e.preventDefault();
    updateProgress();
  });

  document.addEventListener('click', (e) => {
    const btn = (e.target as Element).closest<HTMLElement>('[data-play]');
    if (!btn) return;
    e.preventDefault();
    play(btn.dataset.play!, btn.dataset.queue ? btn.dataset.queue.split(',') : undefined);
  });

  document.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;
    if (e.key !== ' ' || !current || t.closest('input, textarea, button, a, [role="slider"], summary')) return;
    if (e.target === document.body) {
      e.preventDefault();
      toggle();
    }
  });

  if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', toggle);
    navigator.mediaSession.setActionHandler('pause', toggle);
    navigator.mediaSession.setActionHandler('previoustrack', () => step(-1));
    navigator.mediaSession.setActionHandler('nexttrack', () => step(1));
  }

  new ResizeObserver(() => updateProgress()).observe(seek);
  document.addEventListener('astro:page-load', syncPage);

  window.reyPlayer = {
    get slug() {
      return current;
    },
    get time() {
      return audio.currentTime;
    },
    get playing() {
      return !audio.paused;
    },
    play,
    toggle,
  };
}
