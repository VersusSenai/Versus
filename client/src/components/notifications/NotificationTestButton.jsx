import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoAdd, IoCheckmark } from 'react-icons/io5';
import api from '../../api';
import { useNotifications } from '../../hooks/useNotifications';

const NotificationTestButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { fetchNotifications } = useNotifications();

  const createTestNotification = async () => {
    try {
      setIsLoading(true);
      setSuccess(false);
      
      const response = await api.post('/notification/test');
      
      if (response.status === 200) {
        setSuccess(true);
        // websocket atualiza automaticamente
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Erro ao criar notificação de teste:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={success ? { 
        scale: [1, 1.05, 1],
        boxShadow: [
          "0 0 0 0 rgba(34, 197, 94, 0)",
          "0 0 0 8px rgba(34, 197, 94, 0.1)",
          "0 0 0 0 rgba(34, 197, 94, 0)"
        ]
      } : {}}
      transition={{ duration: 0.4 }}
      onClick={createTestNotification}
      disabled={isLoading}
              className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                success
                  ? 'bg-green-500 text-white shadow-lg cursor-pointer'
                  : isLoading
                  ? 'bg-[var(--color-muted)] text-white cursor-not-allowed'
                  : 'bg-[var(--color-2)] hover:bg-[var(--color-1)] text-white hover:shadow-md cursor-pointer'
              }`}
    >
      {isLoading ? (
        <>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          />
          <span>Criando...</span>
        </>
      ) : success ? (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <IoCheckmark size={16} />
          </motion.div>
          <span>Criada!</span>
        </>
      ) : (
        <>
          <IoAdd size={16} />
          <span>Criar Notificação de Teste</span>
        </>
      )}
    </motion.button>
  );
};

export default NotificationTestButton;
