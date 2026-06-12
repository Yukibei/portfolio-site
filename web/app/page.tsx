import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import SkillsHonors from "@/components/SkillsHonors";
import SiteFooter from "@/components/SiteFooter";
import HeroSection from "./home/HeroSection";
import PortfolioNav from "./home/PortfolioNav";

export default function Home() {
  return (
    <>
      <PortfolioNav />
      <HeroSection />

      {/* 覆盖滚动内容：从 Hero 上方缓缓盖过 */}
      <div className="relative z-10 rounded-t-[2.5rem] bg-black shadow-[0_-24px_80px_rgba(0,0,0,0.55)]">
        <About />
        <Projects />
        <Experience />
        <SkillsHonors />
        <SiteFooter />
      </div>
    </>
  );
}
