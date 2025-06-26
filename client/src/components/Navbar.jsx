import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaSignOutAlt } from 'react-icons/fa';
import { MdOutlineEmojiEvents, MdOutlinePeopleAlt, MdOutlineAddBox } from 'react-icons/md';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.svg';
import { logout } from '../redux/userSlice';

const Navbar = ({ onWidthChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Pega o usuário do estado global do Redux
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    onWidthChange(isCollapsed ? 80 : 256);
  }, [isCollapsed, onWidthChange]);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setShowMobileMenu(false);
  };

  const links = [
    { label: 'Usuários', icon: <MdOutlinePeopleAlt />, path: 'users', roles: ['A'] },
    {
      label: 'Torneios',
      icon: <MdOutlineEmojiEvents />,
      path: 'tournaments',
      roles: ['A', 'P', 'O'],
    },
    {
      label: 'Criar Torneios',
      icon: <MdOutlineAddBox />,
      path: 'createTournaments',
      roles: ['A', 'O'],
    },
  ];

  // Loading simples enquanto user === null (ex: carregando do Redux)
  if (user === null) {
    return (
      <aside
        className={`hidden md:flex flex-col fixed bg-[#f8f9fa] p-5 min-h-screen z-50 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-center h-full text-gray-500">Carregando...</div>
      </aside>
    );
  }

  // Filtra links permitidos para o usuário atual
  const allowedLinks = user ? links.filter((link) => link.roles.includes(user.role)) : [];

  const renderLinks = () => (
    <nav className="flex flex-col gap-2">
      {allowedLinks.map((link) => {
        const isActive = location.pathname === `/${link.path}`;
        return (
          <button
            key={link.label}
            onClick={() => {
              navigate(`/${link.path}`);
              setShowMobileMenu(false);
            }}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-all text-[#23253a] hover:bg-[#e6e6fa]
              ${isActive ? 'bg-[var(--color-2)] text-white shadow' : ''}
              ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          >
            <span className="text-lg">{link.icon}</span>
            {!isCollapsed && <span>{link.label}</span>}
          </button>
        );
      })}

      {/* Botão Logout */}
      <button
        onClick={handleLogout}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-all text-[#23253a] hover:bg-[#e6e6fa] ${
          isCollapsed ? 'justify-center' : 'justify-start'
        }`}
      >
        <span className="text-lg">
          <FaSignOutAlt />
        </span>
        {!isCollapsed && <span>Sair</span>}
      </button>
    </nav>
  );

  return (
    <>
      {/* Desktop Navbar */}
      <aside
        className={`hidden md:flex flex-col fixed bg-[#f8f9fa] p-5 min-h-screen z-50 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Logo"
            className={`transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-32'}`}
          />
          {!isCollapsed && user && (
            <div className="mt-4 text-center text-sm font-semibold text-gray-700">
              Olá, <span className="text-1">{user.name || user.username || 'Usuário'}</span>!
            </div>
          )}
        </div>
        {renderLinks()}
        <button
          onClick={toggleCollapse}
          className="absolute bottom-5 left-5 bg-[var(--color-2)] text-white p-2 rounded-full"
          aria-label="Toggle Navbar"
        >
          {isCollapsed ? '>' : '<'}
        </button>
      </aside>

      {/* Mobile Navbar */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.aside
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="fixed top-0 left-0 w-[80%] h-full bg-[rgba(0,0,0,0.8)] backdrop-blur-md z-40 text-white p-5 md:hidden shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <img src={logo} alt="Logo" className="h-10" />
              <button
                onClick={toggleMobileMenu}
                aria-label="Fechar menu"
                className="text-white hover:text-gray-300"
              >
                <AiOutlineClose size={28} />
              </button>
            </div>

            {user && (
              <div className="mb-6 text-sm font-medium">
                Olá,{' '}
                <span className="text-[var(--color-2)]">
                  {user.name || user.username || 'Usuário'}
                </span>
                !
              </div>
            )}

            <nav className="flex flex-col gap-2">
              {allowedLinks.map((link) => {
                const isActive = location.pathname === `/${link.path}`;
                return (
                  <button
                    key={link.label}
                    onClick={() => {
                      navigate(`/${link.path}`);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-all ${
                      isActive
                        ? 'bg-[var(--color-2)] text-white shadow-md'
                        : 'hover:bg-[rgba(255,255,255,0.1)]'
                    }`}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="text-base">{link.label}</span>
                  </button>
                );
              })}

              {/* Botão logout no mobile */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left hover:bg-[rgba(255,255,255,0.1)]"
              >
                <span className="text-xl">
                  <FaSignOutAlt />
                </span>
                <span className="text-base">Sair</span>
              </button>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Navbar Toggle Button */}
      {!showMobileMenu && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full backdrop-blur text-white shadow-md"
            aria-label="Abrir Menu"
          >
            <AiOutlineMenu size={24} />
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
