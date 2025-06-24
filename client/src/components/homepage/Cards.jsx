import React from 'react';
import BasicIcon from './../../assets/plano1.png';
import ProIcon from './../../assets/plano2.png';
import EnterpriseIcon from './../../assets/plano3.png';
import ScrollArrow from '../../components/ScrollArrow';

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

const Cards = () => {
  return (
    <section
      id="cards"
      className="w-full min-h-screen bg-transparent px-6 py-16 pb-[8rem] flex justify-center items-center relative"
    >
      <div className="max-w-[1240px] w-full grid gap-12 md:grid-cols-3">
        {plans.map(
          ({ title, price, features, img, btnText, btnClass, bgClass, highlight }, idx) => (
            <div
              key={idx}
              className={`
              flex flex-col items-center rounded-xl shadow-lg pt-20 pb-8 px-8 
              relative transition-all duration-300 hover:scale-105 
              ${bgClass} 
              ${highlight ? 'md:scale-110 z-10 border-2 border-[var(--color-2)]' : ''}
            `}
            >
              {/* Imagem flutuante no topo */}
              <img
                src={img}
                alt={title}
                className="w-32 h-32 md:w-40 md:h-40 object-contain absolute -top-16 md:-top-20"
              />
              <h3 className="text-3xl font-semibold mt-6 text-center">{title}</h3>
              <p className="text-4xl font-extrabold mt-4 mb-6 text-center text-gray-900">{price}</p>
              <ul className="text-center text-gray-700 mb-8 space-y-3">
                {features.map((feature, i) => (
                  <li key={i} className="border-b border-gray-300 pb-2">
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`px-10 py-3 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-2)] ${btnClass}`}
              >
                {btnText}
              </button>
            </div>
          )
        )}
      </div>

      {/* Scroll para seção analytics */}
      <ScrollArrow targetId="analytics" />
    </section>
  );
};

export default Cards;
