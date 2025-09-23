import { FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiBell } from 'react-icons/hi';
import logo from '../../assets/logo.svg';
import { NavLinks } from './NavLinks';
import { useState, useRef, useEffect } from 'react';

export const NavbarMobile = ({
  show,
  toggle,
  user,
  allowedLinks,
  activePath,
  onNavigate,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const notifications = [
    {
      id: 1,
      title: "Novo torneio disponível",
      message: "Torneio de CS2 iniciando em 2 horas",
      time: "5 min atrás",
      unread: true
    },
    {
      id: 2,
      title: "Sua partida foi agendada",
      message: "Você tem uma partida às 20:00 hoje",
      time: "1 hora atrás",
      unread: true
    },
    {
      id: 3,
      title: "Torneio finalizado",
      message: "O torneio de Valorant foi concluído",
      time: "3 horas atrás",
      unread: false
    }
  ];

  return (
  <AnimatePresence>
    {show && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggle}
        />
        
        <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 w-[90%] max-w-md h-full shadow-2xl z-50 md:hidden"
          style={{ backgroundColor: 'var(--color-dark)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-purple-400/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-indigo-400/20 to-transparent rounded-full blur-2xl" />
          
          <div className="relative z-10 p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 rounded-xl bg-gradient-to-r from-purple-800/80 to-indigo-800/80 backdrop-blur-sm border border-purple-600/30 text-purple-200 hover:text-white hover:from-purple-700/80 hover:to-indigo-700/80 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 cursor-pointer relative"
                  aria-label="notificações"
                >
                  <HiBell size={24} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-purple-900 animate-pulse"></span>
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-sm border border-purple-600/30 rounded-xl shadow-2xl z-50"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-white font-semibold text-lg">notificações</h3>
                          <span className="text-purple-300 text-sm">{notifications.filter(n => n.unread).length} não lidas</span>
                        </div>
                        
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-3 rounded-lg border transition-all duration-200 hover:bg-purple-800/20 cursor-pointer ${
                                notification.unread 
                                  ? 'bg-purple-800/30 border-purple-500/50' 
                                  : 'bg-gray-800/50 border-gray-600/30'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="text-white font-medium text-sm mb-1">
                                    {notification.title}
                                  </h4>
                                  <p className="text-gray-300 text-xs mb-2">
                                    {notification.message}
                                  </p>
                                  <span className="text-purple-400 text-xs">
                                    {notification.time}
                                  </span>
                                </div>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-red-500 rounded-full ml-2 mt-1"></div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-purple-600/30">
                          <button className="w-full text-center text-purple-300 hover:text-white text-sm transition-colors duration-200">
                            ver todas as notificações
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <button
                onClick={toggle}
                className="p-3 rounded-xl bg-gradient-to-r from-purple-800/80 to-indigo-800/80 backdrop-blur-sm border border-purple-600/30 text-purple-200 hover:text-white hover:from-purple-700/80 hover:to-indigo-700/80 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 cursor-pointer"
                aria-label="fechar menu"
              >
                <HiX size={24} />
              </button>
            </div>

            <div className="flex flex-col items-center mb-8">
              <div className="flex justify-center">
                <div>
                  <img src={logo} alt="versus logo" className="h-16 w-16 scale-150" />
                </div>
              </div>
            </div>

            {user && (
              <div className="mb-8 p-5 bg-gradient-to-br from-purple-600/90 to-indigo-600/90 rounded-2xl shadow-2xl border border-purple-500/30 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {(user.name || user.username || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">
                        {user.name || user.username || user.email || 'usuário'}
                      </div>
                      <div className="text-purple-100 text-sm font-medium">
                        {user.role === 'A' ? 'Administrador' : 
                         user.role === 'O' ? 'Organizador' : 
                         user.role === 'P' ? 'Jogador' : 
                         user.role ? `role: ${user.role}` : 'usuário'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 flex flex-col gap-2">
              <NavLinks
                links={allowedLinks}
                collapsed={false}
                activePath={activePath}
                onNavigate={onNavigate}
              />
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-purple-800/50">
            <div className="text-center text-purple-300 text-xs p-6">
              <div className="text-white/60 font-medium mb-1">versus platform</div>
              <div className="text-purple-400/70 text-xs">
                © 2024 todos os direitos reservados
              </div>
            </div>
          </div>
        </motion.aside>
      </>
    )}
  </AnimatePresence>
  );
};
