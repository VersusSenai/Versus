import { Card } from '@/components/ui/card';
import teamPhoto from '@/assets/team.jpeg';
import { TeamProps } from '@/types';

export type TeamCardProps = {
  team: TeamProps;
};

export const TeamsCardsPage = ({ team }: TeamCardProps) => {
  return (
    <Card className="flex bg-[var(--color-dark)] text-white border border-white/10 shadow-md relative flex-col gap-2 p-4">
      <img src={teamPhoto} alt={team?.name} className="w-full h-32 object-cover mb-2 rounded" />
      <h2 className="text-xl font-bold">{team?.name}</h2>
      <p>{team?.description}</p>
      <p>Cadastrado em: {new Date(team?.registered_date).toLocaleDateString()}</p>
    </Card>
  );
};
