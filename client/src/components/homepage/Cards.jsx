import React from 'react';
import BasicIcon from './../../assets/plano1.png';
import ProIcon from './../../assets/plano2.png';
import EnterpriseIcon from './../../assets/plano3.png';
import ScrollArrow from '../../components/ScrollArrow';
import { motion } from 'framer-motion';

const plans = [
  {
    title: 'Plano Básico',
    price: 'Grátis',
    features: [
      'Até 3 torneios simultâneos',
      'Até 16 jogadores por torneio',
      'Dashboard básica de resultados',
    ],
    img: BasicIcon,
    btnText: 'Começar Grátis',
    btnClass: 'bg-[var(--color-2)] text-white hover:brightness-90',
    bgClass: 'bg-white',
    highlight: false,
  },
  {
    title: 'Plano Profissional',
    price: 'R$49/mês',
    features: [
      'Torneios ilimitados',
      'Até 128 jogadores por torneio',
      'Estatísticas avançadas e integração',
    ],
    img: ProIcon,
    btnText: 'Assinar Agora',
    btnClass: 'bg-[var(--color-dark)] text-[var(--color-2)] hover:brightness-90',
    bgClass: 'bg-gray-100',
    highlight: true, // destacado
  },
  {
    title: 'Plano Empresarial',
    price: 'R$149/mês',
    features: [
      'Torneios ilimitados & grandes',
      'Suporte prioritário',
      'Equipes & administradores múltiplos',
    ],
    img: EnterpriseIcon,
    btnText: 'Assinar Agora',
    btnClass: 'bg-[var(--color-2)] text-white hover:brightness-90',
    bgClass: 'bg-white',
    highlight: false,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, delay: 0.15 * i, ease: 'easeOut' },
  }),
};

const Cards = () => {
  return (
    <section
      id="cards"
      className="w-full min-h-screen bg-transparent px-6 py-16 pb-[8rem] flex justify-center items-center relative"
    >
      <div className="max-w-[1240px] w-full grid gap-12 md:grid-cols-3">
        {plans.map(
          ({ title, price, features, img, btnText, btnClass, bgClass, highlight }, idx) => (
            <motion.div
              key={idx}
              className={`
              group relative flex flex-col items-center rounded-2xl pt-20 pb-8 px-8
              transition-all duration-300
              ${highlight ? 'md:scale-105 z-10 ring-2 ring-[var(--color-2)]' : 'hover:-translate-y-1.5'}
              border border-white/10 bg-white/10 backdrop-blur-xl text-white shadow-[0_10px_30px_rgba(0,0,0,0.15)]
            `}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={idx}
            >
              {highlight && (
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold text-white shadow-md"
                    style={{ background: 'linear-gradient(90deg, var(--color-1), var(--color-2))' }}
                  >
                    Mais usado
                  </span>
                </div>
              )}
              {/* imagem flutuante */}
              <motion.img
                src={img}
                alt={title}
                className="w-32 h-32 md:w-40 md:h-40 object-contain absolute -top-16 md:-top-20 drop-shadow-xl"
                initial={{ y: -10 }}
                animate={{ y: [ -10, -4, -10 ] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              />
              <h3 className="text-3xl font-semibold mt-6 text-center text-white">{title}</h3>
              <p className="text-4xl font-extrabold mt-4 mb-6 text-center text-white">{price}</p>
              <ul className="text-center text-white/80 mb-8 space-y-3 w-full">
                {features.map((feature, i) => (
                  <li key={i} className="border-b border-white/10 pb-2">
                    {feature}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`px-10 py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-2)] cursor-pointer ${btnClass}`}
              >
                {btnText}
              </motion.button>
              {/* Shine effect */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300"
                   style={{
                     background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.35), transparent)',
                     maskImage: 'radial-gradient(circle at 50% 0%, black, transparent 70%)'
                   }}
              />
            </motion.div>
          )
        )}
      </div>

      {/* seta para showcase */}
      <ScrollArrow targetId="showcase" />
    </section>
  );
};

export default Cards;
