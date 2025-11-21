import { useState } from 'react';
import api from '../api';

export function useDeleteEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteEvent = async (eventId: string) => {
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/event/${eventId}`);
      setLoading(false);
      return true;
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Falha ao apagar o torneio');
      return false;
    }
  };

  return { deleteEvent, loading, error };
}
