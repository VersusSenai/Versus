import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DotGrid from '../../ui/blocks/Backgrounds/DotGrid/DotGrid';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const animatedWords = ['torneios', 'times', 'ranking'];

const Hero = () => {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % animatedWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-white">
      <Button onClick={() => navigate('/login')}>login</Button>
      <div className="max-w-[1000px] w-full h-screen mx-auto text-center flex flex-col justify-center">
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

        <p className="md:text-xl text-base font-medium text-gray-400">
          Crie brackets, acompanhe estatísticas e gerencie jogadores em uma interface intuitiva.
        </p>

        <button className="bg-[var(--color-2)] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black">
          Ver torneios
        </button>
      </div>
    </div>
  );
};

export default Hero;
