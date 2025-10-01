import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogIn } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ScrollArrow from '../../components/ScrollArrow';
import logo from '../../assets/logo.svg';
import { FaPlay } from 'react-icons/fa';

const animatedWords = ['torneios', 'times', 'ranking'];

const Hero = () => {
  const navigate = useNavigate();
  const logoRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [logoCoords, setLogoCoords] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const prevNavbarLogoOpacityRef = useRef(null);

  // Alterna as palavras animadas
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % animatedWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Detecta se é mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = () => {
    const navbarLogo = document.getElementById('navbar-logo');
    const sourceEl = navbarLogo || logoRef.current;
    if (sourceEl) {
      const rect = sourceEl.getBoundingClientRect();
      setLogoCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
      // Oculta o logo original durante a animação para evitar "logo parado"
      try {
        prevNavbarLogoOpacityRef.current = sourceEl.style.opacity;
        sourceEl.style.opacity = '0';
      } catch {}
      setAnimating(true);

      setTimeout(() => {
        navigate('/login');
      }, 2700);
    }
  };

  // Caso a animação seja cancelada/termine sem navegação, restaura o logo
  useEffect(() => {
    if (!animating) {
      const navbarLogo = document.getElementById('navbar-logo');
      if (navbarLogo && prevNavbarLogoOpacityRef.current !== null) {
        try {
          navbarLogo.style.opacity = prevNavbarLogoOpacityRef.current;
        } catch {}
        prevNavbarLogoOpacityRef.current = null;
      }
    }
  }, [animating]);

  return (
    <>
      {/* overlay durante animação */}
      <AnimatePresence>
        {animating && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'black',
              zIndex: 1100,
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        id="hero"
        className="relative text-white overflow-hidden"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* orbs de fundo */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(closest-side, var(--color-1), transparent 70%)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.35, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(closest-side, var(--color-2), transparent 70%)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.25, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.35 }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.15), transparent 70%)' }}
          />
        </div>

        {/* logo fica na navbar */}

        {/* logo animada */}
        <AnimatePresence>
          {animating && logoCoords && (
            <motion.img
              src={logo}
              alt="Logo animado"
              initial={{
                position: 'fixed',
                top: logoCoords.top,
                left: logoCoords.left,
                width: logoCoords.width,
                height: logoCoords.height,
                scale: 1,
                opacity: 1,
                x: 0,
                y: 0,
                rotate: 0,
                zIndex: 9999,
                pointerEvents: 'none',
                originX: 0.5,
                originY: 0.5,
                filter: 'none',
                willChange: 'transform, opacity',
                backgroundColor: 'transparent'
              }}
              animate={{
                top: '50%',
                left: '50%',
                x: ['-75%', '-58%', '-50%'],
                y: ['-25%', '-56%', '-50%'],
                scale: [1, (isMobile ? 7.5 : 12.0) * 1.02, (isMobile ? 7.5 : 12.0)],
                opacity: 1,
                rotate: 0,
                filter: 'none',
                boxShadow: ['0 0 0 rgba(0,0,0,0)', '0 0 28px rgba(132,92,245,0.16)', '0 0 34px rgba(132,92,245,0.18)']
              }}
              transition={{
                duration: 2.6,
                ease: [0.16, 1, 0.3, 1],
                times: [0, 0.6, 1],
                x: { duration: 2.6, ease: [0.16, 1, 0.3, 1] },
                y: { duration: 2.6, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 2.6, ease: [0.16, 1, 0.3, 1], times: [0, 0.6, 1] },
                boxShadow: { duration: 1.2, ease: 'easeOut' }
              }}
            />
          )}
        </AnimatePresence>

        {/* conteúdo principal */}
        <div className="max-w-[1100px] w-full h-screen mx-auto text-center flex flex-col justify-center px-4">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[var(--color-2)] font-bold text-sm sm:text-base tracking-widest"
          >
            ORGANIZE. COMPITA. VENÇA.
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:text-7xl sm:text-5xl text-4xl font-extrabold md:py-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-[var(--color-2)] via-white to-[var(--color-2)] bg-clip-text text-transparent">
              Gerencie seu torneio com facilidade
            </span>
          </motion.h1>

          <div className="flex justify-center items-center h-[60px]">
            <p className="md:text-4xl sm:text-2xl text-lg font-bold py-4">
              A melhor plataforma para&nbsp;
            </p>
            <AnimatePresence mode="wait">
              <motion.span
                key={animatedWords[index]}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="md:text-4xl sm:text-2xl text-lg font-extrabold text-[var(--color-2)]"
              >
                {animatedWords[index]}
              </motion.span>
            </AnimatePresence>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:text-xl text-base font-medium text-gray-300 max-w-2xl mx-auto"
          >
            Crie brackets, acompanhe estatísticas e gerencie jogadores em uma interface intuitiva.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center mt-8"
          >
            <button
              onClick={handleLogin}
              disabled={animating}
              className="flex items-center justify-center gap-2 border border-[var(--color-2)] backdrop-blur-sm min-w-[220px] rounded-xl font-semibold py-3 text-[var(--color-2)] text-lg hover:bg-[var(--color-2)] hover:text-[var(--color-dark)] transition shadow-lg cursor-pointer"
            >
              <FiLogIn className="text-2xl" />
              Entrar
            </button>
            <button
              onClick={() => document.getElementById('cards')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center justify-center gap-2 border border-white/30 backdrop-blur-sm min-w-[220px] rounded-xl font-semibold py-3 text-white text-lg hover:bg-white/10 transition shadow-lg cursor-pointer"
            >
              <FaPlay />
              Explorar recursos
            </button>
          </motion.div>

          <ScrollArrow targetId="cards" />
        </div>
      </motion.div>
    </>
  );
};

export default Hero;
