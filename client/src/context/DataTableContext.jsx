// src/contexts/useDataTableContext.tsx

import { createContext, useState, useEffect } from 'react';


export const DataTableContext = createContext(undefined);

export const DataTableProvider = ({ children }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [filter, setFilter] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('all');
  const [planFilter, setPlanFilter] = useState('');

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
