import React, { useEffect, useState } from 'react';
import PageTransition from '../components/transition/PageTransition';
import CustomTable from '../components/CustomTable';
import api from '../api'; // sua instância axios
import { Eye, Calendar } from 'lucide-react';

const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'username',
    header: 'Nome',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'password',
    header: 'Senha',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (info) => info.getValue(),
  },
];

// Definindo as ações do dropdown em cada linha
const actions = [
  {
    label: 'Visualizar',
    icon: Eye,
    onClick: (user) => {
      alert(`Visualizando usuário: ${user.username}`);
      // Exemplo: abrir modal ou redirecionar
    },
  },
  {
    label: 'Agenda',
    icon: Calendar,
    onClick: (user) => {
      alert(`Abrir agenda do usuário: ${user.username}`);
      // Exemplo: abrir modal ou redirecionar
    },
  },
];

const Users = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get('/user')
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Erro ao carregar usuários');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-white">Carregando usuários...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Erro: {error}</div>;
  }

  return (
    <PageTransition>
      <CustomTable columns={columns} data={data} actions={actions} />
    </PageTransition>
  );
};

export default Users;
