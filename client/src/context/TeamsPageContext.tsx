import { createContext, useState, useEffect } from 'react';
import { TeamProps, ResponseGetTeams, TeamsPageProviderProps } from '@/types';
import api from '@/api';

export const TeamsPageContext = createContext<TeamsPageProviderProps | undefined>(undefined);

export const TeamsPageProvider = ({ children }: { children: React.ReactNode }) => {
  const [teams, setTeams] = useState<TeamProps[]>([]);
  const [responseData, setResponseData] = useState<ResponseGetTeams | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEditTeam, setSelectedEditTeam] = useState<TeamProps | null>(null);
  const [joinTeam, setJoinTeam] = useState<TeamProps | null>(null);

  const fetchTeams = async ({ page = 1, search = '' }) => {
    try {
      setLoading(true);
      const response = await api.get('/team', {
        params: {
          page,
          limit: 9,
          search, // Envia o termo de busca apenas se não estiver vazio // a ser implementado no backend
        },
      });
      setResponseData(response.data);
      setTeams(response.data[0]);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams({ page: currentPage });
  }, [currentPage]);

  useEffect(() => {
    searchTerm.length > 0
      ? setTeams((prevTeams) =>
          prevTeams.filter((team) => team.name.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : fetchTeams({ page: currentPage, search: searchTerm });
  }, [searchTerm]);

  return (
    <TeamsPageContext.Provider
      value={{
        teams,
        setTeams,
        responseData,
        setResponseData,
        loading,
        setLoading,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        refreshTeams: () => fetchTeams({ page: 1, search: '' }),
        fetchTeams: () => fetchTeams({ page: currentPage, search: searchTerm }),
        selectedEditTeam,
        setSelectedEditTeam,
        joinTeam,
        setJoinTeam,
      }}
    >
      {children}
    </TeamsPageContext.Provider>
  );
};
