import { useState, useEffect } from 'react';
import { TeamsCardsPage } from '../components/TeamsCardsPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResponseGetTeams, TeamProps } from '@/types';
import api from '@/api';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@/components/ui/switch';

export const Teams = () => {
  const [teams, setTeams] = useState<TeamProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [responseData, setResponseData] = useState<ResponseGetTeams | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await api.get('/team', {
        params: {
          page: currentPage,
          limit: 9,
          search: searchTerm || undefined, // Envia o termo de busca apenas se não estiver vazio
        },
      });
      console.log(response.data);
      setResponseData(response.data);
      setTeams(response.data[0]);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTeams = () => {
    fetchTeams();
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    searchTerm.length > 0
      ? setTeams((prevTeams) =>
          prevTeams.filter((team) => team.name.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : fetchTeams();
  }, [searchTerm]);

  const createTeamSchema = z.object({
    name: z.string().min(3, 'O nome do time deve ter pelo menos 3 caracteres'),
    description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
    private: z.boolean().optional().default(false),
    // photo: z.url('A foto deve ser uma URL válida').optional(), // A ser implementado no futuro
  });

  const createTeamForm = useForm({
    resolver: zodResolver(createTeamSchema),
  });

  async function onSubmit(data: z.infer<typeof createTeamSchema>) {
    const response = await api.post('/team', data);
    console.log(response.data);
  }

  return (
    <>
      <div className="grid h-screen w-full">
        <div className="flex flex-1 justify-between">
          <Input
            type="text"
            placeholder="Buscar time..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleFetchTeams();
              }
            }}
            className="m-4 w-1/3 text-background placeholder:text-background/60"
          />
          <Button className="m-4" variant="default" size="sm" onClick={() => setIsDialogOpen(true)}>
            Criar novo time
          </Button>
        </div>
        {loading ? (
          <div className="flex text-white items-center justify-center h-full">
            <div className="border p-6 rounded shadow bg-gray-800 flex flex-col items-center">
              <div className="animate-spin rounded-full  h-8 w-8 border-b-[2px] border-white mb-4"></div>
              <span>Carregando times...</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap self-start gap-2">
            {teams.length > 0 ? (
              teams.map((team) => <TeamsCardsPage team={team} key={team.id} />)
            ) : (
              <div className="mx-auto bg-dark text-background justify-items-center border border-1 p-4 m-2 rounded-md shadow">
                <h2 className="text-xl">Nenhum time encontrado</h2>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-1 self-end justify-center gap-2 m-4">
          <Button
            disabled={responseData?.[1].isFirstPage}
            onClick={() => setCurrentPage(responseData?.[1].previousPage ?? currentPage - 1)}
          >
            Anterior
          </Button>
          <Button disabled>Página {currentPage}</Button>
          <Button
            disabled={responseData?.[1].isLastPage}
            onClick={() => setCurrentPage(responseData?.[1].nextPage ?? currentPage + 1)}
          >
            Próximo
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
        <DialogContent>
          <DialogTitle>Criar novo time</DialogTitle>
          <DialogDescription>Funcionalidade de criar time ainda não implementada</DialogDescription>
          <Form {...createTeamForm}>
            <form
              onSubmit={createTeamForm.handleSubmit((data) => onSubmit(data))}
              className="grid gap-2"
            >
              <FormField
                control={createTeamForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Nome do time</FormLabel>
                    <FormControl>
                      <Input id="name" placeholder="Nome do time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createTeamForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="description">Descrição</FormLabel>
                    <FormControl>
                      <Input id="description" placeholder="Descrição" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createTeamForm.control}
                name="private"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="private">Privado</FormLabel>
                    <FormDescription>Marque aqui para que o time seja privado</FormDescription>
                    <FormControl>
                      <Switch
                        className="m-0"
                        id="private"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Criar time</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
