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
import { formatDate } from '../../utils/formatDate';
import ProfessionalBracket from '@/components/Bracket';
import { Calendar, Users, Lock, Trophy, UserCheck, UserX, Swords } from 'lucide-react';

export default function TournamentDialog({
  event,
  children,
  dialogOpen,
  setDialogOpen,
  user,
  userInscriptions,
  eventMatches,
  loadingMatches,
  handleSubscribe,
  handleUnsubscribe,
  eventStatus,
  fetchEvents,
}) {
  const isInscribed = userInscriptions[event.id];
  const hasMatches = eventMatches.length > 0;

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="p-0 bg-[var(--color-dark)] text-white rounded-2xl border border-white/10 max-w-[95vw] lg:max-w-[85vw] max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 lg:p-6 border-b border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl lg:text-3xl font-bold mb-2">{event.name}</DialogTitle>
            <DialogDescription className="text-white/70 text-sm lg:text-base">
              {event.description || 'Sem descrição disponível'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <Calendar className="text-[var(--color-1)]" size={16} />
              <div className="text-xs">
                <div className="text-white/50 text-[10px]">Início</div>
                <div className="font-medium">{formatDate(event.startDate)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <Users className="text-[var(--color-2)]" size={16} />
              <div className="text-xs">
                <div className="text-white/50 text-[10px]">Máximo</div>
                <div className="font-medium">{event.maxPlayers}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <Trophy className="text-yellow-400" size={16} />
              <div className="text-xs">
                <div className="text-white/50 text-[10px]">Tipo</div>
                <div className="font-medium">{event.multiplayer ? 'Multi' : 'Solo'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <Lock className={event.private ? 'text-purple-400' : 'text-green-400'} size={16} />
              <div className="text-xs">
                <div className="text-white/50 text-[10px]">Acesso</div>
                <div className="font-medium">{event.private ? 'Privado' : 'Público'}</div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[var(--color-1)]/20 to-[var(--color-2)]/20 border border-[var(--color-1)]/30">
              <div className="w-2 h-2 rounded-full bg-[var(--color-1)] animate-pulse" />
              <span className="text-xs font-semibold">{eventStatus}</span>
            </div>
          </div>
        </div>

        <div className="px-4 lg:px-6 py-3 bg-white/5 border-b border-white/10">
          <div className="flex flex-wrap gap-2">
            {isInscribed ? (
              <Button
                onClick={() => handleUnsubscribe(event.id)}
                size="sm"
                className="bg-slate-700 hover:bg-slate-600 text-white text-xs"
              >
                <UserX size={14} className="mr-1" />
                Cancelar Inscrição
              </Button>
            ) : (
              <Button
                onClick={() => handleSubscribe(event.id)}
                size="sm"
                className="bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] hover:opacity-90 text-white text-xs"
              >
                <UserCheck size={14} className="mr-1" />
                Inscrever-se
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {loadingMatches ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-[var(--color-1)] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-white/70">Carregando chaves...</p>
              </div>
            </div>
          ) : hasMatches ? (
            <div className="bg-[#0a0118]/50 rounded-xl border border-white/10 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                <Swords className="text-[var(--color-1)]" size={18} />
                <h3 className="text-base font-bold">Bracket do Torneio</h3>
              </div>
              <ProfessionalBracket eventId={event.id} multiplayer={event.multiplayer} />
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Trophy className="mx-auto text-white/20 mb-4" size={64} />
                <h3 className="text-xl font-bold text-white mb-2">Bracket não disponível</h3>
                <p className="text-white/50 text-sm">
                  O bracket será gerado quando o torneio iniciar
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
