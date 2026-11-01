import type { Directive } from 'vue';

// v-reveal: lifts an element into place once it scrolls into view.
// Content is only hidden after the script runs, so it never stays invisible.
const STEP_MS = 75;

const prefersReducedMotion = (): boolean =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const createObserver = (): IntersectionObserver =>
  new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-in');
        entry.target.classList.remove('reveal-pending');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px' }
  );

export default defineNuxtPlugin((nuxtApp) => {
  const observer = import.meta.client ? createObserver() : null;

  const reveal: Directive<HTMLElement, number | undefined> = {
    getSSRProps: () => ({}),
    mounted: (element, binding) => {
      if (!observer || prefersReducedMotion()) return;
      const order = binding.value ?? 0;
      element.style.setProperty('--reveal-delay', `${order * STEP_MS}ms`);
      element.classList.add('reveal-pending');
      observer.observe(element);
    },
    unmounted: (element) => {
      observer?.unobserve(element);
    },
  };

  nuxtApp.vueApp.directive('reveal', reveal);
});
