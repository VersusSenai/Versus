import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '../../api';
import { toast } from 'react-toastify';
import { 
  Calendar, 
  Users, 
  Trophy, 
  MapPin, 
  Clock,
  Loader2,
  Info,
  Gamepad2,
  Lock,
  Unlock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '../../utils/formatDate';
import defaultTournamentImage from '../../assets/solo.jpg';

export default function TournamentDetailsDialog({ open, onOpenChange, tournament }) {
  const [details, setDetails] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && tournament) {
      fetchDetails();
    }
  }, [open, tournament]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const [detailsResponse, matchesResponse] = await Promise.all([
        api.get(`/event/${tournament.id}`),
        api.get(`/match/event/${tournament.id}`).catch(() => ({ data: [] }))
      ]);
      
      setDetails(detailsResponse.data);
      setMatches(matchesResponse.data || []);
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
      toast.error('Erro ao carregar detalhes do torneio');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      P: 'text-yellow-400',
      O: 'text-green-400',
      E: 'text-gray-400'
    };
    return colors[status] || 'text-white';
  };

  const getStatusLabel = (status) => {
    const labels = {
      P: 'Pendente',
      O: 'Em Andamento',
      E: 'Finalizado'
    };
    return labels[status] || 'Desconhecido';
  };

  if (!tournament) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="bg-[var(--color-dark)] border-white/20 text-white max-w-4xl max-h-[85vh] overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-[var(--color-1)]" size={50} />
          </div>
        ) : details ? (
          <div className="space-y-4">
            {/* Header with Image */}
            <div className="relative w-full h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
              <img
                src={details.thumbnail || defaultTournamentImage}
                alt={details.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-[var(--color-dark)]/50 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-3xl font-bold text-white mb-2">{details.name}</h2>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${getStatusColor(details.status)}`}>
                    {getStatusLabel(details.status)}
                  </span>
                  {details.private ? (
                    <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 shadow-md text-white text-sm flex items-center gap-2 font-semibold border border-purple-400/40">
                      <Lock size={14} />
                      Privado
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 shadow-md text-white text-sm flex items-center gap-2 font-semibold border border-emerald-400/40">
                      <Unlock size={14} />
                      Público
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-white/10 p-1 rounded-xl">
                <TabsTrigger 
                  value="info" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--color-1)] data-[state=active]:to-[var(--color-2)] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  <Info size={16} className="mr-2" />
                  Informações
                </TabsTrigger>
                <TabsTrigger 
                  value="matches" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--color-1)] data-[state=active]:to-[var(--color-2)] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  <Gamepad2 size={16} className="mr-2" />
                  Partidas ({matches.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="stats" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--color-1)] data-[state=active]:to-[var(--color-2)] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  <Trophy size={16} className="mr-2" />
                  Estatísticas
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[400px] mt-4">
                <TabsContent value="info" className="space-y-4 pr-4">
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-sm text-white/60 mb-1">Descrição</p>
                      <p className="text-white">{details.description || 'Sem descrição'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--color-1)]/20 to-[var(--color-2)]/20 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="text-[var(--color-1)]" size={20} />
                          <p className="text-sm text-white/60">Data de Início</p>
                        </div>
                        <p className="text-white font-semibold">{formatDate(details.startDate)}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--color-1)]/20 to-[var(--color-2)]/20 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="text-[var(--color-2)]" size={20} />
                          <p className="text-sm text-white/60">Data de Término</p>
                        </div>
                        <p className="text-white font-semibold">{formatDate(details.endDate)}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="text-blue-400" size={20} />
                          <p className="text-sm text-white/60">Máximo de Jogadores</p>
                        </div>
                        <p className="text-white font-semibold">{details.maxPlayers}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Gamepad2 className="text-purple-400" size={20} />
                          <p className="text-sm text-white/60">Modo</p>
                        </div>
                        <p className="text-white font-semibold">
                          {details.multiplayer ? 'Multiplayer' : 'Singleplayer'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="text-yellow-400" size={20} />
                        <p className="text-sm text-white/60">Modelo do Torneio</p>
                      </div>
                      <p className="text-white font-semibold">
                        {details.model === 'P' ? 'Pontos' : 'Eliminatória'}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="matches" className="pr-4">
                  {matches.length === 0 ? (
                    <div className="text-center py-12">
                      <Gamepad2 className="mx-auto mb-4 text-white/20" size={60} />
                      <p className="text-white/60">Nenhuma partida gerada ainda</p>
                      <p className="text-white/40 text-sm mt-2">
                        As partidas serão criadas quando o torneio for iniciado
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {matches.map((match, index) => (
                        <motion.div
                          key={match.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-white/60 mb-2">Partida #{index + 1}</p>
                              <div className="flex items-center gap-3">
                                <span className="text-white font-semibold">
                                  {match.firstUser?.username || match.firstTeam?.name || 'TBD'}
                                </span>
                                <span className="text-white/40">vs</span>
                                <span className="text-white font-semibold">
                                  {match.secondUser?.username || match.secondTeam?.name || 'TBD'}
                                </span>
                              </div>
                            </div>
                            {match.winnerId && (
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-600 to-amber-600 shadow-md border border-yellow-400/30">
                                <Trophy size={16} className="text-white" />
                                <span className="text-sm font-semibold text-white">Vencedor definido</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="stats" className="pr-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-white/10">
                        <p className="text-sm text-white/60 mb-2">Total de Inscritos</p>
                        <p className="text-3xl font-bold text-white">
                          {details.eventInscriptions?.length || 0}
                        </p>
                      </div>

                      <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10">
                        <p className="text-sm text-white/60 mb-2">Vagas Restantes</p>
                        <p className="text-3xl font-bold text-white">
                          {details.maxPlayers - (details.eventInscriptions?.length || 0)}
                        </p>
                      </div>

                      <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10">
                        <p className="text-sm text-white/60 mb-2">Partidas Criadas</p>
                        <p className="text-3xl font-bold text-white">{matches.length}</p>
                      </div>

                      <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-white/10">
                        <p className="text-sm text-white/60 mb-2">Taxa de Ocupação</p>
                        <p className="text-3xl font-bold text-white">
                          {Math.round(((details.eventInscriptions?.length || 0) / details.maxPlayers) * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] hover:opacity-90"
              >
                Fechar
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
