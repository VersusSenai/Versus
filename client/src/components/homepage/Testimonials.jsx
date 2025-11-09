import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: 'Estou incredulo com a beleza daquele dev Eduardo! meu deus, q lindo!',
    name: 'Guilherme Sassi.',
    role: 'Fan',
  },
  {
    quote: 'Conseguimos dobrar a participação e reduzir erros manuais. Recomendo demais!',
    name: 'Bianca R.',
    role: 'Head de eSports',
  },
  {
    quote: 'Os relatórios e notificações automáticas salvaram horas da equipe.',
    name: 'Felipe K.',
    role: 'Administrador',
  },
  {
    quote: 'Interface intuitiva e recursos poderosos. Perfeito para nossos torneios!',
    name: 'Ana L.',
    role: 'Community Manager',
  },
];

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="w-full bg-transparent min-h-screen relative flex items-center px-4 sm:px-6 py-16 sm:py-20 pb-32"
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
            Feedback
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4">
            O que{' '}
            <span className="bg-gradient-to-r from-[var(--color-2)] to-[var(--color-1)] bg-clip-text text-transparent">
              dizem
            </span>
          </h2>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto mb-4">
            Histórias reais de organizadores que transformaram seus torneios
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-[var(--color-2)] to-[var(--color-1)] rounded-full mx-auto" />
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 mb-12">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="relative rounded-2xl p-6 sm:p-8 border border-white/10 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 transition-colors duration-300"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{ background: 'linear-gradient(90deg, var(--color-1), var(--color-2))' }}
              />
              <div className="mb-6">
                <svg
                  className="w-10 h-10 text-[var(--color-2)] opacity-50"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-white/90 text-base sm:text-lg mb-6 leading-relaxed">{t.quote}</p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[var(--color-2)] to-[var(--color-1)] text-white flex items-center justify-center text-base font-bold shadow-lg">
                  {String(t.name).slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-white text-base">{t.name}</p>
                  <p className="text-white/60 text-sm">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center p-8 sm:p-12 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--color-2)]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-3xl sm:text-4xl font-black text-white mb-2">4.9/5.0</p>
          <p className="text-white/70 text-sm sm:text-base">Baseado em mais de 1.000 avaliações</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
