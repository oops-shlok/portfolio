# Portfolio

Personal portfolio and project case studies for Shlok Upadhyay: Software Engineer, GenAI & full-stack.

**Live:** _TODO: deployed URL_

## Stack

Next.js 15 (App Router, static export) · React 19 · TypeScript · Tailwind CSS 4 · three.js (custom GLSL particle shader) · Framer Motion · Lenis

**Highlights:** a WebGL "AI core": a particle sphere with a simplex-noise plasma surface and an orbiting token ring that bulges under the cursor, ripples on click and spirals into a vortex on scroll; scroll-lit statement text; stacked sticky project cards with generative SVG art; custom cursor, magnetic buttons, preloader and film grain. Respects `prefers-reduced-motion` and falls back to a static glow without WebGL.

## Editing content

All content lives in [`src/data/site.ts`](src/data/site.ts): profile, projects (featured ones get a
case-study page at `/projects/<slug>`), experience, open-source contributions and skills.
Replace `public/resume.pdf` to update the resume. Your photo (`public/images/shlok.jpg`) appears in the About section.

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
