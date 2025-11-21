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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '../../api';
import { toast } from 'react-toastify';
import { UserMinus, Users, Shield, Crown, Loader2, UserPlus, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InscriptionsDialog({ open, onOpenChange, tournament }) {
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [inviting, setInviting] = useState(false);

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

  const handleSearchUsers = async () => {
    if (!searchTerm.trim()) {
      toast.error('Digite um nome ou email para buscar');
      return;
    }

    try {
      setSearching(true);
      const response = await api.get('/user', {
        params: {
          search: searchTerm,
        },
      });

      // Filtra usuários já inscritos
      const inscribedUserIds = inscriptions.map((i) => i.user.id);
      const availableUsers = (response.data[0] || response.data.data || response.data || []).filter(
        (user) => !inscribedUserIds.includes(user.id)
      );

      setSearchResults(availableUsers);

      if (availableUsers.length === 0) {
        toast.info('Nenhum usuário disponível encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Erro ao buscar usuários');
    } finally {
      setSearching(false);
    }
  };

  const handleInviteUser = async (userId) => {
    try {
      setInviting(true);
      await api.post(`/event/${tournament.id}/invite`, {
        id: userId,
      });
      toast.success('Convite enviado com sucesso!');
      setInviteDialogOpen(false);
      setSearchTerm('');
      setSearchResults([]);
    } catch (error) {
      console.error('Erro ao enviar convite:', error);
      toast.error(error.response?.data?.message || 'Erro ao enviar convite');
    } finally {
      setInviting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[var(--color-dark)] border-white/20 text-white max-w-2xl max-h-[80vh]">
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
                    <div className="flex items-center gap-3 flex-1">
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

                    {inscription.role !== 'O' && (
                      <Button
                        onClick={() => handleRemoveInscription(inscription.user.id)}
                        disabled={removingId === inscription.user.id || tournament?.status !== 'P'}
                        size="sm"
                        variant="destructive"
                        className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white border-0 shadow-md hover:shadow-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title={
                          tournament?.status !== 'P'
                            ? 'Não é possível remover após o torneio iniciar'
                            : 'Remover participante'
                        }
                      >
                        {removingId === inscription.user.id ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <>
                            <UserMinus size={16} className="mr-1" />
                            Expulsar
                          </>
                        )}
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-white/10 gap-3">
            <div className="text-sm text-white/60">
              <span className="font-semibold text-white">{inscriptions.length}</span> de{' '}
              <span className="font-semibold text-white">{tournament?.maxPlayers}</span> vagas
              preenchidas
            </div>
            <div className="flex gap-2">
              {tournament?.status === 'P' && (
                <Button
                  onClick={() => setInviteDialogOpen(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white"
                >
                  <UserPlus size={16} className="mr-2" />
                  Convidar
                </Button>
              )}
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] hover:opacity-90"
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para convidar jogadores */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="bg-[var(--color-dark)] border-white/20 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <UserPlus className="text-green-500" />
              Convidar Jogador
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Busque e convide jogadores para {tournament?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="search" className="text-white/80 mb-2 block">
                  Nome ou Email do Jogador
                </Label>
                <Input
                  id="search"
                  placeholder="Digite o nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchUsers()}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <Button
                onClick={handleSearchUsers}
                disabled={searching}
                className="bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] hover:opacity-90 mt-7"
              >
                {searching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <ScrollArea className="max-h-[300px] pr-4">
                <div className="space-y-2">
                  {searchResults.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 bg-gradient-to-br from-[var(--color-1)] to-[var(--color-2)]">
                          <div className="w-full h-full flex items-center justify-center text-white font-bold">
                            {user.username?.charAt(0).toUpperCase() || '?'}
                          </div>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-white">{user.username}</p>
                          <p className="text-sm text-white/50">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleInviteUser(user.id)}
                        disabled={inviting}
                        size="sm"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white"
                      >
                        {inviting ? (
                          <Loader2 className="animate-spin" size={14} />
                        ) : (
                          <>
                            <UserPlus size={14} className="mr-1" />
                            Convidar
                          </>
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <Button
              onClick={() => {
                setInviteDialogOpen(false);
                setSearchTerm('');
                setSearchResults([]);
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
