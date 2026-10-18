# Portfolio

Personal portfolio and project case studies for Shlok Upadhyay: Software Engineer, GenAI & full-stack.

**Live:** _TODO: deployed URL_

## Stack

Next.js 15 (App Router, static export) · React 19 · TypeScript · Tailwind CSS 4 · three.js (custom GLSL particle shader) · Framer Motion · Lenis

**Highlights:** a WebGL particle portrait that assembles on load, scatters away from the cursor and spirals into a vortex on scroll; scroll-lit statement text; stacked sticky project cards with generative SVG art; custom cursor, magnetic buttons, preloader and film grain. Respects `prefers-reduced-motion` and falls back to a static image without WebGL.

## Editing content

All content lives in [`src/data/site.ts`](src/data/site.ts): profile, projects (featured ones get a
case-study page at `/projects/<slug>`), experience, open-source contributions and skills.
Replace `public/resume.pdf` to update the resume. The hero portrait is `public/images/profile.png` (set in `src/components/hero/Hero.tsx`; a transparent-background PNG looks best, and `crop` controls how much of the photo height is used).

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
```

## Deploy

Import the repo on [Vercel](https://vercel.com/new) (zero config), or deploy the `out/`
folder to any static host.

The previous Create React App version (2022) is kept in `legacy/` for reference and can be deleted.
