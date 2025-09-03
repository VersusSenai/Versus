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
import { Button } from '../components/ui/button';
import { useState } from 'react';

export default function AccountPage() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    console.log('Conta excluída');
    setShowDeleteDialog(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="rounded-xl p-8 w-full max-w-lgflex flex-col items-center justify-center flex">
        <h1 className="text-5xl font-bold mb-6 text-center text-white">Conta do Usuário</h1>
        <div className="flex items-center justify-center rounded-xl p-8 max-w-lgflex flex-col  w-full max-w-md">
          <div className="mb-6">
            <FaUserCircle className="text-[120px] text-white drop-shadow-lg" />
          </div>

          <VersusInput placeholder="Nome de usuário" />
          <div className="mt-4 w-full">
            <VersusInput type="email" placeholder="Email" />
          </div>

          <div className="flex w-full gap-4 mt-6">
            <VersusButton
              label="Editar"
              variant="contained"
              onClick={() => console.log('Editar conta')}
              fullWidth
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
                  <VersusButton label="Excluir" variant="contained" onClick={handleDelete} />
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
