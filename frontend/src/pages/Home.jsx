import Hero from "../components/Hero";
import Features from "../components/Features";
import WorkflowSection from "../components/WorkflowSection";

function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero with Value Prop & Interactive Studio Preview */}
      <Hero />

      {/* 2. Six-Pillar Developer Capabilities Matrix */}
      <Features />

      {/* 3. Three-Step Workflow from Canvas to Clean Code */}
      <WorkflowSection />
    </main>
  );
}

export default Home;