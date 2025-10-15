import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { IoNotificationsOutline, IoClose, IoCheckmarkDone, IoRefresh } from 'react-icons/io5';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationTestButton from './NotificationTestButton';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('unread');
  const [newNotificationId, setNewNotificationId] = useState(null);
  const { 
    notifications, 
    unreadCount, 
    totalCount, 
    loading, 
    loadingMore, 
    hasMore, 
    socketConnected, 
    markAsRead, 
    markAllAsRead, 
    fetchNotifications, 
    loadMoreNotifications 
  } = useNotifications();
  
  const dropdownRef = useRef(null);
  const notificationsListRef = useRef(null);

  // detectar novas notificações
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      if (latest && !latest.read) {
        setNewNotificationId(latest.id);
        
        if (isOpen && notificationsListRef.current) {
          setTimeout(() => {
            notificationsListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
        }
        
        setTimeout(() => setNewNotificationId(null), 3000);
      }
    }
  }, [notifications, isOpen]);

  // fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // scroll infinito
  useEffect(() => {
    const handleScroll = () => {
      if (!notificationsListRef.current || !hasMore || loadingMore) return;
      
      const { scrollTop, scrollHeight, clientHeight } = notificationsListRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      
      if (isNearBottom) {
        loadMoreNotifications();
      }
    };

    const listElement = notificationsListRef.current;
    if (listElement) {
      listElement.addEventListener('scroll', handleScroll);
      return () => listElement.removeEventListener('scroll', handleScroll);
    }
  }, [hasMore, loadingMore, loadMoreNotifications]);

  // filtrar notificações
  const filteredNotifications = notifications.filter(notification => {
    return activeTab === 'unread' ? !notification.read : true;
  });

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 mt-2 w-80 sm:w-96 bg-[var(--color-dark)]/95 backdrop-blur-sm rounded-xl shadow-xl border border-[var(--color-2)]/30 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-2)]/20 bg-gradient-to-r from-[var(--color-1)]/10 to-[var(--color-2)]/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IoNotificationsOutline className="text-[var(--color-2)]" size={20} />
            <h3 className="text-lg font-semibold text-[var(--color-text)]">Notificações</h3>
            {unreadCount > 0 && (
              <span className="bg-[var(--color-2)] text-white text-xs px-2 py-1 rounded-full font-medium">
                {unreadCount}
              </span>
            )}
            {socketConnected && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Conectado em tempo real" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchNotifications}
              className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="Atualizar"
            >
              <IoRefresh size={16} className="text-[var(--color-muted)]" />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <IoClose size={18} className="text-[var(--color-muted)]" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-3">
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'unread'
                ? 'bg-[var(--color-2)] text-white'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            Não lidas ({unreadCount})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[var(--color-2)] text-white'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            Todas ({totalCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div ref={notificationsListRef} className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-[var(--color-muted)]">
            <IoRefresh size={32} className="mx-auto mb-3 text-[var(--color-muted)] animate-spin" />
            <p className="text-sm">Carregando...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-muted)]">
            <IoNotificationsOutline size={48} className="mx-auto mb-3 text-[var(--color-muted)]" />
            <p className="text-sm">
              {activeTab === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-2)]/20">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  scale: 1,
                  backgroundColor: newNotificationId === notification.id ? 'rgba(92, 75, 245, 0.2)' : 'transparent'
                }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.05,
                  backgroundColor: { duration: 0.5 }
                }}
                className={`p-4 hover:bg-white/5 transition-all duration-200 cursor-pointer relative ${
                  !notification.read ? 'bg-[var(--color-1)]/10 border-l-4 border-l-[var(--color-1)]' : ''
                } ${newNotificationId === notification.id ? 'ring-2 ring-[var(--color-2)]/50' : ''}`}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    !notification.read ? 'bg-[var(--color-1)]' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white mb-1">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {formatDate(notification.createdAt)}
                      </span>
                      {!notification.read && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            newNotificationId === notification.id 
                              ? 'bg-green-500/20 text-green-400 animate-pulse' 
                              : 'bg-[var(--color-1)]/20 text-[var(--color-1)]'
                          }`}
                        >
                          {newNotificationId === notification.id ? 'NOVA!' : 'Nova'}
                        </motion.span>
                      )}
                    </div>
                    {notification.link && (
                      <a
                        href={notification.link}
                        className="text-xs text-[var(--color-1)] hover:text-[var(--color-2)] mt-2 inline-block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Ver detalhes →
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Loading indicator */}
        {loadingMore && (
          <div className="p-4 text-center text-[var(--color-muted)]">
            <IoRefresh size={24} className="mx-auto mb-2 text-[var(--color-muted)] animate-spin" />
            <p className="text-sm">Carregando mais...</p>
          </div>
        )}
        
        {/* End of list */}
        {!hasMore && notifications.length > 0 && (
          <div className="p-4 text-center text-[var(--color-muted)]">
            <p className="text-sm">Todas as notificações foram carregadas</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[var(--color-2)]/20 bg-[var(--color-dark)]/50">
        <div className="flex gap-2">
          <NotificationTestButton />
          {activeTab === 'unread' && unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3 py-2 bg-[var(--color-1)]/20 text-[var(--color-1)] text-sm font-medium rounded-lg hover:bg-[var(--color-1)]/30 transition-colors flex items-center justify-center gap-2 flex-1 cursor-pointer"
            >
              <IoCheckmarkDone size={16} />
              Marcar todas como lidas
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationDropdown;