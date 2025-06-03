import React from 'react';
import TournamentImage from './../../assets/double.png';

const Analytics = () => {
  return (
    <div className="w-full bg-white py-16 px-4 rounded-3xl">
      <div className="max-w-[1240px] mx-auto grid md:grid-cols-2 items-center">
        <img
          className="w-[500px] mx-auto my-4 rounded-xl shadow-lg"
          src={TournamentImage}
          alt="Torneio online"
        />
        <div className="flex flex-col justify-center">
          <p className="text-[var(--color-2)] font-bold ">VERSUS - Gerenciador de Torneios</p>
          <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold py-2">
            Organize Torneios, Acompanhe Resultados e Conecte Jogadores
          </h1>
          <ul className="list-disc ml-5 space-y-2 text-gray-700">
            <li>Crie torneios em poucos minutos</li>
            <li>Acompanhe partidas e estatísticas em tempo real</li>
            <li>Ranking dinâmico e notificações automáticas</li>
            <li>Compatível com jogos populares e plataformas de streaming</li>
          </ul>
          <button className="bg-[var(--color-dark)] text-[var(--color-2)] w-[220px] rounded-md font-medium my-6 py-3 hover:bg-[var(--color-2)] hover:text-black transition">
            Criar Torneio Agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
