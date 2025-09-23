// src/contexts/useDataTableContext.tsx

import { createContext, useState, useEffect } from 'react';

interface DataTableContextType {
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  statusFiltro: string;
  setStatusFiltro: React.Dispatch<React.SetStateAction<string>>;
}

export const DataTableContext = createContext<DataTableContextType | undefined>(undefined);

export const DataTableProvider = ({ children }: { children: React.ReactNode }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [filter, setFilter] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('all');

  useEffect(() => {
    setPageIndex(0);
    setFilter('');
    setStatusFiltro('all');
  }, []);

  return (
    <DataTableContext.Provider
      value={{
        pageIndex,
        setPageIndex,
        filter,
        setFilter,
        statusFiltro,
        setStatusFiltro,
      }}
    >
      {children}
    </DataTableContext.Provider>
  );
};
