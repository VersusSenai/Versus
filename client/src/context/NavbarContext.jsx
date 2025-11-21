import { createContext, useContext, useState, useEffect } from 'react';

const NavbarContext = createContext();

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};

export const NavbarProvider = ({ children }) => {
  // Estado inicial baseado no localStorage ou padrão (fechado)
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('navbar-collapsed');
    return saved ? JSON.parse(saved) : true; // Padrão: fechado
  });

  // Salvar no localStorage sempre que o estado mudar
  useEffect(() => {
    localStorage.setItem('navbar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  const toggleCollapse = () => {
    setCollapsed(prev => !prev);
  };

  const setNavbarCollapsed = (isCollapsed) => {
    setCollapsed(isCollapsed);
  };

  const value = {
    collapsed,
    toggleCollapse,
    setNavbarCollapsed,
  };

  return (
    <NavbarContext.Provider value={value}>
      {children}
    </NavbarContext.Provider>
  );
};




