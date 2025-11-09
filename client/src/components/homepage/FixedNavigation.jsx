import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = ['hero', 'cards', 'showcase', 'testimonials'];

const FixedNavigation = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(true);

      // Detectar qual seção está visível
      const scrollPosition = window.scrollY + 200;

      let foundSection = 0;

      // Percorrer de trás pra frente para pegar a última seção visível
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop;

          if (scrollPosition >= sectionTop) {
            foundSection = i;
            break;
          }
        }
      }

      setCurrentSection(foundSection);
    };

    // Executar imediatamente e no scroll
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Também executar após um delay
    const timeout = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const scrollToSection = (index) => {
    if (index < 0 || index >= sections.length) {
      return;
    }

    const section = document.getElementById(sections[index]);

    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-[999] flex flex-col gap-4"
        >
          {/* Indicadores de seção */}
          {sections.map((sectionName, index) => (
            <motion.button
              key={index}
              onClick={() => {
                console.log('Clicked section:', index);
                scrollToSection(index);
              }}
              className="group relative flex items-center gap-4 cursor-pointer py-2"
              aria-label={`Ir para seção ${index + 1}`}
              whileHover={{ scale: 1.08, x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Nome da seção - PRIMEIRO */}
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{
                  opacity: index === currentSection ? 1 : 0.6,
                  x: 0,
                }}
                className={`text-base font-semibold whitespace-nowrap transition-all ${
                  index === currentSection
                    ? 'text-white'
                    : 'text-white/60 group-hover:text-white/80'
                }`}
              >
                {sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}
              </motion.span>

              {/* Bolinha - DEPOIS */}
              <div className="flex items-center justify-center">
                {index === currentSection ? (
                  // Bolinha ativa - MAIOR
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="relative h-4 w-4 rounded-full"
                  >
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, var(--color-2), var(--color-1))',
                        boxShadow: '0 0 24px rgba(132, 92, 245, 0.7)',
                      }}
                    />
                  </motion.div>
                ) : (
                  // Bolinha inativa - MAIOR
                  <motion.div
                    whileHover={{ scale: 1.6 }}
                    whileTap={{ scale: 0.9 }}
                    className="h-3 w-3 rounded-full bg-white/50 transition-all"
                  />
                )}
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FixedNavigation;
