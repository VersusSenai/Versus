import React from 'react';
import { motion } from 'framer-motion';

const logos = [
  'Rito Gomez',
  'Valvula',
  'Eai Sports',
  'Bugsoft',
  'Rare Games',
  'Mintendo',
  'GameStation',
  'Zboz',
];

const Showcase = () => {
  return (
    <section
      id="showcase"
      className="w-full bg-transparent min-h-screen relative flex items-center px-4 sm:px-6 py-16 sm:py-20"
    >
      <div className="max-w-[1240px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[var(--color-2)] text-sm sm:text-base font-bold tracking-wider uppercase mb-2 block">
            Confiança
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4">
            Nossos{' '}
            <span className="bg-gradient-to-r from-[var(--color-2)] to-[var(--color-1)] bg-clip-text text-transparent">
              Parceiros
            </span>
          </h2>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto mb-4">
            Trabalhamos com as maiores empresas do mercado de eSports
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-[var(--color-2)] to-[var(--color-1)] rounded-full mx-auto" />
        </motion.div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[var(--color-dark)] via-[#1a0d2e] to-[var(--color-dark)] py-8">
          <style>{`
            @keyframes scroll-left {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .scroll-animation {
              animation: scroll-left 20s linear infinite;
            }
          `}</style>
          <div
            className="pointer-events-none absolute left-0 top-0 h-full w-16 sm:w-24 z-10"
            style={{
              background:
                'linear-gradient(90deg, var(--color-dark) 0%, rgba(13, 2, 33, 0.8) 40%, transparent 100%)',
            }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-16 sm:w-24 z-10"
            style={{
              background:
                'linear-gradient(270deg, var(--color-dark) 0%, rgba(13, 2, 33, 0.8) 40%, transparent 100%)',
            }}
          />
          <div className="flex gap-8 sm:gap-12 px-4 items-center scroll-animation">
            {logos.map((name, i) => (
              <div
                key={`a-${i}`}
                className="shrink-0 whitespace-nowrap text-white/80 text-xl sm:text-2xl font-semibold"
              >
                {name}
              </div>
            ))}
            {logos.map((name, i) => (
              <div
                key={`b-${i}`}
                className="shrink-0 whitespace-nowrap text-white/80 text-xl sm:text-2xl font-semibold"
              >
                {name}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: '500+', desc: 'Torneios realizados' },
            { label: '50K+', desc: 'Jogadores ativos' },
            { label: '98%', desc: 'Satisfação' },
            { label: '24/7', desc: 'Suporte' },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[var(--color-2)] to-[var(--color-1)] bg-clip-text text-transparent mb-2">
                {stat.label}
              </p>
              <p className="text-white/70 text-sm">{stat.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Showcase;
