import React from 'react';
import Analytics from '../components/homepage/Analytics';
import Cards from '../components/homepage/Cards';
import Footer from '../components/homepage/Footer';
import Hero from '../components/homepage/Hero';
import Newsletter from '../components/homepage/Newsletter';
import Aurora from '../ui/blocks/Backgrounds/Aurora/Aurora';

function HomePage() {
  return (
    <>
      <div className="bg-[var(--color-dark)] fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <Aurora
          colorStops={['#0D0221', '#5c4bf5', '#845cf5']}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <Hero />
      <Analytics />
      <Newsletter />
      <Cards />
      <Footer />
    </>
  );
}

export default HomePage;
