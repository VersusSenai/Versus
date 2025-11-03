import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import api from '../../api';
import { toast } from 'react-toastify';
import { UserMinus, Users, Shield, Crown, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InscriptionsDialog({ open, onOpenChange, tournament }) {
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (open && tournament) {
      fetchInscriptions();
    }
  }, [open, tournament]);

  const fetchInscriptions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/event/${tournament.id}/inscriptions`);
      setInscriptions(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar inscrições:', error);
      toast.error('Erro ao carregar inscrições');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveInscription = async (userId) => {
    if (!window.confirm('Tem certeza que deseja remover este participante?')) {
      return;
    }

    try {
      setRemovingId(userId);
      await api.delete(`/event/${tournament.id}/unsubscribe/${userId}`);
      toast.success('Participante removido com sucesso!');
      fetchInscriptions();
    } catch (error) {
      console.error('Erro ao remover inscrição:', error);
      toast.error(error.response?.data?.message || 'Erro ao remover participante');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="bg-[var(--color-dark)] border-white/20 text-white max-w-2xl max-h-[80vh]"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Users className="text-[var(--color-1)]" />
            Participantes Inscritos
          </DialogTitle>
          <DialogDescription className="text-white/60">
            {tournament?.name} • {inscriptions.length} inscritos
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-[var(--color-1)]" size={40} />
          </div>
        ) : inscriptions.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto mb-4 text-white/20" size={60} />
            <p className="text-white/60">Nenhum participante inscrito ainda</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-3">
              {inscriptions.map((inscription, index) => (
                <motion.div
                  key={inscription.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 bg-gradient-to-br from-[var(--color-1)] to-[var(--color-2)]">
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                          {inscription.user?.username?.charAt(0).toUpperCase() || '?'}
                        </div>
                      </Avatar>
                      {inscription.role === 'O' && (
                        <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full p-1 shadow-lg shadow-yellow-500/50 border border-yellow-300/30">
                          <Crown size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <p className="font-semibold text-white flex items-center gap-2">
                        {inscription.user?.username || 'Usuário desconhecido'}
                        {inscription.role === 'O' && (
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/30">
                            Organizador
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-white/50">{inscription.user?.email}</p>
                    </div>
                  </div>

                  {inscription.role !== 'O' && tournament?.status === 'P' && (
                    <Button
                      onClick={() => handleRemoveInscription(inscription.user.id)}
                      disabled={removingId === inscription.user.id}
                      size="sm"
                      className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white border-0 shadow-md hover:shadow-red-500/50 transition-all"
                    >
                      {removingId === inscription.user.id ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <UserMinus size={16} />
                      )}
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <div className="text-sm text-white/60">
            <span className="font-semibold text-white">{inscriptions.length}</span> de{' '}
            <span className="font-semibold text-white">{tournament?.maxPlayers}</span> vagas preenchidas
          </div>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] hover:opacity-90"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
