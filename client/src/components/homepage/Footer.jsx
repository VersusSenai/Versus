import React from 'react';
import {
  FaDribbbleSquare,
  FaFacebookSquare,
  FaGithubSquare,
  FaInstagram,
  FaTwitterSquare,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import GlassButton from './GlassButton';

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-[var(--color-dark)] to-[#0a0015] text-white py-16 px-4 border-t border-white/5">
      <div className="max-w-[1240px] mx-auto grid lg:grid-cols-3 gap-12">
        {/* branding e social */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-2)] to-[var(--color-1)] bg-clip-text text-transparent">Versus</h1>
          <p className="py-4 text-white/70 leading-relaxed">A melhor plataforma para gerenciar torneios e conectar jogadores do mundo todo.</p>
          <div className="flex justify-start gap-4 mt-6">
            {[FaFacebookSquare, FaInstagram, FaTwitterSquare, FaGithubSquare, FaDribbbleSquare].map((Icon, i) => (
              <motion.a 
                key={i} 
                whileHover={{ y: -4, scale: 1.1 }} 
                whileTap={{ scale: 0.95 }}
                href="#" 
                className="text-white/60 hover:text-[var(--color-2)] transition-colors duration-300"
                aria-label={`Rede social ${i + 1}`}
              >
                <Icon size={28} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* newsletter */}
        <div className="lg:col-span-2">
          <h2 className="md:text-2xl sm:text-xl text-lg font-bold py-2 text-white">
            Fique por dentro das novidades
          </h2>
          <p className="pb-4 text-white/70">
            Receba atualizações exclusivas, dicas e novidades do Versus direto no seu e-mail.
          </p>
          <form className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
            <input
              className="p-3 flex-1 rounded-lg text-white border border-white/20 bg-white/5 placeholder-white/40 focus:outline-none focus:border-[var(--color-2)] focus:shadow-[0_0_0_3px_rgba(132,92,245,0.2)] transition-all"
              type="email"
              placeholder="Digite seu melhor e-mail"
              required
            />
            
            <GlassButton
              type="submit"
              variant="primary"
              className="px-8 whitespace-nowrap"
            >
              Inscrever-se
            </GlassButton>
          </form>
          <p className="text-xs mt-3 text-white/50">
            🔒 Respeitamos sua privacidade. Sem spam, apenas conteúdo relevante.{' '}
            <a href="#" className="text-[var(--color-2)] hover:underline">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>

      {/* links rápidos (opcional) */}
      <div className="max-w-[1240px] mx-auto mt-12 pt-8 border-t border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h3 className="font-semibold text-white mb-3">Produto</h3>
            <ul className="space-y-2 text-white/60">
              <li><a href="#" className="hover:text-[var(--color-2)] transition">Recursos</a></li>
              <li><a href="#" className="hover:text-[var(--color-2)] transition">Preços</a></li>
              <li><a href="#" className="hover:text-[var(--color-2)] transition">API</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Empresa</h3>
            <ul className="space-y-2 text-white/60">
              <li><a href="#" className="hover:text-[var(--color-2)] transition">Sobre</a></li>
              <li><a href="#" className="hover:text-[var(--color-2)] transition">Blog</a></li>
              <li><a href="#" className="hover:text-[var(--color-2)] transition">Carreiras</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Suporte</h3>
            <ul className="space-y-2 text-white/60">
              <li><a href="#" className="hover:text-[var(--color-2)] transition">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-[var(--color-2)] transition">Contato</a></li>
              <li><a href="#" className="hover:text-[var(--color-2)] transition">Status</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Legal</h3>
            <ul className="space-y-2 text-white/60">
              <li><a href="#" className="hover:text-[var(--color-2)] transition">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-[var(--color-2)] transition">Privacidade</a></li>
              <li><a href="#" className="hover:text-[var(--color-2)] transition">Cookies</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* copyright */}
      <div className="max-w-[1240px] mx-auto border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/50 text-sm">
        <p>&copy; {new Date().getFullYear()} Versus. Todos os direitos reservados.</p>
        <p className="flex items-center gap-2">
          Feito com <span className="text-[var(--color-2)]">♥</span> para a comunidade gamer
        </p>
      </div>
    </footer>
  );
};

export default Footer;
