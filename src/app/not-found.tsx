import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center px-4 text-center">
      <p className="font-serif text-[30vw] italic leading-none text-acid sm:text-[18vw]">404</p>
      <p className="mt-4 text-dim">This page drifted out of the vector space.</p>
      <Link href="/" className="mt-8 rounded-full border border-line px-6 py-3 text-sm hover:border-acid hover:text-acid">
        Back home
      </Link>
    </div>
  );
}
