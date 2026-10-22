// Page behavior: smooth scrolling, the layered scroll effects, the header and
// menu, and small helpers. Runs on every page load, including client-side
// navigations (astro:page-load), and cleans up before the next page swaps in.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initRing } from './ring';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let lenis: Lenis | null = null;
let cleanups: Array<() => void> = [];
const onCleanup = (fn: () => void) => cleanups.push(fn);

function motionAllowed() {
  return !reduceMotion.matches;
}

function startSmoothScroll() {
  document.documentElement.classList.toggle('no-motion', !motionAllowed());
  if (!motionAllowed() || lenis) return;
  lenis = new Lenis({
    lerp: 0.11,
    anchors: { offset: -16 },
    prevent: (node) => !!node.closest?.('[data-lenis-prevent]'),
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ---------- header & menu ----------

function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  const button = header.querySelector<HTMLButtonElement>('[data-menu-button]')!;
  const menu = header.querySelector<HTMLElement>('[data-menu]')!;
  let lastY = window.scrollY;
  // Distance scrolled in the current direction (down positive, up negative).
  let travel = 0;
  let menuOpen = false;

  // Over a page's opening photo the bar stays see-through, so it never cuts
  // across the portrait; it turns solid once the content below reaches it.
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  let solidFrom = 24;
  const measure = () => {
    solidFrom = hero ? hero.offsetHeight - header.offsetHeight : 24;
  };
  measure();
  window.addEventListener('resize', measure);

  // Hide on the way down, show on the way up. Only a deliberate move flips it:
  // smooth scrolling and trackpad momentum slow to a pixel or two per frame,
  // which must not bring the bar back while the page is still going down.
  const onScroll = () => {
    const y = window.scrollY;
    const dy = y - lastY;
    lastY = y;
    header.classList.toggle('is-scrolled', y > solidFrom);
    if (menuOpen || dy === 0) return;
    travel = Math.sign(dy) === Math.sign(travel) ? travel + dy : dy;
    if (y < window.innerHeight * 0.7 || travel < -6) header.classList.remove('is-hidden');
    else if (travel > 6) header.classList.add('is-hidden');
  };

  const setMenu = (open: boolean) => {
    menuOpen = open;
    button.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    header.classList.toggle('is-scrolled', open || window.scrollY > solidFrom);
    header.classList.remove('is-hidden');
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && menuOpen) {
      setMenu(false);
      button.focus();
    }
  };

  button.addEventListener('click', () => setMenu(!menuOpen));
  menu.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) setMenu(false);
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('keydown', onKey);
  onScroll();

  onCleanup(() => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', measure);
    document.removeEventListener('keydown', onKey);
    if (menuOpen) setMenu(false);
  });
}

// ---------- scroll effects ----------

/** The home hero: one entrance on load, then it sinks back as the page covers it. */
function initHero() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) {
    document.documentElement.classList.remove('intro-pending');
    return;
  }
  const media = hero.querySelector<HTMLElement>('[data-hero-media]');
  const shade = hero.querySelector<HTMLElement>('[data-hero-shade]');
  const copy = hero.querySelector<HTMLElement>('[data-hero-copy]');
  const lines = hero.querySelectorAll<HTMLElement>('[data-hero-line]');
  const fades = hero.querySelectorAll<HTMLElement>('[data-hero-fade]');
  // A word that gets crossed out, with a new one rising in below it (Teaching).
  const struck = hero.querySelector<HTMLElement>('[data-hero-struck]');
  const strike = hero.querySelector<HTMLElement>('[data-hero-strike]');
  const next = hero.querySelectorAll<HTMLElement>('[data-hero-next]');

  if (!motionAllowed()) {
    document.documentElement.classList.remove('intro-pending');
    hero.classList.add('is-ready');
    return;
  }

  const intro = gsap.timeline({
    defaults: { ease: 'expo.out' },
    // GSAP now holds the starting state inline, so the pre-paint hiding can go.
    onStart: () => document.documentElement.classList.remove('intro-pending'),
  });
  if (media) intro.fromTo(media, { scale: 1.12, opacity: 0 }, { scale: 1.06, opacity: 1, duration: 2.2 }, 0);
  intro.fromTo(lines, { yPercent: 108, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 1.5, stagger: 0.12 }, 0.35);
  if (struck && strike) {
    // The markup starts crossed out, so it reads right without the intro.
    struck.classList.remove('is-struck');
    intro
      .fromTo(strike, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, 1.5)
      .add(() => struck.classList.add('is-struck'), 2.1)
      .fromTo(next, { yPercent: 108, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 1.5 }, 2.2);
  }
  intro
    .fromTo(fades, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.9)
    .add(() => hero.classList.add('is-ready'));

  const scroll = gsap.timeline({
    scrollTrigger: {
      trigger: hero.parentElement || hero,
      start: 'top top',
      end: () => `+=${window.innerHeight}`,
      scrub: true,
    },
  });
  if (media) scroll.to(media, { yPercent: 9, scale: 1, ease: 'none' }, 0);
  if (shade) scroll.to(shade, { opacity: 0.72, ease: 'none' }, 0);
  if (copy) scroll.to(copy, { yPercent: -28, opacity: 0, ease: 'none' }, 0);

  onCleanup(() => {
    intro.kill();
    scroll.scrollTrigger?.kill();
    scroll.kill();
  });
}

