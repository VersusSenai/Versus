import React from 'react';
import {
  FaDribbbleSquare,
  FaFacebookSquare,
  FaGithubSquare,
  FaInstagram,
  FaTwitterSquare,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <div className="w-full bg-[var(--color-dark)] text-white py-16 px-4">
      <div className="max-w-[1240px] mx-auto grid lg:grid-cols-3 gap-8">
        {/* branding e social */}
        <div>
          <h1 className="text-3xl font-bold text-accent">Versus.</h1>
          <p className="py-4 text-white/80">A melhor empresa de gerenciamento de torneios online.</p>
          <div className="flex justify-start space-x-6 mt-6">
            {[FaFacebookSquare, FaInstagram, FaTwitterSquare, FaGithubSquare, FaDribbbleSquare].map((Icon, i) => (
              <motion.a key={i} whileHover={{ y: -2, scale: 1.05 }} href="#" className="text-white/80 hover:text-[var(--color-2)] transition">
                <Icon size={30} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* newsletter */}
        <div className="lg:col-span-2">
          <h2 className="md:text-2xl sm:text-xl text-lg font-bold py-2">
            Quer ficar por dentro das últimas novidades e dicas para seus torneios?
          </h2>
          <p className="pb-4">
            Receba atualizações exclusivas, dicas e novidades do Versus direto no seu e-mail.
          </p>
          <form className="flex flex-col sm:flex-row items-center justify-between w-full">
            <input
              className="p-3 flex w-full rounded-md text-accent border border-white/40 bg-white/5 placeholder-white/50"
              type="email"
              placeholder="Digite seu e-mail"
              required
            />
            <button
              type="submit"
              className="bg-[var(--color-2)] text-[var(--color-dark)] rounded-md font-semibold w-[200px] ml-0 sm:ml-4 my-4 sm:my-0 px-6 py-3 hover:bg-[var(--color-dark)] hover:text-[var(--color-2)] transition shadow-md cursor-pointer"
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

      {/* copyright */}
      <div className="border-t border-white/10 mt-12 pt-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Versus. Todos os direitos reservados.
      </div>
    </div>
  );
};

export default Footer;
