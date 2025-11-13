import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = ['hero', 'cards', 'showcase', 'testimonials'];
const sectionNames = {
  hero: 'Início',
  cards: 'Planos',
  showcase: 'Parceiros',
  testimonials: 'Depoimentos',
};

const FixedNavigation = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100 && currentScrollY > lastScrollYRef.current) {
        setIsVisible(true);
      } else if (currentScrollY <= 100) {
        setIsVisible(false);
      }

      lastScrollYRef.current = currentScrollY;

      const scrollPosition = currentScrollY + window.innerHeight / 2;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && scrollPosition >= section.offsetTop) {
          setCurrentSection(i);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((index) => {
    const section = document.getElementById(sections[index]);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-[999] flex flex-col gap-3"
        >
          {sections.map((sectionName, index) => (
            <motion.button
              key={sectionName}
              onClick={() => scrollToSection(index)}
              className="group relative flex items-center justify-end gap-3 cursor-pointer py-1.5"
              aria-label={`Ir para ${sectionNames[sectionName]}`}
              whileHover={{ scale: 1.05, x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{
                  opacity: index === currentSection ? 1 : 0.7,
                  x: 0,
                }}
                transition={{ duration: 0.2 }}
                className={`text-sm font-medium whitespace-nowrap transition-all ${
                  index === currentSection
                    ? 'text-white'
                    : 'text-white/70 group-hover:text-white/90'
                }`}
              >
                {sectionNames[sectionName]}
              </motion.span>

              <div className="flex items-center justify-center min-w-[12px]">
                {index === currentSection ? (
                  <motion.div
                    layoutId="activeDot"
                    className="relative h-3 w-3 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, var(--color-2), var(--color-1))',
                        boxShadow: '0 0 20px rgba(132, 92, 245, 0.6)',
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div className="h-2 w-2 rounded-full bg-white/40 group-hover:bg-white/60 transition-colors" />
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
