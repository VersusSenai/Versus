import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Tag from './Tag';
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

  return (
    <Card
      className="cursor-pointer pt-0 hover:shadow-lg transition-shadow flex flex-col bg-[var(--color-dark)] text-white border border-white/10 rounded-2xl shadow-md select-none"
      {...props}
    >
      <div className="w-full h-48 overflow-hidden rounded-t-2xl bg-gray-800">
        <img
          src={event.thumbnail ? event.thumbnail : defaultTournamentImage}
          alt="Imagem do torneio"
          className="w-full h-full object-cover"
        />
      </div>
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
        {hasMatches && <p className="mt-1 text-sm text-white/50">Bracket disponível</p>}
        <div className="mt-2 flex flex-wrap gap-2">
          <Tag>Modo: {event.multiplayer ? 'Multiplayer' : 'Singleplayer'}</Tag>
          <Tag>Início: {formatDate(event.startDate)}</Tag>
          <Tag>Fim: {formatDate(event.endDate)}</Tag>
          <Tag>Máx. Jogadores: {event.maxPlayers}</Tag>
          <Tag>Status Evento: {eventStatus}</Tag>
          <Tag>Privado: {event.private === true ? 'Sim' : 'Não'}</Tag>
          {winnerName && <Tag>🏆 Vencedor: {winnerName}</Tag>}
        </div>
      </CardContent>
    </Card>
  );
}
