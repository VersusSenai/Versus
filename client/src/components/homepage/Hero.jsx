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
        <div className="max-w-[1400px] w-full h-screen mx-auto flex items-center justify-center px-6">
          <div className="w-full max-w-5xl space-y-10">
            {/* Badge redesenhado */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex justify-center"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-2)] via-[var(--color-1)] to-[var(--color-2)] rounded-full opacity-60 blur-lg group-hover:opacity-80 transition-all duration-500" />
                <div className="relative flex items-center gap-3 px-8 py-3 rounded-full bg-black/40 border border-[var(--color-2)]/30 backdrop-blur-2xl">
                  <motion.span className="flex items-center gap-3 text-[var(--color-2)] font-bold text-xs sm:text-sm tracking-[0.25em] uppercase">
                    <span>Crie</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-2)]" />
                    <span>Compita</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-2)]" />
                    <span>Domine</span>
                  </motion.span>
                </div>
              </div>
            </motion.div>

            {/* Headline com design em camadas */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center space-y-4"
            >
              <h1 className="relative">
                {/* Glow layer */}
                <span
                  className="absolute inset-0 blur-3xl opacity-30"
                  style={{
                    background: 'linear-gradient(90deg, var(--color-2), var(--color-1))',
                  }}
                />

                {/* Text layer */}
                <span className="relative block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight">
                  <motion.span
                    className="block bg-gradient-to-r from-[var(--color-2)] via-white to-[var(--color-2)] bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    style={{
                      backgroundSize: '200% 200%',
                    }}
                  >
                    A plataforma definitiva
                  </motion.span>
                  <span className="block text-white mt-2">para seus torneios</span>
                </span>
              </h1>
            </motion.div>

            {/* Subtítulo com palavra animada - redesign simples */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex justify-center"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
                <div className="text-gray-300 mb-3">Gerencie tudo sobre</div>

                {/* Palavra animada em linha separada */}
                <div className="relative h-[50px] sm:h-[60px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={animatedWords[index]}
                      initial={{ opacity: 0, rotateX: 90, y: 20 }}
                      animate={{ opacity: 1, rotateX: 0, y: 0 }}
                      exit={{ opacity: 0, rotateX: -90, y: -20 }}
                      transition={{
                        duration: 0.6,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                      className="absolute"
                    >
                      <div className="relative inline-block px-6 py-2 rounded-2xl bg-gradient-to-r from-[var(--color-2)]/10 to-[var(--color-1)]/10 border border-[var(--color-2)]/30 backdrop-blur-sm">
                        {/* Glow atrás do badge */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-2)] to-[var(--color-1)] rounded-2xl blur-xl opacity-40" />

                        {/* Texto */}
                        <span className="relative font-black text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-[var(--color-2)] to-[var(--color-1)] bg-clip-text text-transparent">
                          {animatedWords[index]}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Descrição com separadores visuais */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex justify-center"
            >
              <div className="max-w-3xl">
                <p className="text-base sm:text-lg text-center leading-relaxed text-gray-400">
                  <span className="mx-2 text-[var(--color-2)]">•</span>
                  <span className="font-medium">Sistema completo de brackets</span>
                  <span className="mx-2 text-[var(--color-2)]">•</span>
                  <span className="font-medium">Estatísticas ao vivo</span>
                  <span className="mx-2 text-[var(--color-2)]">•</span>
                  <span className="font-medium">Gestão de jogadores</span>
                </p>
              </div>
            </motion.div>

            {/* CTAs com efeito premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-6"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <GlassButton
                  onClick={handleLogin}
                  disabled={animating}
                  ariaLabel="Fazer login"
                  variant="primary"
                  className="min-w-[240px] text-lg shadow-2xl shadow-[var(--color-2)]/30"
                >
                  <FiLogIn className="text-2xl" />
                  Entrar
                </GlassButton>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <GlassButton
                  onClick={() => {
                    const el = document.getElementById('cards');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  ariaLabel="Explorar recursos"
                  variant="secondary"
                  className="min-w-[240px] text-lg"
                >
                  <FaPlay />
                  Explorar recursos
                </GlassButton>
              </motion.div>
            </motion.div>
          </div>

          <ScrollArrow targetId="cards" />
        </div>
      </motion.div>
    </>
  );
};

export default Hero;
