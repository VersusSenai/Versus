import { FaUserCircle, FaTimes } from 'react-icons/fa';
import { VersusIconButton } from '../ui/versus/versusIconButton';
import { VersusInput } from '../ui/versus/versusInput';
import { VersusButton } from '../ui/versus/versusButton';
import { useUpdateUser } from '../hooks/useUpdateUser';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AvatarUpload } from '../components/ui/inputs/AvatarUpload';
import { useSelector } from 'react-redux';

export default function AccountEditPage() {
  const user = useSelector((state) => state.user.user);
  const { handleUpdate, loading: updating } = useUpdateUser();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleImageChange = (file, previewUrl) => {
    // Se file for "REMOVE", significa que o usuário quer remover a imagem
    if (file === 'REMOVE') {
      setImage('REMOVE');
      setImagePreview(null);
    } else {
      setImage(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSave = async () => {
    const result = await handleUpdate({
      username,
      email,
      image,
    });
    if (result) {
      navigate('/account'); // volta para a página de conta
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="rounded-xl p-8 w-full max-w-lg flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold mb-6 text-center text-white">Editar Conta</h1>
        <div className="flex items-center justify-center rounded-xl p-8 w-full max-w-md flex-col">
          <div className="mb-6">
            <AvatarUpload
              currentImage={imagePreview || user?.icon}
              onImageChange={handleImageChange}
            />
          </div>

          <VersusInput
            placeholder="Nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="mt-4 w-full">
            <VersusInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex w-full gap-4 mt-6">
            <VersusButton
              label={updating ? 'Salvando...' : 'Salvar'}
              variant="contained"
              onClick={handleSave}
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
