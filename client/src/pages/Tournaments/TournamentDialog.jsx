import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Tag from './Tag';
import { formatDate } from '../../utils/formatDate';
import CustomDialog from '@/components/CustomDialog';
import ProfessionalBracket from '@/components/Bracket';
import EditTournamentDialog from './EditTournamentDialog';
import InvitePlayersDialog from './InviteDialog';
import InscriptionsDialog from './InscriptionDialog/InscriptionDialog';

export default function TournamentDialog({
  event,
  children, // <- o card vem como children
  dialogOpen,
  setDialogOpen,
  user,
  userInscriptions,
  eventMatches,
  loadingMatches,
  handleSubscribe,
  handleUnsubscribe,
  handleStartEvent,
  handleDeleteConfirm,
  deleting,
  deleteDialogOpen,
  setDeleteDialogOpen,
  eventStatus,
  fetchEvents,
}) {
  const isInscribed = userInscriptions[event.id];
  const hasMatches = eventMatches.length > 0;
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleUpdateTournament = async () => {
    await fetchEvents();
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
      {/* Aqui o card aparece e funciona como trigger */}
      <DialogTrigger asChild>{children}</DialogTrigger>

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
          <Tag>Privado: {event.private === true ? 'Sim' : 'Não'}</Tag>
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          {isInscribed ? (
            <Button className="text-red-200 bg-red-500" onClick={() => handleUnsubscribe(event.id)}>
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

          {user && (user.role === 'A' || user.role === 'O') && (
            <>
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditDialogOpen(true);
                }}
              >
                Editar Torneio
              </Button>

              <EditTournamentDialog
                event={event}
                open={editDialogOpen}
                setOpen={setEditDialogOpen}
                onUpdated={handleUpdateTournament}
              />
            </>
          )}

          {user && (user.role === 'A' || user.role === 'O') && (
            <>
              <InvitePlayersDialog eventId={event.id} />
              <InscriptionsDialog eventId={event.id} />
            </>
          )}
        </div>

        {loadingMatches ? (
          <div className="text-center py-8">
            <p className="text-white/70">Carregando chaves do torneio...</p>
          </div>
        ) : hasMatches ? (
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
}
