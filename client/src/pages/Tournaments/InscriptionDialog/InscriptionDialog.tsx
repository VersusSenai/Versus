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
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import api from '@/api';

interface InscriptionsDialogProps {
  eventId: number;
}

interface Inscription {
  id: number;
  role: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export default function InscriptionsDialog({ eventId }: InscriptionsDialogProps) {
  const [open, setOpen] = useState(false);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [expelling, setExpelling] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId?: number;
    username?: string;
  }>({
    open: false,
  });

  const fetchInscriptions = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/event/${eventId}/inscriptions`);
      setInscriptions(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar inscrições');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchInscriptions();
  }, [open]);

  const handleConfirmExpel = (userId: number, username: string) => {
    setConfirmDialog({ open: true, userId, username });
  };

  const handleExpel = async (userId: number) => {
    try {
      setExpelling(userId);
      const res = await api.delete(`/event/${eventId}/unsubscribe/${userId}`);
      if (res.status === 200 || res.status === 204) {
        setInscriptions((prev) => prev.filter((i) => i.user.id !== userId));
        toast.success('Usuário expulso com sucesso');
      } else {
        toast.error(`Erro ao expulsar usuário (status: ${res.status})`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Erro interno ao expulsar usuário');
    } finally {
      setExpelling(null);
    }
  };

  return (
    <>
      {/* Botão principal que abre lista de inscrições */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            Inscrições
          </Button>
        </DialogTrigger>

        <DialogContent className="p-6 bg-[var(--color-dark)] text-white rounded-2xl border border-white/20">
          <DialogHeader>
            <DialogTitle>Inscrições</DialogTitle>
            <DialogDescription className="text-white/80">
              Lista de usuários inscritos neste torneio.
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <p className="text-center text-white/70 mt-4">Carregando inscrições...</p>
          ) : inscriptions.length === 0 ? (
            <p className="text-center text-white/60 mt-4">Nenhum jogador inscrito.</p>
          ) : (
            <div className="max-h-64 overflow-hidden mt-4 border border-white/10 rounded">
              {inscriptions.map((inscription) => (
                <div
                  key={inscription.user.id}
                  className="flex justify-between items-center p-2 border-b border-white/10 hover:bg-white/10"
                >
                  <p>{inscription.user.username}</p>

                  {/* Botão vermelho com tooltip simples */}
                  <div className="relative group">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700 w-8 h-8"
                      onClick={() =>
                        handleConfirmExpel(inscription.user.id, inscription.user.username)
                      }
                      disabled={expelling === inscription.user.id}
                    >
                      <X size={16} />
                    </Button>

                    {/* Tooltip manual */}
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Expulsar
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de expulsão */}
      <Dialog open={confirmDialog.open} onOpenChange={(o) => setConfirmDialog({ open: o })}>
        <DialogContent className="bg-[var(--color-dark)] text-white rounded-2xl border border-white/20 p-6">
          <DialogHeader>
            <DialogTitle>Atenção</DialogTitle>
            <DialogDescription className="text-white/80">
              Tem certeza que deseja expulsar{' '}
              <span className="font-bold text-red-400">{confirmDialog.username}</span> deste
              torneio?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="secondary"
              onClick={() => setConfirmDialog({ open: false })}
              disabled={!!expelling}
            >
              Cancelar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() =>
                handleExpel(
                  inscriptions.find((i) => i.user.username === confirmDialog.username)?.user.id!
                )
              }
              disabled={!!expelling}
            >
              {expelling ? 'Expulsando...' : 'Expulsar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
