import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import TournamentCard from './TournamentCard';
import TournamentDialog from './TournamentDialog';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useDeleteEvent } from '@/hooks/useDeleteEvent';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Tournaments() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInscriptions, setUserInscriptions] = useState({});
  const [eventMatchesMap, setEventMatchesMap] = useState({});
  const [loadingMatches, setLoadingMatches] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filterInscribedOnly, setFilterInscribedOnly] = useState(false);
  const [filterMode, setFilterMode] = useState(searchParams.get('mode') || 'all');
  const [hasTeam, setHasTeam] = useState(false);

  // Paginação - inicializar com valores da URL
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [paginationInfo, setPaginationInfo] = useState({
    isFirstPage: true,
    isLastPage: true,
    currentPage: 1,
    previousPage: null,
    nextPage: null,
  });
  const [totalEvents, setTotalEvents] = useState(0);
  const [itemsPerPage] = useState(parseInt(searchParams.get('limit')) || 9);

  const user = useSelector((state) => state.user.user);
  const { deleteEvent, loading: deleting, error: deleteError } = useDeleteEvent();

  const handleDeleteConfirm = async (eventId) => {
    const success = await deleteEvent(eventId);
    if (success) {
      toast.success('Torneio apagado com sucesso!');
      await fetchEvents();
      setDeleteDialogOpen(false);
    } else {
      toast.error(deleteError);
    }
  };

  const getEventStatus = (event, winnerName) => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (winnerName) return 'Finalizado';
    if (now < start) return 'Não iniciado';
    if (now >= start && now <= end) return 'Em andamento';
    if (now > end) return 'Finalizado';
    return 'Status desconhecido';
  };

  const checkUserTeams = async () => {
    if (!user?.id) return;

    try {
      const response = await api.get(`/team/getByUserId/${user.id}`);
      setHasTeam(response.data && response.data.length > 0);
    } catch (err) {
      console.error('Erro ao verificar times do usuário:', err);
      setHasTeam(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', itemsPerPage);

      if (filterMode === 'multiplayer') {
        params.append('multiplayer', 'true');
      } else if (filterMode === 'singleplayer') {
        params.append('multiplayer', 'false');
      } else if (!hasTeam && user?.role !== 'A') {
        params.append('multiplayer', 'false');
      }

      const eventsResponse = await api.get(`/event?${params.toString()}`);
      const allEvents = eventsResponse.data[0] || [];
      const pagination = eventsResponse.data[1] || {};

      // Atualizar paginação com os campos corretos do backend
      setPaginationInfo({
        isFirstPage: pagination.isFirstPage ?? true,
        isLastPage: pagination.isLastPage ?? true,
        currentPage: pagination.currentPage || currentPage,
        previousPage: pagination.previousPage || null,
        nextPage: pagination.nextPage || null,
      });

      setTotalEvents(pagination.total || allEvents.length);

      const inscriptionsResponse = await api.get('/event/inscriptions/me');
      const userEventIds = new Set(inscriptionsResponse.data.map((event) => event.id));

      // Buscar winnerName apenas para eventos que têm winnerUserId
      const eventsWithWinnerNames = await Promise.all(
        allEvents.map(async (ev) => {
          let winnerName = null;

          if (ev.winnerUserId) {
            try {
              const userRes = await api.get(`/user/${ev.winnerUserId}`);
              winnerName = userRes.data.username;
            } catch {
              winnerName = null;
            }
          }

          return { ...ev, winnerName };
        })
      );

      const inscriptionsMap = {};
      for (const event of eventsWithWinnerNames) {
        inscriptionsMap[event.id] = userEventIds.has(event.id);
      }

      setEvents(eventsWithWinnerNames);
      setUserInscriptions(inscriptionsMap);
    } catch (err) {
      console.error(err);
      toast.error('Falha ao buscar torneios ou inscrições');
    } finally {
      setLoading(false);
    }
  };

  const fetchEventMatches = async (eventId) => {
    if (eventMatchesMap[eventId]) {
      return; // Já carregado
    }

    setLoadingMatches((prev) => ({ ...prev, [eventId]: true }));
    try {
      const matchResponse = await api.get(`/event/${eventId}/match`);
      setEventMatchesMap((prev) => ({ ...prev, [eventId]: matchResponse.data || [] }));
    } catch (err) {
      console.error('Erro ao buscar matches:', err);
      setEventMatchesMap((prev) => ({ ...prev, [eventId]: [] }));
    } finally {
      setLoadingMatches((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  useEffect(() => {
    if (user?.id) {
      checkUserTeams();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterMode]);

  const handleStartEvent = async (eventId) => {
    try {
      await api.post(`/event/${eventId}/start`);
      toast.success('Evento iniciado!');
      await fetchEvents();
      setSelectedEvent(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Falha ao iniciar evento');
    }
  };

  const handleSubscribe = async (eventId) => {
    try {
      await api.post(`/event/${eventId}/inscribe`);
      toast.success('Inscrição realizada!');
      await fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Falha ao inscrever');
    }
  };

  const handleUnsubscribe = async (eventId) => {
    try {
      await api.post(`/event/${eventId}/unsubscribe`);
      toast.success('Inscrição cancelada!');
      await fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Falha ao cancelar inscrição');
    }
  };

  const filteredEvents = events.filter((event) => {
    if (filterInscribedOnly && !userInscriptions[event.id]) return false;
    return true;
  });

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);

    // Atualizar URL
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', pageNumber);
    newParams.set('limit', itemsPerPage);
    if (filterMode !== 'all') {
      newParams.set('mode', filterMode);
    } else {
      newParams.delete('mode');
    }
    setSearchParams(newParams);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (paginationInfo.previousPage) {
      handlePageChange(paginationInfo.previousPage);
    }
  };

  const handleNextPage = () => {
    if (paginationInfo.nextPage) {
      handlePageChange(paginationInfo.nextPage);
    }
  };

  // Resetar para página 1 quando os filtros mudarem
  useEffect(() => {
    if (currentPage !== 1) {
      handlePageChange(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterInscribedOnly, filterMode]);

  const indexOfFirstItem = (paginationInfo.currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(paginationInfo.currentPage * itemsPerPage, totalEvents);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-4xl font-bold mb-8 text-center text-white">Torneios Disponíveis</h2>

      <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8 text-white">
        <div className="flex items-center gap-2">
          <Label htmlFor="filterInscribed">Mostrar só inscritos</Label>
          <Switch
            id="filterInscribed"
            checked={filterInscribedOnly}
            onCheckedChange={setFilterInscribedOnly}
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="filterMode">Filtrar por modo:</Label>
          <Select value={filterMode} onValueChange={setFilterMode}>
            <SelectTrigger className="w-[180px] bg-[var(--color-dark)] border-white/20 text-white">
              <SelectValue placeholder="Modo" />
            </SelectTrigger>
            <SelectContent className="bg-[var(--color-dark)] text-white border-white/20">
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="multiplayer" disabled={user?.role !== 'A' && !hasTeam}>
                Multiplayer {user?.role !== 'A' && !hasTeam && '(Precisa de time)'}
              </SelectItem>
              <SelectItem value="singleplayer">Singleplayer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-white/80">Carregando torneios...</p>
      ) : filteredEvents.length === 0 ? (
        <p className="text-center text-white/80">Nenhum torneio encontrado.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {filteredEvents.map((event) => (
              <TournamentDialog
                key={event.id}
                event={event}
                dialogOpen={selectedEvent?.id === event.id}
                setDialogOpen={(open) => {
                  if (open) {
                    setSelectedEvent(event);
                    fetchEventMatches(event.id);
                  } else {
                    setSelectedEvent(null);
                  }
                }}
                user={user}
                userInscriptions={userInscriptions}
                eventMatches={eventMatchesMap[event.id] || []}
                loadingMatches={loadingMatches[event.id] || false}
                handleSubscribe={handleSubscribe}
                handleUnsubscribe={handleUnsubscribe}
                handleStartEvent={handleStartEvent}
                handleDeleteConfirm={handleDeleteConfirm}
                deleting={deleting}
                deleteDialogOpen={deleteDialogOpen}
                setDeleteDialogOpen={setDeleteDialogOpen}
                eventStatus={getEventStatus(event, event.winnerName)}
                winnerName={event.winnerName}
                fetchEvents={fetchEvents}
              >
                <TournamentCard
                  event={event}
                  isInscribed={userInscriptions[event.id]}
                  eventStatus={getEventStatus(event, event.winnerName)}
                  winnerName={event.winnerName}
                  matches={eventMatchesMap[event.id] || []}
                />
              </TournamentDialog>
            ))}
          </div>

          {/* Info da paginação */}
          <div className="text-center mt-4 mb-2 text-white/60 text-sm">
            Mostrando {indexOfFirstItem} - {indexOfLastItem} de {totalEvents} torneios
            <br />
            <span className="text-white/40 text-xs">(Página {paginationInfo.currentPage})</span>
          </div>

          {/* Paginação - mostrar se não for a primeira E última página ao mesmo tempo */}
          {!(paginationInfo.isFirstPage && paginationInfo.isLastPage) && (
            <div className="flex items-center justify-center gap-2 mt-4 mb-8">
              <Button
                onClick={handlePrevPage}
                disabled={paginationInfo.isFirstPage || !paginationInfo.previousPage}
                variant="outline"
                size="icon"
                className="bg-[var(--color-dark)] border-white/20 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex gap-2 items-center">
                {paginationInfo.previousPage && (
                  <Button
                    onClick={() => handlePageChange(paginationInfo.previousPage)}
                    variant="outline"
                    size="icon"
                    className="bg-[var(--color-dark)] border-white/20 text-white hover:bg-white/10"
                  >
                    {paginationInfo.previousPage}
                  </Button>
                )}

                <Button
                  variant="default"
                  size="icon"
                  className="bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] text-white border-none"
                >
                  {paginationInfo.currentPage}
                </Button>

                {paginationInfo.nextPage && (
                  <Button
                    onClick={() => handlePageChange(paginationInfo.nextPage)}
                    variant="outline"
                    size="icon"
                    className="bg-[var(--color-dark)] border-white/20 text-white hover:bg-white/10"
                  >
                    {paginationInfo.nextPage}
                  </Button>
                )}
              </div>

              <Button
                onClick={handleNextPage}
                disabled={paginationInfo.isLastPage || !paginationInfo.nextPage}
                variant="outline"
                size="icon"
                className="bg-[var(--color-dark)] border-white/20 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
