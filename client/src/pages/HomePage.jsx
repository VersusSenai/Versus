import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Analytics from '../components/homepage/Analytics';
import Cards from '../components/homepage/Cards';
import Footer from '../components/homepage/Footer';
import Hero from '../components/homepage/Hero';
import Aurora from '../ui/blocks/Backgrounds/Aurora/Aurora';

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.toast) {
      toast.error(location.state.toast);

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

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
      <Cards />
      <Analytics />
      <Footer />
    </>
  );
}

export default HomePage;
