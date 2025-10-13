import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import api from '@/api';

interface InvitePlayersDialogProps {
  eventId: number;
}

interface User {
  id: number;
  username: string;
  email: string;
}

export default function InvitePlayersDialog({ eventId }: InvitePlayersDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [loadingIds, setLoadingIds] = useState<number[]>([]); // IDs de usuários que estão sendo convidados

  const normalize = (text: string) =>
    text
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');

  // Carrega usuários
  useEffect(() => {
    if (!open) return;

    const fetchUsers = async () => {
      try {
        const res = await api.get('/user');
        const validUsers: User[] = res.data[0].filter(
          (u: any) =>
            (u?.email && u.email.trim() !== '') || (u?.username && u.username.trim() !== '')
        );
        setUsers(validUsers);
      } catch (err) {
        console.error(err);
        toast.error('Erro ao carregar usuários');
      }
    };

    fetchUsers();
  }, [open]);

  // Filtra usuários
  useEffect(() => {
    if (!search.trim()) {
      setFiltered([]);
      return;
    }
    const term = normalize(search);
    setFiltered(
      users.filter((u) => {
        const username = u.username ? normalize(u.username) : '';
        const email = u.email ? normalize(u.email) : '';
        return username.includes(term) || email.includes(term);
      })
    );
  }, [search, users]);

  // Convida usuário
  const handleInvite = async (targetId: number) => {
    if (!targetId || !eventId) {
      toast.error('Evento ou usuário inválido');
      return;
    }

    setLoadingIds((prev) => [...prev, targetId]); // marca esse usuário como carregando
    try {
      await api.post(`/event/${eventId}/invite`, { targetId });
      toast.success('Convite enviado com sucesso!');
      setSearch('');
      setFiltered([]);
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.msg) {
        toast.error(err.response.data.msg);
      } else {
        toast.error('Erro ao enviar convite');
      }
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== targetId)); // remove o usuário do loading
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          Convidar Jogadores
        </Button>
      </DialogTrigger>

      <DialogContent className="p-6 bg-[var(--color-dark)] text-white rounded-2xl border border-white/20">
        <DialogHeader>
          <DialogTitle>Convidar Jogadores</DialogTitle>
          <DialogDescription className="text-white/80">
            Digite o nome de usuário ou e-mail para convidar alguém para este torneio.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-4">
          <Input
            placeholder="Buscar usuário por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/10 border-white/30 text-white"
          />

          {filtered.length > 0 ? (
            <div className="max-h-48 overflow-auto rounded border border-white/20">
              {filtered.map((user) => {
                const isLoading = loadingIds.includes(user.id);
                return (
                  <div
                    key={user.id}
                    className="flex justify-between items-center p-2 hover:bg-white/10 cursor-pointer"
                  >
                    <div>
                      <p className="font-medium">{user.username || '(sem nome)'}</p>
                      <p className="text-sm text-white/60">{user.email || '—'}</p>
                    </div>
                    <Button size="sm" disabled={isLoading} onClick={() => handleInvite(user.id)}>
                      {isLoading ? 'Convidando...' : 'Convidar'}
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            search.trim().length > 0 && (
              <p className="text-white/60 text-sm mt-2">Nenhum usuário encontrado</p>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
