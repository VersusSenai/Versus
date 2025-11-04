import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Tag from '@/components/tournaments/Tag';
import InscriptionsDialog from '@/components/manageTournaments/InscriptionsDialog';
import TournamentDetailsDialog from '@/components/manageTournaments/TournamentDetailsDialog';
import EditTournamentDialog from '@/components/manageTournaments/EditTournamentDialog';
import defaultTournamentImage from '../assets/solo.jpg';
import { formatDate } from '../utils/formatDate';
import {
  Edit,
  Trash2,
  Users,
  Play,
  Trophy,
  Calendar,
  Eye,
  UserPlus,
  Award,
  Filter,
  Search,
  X,
} from 'lucide-react';

export default function ManageTournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [inscriptionsDialogOpen, setInscriptionsDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    fetchMyTournaments();
  }, []);

  const fetchMyTournaments = async () => {
    try {
      setLoading(true);
      // Buscar eventos onde o usuário é organizador (role='O')
      const response = await api.get('/event/inscriptions/me?role=O');
      setTournaments(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar torneios:', error);
      toast.error('Erro ao carregar seus torneios');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTournament = async (tournamentId) => {
    if (!window.confirm('Tem certeza que deseja excluir este torneio?')) {
      return;
    }

    try {
      await api.delete(`/event/${tournamentId}`);
      toast.success('Torneio excluído com sucesso!');
      fetchMyTournaments();
    } catch (error) {
      console.error('Erro ao excluir torneio:', error);
      toast.error(error.response?.data?.message || 'Erro ao excluir torneio');
    }
  };

  const handleStartTournament = async (tournamentId) => {
    if (!window.confirm('Tem certeza que deseja iniciar este torneio?')) {
      return;
    }

    try {
      await api.post(`/event/${tournamentId}/start`);
      toast.success('Torneio iniciado com sucesso!');
      fetchMyTournaments();
    } catch (error) {
      console.error('Erro ao iniciar torneio:', error);
      toast.error(error.response?.data?.message || 'Erro ao iniciar torneio');
    }
  };

  const handleViewInscriptions = (tournament) => {
    setSelectedTournament(tournament);
    setInscriptionsDialogOpen(true);
  };

  const handleViewDetails = (tournament) => {
    setSelectedTournament(tournament);
    setDetailsDialogOpen(true);
  };

  const handleEditTournament = (tournament) => {
    setSelectedTournament(tournament);
    setEditDialogOpen(true);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      P: { label: 'Pendente', color: 'bg-slate-600' },
      O: {
        label: 'Em Andamento',
        color: 'bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)]',
      },
      E: { label: 'Finalizado', color: 'bg-slate-700' },
    };

    const statusInfo = statusMap[status] || statusMap.P;

    return (
      <div className={`px-3 py-1.5 rounded-lg ${statusInfo.color}`}>
        <span className="text-white text-xs font-semibold">{statusInfo.label}</span>
      </div>
    );
  };

  const getTournamentStats = (tournament) => {
    const inscriptions = tournament.eventInscriptions?.filter((i) => i.role === 'P') || [];
    const inscriptionCount = inscriptions.length;

    return {
      inscriptionCount,
      maxPlayers: tournament.maxPlayers,
      progress: (inscriptionCount / tournament.maxPlayers) * 100,
    };
  };

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesStatus = filterStatus === 'all' || tournament.status === filterStatus;
    const matchesSearch =
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0118] via-[var(--color-dark)] to-[#0a0118]">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 border-4 rounded-full mx-auto mb-4"
            style={{
              borderColor: 'var(--color-1)',
              borderTopColor: 'transparent',
              boxShadow: '0 0 30px rgba(92, 75, 245, 0.3)',
            }}
          />
          <p className="text-white/60 text-lg">Carregando torneios...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[var(--color-dark)] to-[#0a0118]">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Title and Create Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Trophy className="text-[var(--color-1)]" size={32} />
                Meus Torneios
              </h1>
              <p className="text-white/60 text-sm">
                {tournaments.length}{' '}
                {tournaments.length === 1 ? 'torneio criado' : 'torneios criados'}
              </p>
            </div>
            <Button
              onClick={() => navigate('/createTournaments')}
              className="bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] text-white hover:opacity-90 transition-all px-6 py-3 rounded-lg font-medium"
            >
              <UserPlus className="mr-2" size={18} />
              Criar Torneio
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar torneios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-[var(--color-dark)]/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--color-1)]/50 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 bg-[var(--color-dark)]/50 border border-white/10 rounded-lg p-1">
              {[
                { label: 'Todos', value: 'all', icon: Filter },
                { label: 'Pendentes', value: 'P', icon: Calendar },
                { label: 'Ativos', value: 'O', icon: Play },
                { label: 'Finalizados', value: 'E', icon: Award },
              ].map(({ label, value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setFilterStatus(value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${
                    filterStatus === value
                      ? 'bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tournament Cards */}
        <AnimatePresence mode="wait">
          {filteredTournaments.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <Trophy className="mx-auto text-white/20 mb-4" size={64} />
              <h3 className="text-2xl font-bold text-white mb-2">
                {searchTerm || filterStatus !== 'all'
                  ? 'Nenhum resultado encontrado'
                  : 'Nenhum torneio criado'}
              </h3>
              <p className="text-white/50 mb-6">
                {searchTerm || filterStatus !== 'all'
                  ? 'Tente ajustar seus filtros'
                  : 'Comece criando seu primeiro torneio!'}
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button
                  onClick={() => navigate('/createTournaments')}
                  className="bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] text-white hover:opacity-90 px-6 py-3 rounded-lg"
                >
                  <UserPlus className="mr-2" size={18} />
                  Criar Torneio
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTournaments.map((tournament, index) => {
                const stats = getTournamentStats(tournament);

                return (
                  <motion.div
                    key={tournament.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-[var(--color-dark)]/80 border border-white/10 rounded-2xl overflow-hidden hover:border-[var(--color-1)]/50 transition-all hover:shadow-lg group">
                      {/* Tournament Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={tournament.thumbnail || defaultTournamentImage}
                          alt={tournament.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-transparent to-transparent" />

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          {getStatusBadge(tournament.status)}
                        </div>

                        {/* Private Badge */}
                        {tournament.private && (
                          <div className="absolute top-3 left-3">
                            <div className="px-3 py-1.5 rounded-lg bg-purple-600/90 backdrop-blur-sm">
                              <span className="text-white text-xs font-semibold">PRIVADO</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <CardHeader className="pt-4 px-4">
                        <CardTitle className="text-xl text-white font-bold">
                          {tournament.name}
                        </CardTitle>
                        <CardDescription className="text-white/70 text-sm line-clamp-2">
                          {tournament.description || 'Sem descrição'}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="px-4 pb-4 space-y-3">
                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-white/50">Inscrições</span>
                            <span className="text-white font-medium">
                              {stats.inscriptionCount} / {stats.maxPlayers}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${stats.progress}%` }}
                              transition={{ duration: 0.8, delay: index * 0.05 }}
                              className="h-full bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] rounded-full"
                            />
                          </div>
                        </div>

                        {/* Info Tags */}
                        <div className="flex flex-wrap gap-2 text-xs">
                          <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[var(--color-1)]/20 to-[var(--color-2)]/20 border border-[var(--color-1)]/30 text-white font-semibold">
                            {tournament.multiplayer ? 'Multiplayer' : 'Singleplayer'}
                          </div>
                          <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[var(--color-1)]/20 to-[var(--color-2)]/20 border border-[var(--color-1)]/30 text-white font-semibold flex items-center gap-1.5">
                            <Calendar size={12} />
                            {formatDate(tournament.startDate)}
                          </div>
                          <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[var(--color-1)]/20 to-[var(--color-2)]/20 border border-[var(--color-1)]/30 text-white font-semibold">
                            Máx: {tournament.maxPlayers}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <Button
                            onClick={() => handleViewInscriptions(tournament)}
                            size="sm"
                            className="bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] hover:opacity-90 text-white text-xs"
                          >
                            <Users size={14} className="mr-1" />
                            Inscritos
                          </Button>

                          {tournament.status === 'P' && (
                            <>
                              <Button
                                onClick={() => handleEditTournament(tournament)}
                                size="sm"
                                className="bg-slate-700 hover:bg-slate-600 text-white text-xs"
                              >
                                <Edit size={14} className="mr-1" />
                                Editar
                              </Button>

                              <Button
                                onClick={() => handleStartTournament(tournament.id)}
                                size="sm"
                                className="bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] hover:opacity-90 text-white disabled:opacity-50 text-xs"
                                disabled={stats.inscriptionCount < 2}
                                title={stats.inscriptionCount < 2 ? 'Mínimo 2 inscritos' : ''}
                              >
                                <Play size={14} className="mr-1" />
                                Iniciar
                              </Button>

                              <Button
                                onClick={() => handleDeleteTournament(tournament.id)}
                                size="sm"
                                className="bg-slate-700 hover:bg-slate-600 text-white text-xs"
                              >
                                <Trash2 size={14} className="mr-1" />
                                Excluir
                              </Button>
                            </>
                          )}

                          {(tournament.status === 'O' || tournament.status === 'E') && (
                            <Button
                              onClick={() => handleViewDetails(tournament)}
                              size="sm"
                              className="bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] hover:opacity-90 text-white col-span-2 text-xs"
                            >
                              <Eye size={14} className="mr-1" />
                              Ver Detalhes
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dialogs */}
      <InscriptionsDialog
        open={inscriptionsDialogOpen}
        onOpenChange={setInscriptionsDialogOpen}
        tournament={selectedTournament}
      />

      <TournamentDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        tournament={selectedTournament}
      />

      <EditTournamentDialog
        event={selectedTournament}
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        onUpdated={fetchMyTournaments}
      />
    </div>
  );
}
