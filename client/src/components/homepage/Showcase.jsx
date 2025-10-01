import React from 'react';
import { motion } from 'framer-motion';
import ScrollArrow from '../../components/ScrollArrow';

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

const testimonials = [
  {
    quote: 'Estou incredulo com a beleza daquele dev Eduardo! meu deus, q lindo!',
    name: 'Guilherme Sassi.',
    role: 'Fan - Versus',
  },
  {
    quote: 'Conseguimos dobrar a participação e reduzir erros manuais. Recomendo demais!',
    name: 'Bianca R.',
    role: 'Head de eSports',
  },
  {
    quote: 'Os relatórios e notificações automáticas salvaram horas da equipe.',
    name: 'Felipe K.',
    role: 'Administrador de Clube',
  },
  {
    quote: 'A inscrição e o acompanhamento dos jogos ficaram muito mais fáceis.',
    name: 'Larissa M.',
    role: 'Community Manager',
  },
];

const Showcase = () => {
  const items = [...logos, ...logos];
  return (
    <section id="showcase" className="w-full bg-transparent min-h-screen relative flex items-center px-6 py-16">
      {/* orbs de fundo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full blur-3xl" style={{ background: 'radial-gradient(closest-side, var(--color-2), transparent 70%)' }} />
        <div className="absolute bottom-0 left-10 h-64 w-64 rounded-full blur-3xl" style={{ background: 'radial-gradient(closest-side, var(--color-1), transparent 70%)' }} />
      </div>

      <div className="max-w-[1240px] mx-auto w-full">
        <h3 className="text-center text-white text-2xl font-bold mb-10">Parcerias e depoimentos</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 sm:p-6 lg:p-8">
            <p className="text-white/70 mb-4">Integrado com as maiores publishers</p>
            <div className="relative overflow-hidden rounded-2xl border border-white/10">
              <div className="pointer-events-none absolute left-0 top-0 h-full w-16" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.65), rgba(0,0,0,0))' }} />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-16" style={{ background: 'linear-gradient(270deg, rgba(0,0,0,0.65), rgba(0,0,0,0))' }} />
              <div className="overflow-hidden py-4">
                <motion.div
                  className="flex gap-12 px-6 items-center"
                  initial={{ x: '0%' }}
                  animate={{ x: ['0%', '-50%'] }}
                  transition={{ duration: 24, ease: 'linear', repeat: Infinity }}
                  style={{ willChange: 'transform' }}
                >
                  {logos.map((name, i) => (
                    <div key={`a-${i}`} className="shrink-0 whitespace-nowrap text-white/80 text-lg md:text-xl font-semibold">{name}</div>
                  ))}
                  {logos.map((name, i) => (
                    <div key={`b-${i}`} className="shrink-0 whitespace-nowrap text-white/80 text-lg md:text-xl font-semibold">{name}</div>
                  ))}
                </motion.div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-white/70">
              {['APIs estáveis','Webhooks','OAuth','SDKs & plugins','Notificações','Ranking & stats','SLA & suporte','Multi-idioma','Streaming'].map((tag,i)=> (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3 cursor-default">{tag}</div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: 0.08 * i, ease: 'easeOut' }}
                className="relative rounded-2xl p-6 border border-white/10 bg-white/10 backdrop-blur-xl text-white shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
              >
                {/* barra de acento */}
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, var(--color-1), var(--color-2))' }} />
                <p className="text-white/90">“{t.quote}”</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[var(--color-2)] text-[var(--color-dark)] flex items-center justify-center text-xs font-bold">
                    {String(t.name).slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-white/60 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        {/* seta para voltar ao topo */}
        <ScrollArrow targetId="hero" direction="up" />
      </div>
    </section>
  );
};

export default Showcase;


