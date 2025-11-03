import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Tag from '@/components/tournaments/Tag';
import defaultTournamentImage from '../../assets/solo.jpg';
import { formatDate } from '../../utils/formatDate';

export default function TournamentCard({
  event,
  isInscribed,
  eventStatus,
  winnerName,
  matches,
  ...props
}) {
  const hasMatches = matches.length > 0;

  // Status badge helper
  const getStatusBadge = () => {
    if (eventStatus === 'Finalizado') {
      return (
        <div className="px-3 py-1.5 rounded-lg bg-slate-700">
          <span className="text-white text-xs font-semibold">Finalizado</span>
        </div>
      );
    }
    if (eventStatus === 'Em andamento') {
      return (
        <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)]">
          <span className="text-white text-xs font-semibold">Em Andamento</span>
        </div>
      );
    }
    return (
      <div className="px-3 py-1.5 rounded-lg bg-slate-600">
        <span className="text-white text-xs font-semibold">Aguardando</span>
      </div>
    );
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all flex flex-col bg-[var(--color-dark)]/80 text-white border border-white/10 rounded-2xl shadow-md select-none group hover:border-[var(--color-1)]/50"
      {...props}
    >
      <div className="relative w-full h-48 overflow-hidden rounded-t-2xl bg-gray-800">
        <img
          src={event.thumbnail ? event.thumbnail : defaultTournamentImage}
          alt="Imagem do torneio"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-transparent to-transparent" />

        {/* Status Badge */}
        {!winnerName && <div className="absolute top-3 right-3">{getStatusBadge()}</div>}

        {/* Private Badge */}
        {event.private && (
          <div className="absolute top-3 left-3">
            <div className="px-3 py-1.5 rounded-lg bg-purple-600/90 backdrop-blur-sm">
              <span className="text-white text-xs font-semibold">PRIVADO</span>
            </div>
          </div>
        )}

        {/* Winner Badge */}
        {winnerName && (
          <div className="absolute top-3 right-3">
            <div className="px-3 py-1.5 rounded-lg bg-yellow-500/90 backdrop-blur-sm">
              <span className="text-white text-xs font-semibold">🏆 {winnerName}</span>
            </div>
          </div>
        )}
      </div>

      <CardHeader className="pt-4 px-4">
        <CardTitle className="text-xl font-bold">{event.name}</CardTitle>
        <CardDescription className="text-white/70">
          {event.description || 'Sem descrição'}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-auto px-4 pb-4 space-y-3">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/50">Inscrições</span>
            <span className="text-white font-medium">
              {event.eventInscriptions?.filter((i) => i.role === 'P').length || 0} /{' '}
              {event.maxPlayers}
            </span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              style={{
                width: `${((event.eventInscriptions?.filter((i) => i.role === 'P').length || 0) / event.maxPlayers) * 100}%`,
              }}
              className="h-full bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] rounded-full transition-all duration-500"
            />
          </div>
        </div>

        {/* Status de Inscrição */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/50">Status:</span>
          {isInscribed ? (
            <span className="text-green-400 font-semibold text-sm">Inscrito ✓</span>
          ) : (
            <span className="text-white/50 font-semibold text-sm">Não inscrito</span>
          )}
        </div>

        {hasMatches && <p className="text-sm text-blue-400">⚔️ Bracket disponível</p>}

        <div className="flex flex-wrap gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[var(--color-1)]/20 to-[var(--color-2)]/20 border border-[var(--color-1)]/30 text-white font-semibold">
            {event.multiplayer ? 'Multiplayer' : 'Singleplayer'}
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[var(--color-1)]/20 to-[var(--color-2)]/20 border border-[var(--color-1)]/30 text-white font-semibold">
            Início: {formatDate(event.startDate)}
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[var(--color-1)]/20 to-[var(--color-2)]/20 border border-[var(--color-1)]/30 text-white font-semibold">
            Máx: {event.maxPlayers}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
