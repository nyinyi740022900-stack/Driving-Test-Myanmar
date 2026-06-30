import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TestCards from '@/components/TestCards';
import QuizDemo from '@/components/QuizDemo';
import HowItWorks from '@/components/HowItWorks';
import Centres from '@/components/Centres';
import Resources from '@/components/Resources';
import FAQ from '@/components/FAQ';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import AdSlot from '@/components/AdSlot';

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <div className="lane" aria-hidden="true" />
      <Reveal><TestCards /></Reveal>
      <div className="lane" aria-hidden="true" />
      <Reveal delay={60}><QuizDemo /></Reveal>
      <div className="lane" aria-hidden="true" />
      <div className="wrap" style={{ padding: '0 24px' }}>
        <AdSlot slot="5983088447" format="horizontal" />
      </div>
      <div className="lane" aria-hidden="true" />
      <Reveal delay={40}><HowItWorks /></Reveal>
      <div className="lane" aria-hidden="true" />
      <Reveal delay={40}><Centres /></Reveal>
      <div className="lane" aria-hidden="true" />
      <Reveal delay={40}><Resources /></Reveal>
      <div className="lane" aria-hidden="true" />
      <Reveal delay={40}><FAQ /></Reveal>
      <div className="lane" aria-hidden="true" />
      <div className="wrap" style={{ padding: '0 24px' }}>
        <AdSlot slot="5983088447" format="horizontal" />
      </div>
      <div className="lane" aria-hidden="true" />
      <Reveal delay={40}><Pricing /></Reveal>
      <Footer />
    </>
  );
}
