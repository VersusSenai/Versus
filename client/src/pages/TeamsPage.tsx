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
import { TeamProps, TeamUserProps, UserProps } from '@/types';
import teamPhoto from '@/assets/team.jpeg';
import { Edit } from 'lucide-react';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import { HoverCardContent } from '@radix-ui/react-hover-card';
import { MdDeleteOutline, MdInfoOutline } from 'react-icons/md';

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
  const { width } = useWindowSize();
  const [isDialogCreateOpen, setIsDialogCreateOpen] = useState(false);
  const [isDialogEditOpen, setIsDialogEditOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}') as UserProps;
  const [pageView, setPageView] = useState<'list' | 'detail'>('detail');
  const [myTeam, setMyTeam] = useState<TeamProps | null>(null);
  const [myTeamUsers, setMyTeamUsers] = useState<TeamUserProps[]>([]);
  const [isDeleteTeamUserDialog, setIsDeleteTeamUserDialog] = useState(false);
  const [selectedTeamUser, setSelectedTeamUser] = useState<TeamUserProps | null>(null);

  const handleFetchTeams = () => {
    fetchTeams();
  };

  const getMyTeam = async () => {
    try {
      const response = await api.get(`/team/getByUserId/${user.id}`);
      setMyTeam(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching my team:', error);
      setMyTeam(null);
    }
  };

  const getMyTeamUsers = async (teamId: string) => {
    try {
      const response = await api.get(`/team/${teamId}/inscriptions`);
      setMyTeamUsers(response.data);
    } catch (error) {
      console.error('Error fetching my team users:', error);
      setMyTeamUsers([]);
    }
  };

  useEffect(() => {
    getMyTeam().then((team) => {
      getMyTeamUsers(team.id.toString()); // Toma a logica do malandro
    });
  }, []);

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
    image: z.file().optional(),
  });

  const createTeamForm = useForm({
    resolver: zodResolver(createTeamSchema),
  });

  async function onCreateSubmit(data: z.infer<typeof createTeamSchema>) {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('private', JSON.stringify(data.private));
    if (data.image) {
      formData.append('image', data.image);
    }
    try {
      await api.post('/team', formData);
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setIsDialogCreateOpen(false);
      createTeamForm.reset();
      getMyTeam();
      refreshTeams();
    }
  }

  const editTeamSchema = z.object({
    name: z
      .string('O nome do time deve ter pelo menos 3 caracteres')
      .min(3, 'O nome do time deve ter pelo menos 3 caracteres'),
    description: z
      .string('A descrição deve ter pelo menos 10 caracteres')
      .min(10, 'A descrição deve ter pelo menos 10 caracteres'),
    private: z.boolean().optional().default(false),
    image: z.file().optional(),
  });

  const editTeamForm = useForm({
    resolver: zodResolver(editTeamSchema),
  });

  async function onEditSubmit(data: z.infer<typeof editTeamSchema>) {
    if (!selectedTeam) return;
    try {
      await api.put(`/team/${selectedTeam.id}`, data);
    } catch (error) {
      console.error('Error updating team:', error);
    } finally {
      setSelectedTeam(null);
      setIsDialogEditOpen(false);
      editTeamForm.reset();
      if (pageView === 'detail') {
        getMyTeam();
      } else {
        refreshTeams();
      }
    }
  }

  async function handleDeleteTeamUser(teamId?: number) {
    if (!teamId || !selectedTeamUser) return;
    try {
      await api.post(`/team/${teamId}/unsubscribe/${selectedTeamUser?.id}`);
    } catch (error) {
      console.error('Error removing team user:', error);
    } finally {
      getMyTeamUsers(myTeam?.id.toString() || '');
      setIsDeleteTeamUserDialog(false);
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

  const ListTeamsView = () => {
    return (
      <>
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
      </>
    );
  };

  const TeamView = () => {
    return (
      <div className="bg-dark text-white p-4 rounded-md">
        <div className="flex justify-between gap-2 items-center">
          <h1 className="text-2xl mb-2">Detalhes do Time</h1>
          <span
            className={`inline-flex whitespace-nowrap items-center px-3 py-1 rounded-full text-sm font-medium ${
              myTeam?.private
                ? 'bg-red-900/20 text-red-300 border border-red-800'
                : 'bg-green-900/20 text-green-300 border border-green-800'
            }`}
          >
            {myTeam?.private ? '🔒 Privado' : '🌐 Público'}
          </span>
        </div>
        <div className="grid md:flex gap-6">
          <div className="flex-1 relative">
            <img
              src={teamPhoto}
              alt={myTeam?.name}
              className="w-full h-80 object-cover rounded-md"
            />
            <HoverCard>
              <HoverCardTrigger className="absolute top-2 right-2">
                <Edit className="w-8 h-8 rounded-md p-1 bg-1/30 hover:bg-1/20 text-gray-400 hover:text-gray-300 cursor-pointer duration-150" />
              </HoverCardTrigger>
              <HoverCardContent className="bg-dark text-white p-2 rounded shadow">
                Troca foto
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="grid flex-1">
            <div className="flex flex-col gap-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-300">Nome</h3>
                <p className="text-xl font-bold">{myTeam?.name || 'Carregando...'}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-300">Descrição</h3>
                <p className="text-base leading-relaxed">
                  {myTeam?.description || 'Carregando...'}
                </p>
              </div>
            </div>
            <Button
              className="mt-4 w-full self-end"
              variant="default"
              onClick={() => setSelectedTeam(myTeam)}
            >
              Editar
            </Button>
          </div>
        </div>
        <ul className="grid divide-y border-[1px] border-gray-800 mt-2 rounded-md">
          {myTeamUsers.map((teamUser) => {
            const isOwner = myTeamUsers.some(
              (teamUser) => teamUser.user.id === user.id && teamUser.role === 'O'
            );
            return (
              <li key={teamUser.id} className="flex justify-between py-2 px-4 border-gray-800">
                <p className="content-center h-9">
                  <b>{teamUser.id}</b> - {teamUser.user.username}
                  {teamUser.role === 'O' && ' - Dono'}
                  {user.id === teamUser.user.id && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900/20 text-blue-300 border border-blue-800">
                      Você
                    </span>
                  )}
                </p>
                <div className="flex gap-2">
                  {user.id !== teamUser.user.id && (
                    <HoverCard openDelay={100} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <Button variant="ghost" className="cursor-default" size="icon">
                          <MdInfoOutline />
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="bg-dark text-white p-2 rounded shadow">
                        <ul>
                          <li>
                            <b>ID usuário:</b> {teamUser.userId}
                          </li>
                          <li>
                            <b>Nome:</b> {teamUser.user.username}
                          </li>
                          <li>
                            <b>Email:</b> {teamUser.user.email}
                          </li>
                          <li>
                            <b>Função:</b> {teamUser.role === 'O' ? 'Dono' : 'Membro'}
                          </li>
                          <li>
                            <b>Status:</b> {teamUser.status === 'O' ? 'Ativo' : 'Banido'}
                          </li>
                          <li>
                            <b>Data de Inscrição:</b>{' '}
                            {new Date(teamUser.inscriptionDate).toLocaleDateString()}
                          </li>
                        </ul>
                      </HoverCardContent>
                    </HoverCard>
                  )}

                  {isOwner && user.id !== teamUser.user.id && (
                    <Button
                      onClick={() => {
                        setSelectedTeamUser(teamUser);
                        setIsDeleteTeamUserDialog(true);
                      }}
                      variant="destructive"
                      size="icon"
                    >
                      <MdDeleteOutline />
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col max-h-screen h-screen p-4 gap-2">
        <div className="flex items-start content-start self-start justify-between w-full">
          {pageView === 'list' ? (
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
          ) : null}
          <div className="flex flex-1 gap-2 justify-end">
            {pageView === 'list' ? (
              <Button variant="default" onClick={() => setPageView('detail')}>
                Meu time
              </Button>
            ) : (
              <Button variant="default" onClick={() => setPageView('list')}>
                Listar times
              </Button>
            )}
            {myTeam === null && (
              <Button variant="default" onClick={() => setIsDialogCreateOpen(true)}>
                Criar novo time
              </Button>
            )}
          </div>
        </div>
        {pageView === 'list' ? <ListTeamsView /> : <TeamView />}
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
              ><FormField
                  control={createTeamForm.control}
                  name="image"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel htmlFor="image">Imagem do time</FormLabel>
                      <FormControl>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files?.[0])}
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name="image"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel htmlFor="image">Imagem do time</FormLabel>
                      <FormControl>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files?.[0])}
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              ><FormField
                  control={editTeamForm.control}
                  name="image"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel htmlFor="image">Imagem do time</FormLabel>
                      <FormControl>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files?.[0])}
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editTeamForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Nome do time</FormLabel>
                      <FormControl>
                        <Input id="name" type="text" placeholder="Nome do time" {...field} />
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
                        <Input id="description" type="text" placeholder="Descrição" {...field} />
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
              ><FormField
                  control={editTeamForm.control}
                  name="image"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel htmlFor="image">Imagem do time</FormLabel>
                      <FormControl>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files?.[0])}
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editTeamForm.control}
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
                  control={editTeamForm.control}
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
                <Button type="submit">Atualizar time</Button>
              </form>
            </Form>
          </DrawerContent>
        </Drawer>
      )}

      {/* Dialog para remover membro do time */}
      {width >= 768 ? (
        <Dialog open={isDeleteTeamUserDialog} onOpenChange={setIsDeleteTeamUserDialog}>
          <DialogContent>
            <DialogTitle>Remover membro do time</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este membro do time?
            </DialogDescription>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDeleteTeamUserDialog(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteTeamUser(myTeam?.id)}>
                Remover
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isDeleteTeamUserDialog} onOpenChange={setIsDeleteTeamUserDialog}>
          <DrawerContent className="p-4">
            <DrawerTitle>Remover membro do time</DrawerTitle>
            <DrawerDescription>
              Tem certeza que deseja remover este membro do time?
            </DrawerDescription>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDeleteTeamUserDialog(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteTeamUser(myTeam?.id)}>
                Remover
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
