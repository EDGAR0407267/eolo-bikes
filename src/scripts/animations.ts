const revealSelector = [
  '[data-reveal]',
  '[data-section-title]',
  '[data-hero-title]',
  '[data-hero-subtitle]',
  '[data-hero-buttons]',
  '[data-hero-quote]',
  '[data-hero-image]',
  '[data-hero-reveal]',
].join(',');

type ParallaxItem = {
  el: HTMLElement;
  trigger: Element;
  strength: number;
  scale: number;
};

const revealed = new WeakSet<HTMLElement>();

const showElement = (el: HTMLElement, instant = false) => {
  if (revealed.has(el) && !instant) return;
  revealed.add(el);

  if (instant) {
    el.style.setProperty('--reveal-delay', '0s');
    el.style.setProperty('transition-delay', '0s', 'important');
    el.style.setProperty('transition', 'none', 'important');
  }

  el.classList.add('is-visible');
  el.style.setProperty('opacity', '1', 'important');
  el.style.setProperty('transform', 'translate3d(0, 0, 0)', 'important');

  window.setTimeout(() => {
    el.classList.add('motion-complete');
  }, 1200);
};

const isInViewport = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return rect.bottom >= 0 && rect.top <= window.innerHeight;
};

const isEssentialInitialElement = (el: HTMLElement) =>
  el.hasAttribute('data-hero-reveal') ||
  el.hasAttribute('data-hero-title') ||
  el.hasAttribute('data-hero-subtitle') ||
  el.hasAttribute('data-hero-buttons');

const initRevealMotion = () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canObserve = 'IntersectionObserver' in window;

  const revealTargets = Array.from(
    document.querySelectorAll<HTMLElement>(revealSelector),
  );
  const staggerContainers = Array.from(
    document.querySelectorAll<HTMLElement>('[data-stagger]'),
  );

  const staggerItems = staggerContainers.flatMap((container) =>
    Array.from(container.querySelectorAll<HTMLElement>('[data-stagger-item]')),
  );

  if (reducedMotion || !canObserve) {
    revealTargets.forEach((el) => showElement(el, true));
    staggerItems.forEach((el) => showElement(el, true));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        showElement(el);
        revealObserver.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.14 },
  );

  revealTargets.forEach((el) => {
    if (revealed.has(el)) return;

    if (el.dataset.revealDelay) {
      el.style.setProperty('--reveal-delay', `${el.dataset.revealDelay}s`);
    }
    if (el.dataset.revealY) {
      el.style.setProperty('--reveal-y', `${el.dataset.revealY}px`);
    }

    revealObserver.observe(el);

    if (isInViewport(el) || isEssentialInitialElement(el)) {
      window.requestAnimationFrame(() => showElement(el));
    }
  });

  window.setTimeout(() => {
    revealTargets.forEach((el) => {
      if (!revealed.has(el) && (isInViewport(el) || isEssentialInitialElement(el))) {
        showElement(el, true);
      }
    });
  }, 900);

  const staggerItemsByContainer = new Map<HTMLElement, HTMLElement[]>();
  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const container = entry.target as HTMLElement;
        const items = staggerItemsByContainer.get(container);
        if (!items) return;
        items.forEach((item) => showElement(item));
        staggerObserver.unobserve(container);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
  );

  staggerContainers.forEach((container) => {
    const items = Array.from(
      container.querySelectorAll<HTMLElement>('[data-stagger-item]'),
    );
    if (!items.length) return;

    items.forEach((item, index) => {
      if (item.dataset.staggerBound === 'true') return;
      item.dataset.staggerBound = 'true';
      item.style.setProperty('--reveal-delay', `${index * 0.06}s`);
      item.style.setProperty('--reveal-y', '28px');
    });

    staggerItemsByContainer.set(container, items);
    staggerObserver.observe(container);
  });

  window.setTimeout(() => {
    revealTargets.forEach((el) => showElement(el, true));
    staggerItems.forEach((el) => showElement(el, true));
  }, 2400);
};

const initParallax = () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canObserve = 'IntersectionObserver' in window;
  const canParallax =
    !reducedMotion &&
    canObserve &&
    window.matchMedia('(min-width: 768px)').matches;

  if (!canParallax) return;

  const items = Array.from(
    document.querySelectorAll<HTMLElement>('[data-parallax]'),
  )
    .filter((el) => el.dataset.parallaxBound !== 'true')
    .map<ParallaxItem>((el) => {
      el.dataset.parallaxBound = 'true';
      return {
        el,
        trigger: el.closest('section') ?? el.parentElement ?? el,
        strength: Number.parseFloat(el.dataset.parallaxStrength ?? '56'),
        scale: Number.parseFloat(el.dataset.parallaxScale ?? '1.06'),
      };
    });

  if (!items.length) return;

  const active = new Set<ParallaxItem>();
  const itemsByTrigger = new Map<Element, ParallaxItem[]>();
  items.forEach((item) => {
    const group = itemsByTrigger.get(item.trigger) ?? [];
    group.push(item);
    itemsByTrigger.set(item.trigger, group);
  });
  let frame = 0;

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const updateParallax = () => {
    frame = 0;
    const viewportHeight = window.innerHeight;

    active.forEach((item) => {
      const rect = item.trigger.getBoundingClientRect();
      const progress = clamp(
        (viewportHeight - rect.top) / (viewportHeight + rect.height),
        0,
        1,
      );
      const y = (progress - 0.5) * item.strength;
      item.el.style.transform = `translate3d(0, ${y.toFixed(
        1,
      )}px, 0) scale(${item.scale})`;
    });
  };

  const requestParallax = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(updateParallax);
  };

  const parallaxObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        itemsByTrigger.get(entry.target)?.forEach((item) => {
          if (entry.isIntersecting) {
            active.add(item);
            item.el.style.willChange = 'transform';
          } else {
            active.delete(item);
            item.el.style.willChange = '';
          }
        });
      });
      requestParallax();
    },
    { rootMargin: '18% 0px', threshold: 0 },
  );

  itemsByTrigger.forEach((_items, trigger) => {
    parallaxObserver.observe(trigger);
  });

  window.addEventListener('scroll', requestParallax, { passive: true });
  window.addEventListener('resize', requestParallax, { passive: true });
  requestParallax();
};

const initMotion = () => {
  initRevealMotion();
  initParallax();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMotion, { once: true });
} else {
  initMotion();
}

document.addEventListener('astro:after-swap', initMotion);
