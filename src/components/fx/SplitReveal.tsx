"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const word: Variants = {
  hidden: { y: "110%" },
  show: (i: number) => ({ y: "0%", transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i } }),
};

// Slides each word up from behind a mask when the heading enters the viewport.
// The heading itself is observed: the words start clipped by their masks, so
// they would never register as visible on their own.
export default function SplitReveal({
  text,
  className = "",
  delay = 0,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const M = motion[Tag];
  return (
    <M
      className={className}
      aria-label={text}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden="true">
          <motion.span className="inline-block" variants={word} custom={delay + i * 0.05}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </M>
  );
}
