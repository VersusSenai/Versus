import { Card } from '@/components/ui/card';
import teamPhoto from '@/assets/team.jpeg';
import { TeamProps } from '@/types';
import { Button } from './ui/button';
import { Ban, Check, Edit2, Info, Users2, X } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { toast } from 'react-toastify';
import api from '@/api';
import { useTeamsPageContext } from '@/context/useTeamPageContext';

export type TeamCardProps = {
  team: TeamProps;
};

export const TeamsCardsPage = ({ team }: TeamCardProps) => {
  const { refreshTeams, setSelectedTeam } = useTeamsPageContext();

  async function handleBanTeam() {
    try {
      await api.delete(`/team/${team.id}`);
      console.log(`Time com ID ${team.id} banido com sucesso`);
      toast.success('Time banido com sucesso');
    } catch (error) {
      console.error(`Erro ao banir o time com ID ${team.id}:`, error);
      toast.error('Erro ao banir o time. Tente novamente.');
    } finally {
      refreshTeams();
    }
  }

  async function handleApproveTeam() {
    try {
      await api.post(`/team/approveTeam/${team.id}`);
      console.log(`Time com ID ${team.id} aprovado com sucesso`);
      toast.success('Time aprovado com sucesso');
    } catch (error) {
      console.error(`Erro ao aprovar o time com ID ${team.id}:`, error);
      toast.error('Erro ao aprovar o time. Tente novamente.');
    } finally {
      refreshTeams();
    }
  }

  return (
    <Card className="flex bg-[var(--color-dark)] text-white border border-white/10 shadow-md flex-col gap-2 p-4">
      <div className="relative w-full h-30 object-cover mb-2 rounded-md">
        {team.status === 'B' && (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Ban
                color="red"
                size={32}
                className="absolute top-0 right-0 rounded-tr-md rounded-bl-md bg-red-900/60 p-1"
              />
            </HoverCardTrigger>
            <HoverCardContent className="grid justify-items-center whitespace-nowrap w-min">
              Time banido
            </HoverCardContent>
          </HoverCard>
        )}
        {team.status === 'P' && (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Info
                color="orange"
                size={32}
                className=" absolute top-0 left-0 rounded-br-md rounded-tl-md bg-dark/60 p-1"
              />
            </HoverCardTrigger>
            <HoverCardContent className="grid justify-items-center whitespace-nowrap w-min">
              Pendente
            </HoverCardContent>
          </HoverCard>
        )}
        <img src={teamPhoto} alt={team?.name} className="w-full h-full object-cover rounded-md" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">{team?.name}</h2>
          <p className="text-sm text-gray-400">
            Cadastro: {new Date(team?.registeredDate).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <p className="text-sm text-gray-300">{team?.description}</p>
        <div className="flex justify-between items-center gap-2 mt-2">
          {team.status === 'P' && (
            <div className="flex gap-2">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button
                    size="icon"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleApproveTeam}
                  >
                    <Check />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="grid justify-items-center whitespace-nowrap w-min">
                  Aceitar
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button size="icon" variant="destructive" onClick={handleBanTeam}>
                    <X />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="grid justify-items-center whitespace-nowrap w-min">
                  Recusar
                </HoverCardContent>
              </HoverCard>
            </div>
          )}
          <div className="flex gap-2 ml-auto">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button size="icon">
                  <Users2 />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="grid justify-items-center whitespace-nowrap w-min">
                Membros
              </HoverCardContent>
            </HoverCard>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button size="icon" onClick={() => setSelectedTeam(team)}>
                  <Edit2 />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="grid justify-items-center whitespace-nowrap w-min">
                Editar
              </HoverCardContent>
            </HoverCard>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button size="icon" variant="destructive" onClick={handleBanTeam}>
                  <Ban />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="grid justify-items-center whitespace-nowrap w-min">
                Banir
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>
    </Card>
  );
};
