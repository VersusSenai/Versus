import { FaUserCircle, FaTimes } from 'react-icons/fa';
import { VersusIconButton } from '../ui/versus/versusIconButton';
import { VersusInput } from '../ui/versus/versusInput';
import { VersusButton } from '../ui/versus/versusButton';
import { useUser } from '../hooks/useUser';
import { useUpdateUser } from '../hooks/useUpdateUser';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AccountEditPage() {
  const { user, loading } = useUser();
  const { handleUpdate, loading: updating } = useUpdateUser();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async () => {
    const ok = await handleUpdate({ username, email });
    if (ok) {
      navigate('/account'); // volta para a página de conta
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="rounded-xl p-8 w-full max-w-lg flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold mb-6 text-center text-white">Editar Conta</h1>
        <div className="flex items-center justify-center rounded-xl p-8 w-full max-w-md flex-col">
          <div className="mb-6">
            <FaUserCircle className="text-[120px] text-white drop-shadow-lg" />
          </div>

          <VersusInput
            placeholder="Nome de usuário"
            value={loading ? 'Carregando...' : username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="mt-4 w-full">
            <VersusInput
              type="email"
              placeholder="Email"
              value={loading ? 'Carregando...' : email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex w-full gap-4 mt-6">
            <VersusButton
              label={updating ? 'Salvando...' : 'Salvar'}
              variant="contained"
              onClick={handleSave}
              disabled={updating}
              fullWidth
            />

            <VersusIconButton
              icon={<FaTimes />}
              color="danger"
              onClick={() => navigate('/account')} // cancela e volta
            />
          </div>
        </div>
      </div>
    </div>
  );
}
