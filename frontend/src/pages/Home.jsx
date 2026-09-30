import Hero from "../components/Hero";
import Features from "../components/Features";
import WorkflowSection from "../components/WorkflowSection";
import HomeCTA from "../components/HomeCTA";

function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero with Value Prop & Interactive Studio Preview */}
      <Hero />

      {/* 2. Six-Pillar Developer Capabilities Matrix */}
      <Features />

      {/* 3. Three-Step Workflow from Canvas to Clean Code */}
      <WorkflowSection />

      {/* 4. Pre-Footer Action / Conversion Banner */}
      <HomeCTA />
    </main>
  );
}

export default Home;