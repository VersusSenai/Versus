export type TeamProps = {
  id: number;
  name: string;
  photo: string;
  description: string;
  registeredDate: Date;
  private: boolean;
  status: 'P' | 'O' | 'B';
};

export type ResponseGetTeams = {
  0: TeamProps[];
  1: {
    currentPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
};

export type TeamsPageProviderProps = {
  teams: TeamProps[];
  setTeams: (teams: TeamProps[]) => void;
  responseData: ResponseGetTeams | null;
  setResponseData: (data: ResponseGetTeams | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  fetchTeams: () => Promise<void>;
  refreshTeams: () => Promise<void>;
};
