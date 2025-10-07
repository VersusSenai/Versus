import React, { useEffect, useState } from 'react';
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
import { formatDate } from '../../utils/formatDate';

export default function Tournaments() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInscriptions, setUserInscriptions] = useState({});
  const [eventMatchesMap, setEventMatchesMap] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filterInscribedOnly, setFilterInscribedOnly] = useState(false);
  const [filterMode, setFilterMode] = useState('all');

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

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsResponse = await api.get('/event');

      const eventsWithDetails = await Promise.all(
        eventsResponse.data[0].map(async (ev) => {
          try {
            const detailRes = await api.get(`/event/${ev.id}`);
            const eventDetail = detailRes.data;
            let winnerName = null;
            if (eventDetail.winnerUserId) {
              try {
                const userRes = await api.get(`/user/${eventDetail.winnerUserId}`);
                winnerName = userRes.data.username;
              } catch {
                winnerName = null;
              }
            }
            return { ...eventDetail, winnerName };
          } catch {
            return ev;
          }
        })
      );

      setEvents(eventsWithDetails);

      const inscriptionsResponse = await api.get('/event/inscriptions/me');
      const userEventIds = new Set(inscriptionsResponse.data.map((i) => i.event.id));
      const inscriptionsMap = {};
      const matchesMap = {};

      for (const event of eventsWithDetails) {
        inscriptionsMap[event.id] = userEventIds.has(event.id);
        try {
          const matchResponse = await api.get(`/event/${event.id}/match`);
          matchesMap[event.id] = matchResponse.data || [];
        } catch {
          matchesMap[event.id] = [];
        }
      }

      setUserInscriptions(inscriptionsMap);
      setEventMatchesMap(matchesMap);
    } catch {
      toast.error('Falha ao buscar torneios ou inscrições');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleStartEvent = async (eventId) => {
    try {
      await api.post(`/event/${eventId}/start`);
      toast.success('Evento iniciado!');
      await fetchEvents();
      setDialogOpen(false);
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
    if (filterMode === 'multiplayer' && !event.multiplayer) return false;
    if (filterMode === 'singleplayer' && event.multiplayer) return false;
    return true;
  });

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
              <SelectItem value="multiplayer">Multiplayer</SelectItem>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <TournamentDialog
              key={event.id}
              event={event}
              dialogOpen={selectedEvent?.id === event.id}
              setDialogOpen={(open) => setSelectedEvent(open ? event : null)}
              user={user}
              userInscriptions={userInscriptions}
              eventMatches={eventMatchesMap[event.id] || []}
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
      )}
    </div>
  );
}
