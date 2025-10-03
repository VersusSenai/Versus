import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiUser, HiLogout, HiCog } from 'react-icons/hi';
import logo from '../../assets/logo.svg';

const NavBarMobile = ({
  show,
  toggle,
  user,
  allowedLinks,
  activePath,
  onNavigate,
  onLogout
}) => {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={toggle}
          />

          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-0 top-0 h-full w-80 z-50"
            style={{ backgroundColor: 'var(--color-dark)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-1)]/5 via-transparent to-[var(--color-2)]/5 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-2)]/10 to-transparent rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[var(--color-1)]/10 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-center p-6 border-b border-white/10">
                
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggle}
                  className="p-3 rounded-xl bg-gradient-to-r from-[var(--color-1)]/20 to-[var(--color-2)]/20 backdrop-blur-sm border border-[var(--color-2)]/30 text-[var(--color-2)] hover:text-white hover:from-[var(--color-1)]/40 hover:to-[var(--color-2)]/40 transition-all duration-300 shadow-lg hover:shadow-[var(--color-2)]/25 cursor-pointer"
                >
                  <HiX size={20} />
                </motion.button>
              </div>

              <div className="flex justify-center items-center p-6 border-b border-white/10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center space-y-4"
                >
                  <img 
                    src={logo} 
                    alt="Logo Versus" 
                    className="h-32 w-32 drop-shadow-2xl"
                  />
                </motion.div>
              </div>

              <nav className="flex-1 px-6 py-6 space-y-3 overflow-y-auto">
                {allowedLinks && allowedLinks.map((link, index) => {
                  const linkPath = `/${link.path}`;
                  const isActive = activePath === linkPath;
                  
                  return (
                    <motion.button
                      key={link.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (link.action) link.action();
                        else {
                          onNavigate(link.path);
                          toggle();
                        }
                      }}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ease-out group relative overflow-hidden cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] text-white shadow-xl shadow-[var(--color-2)]/25'
                          : 'text-[var(--color-2)] hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-[var(--color-2)]/30'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicatorMobile"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      <div className={`flex-shrink-0 transition-all duration-300 ${
                        isActive ? 'text-white' : 'text-[var(--color-2)] group-hover:text-white group-hover:scale-110'
                      }`}>
                        {link.icon}
                      </div>
                      <span className="font-semibold text-sm">
                        {link.label}
                      </span>
                    </motion.button>
                  );
                })}
              </nav>

              <footer className="p-6 border-t border-white/10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-1)]/10 via-[var(--color-2)]/5 to-[var(--color-1)]/10 rounded-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
                  
                  <div className="relative z-10 p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative group">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-1)] to-[var(--color-2)] flex items-center justify-center shadow-xl shadow-[var(--color-2)]/25 group-hover:shadow-[var(--color-2)]/40 transition-all duration-300">
                          <HiUser className="text-white" size={28} />
                        </div>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold text-base truncate mb-1">
                          {user?.username || 'Usuário'}
                        </h4>
                        <p className="text-[var(--color-2)] text-sm truncate opacity-80">
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onNavigate('account');
                        toggle();
                      }}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-gradient-to-r from-[var(--color-1)]/20 to-[var(--color-2)]/20 hover:from-[var(--color-1)]/30 hover:to-[var(--color-2)]/30 text-[var(--color-2)] hover:text-white rounded-xl transition-all duration-300 group border border-[var(--color-2)]/20 hover:border-[var(--color-2)]/40 backdrop-blur-sm mb-3 cursor-pointer"
                    >
                      <HiCog size={18} className="group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
                      <span className="font-semibold text-sm">Minha Conta</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onLogout();
                        toggle();
                      }}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-300 hover:text-red-200 rounded-xl transition-all duration-300 group border border-red-500/20 hover:border-red-400/30 backdrop-blur-sm cursor-pointer"
                    >
                      <HiLogout size={18} className="group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                      <span className="font-semibold text-sm">Sair da conta</span>
                    </motion.button>
                  </div>
                </motion.div>
              </footer>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default NavBarMobile;