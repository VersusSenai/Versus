import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogIn } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
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
        <div className="max-w-[1400px] w-full min-h-screen mx-auto flex items-center justify-center px-4 sm:px-6 py-20 sm:py-0">
          <div className="w-full max-w-6xl space-y-6 sm:space-y-8">
            {/* Badge minimalista */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex justify-center"
            >
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[var(--color-2)]/10 border border-[var(--color-2)]/20 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-2)] animate-pulse" />
                <span className="text-[10px] sm:text-xs font-semibold text-[var(--color-2)] tracking-wider uppercase">
                  Crie • Compita • Domine
                </span>
              </div>
            </motion.div>

            {/* Headline principal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-center px-2"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.15] sm:leading-[1.1] tracking-tight">
                <span className="block bg-gradient-to-br from-white via-white to-gray-300 bg-clip-text text-transparent">
                  A plataforma definitiva
                </span>
                <span className="block mt-1 sm:mt-2">
                  <span className="text-gray-300">para seus </span>
                  <span className="relative inline-block">
                    <motion.span
                      className="bg-gradient-to-r from-[var(--color-2)] via-[var(--color-1)] to-[var(--color-2)] bg-clip-text text-transparent"
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      style={{
                        backgroundSize: '200% 200%',
                      }}
                    >
                      torneios
                    </motion.span>
                    {/* Underline animado */}
                    <motion.span
                      className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-[var(--color-2)] to-[var(--color-1)] rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                  </span>
                </span>
              </h1>
            </motion.div>

            {/* Subtítulo com palavra animada inline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center px-4"
            >
              <p className="text-base sm:text-xl md:text-2xl lg:text-3xl text-center text-gray-300 font-medium max-w-3xl leading-relaxed">
                Gerencie{' '}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={animatedWords[index]}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block font-bold bg-gradient-to-r from-[var(--color-2)] to-[var(--color-1)] bg-clip-text text-transparent"
                  >
                    {animatedWords[index]}
                  </motion.span>
                </AnimatePresence>{' '}
                com eficiência e estilo
              </p>
            </motion.div>

            {/* Features em pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-2 sm:gap-3 px-4"
            >
              {['Brackets Inteligentes', 'Stats ao Vivo', 'Gestão Total'].map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <span className="text-xs sm:text-sm text-gray-400 font-medium">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs com efeito premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center pt-4 sm:pt-6 px-4"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="w-full sm:w-auto"
              >
                <GlassButton
                  onClick={handleLogin}
                  disabled={animating}
                  ariaLabel="Fazer login"
                  variant="primary"
                  className="w-full sm:min-w-[220px] text-base sm:text-lg shadow-2xl shadow-[var(--color-2)]/30"
                >
                  <FiLogIn className="text-xl sm:text-2xl" />
                  Entrar
                </GlassButton>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="w-full sm:w-auto"
              >
                <GlassButton
                  onClick={() => {
                    const el = document.getElementById('cards');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  ariaLabel="Explorar recursos"
                  variant="secondary"
                  className="w-full sm:min-w-[220px] text-base sm:text-lg"
                >
                  <FaPlay />
                  Explorar recursos
                </GlassButton>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Hero;
