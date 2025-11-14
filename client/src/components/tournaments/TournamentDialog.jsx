import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { formatDate } from '../../utils/formatDate';
import ProfessionalBracket from '@/components/Bracket';
import { Calendar, Users, Lock, Trophy, UserCheck, UserX, Swords, Info } from 'lucide-react';

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
  const isOwner = event.userRole === 'O';

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="p-0 bg-[var(--color-dark)] text-white rounded-xl border border-white/10 max-w-[90vw] w-[1200px] max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header Section - Compact */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-1">{event.name}</DialogTitle>
            <DialogDescription className="text-white/60 text-sm line-clamp-1">
              {event.description || 'Sem descrição disponível'}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="info" className="flex-1 flex flex-col min-h-0">
          <div className="px-4 pt-3 pb-0 bg-white/5 border-b border-white/10">
            <TabsList className="bg-transparent border border-white/10 p-1 h-auto">
              <TabsTrigger
                value="info"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--color-1)] data-[state=active]:to-[var(--color-2)] data-[state=active]:text-white text-white/70 gap-2"
              >
                <Info size={16} />
                Informações
              </TabsTrigger>
              <TabsTrigger
                value="bracket"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--color-1)] data-[state=active]:to-[var(--color-2)] data-[state=active]:text-white text-white/70 gap-2"
              >
                <Swords size={16} />
                Bracket
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Info Tab Content */}
          <TabsContent value="info" className="flex-1 overflow-auto p-6 mt-0">
            <div className="space-y-6">
              {/* Info Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="flex flex-col gap-2 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[var(--color-1)]/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-[var(--color-1)]" size={18} />
                    <span className="text-white/50 text-xs">Data de Início</span>
                  </div>
                  <span className="font-semibold text-white">{formatDate(event.startDate)}</span>
                </div>

                <div className="flex flex-col gap-2 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[var(--color-2)]/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <Users className="text-[var(--color-2)]" size={18} />
                    <span className="text-white/50 text-xs">Jogadores</span>
                  </div>
                  <span className="font-semibold text-white">{event.maxPlayers} máximo</span>
                </div>

                <div className="flex flex-col gap-2 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-yellow-400/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <Trophy className="text-yellow-400" size={18} />
                    <span className="text-white/50 text-xs">Tipo</span>
                  </div>
                  <span className="font-semibold text-white">
                    {event.multiplayer ? 'Multiplayer' : 'Solo'}
                  </span>
                </div>

                <div className="flex flex-col gap-2 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-purple-400/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <Lock
                      className={event.private ? 'text-purple-400' : 'text-green-400'}
                      size={18}
                    />
                    <span className="text-white/50 text-xs">Acesso</span>
                  </div>
                  <span className="font-semibold text-white">
                    {event.private ? 'Privado' : 'Público'}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[var(--color-1)]/10 to-[var(--color-2)]/10 border border-[var(--color-1)]/20">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[var(--color-1)] animate-pulse shadow-lg shadow-[var(--color-1)]/50" />
                  <div>
                    <span className="text-xs text-white/60 block">Status do Torneio</span>
                    <span className="text-sm font-bold text-white">{eventStatus}</span>
                  </div>
                </div>

                {/* Action Button */}
                {isOwner ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                    <span className="text-xl">👑</span>
                    <span className="text-yellow-400 font-bold text-sm">Você é o Dono</span>
                  </div>
                ) : isInscribed ? (
                  <Button
                    onClick={() => handleUnsubscribe(event.id)}
                    size="sm"
                    className="bg-slate-700 hover:bg-slate-600 text-white"
                  >
                    <UserX size={16} className="mr-2" />
                    Cancelar Inscrição
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSubscribe(event.id)}
                    size="sm"
                    className="bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] hover:opacity-90 text-white"
                  >
                    <UserCheck size={16} className="mr-2" />
                    Inscrever-se
                  </Button>
                )}
              </div>

              {/* Description Section */}
              {event.description && (
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Info size={16} className="text-[var(--color-1)]" />
                    Descrição do Torneio
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">{event.description}</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Bracket Tab Content */}
          <TabsContent
            value="bracket"
            className="flex-1 overflow-hidden p-4 mt-0 flex flex-col min-h-0"
          >
            {loadingMatches ? (
              <div className="flex items-center justify-center flex-1">
                <div className="text-center">
                  <div className="inline-block w-12 h-12 border-4 border-[var(--color-1)] border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-white/70">Carregando chaves...</p>
                </div>
              </div>
            ) : hasMatches ? (
              <div className="bg-[#0a0118]/50 rounded-lg border border-white/10 overflow-hidden flex-1 flex flex-col">
                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                  <Swords className="text-[var(--color-1)]" size={18} />
                  <h3 className="text-base font-bold">Bracket do Torneio</h3>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ProfessionalBracket eventId={event.id} multiplayer={event.multiplayer} />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center flex-1">
                <div className="text-center">
                  <Trophy className="mx-auto text-white/20 mb-4" size={64} />
                  <h3 className="text-xl font-bold text-white mb-2">Bracket não disponível</h3>
                  <p className="text-white/50 text-sm">
                    O bracket será gerado quando o torneio iniciar
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
