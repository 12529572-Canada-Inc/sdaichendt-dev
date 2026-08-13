import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Contributions from "@/components/Contributions";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f0f13] text-white">
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Contributions />
        <About />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
