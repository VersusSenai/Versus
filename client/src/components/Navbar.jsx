import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../assets/logo.svg';

const navItems = [
  { label: 'Início', href: '#hero' },
  { label: 'Planos', href: '#cards' },
  { label: 'Recursos', href: '#analytics' },
  { label: 'Depoimentos', href: '#testimonials' },
];

const Navbar = ({ logoRef, onLoginClick }) => {
  const user = useSelector((state) => state.user.user);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (hash) => {
    setOpen(false);
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-[1000]"
    >
      <div
        className="mx-auto max-w-[1240px] px-4 py-3 flex items-center justify-between rounded-b-2xl"
        style={{
          background: scrolled
            ? 'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35))'
            : 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.15))',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <div className="flex items-center gap-3">
          <img id="navbar-logo" ref={logoRef} src={logo} alt="Versus" className="h-10 md:h-12 w-auto select-none" />
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
                {String(user.username || 'U').slice(0, 2).toUpperCase()}
              </div>
              <span className="max-w-[140px] truncate">{user.username}</span>
            </Link>
          ) : (
            <button
              onClick={onLoginClick}
              className="hidden sm:flex items-center justify-center gap-2 border border-[var(--color-2)] backdrop-blur-sm min-w-[140px] rounded-xl font-semibold py-2 text-[var(--color-2)] text-sm hover:bg-[var(--color-2)] hover:text-[var(--color-dark)] transition shadow-lg cursor-pointer"
            >
              Entrar
            </button>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-lg border border-white/20 text-white/90"
          >
            <span className="i-ph-list text-xl">≡</span>
          </button>
        </div>
      </div>

      {/* menu mobile */}
      {open && (
        <div className="md:hidden mx-auto max-w-[1240px] px-4 pb-3">
          <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-2 text-white/90">
            {navItems.map((item, i) => (
              <button
                key={i}
                onClick={() => goTo(item.href)}
                className="w-full text-left px-3 py-3 rounded-xl hover:bg-white/10"
              >
                {item.label}
              </button>
            ))}
            {user ? (
            <Link
                to="/account"
              className="w-full mt-1 flex items-center justify-start gap-2 px-3 py-3 rounded-xl border border-white/15 bg-white/5 text-white/90 hover:bg-white/10 cursor-pointer"
              >
                <div className="h-7 w-7 rounded-full bg-[var(--color-2)] text-[var(--color-dark)] flex items-center justify-center text-xs font-bold">
                  {String(user.username || 'U').slice(0, 2).toUpperCase()}
                </div>
                <span className="truncate">{user.username}</span>
              </Link>
            ) : (
              <button
                onClick={onLoginClick}
                className="w-full mt-1 flex items-center justify-center gap-2 border border-[var(--color-2)] backdrop-blur-sm rounded-xl font-semibold py-3 text-[var(--color-2)] text-sm hover:bg-[var(--color-2)] hover:text-[var(--color-dark)] transition shadow-lg cursor-pointer"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      )}
    </motion.header>
  );
};

export default Navbar;


