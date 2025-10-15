import { FaUserCircle, FaTrash } from 'react-icons/fa';
import { VersusIconButton } from '../ui/versus/versusIconButton';
import { VersusInput } from '../ui/versus/versusInput';
import { VersusButton } from '../ui/versus/versusButton';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../components/ui/dialog';
import { useState } from 'react';
import { useDeleteUser } from '../hooks/useDeleteUser';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function AccountPage() {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { handleDelete, loading: deleting } = useDeleteUser();
  const user = useSelector((state) => state.user.user);

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="rounded-xl p-8 w-full max-w-lg flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold mb-6 text-center text-white">Conta do Usuário</h1>
        <div className="flex items-center justify-center rounded-xl p-8 w-full max-w-md flex-col">
          <div className="mb-6">
            <FaUserCircle className="text-[120px] text-white drop-shadow-lg" />
          </div>

          <VersusInput
            placeholder="Nome de usuário"
            value={user?.username || ''}
            disabled
            readOnly
          />
          <div className="mt-4 w-full">
            <VersusInput
              type="email"
              placeholder="Email"
              value={user?.email || ''}
              disabled
              readOnly
            />
          </div>

          <div className="flex w-full gap-4 mt-6">
            <VersusButton
              label="Editar"
              variant="contained"
              fullWidth
              onClick={() => navigate('/account/edit')} // <-- navega para a página de edição
            />

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <VersusIconButton
                  icon={<FaTrash />}
                  color="danger"
                  onClick={() => setShowDeleteDialog(true)}
                />
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Atenção!</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                  <VersusButton
                    label="Cancelar"
                    variant="outlined"
                    onClick={() => setShowDeleteDialog(false)}
                  />
                  <VersusButton
                    label={deleting ? 'Excluindo...' : 'Excluir'}
                    variant="contained"
                    onClick={handleDelete}
                    disabled={deleting}
                  />
                </DialogFooter>

                <DialogClose />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
