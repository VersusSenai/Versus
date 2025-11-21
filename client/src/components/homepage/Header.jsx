import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import GlassButton from './GlassButton';
import logo from '../../assets/logo.svg';

const navItems = [
  { label: 'Início', href: '#hero' },
  { label: 'Planos', href: '#cards' },
  { label: 'Parceiros', href: '#showcase' },
  { label: 'Depoimentos', href: '#testimonials' },
];

const Header = ({ logoRef, onLoginClick }) => {
  const user = useSelector((state) => state.user.user);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;

      // Atualizar estado de scrolled
      setScrolled(currentScrollY > 8);

      // Controlar visibilidade: ocultar ao rolar para baixo, mostrar ao rolar para cima
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Rolando para baixo e passou de 100px
        setVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
        // Rolando para cima ou no topo
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY]);

  const goTo = (hash) => {
    setOpen(false);
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn(`Elemento com id "${id}" não encontrado`);
    }
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{
        y: visible ? 0 : -100,
        opacity: visible ? 1 : 0,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-[1000]"
    >
      <div
        className="mx-auto max-w-[1240px] px-4 py-3 flex items-center justify-between rounded-b-2xl"
        style={{
          background: scrolled
            ? 'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35))'
            : 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.15))',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center gap-3">
          <img
            id="navbar-logo"
            ref={logoRef}
            src={logo}
            alt="Versus"
            className="h-10 md:h-12 w-auto select-none"
          />
          <span className="hidden sm:block text-white/90 font-semibold">Versus</span>
        </div>

        <nav className="hidden md:flex items-center gap-2 text-white/80">
          {navItems.map((item, i) => (
            <button
              key={i}
              onClick={() => goTo(item.href)}
              className="px-3 py-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Link
              to="/account"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white/90 hover:bg-white/10 transition cursor-pointer"
              title={user.username}
            >
              <div className="h-7 w-7 rounded-full bg-[var(--color-2)] text-[var(--color-dark)] flex items-center justify-center text-xs font-bold">
                {String(user.username || 'U')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <span className="max-w-[140px] truncate">{user.username}</span>
            </Link>
          ) : (
            <>
              <GlassButton
                onClick={onLoginClick}
                variant="primary"
                className="min-w-[140px] text-sm hidden sm:block"
              >
                Entrar
              </GlassButton>
              <button
                onClick={onLoginClick}
                className="sm:hidden relative px-4 py-2 rounded-lg text-sm font-semibold text-white overflow-hidden"
                style={{
                  padding: 1.5,
                  background:
                    'conic-gradient(from 180deg at 50% 50%, var(--color-1), var(--color-2), var(--color-1))',
                }}
              >
                <div
                  className="relative px-3 py-1.5 rounded-md"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.4)] transition-colors rounded-md" />
                  <span className="relative z-10">Entrar</span>
                </div>
              </button>
            </>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            className="md:hidden relative flex flex-col items-center justify-center h-10 w-10 gap-1.5 rounded-lg text-white/90 hover:bg-white/10 transition-colors group"
          >
            <motion.span
              animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="h-0.5 w-5 bg-current rounded-full origin-center"
            />
            <motion.span
              animate={open ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="h-0.5 w-5 bg-current rounded-full"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="h-0.5 w-5 bg-current rounded-full origin-center"
            />
          </button>
        </div>
      </div>

      {/* menu mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden mx-auto max-w-[1240px] px-4 pb-3 overflow-hidden"
          >
            <div
              className="rounded-2xl p-4 text-white/90 relative overflow-hidden"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              {/* Gradiente de borda sutil */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background:
                    'conic-gradient(from 180deg at 50% 50%, var(--color-1), var(--color-2), var(--color-1))',
                  filter: 'blur(20px)',
                }}
              />

              <div className="relative space-y-2">
                {navItems.map((item, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => goTo(item.href)}
                    className="w-full text-left px-4 py-3.5 rounded-xl hover:bg-white/10 transition-colors font-medium text-base"
                  >
                    {item.label}
                  </motion.button>
                ))}

                {user && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.05 }}
                    className="pt-3 mt-2 border-t border-white/10"
                  >
                    <Link
                      to="/account"
                      className="w-full flex items-center justify-start gap-3 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--color-1)] to-[var(--color-2)] flex items-center justify-center text-sm font-bold shadow-lg">
                        {String(user.username || 'U')
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <span className="truncate font-medium">{user.username}</span>
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
