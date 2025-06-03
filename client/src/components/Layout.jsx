import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Aurora from '../ui/blocks/Backgrounds/Aurora/Aurora'; // ajuste o caminho conforme necessário

const Layout = ({ children }) => {
  const [navbarWidth, setNavbarWidth] = useState(256);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      <Navbar onWidthChange={setNavbarWidth} />

      {/* Fundo Aurora absoluto */}
      <div
        className="bg-[var(--color-dark)] absolute top-0 left-0 w-full h-full pointer-events-none -z-10"
        style={{ marginLeft: isDesktop ? navbarWidth : 0 }}
      >
        <Aurora
          colorStops={['#0D0221', '#5c4bf5', '#845cf5']}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <main
        style={{ marginLeft: isDesktop ? navbarWidth : 0 }}
        className="flex-1 transition-[margin-left] duration-300 p-4 relative z-10"
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
