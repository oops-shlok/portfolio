// Content helpers: hide unfinished TODO entries from the rendered site.
export const isTodo = (s?: string) => !s || /^TODO\b/.test(s.trim());
export const clean = (s: string) => s.replace(/^TODO:?\s*/, "");
export const visible = (items: string[] = []) => items.filter((s) => !isTodo(s) && !s.includes("TODO"));

// Seconds to hold hero animations so they start as the preloader wipes away.
// Read once at module load, before the preloader marks the intro as seen.
function readIntroDelay() {
  if (typeof window === "undefined") return 1.6;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
    return sessionStorage.getItem("intro-seen") === "1" ? 0.15 : 1.6;
  } catch {
    return 1.6;
  }
}
export const INTRO_DELAY = readIntroDelay();
