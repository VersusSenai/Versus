import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../api';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);

  // buscar notificações iniciais
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setCurrentPage(1);
      setHasMore(true);
      
      if (socketRef.current?.connected) {
        socketRef.current.emit('reload_notifications');
        return;
      }

      const response = await api.get('/notification?page=1&limit=30');
      const { data, pagination } = response.data;
      
      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.read).length);
      setTotalCount(pagination?.total || 0);
      setHasMore((data || []).length === 30);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      setNotifications([]);
      setUnreadCount(0);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // carregar mais notificações
  const loadMoreNotifications = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      
      const response = await api.get(`/notification?page=${nextPage}&limit=30`);
      const { data } = response.data;
      
      if (data?.length > 0) {
        setNotifications(prev => [...prev, ...data]);
        setCurrentPage(nextPage);
        setHasMore(data.length === 30);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erro ao carregar mais notificações:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // marcar como lida
  const markAsRead = async (notificationId) => {
    try {
      if (socketRef.current?.connected) {
        socketRef.current.emit('mark_as_read', notificationId);
        return;
      }

      await api.patch(`/notification/read/${notificationId}`);
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  // marcar todas como lidas
  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      
      for (const id of unreadIds) {
        await api.patch(`/notification/read/${id}`);
      }
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // conectar websocket
    const connectSocket = () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      socketRef.current = io(api.defaults.baseURL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        timeout: 5000,
        forceNew: true
      });

      socketRef.current.on('connect', () => setSocketConnected(true));
      socketRef.current.on('disconnect', () => setSocketConnected(false));
      socketRef.current.on('connect_error', () => setSocketConnected(false));

      socketRef.current.on('notifications', (data) => {
        if (Array.isArray(data)) {
          setNotifications(data);
          setUnreadCount(data.filter(n => !n.read).length);
          setCurrentPage(1);
          setHasMore(data.length === 30);
        }
      });

      socketRef.current.on('total_count', (total) => {
        setTotalCount(total);
      });

      socketRef.current.on('new_notification', (newNotification) => {
        setNotifications(prev => {
          const exists = prev.some(n => n.id === newNotification.id);
          return exists ? prev : [newNotification, ...prev];
        });
        
        if (!newNotification.read) {
          setUnreadCount(prev => prev + 1);
        }
        setTotalCount(prev => prev + 1);
      });
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const value = {
    notifications,
    unreadCount,
    totalCount,
    loading,
    loadingMore,
    hasMore,
    socketConnected,
    fetchNotifications,
    loadMoreNotifications,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};