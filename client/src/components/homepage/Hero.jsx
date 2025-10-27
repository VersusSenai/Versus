import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogIn } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ScrollArrow from '../../components/ScrollArrow';
import GlassButton from './GlassButton';
import logo from '../../assets/logo.svg';
import { FaPlay } from 'react-icons/fa';

const animatedWords = ['torneios', 'times', 'ranking'];

const Hero = ({ logoRef: externalLogoRef }) => {
  const navigate = useNavigate();
  const internalLogoRef = useRef(null);
  const logoRef = externalLogoRef || internalLogoRef;
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
        {/* logo fica na navbar */}

        {/* logo animada */}
        <AnimatePresence>
          {animating && logoCoords && (
            <motion.div
              initial={{
                position: 'fixed',
                top: logoCoords.top,
                left: logoCoords.left,
                width: logoCoords.width,
                height: logoCoords.height,
                opacity: 1,
                x: 0,
                y: 0,
                zIndex: 9999,
              }}
              animate={{
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%',
                width: isMobile ? 300 : 600,
                height: isMobile ? 300 : 600,
                opacity: 1,
              }}
              transition={{
                duration: 2.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={logo}
                alt="Logo animado"
                className="select-none w-full h-full"
                style={{
                  objectFit: 'contain',
                }}
              />
            </motion.div>
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
            <GlassButton
              onClick={handleLogin}
              disabled={animating}
              ariaLabel="Fazer login"
              variant="primary"
              className="min-w-[220px] text-lg"
            >
              <FiLogIn className="text-2xl" />
              Entrar
            </GlassButton>

            <GlassButton
              onClick={() => {
                const el = document.getElementById('cards');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              ariaLabel="Explorar recursos"
              variant="secondary"
              className="min-w-[220px] text-lg"
            >
              <FaPlay />
              Explorar recursos
            </GlassButton>
          </motion.div>

          <ScrollArrow targetId="cards" />
        </div>
      </motion.div>
    </>
  );
};

export default Hero;
