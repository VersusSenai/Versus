import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogIn } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ScrollArrow from '../../components/ScrollArrow';
import logo from '../../assets/logo.svg';

const animatedWords = ['torneios', 'times', 'ranking'];

const Hero = () => {
  const navigate = useNavigate();
  const logoRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [logoCoords, setLogoCoords] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

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
    if (logoRef.current) {
      const rect = logoRef.current.getBoundingClientRect();
      setLogoCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
      setAnimating(true);

      setTimeout(() => {
        navigate('/login');
      }, 2800);
    }
  };

  return (
    <>
      {/* Fundo escurecido durante a animação */}
      <AnimatePresence>
        {animating && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'black',
              zIndex: 998,
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
        {/* Logo no canto superior */}
        {!animating && (
          <div className="absolute top-6 left-6 z-50">
            <img ref={logoRef} src={logo} alt="Logo VERSUS" className="w-[100px]" />
          </div>
        )}

        {/* Logo animada no centro */}
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
              }}
              animate={{
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%',
                scale: isMobile ? 3.5 : 6,
                opacity: 1,
                rotate: [0, 5, 8, 0],
              }}
              transition={{
                duration: 1.5,
                ease: 'easeInOut',
                times: [0, 0.25, 0.5, 0.75, 1],
              }}
            />
          )}
        </AnimatePresence>

        {/* Conteúdo principal */}
        <div className="max-w-[1000px] w-full h-screen mx-auto text-center flex flex-col justify-center px-4">
          <p className="text-[var(--color-2)] font-bold text-sm sm:text-base">
            ORGANIZE. COMPITA. VENÇA.
          </p>

          <h1 className="md:text-7xl sm:text-5xl text-4xl font-bold md:py-6">
            Gerencie seu torneio com facilidade
          </h1>

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
                className="md:text-4xl sm:text-2xl text-lg font-bold text-[var(--color-2)]"
              >
                {animatedWords[index]}
              </motion.span>
            </AnimatePresence>
          </div>

          <p className="md:text-xl text-base font-medium text-gray-400 max-w-xl mx-auto">
            Crie brackets, acompanhe estatísticas e gerencie jogadores em uma interface intuitiva.
          </p>

          <Button
            onClick={handleLogin}
            disabled={animating}
            className="flex items-center justify-center gap-2 bg-[var(--color-2)] w-[220px] rounded-xl font-semibold my-6 mx-auto py-3 text-black text-lg hover:brightness-110 transition"
          >
            <FiLogIn className="text-2xl" />
            Entrar
          </Button>

          <ScrollArrow targetId="cards" />
        </div>
      </motion.div>
    </>
  );
};

export default Hero;