/** Images that drift inside their frame, slower than the page. */
function initParallax() {
  if (!motionAllowed()) return;
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((frame) => {
    const target = frame.querySelector<HTMLElement>('img, video');
    if (!target) return;
    const amount = Number(frame.dataset.parallax) || 6;
    const tween = gsap.fromTo(
      target,
      { yPercent: -amount },
      {
        yPercent: amount,
        ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
    onCleanup(() => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
  });
}

/** Large type that slides sideways across the page as it scrolls by. */
function initDrift() {
  if (!motionAllowed()) return;
  document.querySelectorAll<HTMLElement>('[data-drift]').forEach((el) => {
    const amount = Number(el.dataset.drift) || -20;
    const tween = gsap.fromTo(
      el,
      { xPercent: 0 },
      {
        xPercent: amount,
        ease: 'none',
        scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
    onCleanup(() => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
  });
}

/** Photographs that hold still and zoom out slowly as the page scrolls past them. */
function initInterludes() {
  if (!motionAllowed()) return;
  document.querySelectorAll<HTMLElement>('[data-interlude]').forEach((section) => {
    const media = section.querySelector<HTMLElement>('[data-interlude-media]');
    if (!media) return;
    // data-interlude="1.04" sets how far in the photo starts; default 1.12.
    const tween = gsap.fromTo(
      media,
      { scale: Number(section.dataset.interlude) || 1.12 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
    onCleanup(() => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
  });
}

function initRings() {
  document.querySelectorAll<HTMLElement>('[data-ring]').forEach((section) => {
    onCleanup(initRing(section, motionAllowed()));
  });
}

// ---------- helpers ----------

/** Muted loops play only while on screen, and never for reduced motion. */
function initVideos() {
  const videos = document.querySelectorAll<HTMLVideoElement>('video[data-loop]');
  if (!videos.length) return;
  if (!motionAllowed()) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const v = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) v.play().catch(() => undefined);
        else v.pause();
      });
    },
    { threshold: 0.15 },
  );
  videos.forEach((v) => io.observe(v));
  onCleanup(() => io.disconnect());
}

/** Copy a bio (or any text) to the clipboard. */
function initCopyButtons() {
  const onClick = async (e: Event) => {
    const btn = (e.target as Element).closest<HTMLButtonElement>('[data-copy]');
    if (!btn) return;
    const target = document.getElementById(btn.dataset.copy!);
    if (!target) return;
    const text = target.innerText.trim();
    try {
      await navigator.clipboard.writeText(text);
      const label = btn.querySelector('[data-copy-label]') || btn;
      const original = label.textContent;
      label.textContent = 'Copied';
      setTimeout(() => (label.textContent = original), 1800);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(target);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };
  document.addEventListener('click', onClick);
  onCleanup(() => document.removeEventListener('click', onClick));
}

/** Drop concerts that have already happened since the site was built. */
function initUpcoming() {
  document.querySelectorAll<HTMLElement>('[data-upcoming]').forEach((list) => {
    const now = Date.now();
    list.querySelectorAll<HTMLElement>('[data-start]').forEach((item) => {
      const start = new Date(`${item.dataset.start}:00-08:00`).getTime();
      if (start < now - 6 * 3600e3) item.remove();
    });
    // Drop year headings left with no concerts under them.
    list.querySelectorAll<HTMLElement>('.year').forEach((year) => {
      const next = year.nextElementSibling as HTMLElement | null;
      if (!next || !next.hasAttribute('data-start')) year.remove();
    });
    if (!list.querySelector('[data-start]')) {
      const section = list.closest<HTMLElement>('[data-upcoming-section]');
      if (section) section.hidden = true;
    }
  });
}

/** Links that leave the site open in a new tab, so visitors keep their place. */
function initExternalLinks() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]').forEach((a) => {
    if (a.host === window.location.host) return;
    a.target = '_blank';
    a.rel = [a.rel, 'noopener'].filter(Boolean).join(' ');
  });
}

// ---------- lifecycle ----------

function initPage() {
  startSmoothScroll();
  initHeader();
  initHero();
  initInterludes();
  initParallax();
  initDrift();
  initRings();
  initVideos();
  initCopyButtons();
  initUpcoming();
  initExternalLinks();
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

document.addEventListener('astro:page-load', initPage);

document.addEventListener('astro:before-swap', () => {
  cleanups.forEach((fn) => fn());
  cleanups = [];
  ScrollTrigger.getAll().forEach((t) => t.kill());
});

document.addEventListener('astro:after-swap', () => {
  lenis?.scrollTo(0, { immediate: true, force: true });
  lenis?.resize();
});

window.addEventListener('load', () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());

reduceMotion.addEventListener('change', () => {
  document.documentElement.classList.toggle('no-motion', !motionAllowed());
  if (!motionAllowed() && lenis) {
    lenis.destroy();
    lenis = null;
  }
});
