# Portfolio

Personal portfolio and project case studies for Shlok Upadhyay: Software Engineer, GenAI & full-stack.

**Live:** _TODO: deployed URL_

## Stack

Next.js 15 (App Router, static export) · React 19 · TypeScript · Tailwind CSS 4

## Editing content

All content lives in [`src/data/site.ts`](src/data/site.ts): profile, projects (featured ones get a
case-study page at `/projects/<slug>`), experience, open-source contributions and skills.
Replace `public/resume.pdf` to update the resume.

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
