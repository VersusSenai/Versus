import { useState, useEffect } from 'react';
import CustomTable from '../components/CustomTable';
import DataTable from '../components/DataTable';

export const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/utils/teams.json');
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const columns = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Nome',
      accessorKey: 'name',
    },
    {
      header: 'Descrição',
      accessorKey: 'description',
    },
    {
      header: 'Cadastrado',
      accessorKey: 'registered_date',
    },
  ];

  return (
    <div className="grid h-screen">
      <DataTable columns={columns} data={teams} />
    </div>
  );
};
