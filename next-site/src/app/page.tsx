import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      {/* Temp spacer to test scroll */}
      <div className="h-screen" />
    </main>
  );
}
