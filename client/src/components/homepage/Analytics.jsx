import { GiOrganigram } from 'react-icons/gi';
import React from 'react';
import ScrollArrow from '../../components/ScrollArrow';

const Analytics = () => {
  return (
    <div
      id="analytics"
      className="w-full min-h-screen bg-transparent py-16 px-4 flex justify-center items-center relative"
    >
      <div className="max-w-[1240px] w-full bg-white rounded-3xl p-8 sm:p-10 md:p-12 lg:p-16 flex flex-col md:grid md:grid-cols-2 gap-8 items-center">
        {/* Conteúdo (texto e botão) */}
        <div className="order-2 md:order-1">
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
          <button className="bg-[var(--color-dark)] text-[var(--color-2)] w-full sm:w-[220px] rounded-md font-medium my-6 py-3 transition hover:bg-[var(--color-2)] hover:text-black">
            Criar Torneio Agora
          </button>
        </div>

        {/* Ícone */}
        <div className="order-1 md:order-2 flex justify-center items-center">
          <GiOrganigram className="text-[var(--color-dark)] text-[180px] sm:text-[220px] md:text-[260px] lg:text-[300px] drop-shadow-xl" />
        </div>
      </div>

      {/* Seta para voltar ao topo */}
      <ScrollArrow targetId="hero" direction="up" />
    </div>
  );
};

export default Analytics;
