import Hero from "@/components/hero/Hero";
import Marquee from "@/components/sections/Marquee";
import Statement from "@/components/sections/Statement";
import Work from "@/components/sections/Work";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Statement />
      <Work />
      <Experience />
      <Contact />
    </>
  );
}
