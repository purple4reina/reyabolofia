// Drives the New York Counterpoint ring: scroll reveals the story, and while the
// recording plays each speaker lights up whenever its part is sounding.
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Parts = {
  offset: number;
  musicEnds: number;
  movements: { name: string; start: number }[];
  parts: { id: string; segs: [number, number][] }[];
};

const SLUG = 'reich-new-york-counterpoint';
const MOVEMENT_NAMES: Record<string, string> = { I: 'I. Fast', II: 'II. Slow', III: 'III. Fast' };

/** Is time t inside one of the sorted [start, end] segments? */
function sounding(segs: [number, number][], t: number) {
  let lo = 0;
  let hi = segs.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const [s, e] = segs[mid];
    if (t < s) hi = mid - 1;
    else if (t > e) lo = mid + 1;
    else return true;
  }
  return false;
}

export function initRing(section: HTMLElement, animate: boolean): () => void {
  const data: Parts = JSON.parse(section.querySelector('[data-ring-data]')?.textContent || '{}');
  const nodes = new Map<string, SVGGElement>();
  section.querySelectorAll<SVGGElement>('[data-part]').forEach((n) => nodes.set(n.dataset.part!, n));
  const rays = new Map<string, SVGLineElement>();
  section.querySelectorAll<SVGLineElement>('[data-ray]').forEach((r) => rays.set(r.dataset.ray!, r));
  const labels = [...section.querySelectorAll<SVGTextElement>('[data-label]')];
  const steps = [...section.querySelectorAll<HTMLElement>('[data-step]')];
  const center = section.querySelector<SVGTextElement>('[data-ring-center]')!;
  const progressArc = section.querySelector<SVGCircleElement>('[data-ring-progress]')!;

  let trigger: ScrollTrigger | null = null;
  let raf = 0;

  // ---- scroll story ----
  const setStage = (p: number) => {
    const stage = Math.min(3, Math.floor(p * 4.2));
    section.dataset.stage = String(stage);
    steps.forEach((s, i) => s.classList.toggle('is-active', i === stage));
    // Speakers appear one by one during the second step.
    const shown = stage >= 2 ? 11 : stage === 1 ? 1 + Math.floor(((p * 4.2 - 1) / 1) * 10) : 1;
    nodes.forEach((n) => n.classList.toggle('is-shown', Number(n.dataset.index) < shown));
    labels.forEach((l, i) => l.classList.toggle('is-shown', i < shown));
  };

  if (animate) {
    setStage(0);
    trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => setStage(self.progress),
    });
  } else {
    section.dataset.stage = '3';
    steps.forEach((s) => s.classList.add('is-active'));
    nodes.forEach((n) => n.classList.add('is-shown'));
    labels.forEach((l) => l.classList.add('is-shown'));
  }

  // ---- playback sync ----
  const clear = () => {
    nodes.forEach((n) => n.classList.remove('is-on'));
    rays.forEach((r) => r.classList.remove('is-on'));
    progressArc.style.strokeDashoffset = '1';
    center.textContent = 'Audience';
  };

  const frame = () => {
    const player = window.reyPlayer;
    if (!player || player.slug !== SLUG) {
      raf = 0;
      return;
    }
    const t = player.time - data.offset;
    for (const part of data.parts) {
      const on = t >= 0 && t <= data.musicEnds && sounding(part.segs, t);
      nodes.get(part.id)?.classList.toggle('is-on', on);
      rays.get(part.id)?.classList.toggle('is-on', on);
    }
    progressArc.style.strokeDashoffset = String(1 - Math.min(1, Math.max(0, t / data.musicEnds)));
    const mv = [...data.movements].reverse().find((m) => t >= m.start);
    center.textContent = t > data.musicEnds ? 'Applause' : mv ? MOVEMENT_NAMES[mv.name] || mv.name : 'Audience';
    raf = player.playing ? requestAnimationFrame(frame) : 0;
  };

  const onChange = (e: Event) => {
    const { slug } = (e as CustomEvent).detail as { slug: string | null; playing: boolean };
    const live = slug === SLUG;
    section.classList.toggle('is-live', live);
    if (!live) {
      clear();
      return;
    }
    if (!raf) raf = requestAnimationFrame(frame);
  };

  document.addEventListener('player:change', onChange);
  if (window.reyPlayer?.slug === SLUG) {
    section.classList.add('is-live');
    raf = requestAnimationFrame(frame);
  }

  return () => {
    document.removeEventListener('player:change', onChange);
    if (raf) cancelAnimationFrame(raf);
    trigger?.kill();
  };
}
