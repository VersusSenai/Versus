import React from 'react';
import BasicIcon from './../../assets/plano1.png';
import ProIcon from './../../assets/plano2.png';
import EnterpriseIcon from './../../assets/plano3.png';

const Cards = () => {
  return (
    <div className="w-full py-[10rem] px-4 bg-white rounded-3xl">
      <div className="max-w-[1240px] mx-auto grid md:grid-cols-3 gap-8">
        {/* Básico */}
        <div className="w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300">
          <img
            className="w-50 mx-auto mt-[-8rem] mb-[-3rem] bg-white"
            src={BasicIcon}
            alt="Plano Básico"
          />
          <h2 className="text-2xl font-bold text-center py-8">Plano Básico</h2>
          <p className="text-center text-4xl font-bold">Grátis</p>
          <div className="text-center font-medium">
            <p className="py-2 border-b mx-8 mt-8">Até 3 torneios simultâneos</p>
            <p className="py-2 border-b mx-8">Até 16 jogadores por torneio</p>
            <p className="py-2 border-b mx-8">Dashboard básica de resultados</p>
          </div>
          <button className="bg-[var(--color-2)] w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3">
            Começar Grátis
          </button>
        </div>
        {/* Profissional */}
        <div className="w-full shadow-xl bg-gray-100 flex flex-col p-4 md:my-0 my-8 rounded-lg hover:scale-105 duration-300">
          <img
            className="w-50 mx-auto mt-[-8rem] mb-[-3rem] bg-transparent"
            src={ProIcon}
            alt="Plano Profissional"
          />
          <h2 className="text-2xl font-bold text-center py-8">Plano Profissional</h2>
          <p className="text-center text-4xl font-bold">R$49/mês</p>
          <div className="text-center font-medium">
            <p className="py-2 border-b mx-8 mt-8">Torneios ilimitados</p>
            <p className="py-2 border-b mx-8">Até 128 jogadores por torneio</p>
            <p className="py-2 border-b mx-8">Estatísticas avançadas e integração</p>
          </div>
          <button className="bg-[var(--color-dark)] text-[var(--color-2)] w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3">
            Assinar Agora
          </button>
        </div>
        {/* Empresarial */}
        {/* Empresarial */}
        <div className="w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300">
          <img
            className="w-50 mx-auto mt-[-8rem] mb-[-3rem] bg-white"
            src={EnterpriseIcon}
            alt="Plano Empresarial"
          />
          <h2 className="text-2xl font-bold text-center py-8">Plano Empresarial</h2>
          <p className="text-center text-4xl font-bold">R$149/mês</p>
          <div className="text-center font-medium">
            <p className="py-2 border-b mx-8 mt-8">Torneios ilimitados & grandes</p>
            <p className="py-2 border-b mx-8">Suporte prioritário</p>
            <p className="py-2 border-b mx-8">Equipes & administradores múltiplos</p>
          </div>
          <button className="bg-[var(--color-2)] w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3">
            Assinar Agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
