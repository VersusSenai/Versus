import { useState, useEffect } from 'react';
import { TeamsCardsPage } from '../components/TeamsCards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import { HoverCardContent } from '@radix-ui/react-hover-card';
import { MdDeleteOutline, MdInfoOutline } from 'react-icons/md';
import { Trash, X } from 'lucide-react';
import { toast } from 'react-toastify';

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
    selectedEditTeam,
    setSelectedEditTeam,
    joinTeam,
    setJoinTeam,
  } = useTeamsPageContext();
  const { width } = useWindowSize();
  const [isDialogCreateOpen, setIsDialogCreateOpen] = useState(false);
  const [isDialogEditOpen, setIsDialogEditOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}') as UserProps;
  const [pageView, setPageView] = useState<'list' | 'detail'>('list');
  const [myTeam, setMyTeam] = useState<TeamProps | null>(null);
  const [teamUsers, setTeamUsers] = useState<TeamUserProps[]>([]);
  const [isDeleteTeamUserDialogOpen, setIsDeleteTeamUserDialogOpen] = useState(false);
  const [selectedTeamUser, setSelectedTeamUser] = useState<TeamUserProps | null>(null);
  const [isLeavingTeamModalOpen, setIsLeavingTeamModalOpen] = useState(false);
  const [isJoiningTeamModalOpen, setIsJoiningTeamModalOpen] = useState(false);
  const [isInvitingTeamModalOpen, setIsInvitingTeamModalOpen] = useState(false);
  const [isDeleteTeamModalOpen, setIsDeleteTeamModalOpen] = useState(false);
  const [confirmDeleteTeamInput, setConfirmDeleteTeamInput] = useState('');

  const handleFetchTeams = () => {
    fetchTeams();
  };

  const getMyTeam = async () => {
    try {
      const response = await api.get(`/team/getByUserId/${user.id}`);
      if (response && response.status === 200) {
        setMyTeam(response.data);
        getTeamUsers(response.data.id.toString());
        setPageView('detail');
        return response.data;
      } else {
        setMyTeam(null);
        return null;
      }
    } catch (error) {
      console.error('Error fetching my team:', error);
      setMyTeam(null);
    }
  };

  const getTeamUsers = async (teamId: string) => {
    try {
      const response = await api.get(`/team/${teamId}/inscriptions`);
      setTeamUsers(response.data);
    } catch (error) {
      console.error('Error fetching my team users:', error);
      setTeamUsers([]);
    }
  };

  useEffect(() => {
    getMyTeam();
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
    image: z
      .file()
      .optional()
      .refine((file) => {
        if (!file) return true;
        // garantir que seja um File e que o tamanho seja <= 5MB
        return file instanceof File ? file.size <= 5 * 1024 * 1024 : true;
      }, 'A imagem deve ter no máximo 5MB'),
  });

  const editTeamSchema = z.object({
    name: z
      .string('O nome do time deve ter pelo menos 3 caracteres')
      .min(3, 'O nome do time deve ter pelo menos 3 caracteres'),
    description: z
      .string('A descrição deve ter pelo menos 10 caracteres')
      .min(10, 'A descrição deve ter pelo menos 10 caracteres'),
    private: z.boolean().optional().default(false),
    image: z
      .file()
      .or(z.string())
      .optional()
      .refine((file) => {
        if (!file) return true;
        // garantir que seja um File e que o tamanho seja <= 5MB
        return file instanceof File ? file.size <= 5 * 1024 * 1024 : true;
      }, 'A imagem deve ter no máximo 5MB'),
  });

  const inviteUserSchema = z.object({
    email: z.email('Email inválido').min(3).max(100),
  });

  const createTeamForm = useForm({
    resolver: zodResolver(createTeamSchema),
  });

  const editTeamForm = useForm({
    resolver: zodResolver(editTeamSchema),
  });

  const inviteUserForm = useForm({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
    },
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
      toast.loading('Criando time...');
      await api.post('/team', formData);
      toast.dismiss();
      toast.success('Time criado com sucesso!');
    } catch (error) {
      toast.dismiss();
      console.error('Error creating team:', error);
      toast.error(`Erro ao criar time. Tente novamente. Erro: ${error}`);
    } finally {
      setIsDialogCreateOpen(false);
      createTeamForm.reset();
      getMyTeam();
      refreshTeams();
    }
  }

  async function onEditSubmit(data: z.infer<typeof editTeamSchema>) {
    if (!selectedEditTeam) return;
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('private', data.private.toString());
    if (data.image) {
      formData.append('image', data.image);
    }
    try {
      toast.loading('Atualizando time...');
      await api.put(`/team/${selectedEditTeam.id}`, formData);
      toast.dismiss();
      toast.success('Time atualizado com sucesso!');
    } catch (error) {
      toast.dismiss();
      console.error('Error updating team:', error);
      toast.error(`Erro ao atualizar time. Tente novamente. Erro: ${error}`);
    } finally {
      setSelectedEditTeam(null);
      setIsDialogEditOpen(false);
      editTeamForm.reset();
      if (pageView === 'detail') {
        getMyTeam();
      } else {
        refreshTeams();
      }
    }
  }

  async function onInviteUserSubmit(data: z.infer<typeof inviteUserSchema>) {
    if (!myTeam) return;
    try {
      toast.loading('Convidando usuário para o time...');
      await api.post(`/team/${data.email}/invite`);
      toast.dismiss();
      toast.success('Usuário convidado para o time com sucesso!');
    } catch (error) {
      toast.dismiss();
      console.error('Error inviting team user:', error);
      toast.error(`Erro ao convidar usuário para o time. Tente novamente. Erro: ${error}`);
    } finally {
      setIsInvitingTeamModalOpen(false);
      getTeamUsers(myTeam.id.toString());
      inviteUserForm.reset();
    }
  }

  async function handleDeleteTeamUser(teamId?: number) {
    if (!teamId || !selectedTeamUser) return;
    try {
      toast.loading('Removendo usuário do time...');
      await api.post(`/team/${teamId}/unsubscribe/${selectedTeamUser?.id}`);
      toast.dismiss();
      toast.success('Usuário removido do time com sucesso!');
    } catch (error) {
      toast.dismiss();
      console.error('Error removing team user:', error);
      toast.error(`Erro ao remover usuário do time. Tente novamente. Erro: ${error}`);
    } finally {
      getTeamUsers(myTeam?.id.toString() || '');
      setIsDeleteTeamUserDialogOpen(false);
    }
  }

  async function handleUnsubscribe(teamId?: number) {
    if (!teamId) return;
    try {
      toast.loading('Saindo do time...');
      await api.post(`/team/${teamId}/unsubscribe`);
      toast.dismiss();
      toast.success('Saída do time realizada com sucesso!');
    } catch (error) {
      toast.dismiss();
      console.error('Error removing team user:', error);
      toast.error(`Erro ao sair do time. Tente novamente. Erro: ${error}`);
    } finally {
      setIsLeavingTeamModalOpen(false);
      setMyTeam(null);
      setPageView('list');
      refreshTeams();
    }
  }

  async function handleJoinTeam(teamId?: number) {
    if (!!myTeam) {
      toast.error('Você já está em um time');
      return;
    }
    if (!teamId) return;
    try {
      toast.loading('Entrando no time...');
      await api.post(`/team/${teamId}/inscribe`);
      toast.dismiss();
      toast.success('Entrada no time realizada com sucesso!');
    } catch (error) {
      toast.dismiss();
      console.error('Error joining team:', error);
      toast.error(`Erro ao entrar no time. Tente novamente. Erro: ${error}`);
    } finally {
      setIsJoiningTeamModalOpen(false);
      getMyTeam();
    }
  }

  async function handleDeleteTeam() {
    if (!confirmDeleteTeamInput || confirmDeleteTeamInput !== 'DELETAR') {
      toast.error('Você precisa digitar "DELETAR" para confirmar a exclusão do time.');
      return;
    }
    if (!myTeam?.id) return;
    try {
      toast.loading('Deletando time...');
      await api.delete(`/team/${myTeam.id}`);
      toast.dismiss();
      toast.success('Time deletado com sucesso!');
    } catch (error) {
      toast.dismiss();
      console.error('Error deleting team:', error);
      toast.error(`Erro ao deletar time. Tente novamente. Erro: ${error}`);
    } finally {
      setIsDeleteTeamModalOpen(false);
      getMyTeam();
      refreshTeams();
    }
  }

  useEffect(() => {
    if (joinTeam) {
      getTeamUsers(joinTeam.id.toString());
      setIsJoiningTeamModalOpen(true);
    }
  }, [joinTeam]);

  async function urlToFile(url: string, nome = 'arquivo.png') {
    const resposta = await fetch(url);
    const blob = await resposta.blob();
    const tipo = blob.type || 'application/octet-stream';
    return new File([blob], nome, { type: tipo });
  }

  useEffect(() => {
    if (selectedEditTeam) {
      editTeamForm.setValue('name', selectedEditTeam.name);
      editTeamForm.setValue('description', selectedEditTeam.description);
      editTeamForm.setValue('private', selectedEditTeam.private);
      selectedEditTeam.icon &&
        urlToFile(selectedEditTeam.icon).then((file) => {
          editTeamForm.setValue('image', file);
        });
      setIsDialogEditOpen(true);
    } else {
      editTeamForm.reset();
    }
  }, [selectedEditTeam]);

  useEffect(() => {
    if (pageView === 'detail') getMyTeam();
  }, [pageView]);

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
              <TeamsCardsPage team={team} key={team.id} myTeam={myTeam} />
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
    const isOwner = teamUsers.some(
      (teamUser) => teamUser.user.id === user.id && teamUser.role === 'O'
    );
    return (
      <div className="grid bg-dark text-white p-4 rounded-md">
        <div className="flex justify-between gap-2 items-center">
          <h1 className="text-2xl mb-2">Detalhes do Time</h1>
          <div className="flex gap-2">
            {myTeam?.status === 'B' && (
              <span className="inline-flex whitespace-nowrap items-center px-3 py-1 rounded-full text-sm font-medium bg-red-900/20 text-red-300 border border-red-800">
                🚫 Banido
              </span>
            )}
            {myTeam?.status === 'P' && (
              <span className="inline-flex whitespace-nowrap items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-900/20 text-orange-300 border border-orange-800">
                ⌚ Pendente
              </span>
            )}
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
        </div>
        <div className="grid md:flex gap-6">
          <div className="flex-1 relative">
            <img
              src={myTeam?.icon ?? teamPhoto}
              alt={myTeam?.name}
              className="w-full h-80 object-cover rounded-md"
            />
            {/* <HoverCard>
              <HoverCardTrigger className="absolute top-2 right-2">
                <Edit className="w-8 h-8 rounded-md p-1 bg-1/30 hover:bg-1/20 text-gray-400 hover:text-gray-300 cursor-pointer duration-150" />
              </HoverCardTrigger>
              <HoverCardContent className="bg-dark text-white p-2 rounded shadow">
                Troca foto
              </HoverCardContent>
            </HoverCard> */}
          </div>
          <div className="flex flex-col flex-1 gap-2 justify-between">
            <div className="flex flex-col gap-4">
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
            <div className="flex flex-col gap-2 mt-6">
              {myTeam?.registeredDate && (
                <span className="text-sm text-gray-500">
                  Criado em {new Date(myTeam.registeredDate).toLocaleDateString()}
                </span>
              )}
              {isOwner ? (
                <div className="flex gap-2 w-full">
                  <Button
                    className="flex-1"
                    variant="default"
                    onClick={() => setSelectedEditTeam(myTeam)}
                  >
                    Editar
                  </Button>
                  <Button
                    className="flex-1"
                    variant="secondary"
                    onClick={() => setIsInvitingTeamModalOpen(true)}
                  >
                    Convidar
                  </Button>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="destructive"
                        size={'icon'}
                        onClick={() => setIsDeleteTeamModalOpen(true)}
                      >
                        <Trash />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="grid justify-items-center whitespace-nowrap w-min p-2 rounded-md shadow bg-dark">
                      Excluir time
                    </HoverCardContent>
                  </HoverCard>
                </div>
              ) : (
                <Button
                  className="flex-1"
                  variant="secondary"
                  onClick={() => setIsLeavingTeamModalOpen(true)}
                >
                  Sair do time
                </Button>
              )}
            </div>
          </div>
        </div>
        <ul className="grid max-h-full divide-y border-[1px] border-gray-800 mt-2 rounded-md">
          {teamUsers.map((teamUser) => {
            return (
              <li key={teamUser.id} className="flex justify-between py-2 px-4 border-gray-800">
                <p className="content-center h-9">
                  <b>{teamUser.id}</b> - {teamUser.user.username}
                  <span className="inline-block gap-2">
                    {teamUser.role === 'O' && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900/20 text-blue-300 border border-blue-800">
                        Dono
                      </span>
                    )}
                    {user.id === teamUser.user.id && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-900/20 text-green-300 border border-green-800">
                        Você
                      </span>
                    )}
                  </span>
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
                        setIsDeleteTeamUserDialogOpen(true);
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
              myTeam && (
                <Button variant="default" onClick={() => setPageView('detail')}>
                  Meu time
                </Button>
              )
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
                <FormField
                  control={createTeamForm.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="image">
                        <span>Imagem do time</span>
                        {field.value && (
                          <div>
                            <img
                              src={URL.createObjectURL(field.value)}
                              alt={`Icone - ${field.value?.name}`}
                            />
                          </div>
                        )}
                      </FormLabel>
                      <FormDescription>Selecione uma imagem para o time de até 5MB</FormDescription>
                      <FormControl>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          name={field.name}
                          ref={field.ref}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            field.onChange(e.target.files?.[0])
                          }
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
                <FormField
                  control={createTeamForm.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="image">
                        <span>Imagem do time</span>
                        {field.value && (
                          <div>
                            <img
                              src={URL.createObjectURL(field.value)}
                              alt={`Icone - ${field.value?.name}`}
                            />
                          </div>
                        )}
                      </FormLabel>
                      <FormDescription>Selecione uma imagem para o time de até 5MB</FormDescription>
                      <FormControl>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          name={field.name}
                          ref={field.ref}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            field.onChange(e.target.files?.[0])
                          }
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
            setSelectedEditTeam(null);
            setIsDialogEditOpen(false);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar time</DialogTitle>
              <DialogDescription>Edite os dados do time</DialogDescription>
            </DialogHeader>
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
                          onCheckedChange={(checked) => {
                            console.log('Check', checked);
                            field.onChange(checked);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editTeamForm.control}
                  name="image"
                  render={({ field }) => {
                    const finalPhoto =
                      field.value && typeof field.value !== 'string'
                        ? URL.createObjectURL(field.value) // usuário enviou imagem
                        : teamPhoto; // usa a padrão

                    return (
                      <FormItem className="relative">
                        <FormLabel htmlFor="image">
                          <span>Imagem do time</span>
                          {field.value && typeof field.value !== 'string' && (
                            <div>
                              <img
                                src={finalPhoto}
                                alt={`Icone ${selectedEditTeam?.name} - ${field.value?.name}`}
                              />
                            </div>
                          )}
                        </FormLabel>
                        <FormDescription>
                          Selecione uma imagem para o time de até 5MB
                        </FormDescription>
                        <FormControl>
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            name={field.name}
                            ref={field.ref}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              field.onChange(e.target.files?.[0])
                            }
                          />
                        </FormControl>
                        {field.value && typeof field.value !== 'string' && (
                          <Button
                            type="button"
                            variant="destructive"
                            className="absolute top-8 right-2 h-8 w-8 rounded-full p-2"
                            title="Remover imagem"
                            onClick={() => {
                              field.onChange('Removido');
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
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
            setSelectedEditTeam(null);
            setIsDialogEditOpen(false);
          }}
        >
          <DrawerContent className="p-4">
            <DrawerTitle>Editar time</DrawerTitle>
            <DrawerDescription>Edite os dados do time</DrawerDescription>
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
                <FormField
                  control={editTeamForm.control}
                  name="image"
                  render={({ field }) => {
                    const finalPhoto =
                      field.value && typeof field.value !== 'string'
                        ? URL.createObjectURL(field.value) // usuário enviou imagem
                        : teamPhoto; // usa a padrão
                    return (
                      <FormItem>
                        <FormLabel htmlFor="image">
                          <span>Imagem do time</span>
                          {field.value && typeof field.value !== 'string' && (
                            <div>
                              <img
                                src={finalPhoto}
                                alt={`Icone ${selectedEditTeam?.name} - ${field.value?.name}`}
                              />
                            </div>
                          )}
                        </FormLabel>
                        <FormDescription>
                          Selecione uma imagem para o time de até 5MB
                        </FormDescription>
                        <FormControl>
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            name={field.name}
                            ref={field.ref}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              field.onChange(e.target.files?.[0])
                            }
                          />
                        </FormControl>
                        {field.value && typeof field.value !== 'string' && (
                          <Button
                            type="button"
                            variant="destructive"
                            className="absolute top-8 right-2 h-8 w-8 rounded-full p-2"
                            title="Remover imagem"
                            onClick={() => {
                              field.onChange('Removido');
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <Button type="submit">Atualizar time</Button>
              </form>
            </Form>
          </DrawerContent>
        </Drawer>
      )}

      {/* Dialog para remover membro do time */}
      {width >= 768 ? (
        <Dialog open={isDeleteTeamUserDialogOpen} onOpenChange={setIsDeleteTeamUserDialogOpen}>
          <DialogContent>
            <DialogTitle>Remover membro do time</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este membro do time?
            </DialogDescription>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDeleteTeamUserDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteTeamUser(myTeam?.id)}>
                Remover
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isDeleteTeamUserDialogOpen} onOpenChange={setIsDeleteTeamUserDialogOpen}>
          <DrawerContent className="p-4">
            <DrawerTitle>Remover membro do time</DrawerTitle>
            <DrawerDescription>
              Tem certeza que deseja remover este membro do time?
            </DrawerDescription>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDeleteTeamUserDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteTeamUser(myTeam?.id)}>
                Remover
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Dialog sair do time */}
      {width >= 768 ? (
        <Dialog open={isLeavingTeamModalOpen} onOpenChange={setIsLeavingTeamModalOpen}>
          <DialogContent>
            <DialogTitle>Sair do time</DialogTitle>
            <DialogDescription>Tem certeza que deseja sair do time?</DialogDescription>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsLeavingTeamModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => handleUnsubscribe(myTeam?.id)}>
                Confirmar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isLeavingTeamModalOpen} onOpenChange={setIsLeavingTeamModalOpen}>
          <DrawerContent className="p-4">
            <DrawerTitle>Sair do time</DrawerTitle>
            <DrawerDescription>Tem certeza que deseja sair do time?</DrawerDescription>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsLeavingTeamModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => handleUnsubscribe(myTeam?.id)}>
                Confirmar
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Dialog entrar do time */}
      {width >= 768 ? (
        <Dialog
          open={isJoiningTeamModalOpen}
          onOpenChange={() => {
            setIsJoiningTeamModalOpen(false);
            setJoinTeam(null);
          }}
        >
          <DialogContent>
            <DialogTitle>Entrar no time</DialogTitle>
            <DialogDescription>
              O time tem um limite de 5 jogadores. <br /> Tem certeza que deseja entrar no time?
            </DialogDescription>
            <ul className="h-[300px] overflow-auto divide-y border border-gray-800 rounded-md p-2">
              {teamUsers.length === 0 ? (
                <li className="p-4 text-center text-sm text-gray-400">Nenhum membro inscrito</li>
              ) : (
                teamUsers.map((member) => (
                  <li key={member.id} className="flex items-center justify-between py-2 px-3">
                    <div>
                      <div className="font-medium text-sm">{member.user.username}</div>
                      <div className="text-xs text-gray-400">
                        {member.role === 'O' ? 'Dono' : 'Membro'}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsJoiningTeamModalOpen(false);
                  setJoinTeam(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                disabled={teamUsers.length >= 5}
                onClick={() => handleJoinTeam(joinTeam?.id)}
              >
                Entrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isJoiningTeamModalOpen} onOpenChange={setIsJoiningTeamModalOpen}>
          <DrawerContent className="p-4">
            <DrawerTitle>Entrar no time</DrawerTitle>
            <DialogDescription>
              O time tem um limite de 5 jogadores. Tem certeza que deseja entrar no time?
            </DialogDescription>
            <ul className="h-[300px] overflow-auto divide-y border border-gray-800 rounded-md p-2">
              {teamUsers.length === 0 ? (
                <li className="p-4 text-center text-sm text-gray-400">Nenhum membro inscrito</li>
              ) : (
                teamUsers.map((member) => (
                  <li key={member.id} className="flex items-center justify-between py-2 px-3">
                    <div>
                      <div className="font-medium text-sm">{member.user.username}</div>
                      <div className="text-xs text-gray-400">
                        {member.role === 'O' ? 'Dono' : 'Membro'}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsJoiningTeamModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="default"
                disabled={teamUsers.length >= 5}
                onClick={() => handleJoinTeam(joinTeam?.id)}
              >
                Entrar
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Dialog convidar para o time */}
      {width >= 768 ? (
        <Dialog
          open={isInvitingTeamModalOpen}
          onOpenChange={() => {
            setIsInvitingTeamModalOpen(false);
            inviteUserForm.reset();
          }}
        >
          <DialogContent>
            <DialogTitle>Convidar para o time</DialogTitle>
            <DialogDescription>
              Digite o email do usuário que deseja convidar para o time (digita o ID do maldito ai)
            </DialogDescription>
            <Form {...inviteUserForm}>
              <form
                className="grid gap-2"
                onSubmit={inviteUserForm.handleSubmit(onInviteUserSubmit)}
              >
                <FormField
                  control={inviteUserForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input id="email" placeholder="Email do usuário" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" type="button">
                    Cancelar
                  </Button>
                  <Button variant="default" type="submit">
                    Enviar convite
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer
          open={isInvitingTeamModalOpen}
          onOpenChange={() => {
            setIsInvitingTeamModalOpen(false);
            inviteUserForm.reset();
          }}
        >
          <DrawerContent className="p-4">
            <DrawerTitle>Convidar para o time</DrawerTitle>
            <DrawerDescription>
              Digite o email do usuário que deseja convidar para o time (digita o ID do maldito ai)
            </DrawerDescription>
            <Form {...inviteUserForm}>
              <form
                className="grid gap-2"
                onSubmit={inviteUserForm.handleSubmit(onInviteUserSubmit)}
              >
                <FormField
                  control={inviteUserForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input id="email" placeholder="Email do usuário" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" type="button">
                    Cancelar
                  </Button>
                  <Button variant="default" type="submit">
                    Enviar convite
                  </Button>
                </div>
              </form>
            </Form>
          </DrawerContent>
        </Drawer>
      )}

      {/* Dialog deletar proprio time */}
      {width >= 768 ? (
        <Dialog
          open={isDeleteTeamModalOpen}
          onOpenChange={() => {
            setIsDeleteTeamModalOpen(false);
          }}
        >
          <DialogContent>
            <DialogTitle>Deletar time</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar este time? Esta ação não pode ser desfeita.
            </DialogDescription>
            <div className="flex flex-col gap-2 mt-4">
              <Input
                type="text"
                placeholder="Digite 'DELETAR' para confirmar"
                value={confirmDeleteTeamInput}
                onChange={(e) => setConfirmDeleteTeamInput(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDeleteTeamModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteTeam}>
                Deletar time
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer
          open={isInvitingTeamModalOpen}
          onOpenChange={() => {
            setIsInvitingTeamModalOpen(false);
            inviteUserForm.reset();
          }}
        >
          <DrawerContent className="p-4">
            <DrawerTitle>Deletar time</DrawerTitle>
            <DrawerDescription>
              Tem certeza que deseja deletar este time? Esta ação não pode ser desfeita.
            </DrawerDescription>
            <div className="flex flex-col gap-2 mt-4">
              <Input
                type="text"
                placeholder="Digite 'DELETAR' para confirmar"
                value={confirmDeleteTeamInput}
                onChange={(e) => setConfirmDeleteTeamInput(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDeleteTeamModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteTeam}>
                Deletar time
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
