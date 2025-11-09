import React from 'react';
import BasicIcon from './../../assets/plano1.png';
import ProIcon from './../../assets/plano2.png';
import EnterpriseIcon from './../../assets/plano3.png';
import GlassButton from './GlassButton';
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
      className="w-full min-h-screen bg-transparent px-4 sm:px-6 py-16 sm:py-20 flex justify-center items-center relative"
    >
      <div className="max-w-[1240px] w-full">
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex flex-col items-center"
          >
            <span className="text-[var(--color-2)] text-sm sm:text-base font-bold tracking-wider uppercase mb-2">
              Preços
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-3">
              Escolha seu{' '}
              <span className="bg-gradient-to-r from-[var(--color-2)] to-[var(--color-1)] bg-clip-text text-transparent">
                Plano
              </span>
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[var(--color-2)] to-[var(--color-1)] rounded-full" />
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map(({ title, price, features, img, btnText, highlight }, idx) => (
            <motion.div
              key={idx}
              className={`
                relative flex flex-col rounded-2xl p-6 sm:p-8
                transition-all duration-300
                ${highlight ? 'md:scale-105 shadow-[0_0_30px_rgba(132,92,245,0.5)]' : ''}
                border border-white/10 bg-white/5 backdrop-blur-xl text-white
              `}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={idx}
            >
              {highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full px-4 py-1 text-xs font-bold text-white bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] shadow-lg">
                    Recomendado
                  </span>
                </div>
              )}

              <div className="flex flex-col items-center mb-6">
                <motion.img
                  src={img}
                  alt={title}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-4"
                  whileHover={{ scale: 1.1 }}
                />
                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                <p className="text-4xl font-black bg-gradient-to-r from-[var(--color-2)] to-[var(--color-1)] bg-clip-text text-transparent">
                  {price}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/80 text-sm">
                    <span className="text-[var(--color-2)] shrink-0">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <GlassButton variant={highlight ? 'primary' : 'secondary'} className="w-full">
                {btnText}
              </GlassButton>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cards;
