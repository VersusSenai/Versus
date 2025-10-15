// Users.tsx
import { useEffect, useState } from 'react';
import PageTransition from '../components/transition/PageTransition';
import CustomDialog from '../components/CustomDialog';
import { RoleSelect } from '../components/RoleSelect';
import api from '../api';
import { Eye, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from '@/components/DataTable';
import CustomTable from '@/components/CustomTable';

const columns = [
  { accessorKey: 'id', header: 'ID', cell: (info) => info.getValue() },
  { accessorKey: 'username', header: 'Nome', cell: (info) => info.getValue() },
  { accessorKey: 'email', header: 'Email', cell: (info) => info.getValue() },
  { accessorKey: 'role', header: 'Role', cell: (info) => info.getValue() },
];

const Users = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    api
      .get('/user')
      .then((res) => {
        // O backend retorna dados paginados como array [dados, meta]
        const userData = Array.isArray(res.data) ? res.data[0] : res.data.data || res.data;
        setData(userData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Erro ao carregar usuários');
        setLoading(false);
      });
  }, []);

  const handleViewUser = (user) => {
    setSelectedUser({ ...user });
    setDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/user/${selectedUser.id}`, {
        ...selectedUser,
        userId: selectedUser.i,
        password: null,
      });
      toast.success('Usuário atualizado com sucesso!');

      setData((oldData) => oldData.map((u) => (u.id === selectedUser.id ? selectedUser : u)));

      setDialogOpen(false);
    } catch (error) {
      toast.error('Erro ao atualizar usuário: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja remover o usuário "${user.username}"?`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/user/${user.id}`, {
        data: { userId: user.id },
      });
      toast.success('Usuário removido com sucesso!');

      setData((oldData) => oldData.filter((u) => u.id !== user.id));
    } catch (error) {
      toast.error('Erro ao remover usuário: ' + (error.response?.data?.message || error.message));
    }
  };

  const actions = [
    {
      label: 'Editar',
      icon: Eye,
      onClick: handleViewUser,
    },
    {
      label: 'Remover',
      icon: Eye,
      onClick: handleDeleteUser,
    },
  ];

  if (loading) return <div className="text-center py-10 text-white">Carregando usuários...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Erro: {error}</div>;

  return (
    <PageTransition>
      <DataTable columns={columns} data={data} actions={actions} />

      {selectedUser && (
        <CustomDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          title={`Editar Usuário: ${selectedUser.username}`}
          description="Faça as alterações e clique em salvar."
          onSubmit={handleSubmit}
          submitText="Salvar"
          showCancel
        >
          <div className="grid gap-3">
            <Label htmlFor="username">Nome</Label>
            <Input
              id="username"
              name="username"
              value={selectedUser.username || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={selectedUser.email || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="role">Role</Label>
            <RoleSelect
              value={selectedUser.role || ''}
              onChange={(val) => setSelectedUser((prev) => ({ ...prev, role: val }))}
            />
          </div>
        </CustomDialog>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </PageTransition>
  );
};

export default Users;
