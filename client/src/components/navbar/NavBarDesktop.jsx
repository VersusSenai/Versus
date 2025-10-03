import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiMenuAlt3, HiX, HiUser, HiLogout, HiCog } from 'react-icons/hi';
import { IoNotificationsOutline } from 'react-icons/io5';
import logo from '../../assets/logo.svg';
import NotificationDropdown from '../notifications/NotificationDropdown';
import { useNotifications } from '../../hooks/useNotifications';

const NavBarDesktop = ({ 
  collapsed, 
  toggleCollapse, 
  user, 
  allowedLinks, 
  activePath, 
  onNavigate, 
  onLogout 
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const { unreadCount } = useNotifications();

  // detectar novas notificações para animação
  useEffect(() => {
    if (unreadCount > 0) {
      setHasNewNotification(true);
      // limpar após 3s
      setTimeout(() => setHasNewNotification(false), 3000);
    }
  }, [unreadCount]);
  return (
    <aside
      className={`hidden md:flex flex-col fixed h-screen z-50 transition-all duration-500 ease-out ${
        collapsed ? 'w-24' : 'w-80'
      }`}
      style={{ backgroundColor: 'var(--color-dark)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-1)]/5 via-transparent to-[var(--color-2)]/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-2)]/10 to-transparent rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[var(--color-1)]/10 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className={`${collapsed ? 'flex flex-col gap-3 items-center mb-4' : 'flex items-center justify-between mb-6'}`}>
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={hasNewNotification ? { 
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 0 0 rgba(239, 68, 68, 0)",
                  "0 0 0 10px rgba(239, 68, 68, 0.1)",
                  "0 0 0 0 rgba(239, 68, 68, 0)"
                ]
              } : {}}
              transition={{ duration: 0.6, repeat: hasNewNotification ? 2 : 0 }}
              onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-3 rounded-xl bg-gradient-to-r from-[var(--color-1)]/20 to-[var(--color-2)]/20 backdrop-blur-sm border border-[var(--color-2)]/30 text-[var(--color-2)] hover:text-white hover:from-[var(--color-1)]/40 hover:to-[var(--color-2)]/40 transition-all duration-300 shadow-lg hover:shadow-[var(--color-2)]/25 cursor-pointer ${
                  hasNewNotification ? 'ring-2 ring-[var(--color-2)] ring-opacity-50' : ''
                }`}
              aria-label="notificações"
            >
              <motion.div
                animate={hasNewNotification ? { rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.5, repeat: hasNewNotification ? 2 : 0 }}
              >
                <IoNotificationsOutline size={20} />
              </motion.div>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                    className={`absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold ${
                      hasNewNotification ? 'bg-[var(--color-2)] animate-pulse' : 'bg-red-500'
                    }`}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </motion.span>
              )}
            </motion.button>
            
            <NotificationDropdown
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleCollapse}
            className="p-3 rounded-xl bg-gradient-to-r from-[var(--color-1)]/20 to-[var(--color-2)]/20 backdrop-blur-sm border border-[var(--color-2)]/30 text-[var(--color-2)] hover:text-white hover:from-[var(--color-1)]/40 hover:to-[var(--color-2)]/40 transition-all duration-300 shadow-lg hover:shadow-[var(--color-2)]/25 cursor-pointer"
            aria-label="toggle sidebar"
          >
            {collapsed ? <HiMenuAlt3 size={20} /> : <HiX size={20} />}
          </motion.button>
        </div>

        {!collapsed && (
          <div className="flex justify-center items-center mb-8">
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
        )}

        <div className="flex-1 flex flex-col justify-center">
          <nav className="space-y-3 mb-6">
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
                    else onNavigate(link.path);
                  }}
                  className={`w-full flex items-center gap-4 rounded-2xl transition-all duration-300 ease-out group relative overflow-hidden cursor-pointer ${
                    collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-4'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] text-white shadow-xl shadow-[var(--color-2)]/25'
                      : 'text-[var(--color-2)] hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-[var(--color-2)]/30'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <div className={`flex-shrink-0 transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-[var(--color-2)] group-hover:text-white group-hover:scale-110'
                  }`}>
                    {link.icon}
                  </div>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="font-semibold text-sm truncate"
                    >
                      {link.label}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        <footer className="pt-4 mt-auto">
          {!collapsed ? (
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
                  onClick={() => onNavigate('account')}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-gradient-to-r from-[var(--color-1)]/20 to-[var(--color-2)]/20 hover:from-[var(--color-1)]/30 hover:to-[var(--color-2)]/30 text-[var(--color-2)] hover:text-white rounded-xl transition-all duration-300 group border border-[var(--color-2)]/20 hover:border-[var(--color-2)]/40 backdrop-blur-sm mb-3 cursor-pointer"
                >
                  <HiCog size={18} className="group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
                  <span className="font-semibold text-sm">Minha Conta</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-300 hover:text-red-200 rounded-xl transition-all duration-300 group border border-red-500/20 hover:border-red-400/30 backdrop-blur-sm cursor-pointer"
                >
                  <HiLogout size={18} className="group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                  <span className="font-semibold text-sm">Sair da conta</span>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('account')}
                className="relative group cursor-pointer"
                title="Minha Conta"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-1)] to-[var(--color-2)] flex items-center justify-center shadow-xl shadow-[var(--color-2)]/25 group-hover:shadow-[var(--color-2)]/40 transition-all duration-300">
                  <HiUser className="text-white" size={24} />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={onLogout}
                className="p-3 rounded-2xl bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-300 hover:text-red-200 transition-all duration-300 border border-red-500/20 hover:border-red-400/30 backdrop-blur-sm cursor-pointer"
                title="Sair da conta"
              >
                <HiLogout size={18} className="hover:rotate-12 transition-transform duration-300" />
              </motion.button>
            </div>
          )}
        </footer>
      </div>
    </aside>
  );
};

export default NavBarDesktop;