import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaHome, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { MdSettings, MdOutlineEmojiEvents, MdOutlineAssignment, MdHowToReg } from 'react-icons/md';
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

  // Função para logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setShowMobileMenu(false);
  };

  const links = [
    { label: 'Usuários', icon: <MdOutlineEmojiEvents />, path: 'users' },
    { label: 'Torneios', icon: <MdOutlineEmojiEvents />, path: 'torneios' },
    { label: 'Jogadores', icon: <FaUsers />, path: 'jogadores' },
    { label: 'Organizadores', icon: <MdHowToReg />, path: 'organizadores' },
    { label: 'Inscrições', icon: <MdOutlineAssignment />, path: 'inscricoes' },
    { label: 'Relatórios', icon: <MdOutlineAssignment />, path: 'relatorios' },
    { label: 'Configurações', icon: <MdSettings />, path: 'configuracoes' },
    // Remove o logout do array para colocar botão separado
  ];

  const renderLinks = () => (
    <nav className="flex flex-col gap-2">
      {links.map((link) => {
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
        className={`hidden md:flex flex-col fixed bg-[#f8f9fa] p-5 min-h-screen z-50 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
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
          className="absolute bottom-5 left-5 bg-[var(--color-2] text-white p-2 rounded-full"
          aria-label="Toggle Navbar"
        >
          {isCollapsed ? '>' : '<'}
        </button>
      </aside>

      {/* Mobile Navbar */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-[70%] h-full bg-[#000300] z-40 text-white p-5 md:hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <img src={logo} alt="Logo" className="h-10" />
              {!isCollapsed && user && (
                <div className="text-sm font-semibold">
                  Olá,{' '}
                  <span className="text-[var(--color-2)]">
                    {user.name || user.username || 'Usuário'}
                  </span>
                  !
                </div>
              )}
              <button onClick={toggleMobileMenu} aria-label="Close Menu">
                <AiOutlineClose size={28} />
              </button>
            </div>
            {links.map((link) => {
              const isActive = location.pathname === `/${link.path}`;
              return (
                <button
                  key={link.label}
                  onClick={() => {
                    navigate(`/${link.path}`);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-left p-4 border-b border-gray-600 ${isActive ? 'bg-[var(--color-2)] text-white' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.label}</span>
                  </div>
                </button>
              );
            })}
            {/* Botão logout no mobile */}
            <button
              onClick={handleLogout}
              className="w-full text-left p-4 border-b border-gray-600 hover:bg-[var(--color-2)]"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  <FaSignOutAlt />
                </span>
                <span>Sair</span>
              </div>
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Navbar Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50 text-black">
        <button onClick={toggleMobileMenu} aria-label="Open Mobile Navbar">
          {!showMobileMenu && <AiOutlineMenu size={28} />}
        </button>
      </div>
    </>
  );
};

export default Navbar;
