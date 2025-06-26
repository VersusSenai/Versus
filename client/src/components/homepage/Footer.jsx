import React from 'react';
import {
  FaDribbbleSquare,
  FaFacebookSquare,
  FaGithubSquare,
  FaInstagram,
  FaTwitterSquare,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="w-full bg-[var(--color-dark)] text-white py-16 px-4">
      <div className="max-w-[1240px] mx-auto grid lg:grid-cols-3 gap-8">
        {/* Branding & Social */}
        <div>
          <h1 className="text-3xl font-bold text-accent">Versus.</h1>
          <p className="py-4">A melhor empresa de gerenciamento de torneios online.</p>
          <div className="flex justify-start space-x-6 mt-6">
            <FaFacebookSquare size={30} />
            <FaInstagram size={30} />
            <FaTwitterSquare size={30} />
            <FaGithubSquare size={30} />
            <FaDribbbleSquare size={30} />
          </div>
        </div>

        {/* Newsletter */}
        <div className="lg:col-span-2">
          <h2 className="md:text-2xl sm:text-xl text-lg font-bold py-2">
            Quer ficar por dentro das últimas novidades e dicas para seus torneios?
          </h2>
          <p className="pb-4">
            Receba atualizações exclusivas, dicas e novidades do Versus direto no seu e-mail.
          </p>
          <form className="flex flex-col sm:flex-row items-center justify-between w-full">
            <input
              className="p-3 flex w-full rounded-md text-accent border border-white"
              type="email"
              placeholder="Digite seu e-mail"
              required
            />
            <button
              type="submit"
              className="bg-[var(--color-2)] text-[var(--color-dark)] rounded-md font-medium w-[200px] ml-0 sm:ml-4 my-4 sm:my-0 px-6 py-3 hover:bg-[var(--color-dark)] hover:text-[var(--color-2)] transition"
            >
              Quero Receber
            </button>
          </form>
          <p className="text-sm mt-2 text-gray-400">
            Nós respeitamos sua privacidade e nunca compartilhamos seus dados.{' '}
            <span className="text-accent cursor-pointer hover:underline">
              Política de Privacidade
            </span>
            .
          </p>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Versus. Todos os direitos reservados.
      </div>
    </div>
  );
};

export default Footer;
