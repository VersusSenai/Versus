import { useState, useEffect } from 'react';
import { TeamsCardsPage } from '../components/TeamsCards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useWindowSize } from 'react-use';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer';
import { useTeamsPageContext } from '@/context/useTeamPageContext';

export const Teams = () => {
  const {
    fetchTeams,
    refreshTeams,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    teams,
    setTeams,
    loading,
    responseData,
    selectedTeam,
    setSelectedTeam,
  } = useTeamsPageContext();
  const [isDialogCreateOpen, setIsDialogCreateOpen] = useState(false);
  const [isDialogEditOpen, setIsDialogEditOpen] = useState(false);
  const { width } = useWindowSize();

  const handleFetchTeams = () => {
    fetchTeams();
  };

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filteredTeams = teams.filter((team) =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setTeams(filteredTeams);
    } else {
      refreshTeams();
    }
  }, [searchTerm]);

  const createTeamSchema = z.object({
    name: z
      .string('O nome do time deve ter pelo menos 3 caracteres')
      .min(3, 'O nome do time deve ter pelo menos 3 caracteres'),
    description: z
      .string('A descrição deve ter pelo menos 10 caracteres')
      .min(10, 'A descrição deve ter pelo menos 10 caracteres'),
    private: z.boolean().optional().default(false),
    // photo: z.url('A foto deve ser uma URL válida').optional(), // A ser implementado no futuro
  });

  const createTeamForm = useForm({
    resolver: zodResolver(createTeamSchema),
  });

  async function onCreateSubmit(data: z.infer<typeof createTeamSchema>) {
    const response = await api.post('/team', data);
    console.log(response.data);
  }

  const editTeamSchema = z.object({
    name: z
      .string('O nome do time deve ter pelo menos 3 caracteres')
      .min(3, 'O nome do time deve ter pelo menos 3 caracteres'),
    description: z
      .string('A descrição deve ter pelo menos 10 caracteres')
      .min(10, 'A descrição deve ter pelo menos 10 caracteres'),
    private: z.boolean().optional().default(false),
    // photo: z.url('A foto deve ser uma URL válida').optional(), // A ser implementado no futuro
  });

  const editTeamForm = useForm({
    resolver: zodResolver(editTeamSchema),
  });

  async function onEditSubmit(data: z.infer<typeof editTeamSchema>) {
    if (!selectedTeam) return;
    console.log('Edit data submitted:', data);
    try {
      const response = await api.put(`/team/${selectedTeam.id}`, data);
      console.log(response.data);
    } catch (error) {
      console.error('Error updating team:', error);
    } finally {
      setSelectedTeam(null);
      setIsDialogEditOpen(false);
      refreshTeams();
    }
  }

  useEffect(() => {
    if (selectedTeam) {
      editTeamForm.setValue('name', selectedTeam.name);
      editTeamForm.setValue('description', selectedTeam.description);
      editTeamForm.setValue('private', selectedTeam.private);
      // editTeamForm.setValue('photo', selectedTeam.photo); // A ser implementado no futuro
      setIsDialogEditOpen(true);
    } else {
      editTeamForm.reset();
    }
  }, [selectedTeam]);
  
  return (
    <>
      <div className="flex flex-col max-h-screen h-screen p-4 gap-2">
        <div className="flex items-start content-start self-start justify-between w-full">
          <Input
            type="text"
            placeholder="Buscar time..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleFetchTeams();
              }
            }}
            className="w-1/3 text-background placeholder:text-background/60"
          />
          <Button variant="default" size="sm" onClick={() => setIsDialogCreateOpen(true)}>
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
        ) : teams.length > 0 ? (
          <div className="grid flex-1 items-start grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 content-start justify-self-center w-full max-h-full overflow-auto flex-wrap gap-2">
            {teams.map((team) => (
              <TeamsCardsPage team={team} key={team.id} />
            ))}
          </div>
        ) : (
          <div className="grid my-auto self-center items-center bg-dark text-background justify-items-center border border-1 p-4 rounded-md shadow">
            <h2 className="text-xl">Nenhum time encontrado</h2>
          </div>
        )}
        <div className="flex self-center gap-2">
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

      {/* Dialog para criar novo time */}
      {width >= 768 ? (
        <Dialog open={isDialogCreateOpen} onOpenChange={() => setIsDialogCreateOpen(false)}>
          <DialogContent>
            <DialogTitle>Criar novo time</DialogTitle>
            <DialogDescription>Crie seu time para começar a competir!</DialogDescription>
            <Form {...createTeamForm}>
              <form
                onSubmit={createTeamForm.handleSubmit((data) => onCreateSubmit(data))}
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
      ) : (
        <Drawer open={isDialogCreateOpen} onOpenChange={() => setIsDialogCreateOpen(false)}>
          <DrawerContent className="p-4">
            <DrawerTitle>Criar novo time</DrawerTitle>
            <DrawerDescription>Crie seu time para começar a competir!</DrawerDescription>
            <Form {...createTeamForm}>
              <form
                onSubmit={createTeamForm.handleSubmit((data) => onCreateSubmit(data))}
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
          </DrawerContent>
        </Drawer>
      )}

      {/* Dialog para editar time */}
      {width >= 768 ? (
        <Dialog
          open={isDialogEditOpen}
          onOpenChange={() => {
            setSelectedTeam(null);
            setIsDialogEditOpen(false);
          }}
        >
          <DialogContent>
            <DialogTitle>Atualizar</DialogTitle>
            <DialogDescription>Atualize os dados do time</DialogDescription>
            <Form {...editTeamForm}>
              <form
                onSubmit={editTeamForm.handleSubmit((data) => onEditSubmit(data))}
                className="grid gap-2"
              >
                <FormField
                  control={editTeamForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Nome do time</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          type='text'
                          placeholder="Nome do time"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editTeamForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="description">Descrição</FormLabel>
                      <FormControl>
                        <Input
                          id="description"
                          type='text'
                          placeholder="Descrição"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editTeamForm.control}
                  name="private"
                  render={({ field }) => (
                    <FormItem className="grid">
                      <FormLabel htmlFor="private">Privado</FormLabel>
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
                <Button type="submit">Atualizar</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer
          open={isDialogEditOpen}
          onOpenChange={() => {
            setSelectedTeam(null);
            setIsDialogEditOpen(false);
          }}
        >
          <DrawerContent className="p-4">
            <DrawerTitle>Atualizar</DrawerTitle>
            <DrawerDescription>Atualize os dados do time</DrawerDescription>
            <Form {...editTeamForm}>
              <form
                onSubmit={editTeamForm.handleSubmit((data) => onEditSubmit(data))}
                className="grid gap-2"
              >
                <FormField
                  control={editTeamForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Nome do time</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          placeholder="Nome do time"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editTeamForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="description">Descrição</FormLabel>
                      <FormControl>
                        <Input
                          id="description"
                          placeholder="Descrição"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editTeamForm.control}
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
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
