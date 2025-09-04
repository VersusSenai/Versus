import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';

export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await api.delete('/user');

      if (response.status === 200 || response.status === 204) {
        toast.success('Conta excluída com sucesso!');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        toast.error(response.message || 'Erro ao excluir conta!');
      }
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      toast.error(error.response?.data?.message || 'Erro ao conectar ao servidor!');
    }
    setLoading(false);
  };

  return { handleDelete, loading };
}
