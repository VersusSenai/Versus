import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ScrollArrow = ({ targetId, direction = 'down' }) => {
  const scrollToSection = () => {
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn(`ScrollArrow: Seção com id "${targetId}" não encontrada`);
    }
  };

  return (
    // seta circular para navegação entre seções
    <motion.button
      onClick={scrollToSection}
      aria-label={direction === 'up' ? 'Ir para seção acima' : 'Ir para próxima seção'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 cursor-pointer"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Outer glow ring */}
      <span
        className="absolute inset-0 -z-10 h-16 w-16 rounded-full"
        style={{
          background: 'radial-gradient(closest-side, color-mix(in oklch, var(--color-2) 35%, transparent), transparent 70%)',
          filter: 'blur(10px)'
        }}
      />
      {/* Button body */}
      <div
        className="relative h-14 w-14 rounded-full overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))',
          backdropFilter: 'blur(8px)'
        }}
      >
        {/* Gradient ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ padding: 1, background: 'conic-gradient(from 180deg at 50% 50%, var(--color-1), var(--color-2), var(--color-1))' }}
        >
          <div className="h-full w-full rounded-full bg-[rgba(0,0,0,0.55)]" />
        </div>
        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center text-white">
          {direction === 'up' ? (
            <FaChevronUp className="text-2xl" />
          ) : (
            <FaChevronDown className="text-2xl" />
          )}
        </div>
      </div>
    </motion.button>
  );
};

export default ScrollArrow;
