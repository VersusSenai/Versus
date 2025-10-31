import { useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../api';
import { toast } from 'react-toastify';
import { login } from '../redux/userSlice';

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleUpdate = async (data: {
    username?: string;
    email?: string;
    image?: File | null | string;
  }) => {
    setLoading(true);
    try {
      // Criar FormData para suportar upload de arquivo
      const formData = new FormData();

      // Adicionar campos apenas se foram fornecidos
      if (data.username) {
        formData.append('username', data.username);
      }

      if (data.email) {
        formData.append('email', data.email);
      }

      if (data.image) {
        formData.append('image', data.image);
      }

      const response = await api.put('/user', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('PUT /user response:', response.data);
      toast.success('Dados atualizados com sucesso!');

      // Recarregar dados do usuário no Redux
      try {
        const userResponse = await api.get('/user/me', { withCredentials: true });
        dispatch(login(userResponse.data));
      } catch (err) {
        console.error('Erro ao recarregar dados do usuário:', err);
      }

      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar usuário!';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdate, loading };
};
