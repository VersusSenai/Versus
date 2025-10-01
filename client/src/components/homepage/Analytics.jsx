import { GiOrganigram } from 'react-icons/gi';
import React from 'react';
import ScrollArrow from '../../components/ScrollArrow';
import { motion } from 'framer-motion';

const Analytics = () => {
  return (
    <div
      id="analytics"
      className="w-full min-h-screen bg-transparent py-16 px-4 flex justify-center items-center relative"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="max-w-[1240px] w-full bg-white rounded-3xl p-8 sm:p-10 md:p-12 lg:p-16 flex flex-col md:grid md:grid-cols-2 gap-8 items-center shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
      >
        {/* conteúdo (texto e botão) */}
        <motion.div className="order-2 md:order-1" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
          <p className="text-[var(--color-2)] font-bold text-sm sm:text-base">
            VERSUS - Gerenciador de Torneios
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold py-2 text-gray-900">
            Organize Torneios, Acompanhe Resultados e Conecte Jogadores
          </h1>
          <ul className="list-disc ml-5 mt-4 space-y-2 text-gray-700 text-sm sm:text-base">
            <li>Crie torneios em poucos minutos</li>
            <li>Acompanhe partidas e estatísticas em tempo real</li>
            <li>Ranking dinâmico e notificações automáticas</li>
            <li>Compatível com jogos populares e plataformas de streaming</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center mt-6">
            <button className="bg-[var(--color-dark)] text-[var(--color-2)] w-full sm:w-[220px] rounded-lg font-semibold py-3 transition hover:bg-[var(--color-2)] hover:text-black shadow-md">
              Criar Torneio Agora
            </button>
            <a href="#hero" className="text-[var(--color-2)] underline underline-offset-4 hover:opacity-80">Ver como funciona</a>
          </div>
        </motion.div>

        {/* ícone */}
        <motion.div className="order-1 md:order-2 flex justify-center items-center" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}>
          <GiOrganigram className="text-[var(--color-dark)] text-[180px] sm:text-[220px] md:text-[260px] lg:text-[300px] drop-shadow-xl" />
        </motion.div>
      </motion.div>

      {/* seta para voltar ao topo */}
      <ScrollArrow targetId="hero" direction="up" />
    </div>
  );
};

export default Analytics;
