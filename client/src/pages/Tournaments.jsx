import React, { useEffect, useState } from 'react';
import api from '../api';
import ProfessionalBracket from '../components/Bracket';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import defaultTournamentImage from '../assets/solo.jpg';
import { useDeleteEvent } from '@/hooks/useDeleteEvent';
import CustomDialog from '@/components/CustomDialog';

const formatDate = (iso) => new Date(iso).toLocaleString();

const Tag = ({ children }) => (
  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 mb-2 px-3 py-1 rounded-full select-none">
    {children}
  </span>
);

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

  // Função que determina o status do evento
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

      // Para cada evento, pegar detalhes completos e nome do vencedor
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
            return {
              ...eventDetail,
              winnerName,
            };
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
          {filteredEvents.map((event) => {
            const isInscribed = userInscriptions[event.id];
            const matches = eventMatchesMap[event.id] || [];
            const hasMatches = matches.length > 0;
            const winnerName = event.winnerName;
            const eventStatus = getEventStatus(event, winnerName);

            return (
              <Dialog
                key={event.id}
                open={selectedEvent?.id === event.id && dialogOpen}
                onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (open) setSelectedEvent(event);
                  else setSelectedEvent(null);
                }}
              >
                <DialogTrigger asChild>
                  <Card className="cursor-pointer pt-0 hover:shadow-lg transition-shadow flex flex-col bg-[var(--color-dark)] text-white border border-white/10 rounded-2xl shadow-md">
                    <img
                      src={defaultTournamentImage}
                      alt="Imagem do torneio"
                      className="w-full object-cover rounded-t-2xl"
                    />
                    <CardHeader className="pt-4 px-4">
                      <CardTitle>{event.name}</CardTitle>
                      <CardDescription className="text-white/70">
                        {event.description || 'Sem descrição'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto px-4 pb-4">
                      <p>
                        <strong>Status Inscrição: </strong>
                        {isInscribed ? (
                          <span className="text-green-400 font-semibold">Inscrito</span>
                        ) : (
                          <span className="text-red-400 font-semibold">Não inscrito</span>
                        )}
                      </p>
                      {hasMatches && (
                        <p className="mt-1 text-sm text-white/50">Bracket disponível</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Tag>Modo: {event.multiplayer ? 'Multiplayer' : 'Singleplayer'}</Tag>
                        <Tag>Início: {formatDate(event.startDate)}</Tag>
                        <Tag>Fim: {formatDate(event.endDate)}</Tag>
                        <Tag>Máx. Jogadores: {event.maxPlayers}</Tag>
                        <Tag>Status Evento: {eventStatus}</Tag>
                        {winnerName && <Tag>🏆 Vencedor: {winnerName}</Tag>}
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>

                <DialogContent
                  className="p-6 bg-[var(--color-dark)] text-white rounded-2xl border border-white/20"
                  style={{
                    maxWidth: '65vw',
                    maxHeight: '90vh',
                    overflow: 'auto',
                  }}
                >
                  <DialogHeader>
                    <DialogTitle>{event.name}</DialogTitle>
                    <DialogDescription className="mb-4 block text-white/80">
                      {event.description || 'Nenhuma descrição disponível.'}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Tag>Modo: {event.multiplayer ? 'Multiplayer' : 'Singleplayer'}</Tag>
                    <Tag>Início: {formatDate(event.startDate)}</Tag>
                    <Tag>Fim: {formatDate(event.endDate)}</Tag>
                    <Tag>Máximo Jogadores: {event.maxPlayers}</Tag>
                    <Tag>Status Evento: {eventStatus}</Tag>
                  </div>

                  <div className="flex gap-2 flex-wrap mb-4">
                    {isInscribed ? (
                      <Button
                        className="text-red-200 bg-red-500"
                        onClick={() => handleUnsubscribe(event.id)}
                      >
                        Cancelar Inscrição
                      </Button>
                    ) : (
                      <Button
                        className="text-green-200 bg-green-500"
                        onClick={() => handleSubscribe(event.id)}
                      >
                        Inscrever-se
                      </Button>
                    )}

                    {user && (user.role === 'A' || user.role === 'O') && (
                      <Button variant="secondary" onClick={() => handleStartEvent(event.id)}>
                        Iniciar Torneio
                      </Button>
                    )}
                    {user && (user.role === 'A' || user.role === 'O') && (
                      <CustomDialog
                        open={deleteDialogOpen}
                        setOpen={setDeleteDialogOpen}
                        title="Atenção!"
                        description="Você tem certeza que deseja apagar este torneio? Esta ação não pode ser desfeita."
                        submitText={deleting ? 'Apagando...' : 'Apagar'}
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleDeleteConfirm(event.id);
                        }}
                        triggerButton={
                          <Button
                            className="text-red-200 bg-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteDialogOpen(true);
                            }}
                          >
                            Apagar Torneio
                          </Button>
                        }
                      />
                    )}
                  </div>

                  {hasMatches ? (
                    <div
                      className="border-none rounded p-4 bg-[var(--color-dark)]"
                      style={{
                        overflowX: 'auto',
                        maxWidth: '100%',
                        maxHeight: '50vh',
                      }}
                    >
                      <ProfessionalBracket eventId={event.id} multiplayer={event.multiplayer} />
                    </div>
                  ) : (
                    <p className="text-center text-white/50">Bracket não disponível ainda.</p>
                  )}
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      )}
    </div>
  );
}
