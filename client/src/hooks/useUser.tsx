import { useEffect, useState } from 'react';
import api from '../api';

export const useUser = () => {
  const [user, setUser] = useState<{ id: string; username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.warn('Nenhum ID encontrado no localStorage');
        setLoading(false);
        return;
      }

      const response = await api.get(`/user/${userId}`);
      setUser(response.data);
      console.log('GET /user/{id} response:', response.data);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, refetch: fetchUser };
};
