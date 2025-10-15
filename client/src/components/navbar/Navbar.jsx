import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MdOutlineEmojiEvents, MdOutlinePeopleAlt, MdOutlineAddBox, MdOutlineGroups } from 'react-icons/md';
import { AiOutlineMenu } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { logout } from '../../redux/userSlice';
import NavbarDesktop from './NavBarDesktop';
import NavbarMobile from './NavBarMobile';
import { useNavbar } from '../../context/NavbarContext';
import api from '../../api';

const Navbar = ({ onWidthChange }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { collapsed, toggleCollapse } = useNavbar();

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    onWidthChange(collapsed ? 96 : 320);
  }, [collapsed, onWidthChange]);

  const handleLogout = async () => {
    try {
      // chamar rota de logout do backend
      await api.post('/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      dispatch(logout());
              window.location.href = "/login";
      setShowMobileMenu(false);
    }
  };

  const links = useMemo(
    () => [
      { label: 'Usuários', icon: <MdOutlinePeopleAlt />, path: 'users', roles: ['A'], variant: 'outlined'   },
      {
        label: 'Torneios',
        icon: <MdOutlineEmojiEvents />,
        path: 'tournaments',
        roles: ['A', 'P', 'O'],
        variant: 'outlined',
      },
      {
        label: 'Criar Torneios',
        icon: <MdOutlineAddBox />,
        path: 'createTournaments',
        roles: ['A', 'O'],
        variant: 'outlined',
      },

      {
        label: 'Times',
        icon: <MdOutlineGroups />,
        path: 'teams',
        roles: ['A'],
        variant: 'outlined',
      },
    ],
    [handleLogout]
  );

  const allowedLinks = user ? links.filter((l) => l.roles.includes(user.role)) : [];

  const handleNavigate = (path) => {
    navigate(`/${path}`);
    setShowMobileMenu(false);
  };

  if (!user) {
    return (
      <aside
        className={`hidden md:flex flex-col fixed bg-[#f8f9fa] p-5 min-h-screen z-50 ${collapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex items-center justify-center h-full text-gray-500">carregando...</div>
      </aside>
    );
  }

  return (
    <>
      <NavbarDesktop
        collapsed={collapsed}
        toggleCollapse={toggleCollapse}
        user={user}
        allowedLinks={allowedLinks}
        activePath={location.pathname}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <NavbarMobile
        show={showMobileMenu}
        toggle={() => setShowMobileMenu(!showMobileMenu)}
        user={user}
        allowedLinks={allowedLinks}
        activePath={location.pathname}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {!showMobileMenu && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMobileMenu(true)}
            className="p-4 rounded-2xl shadow-2xl border border-purple-600/30 text-purple-200 hover:text-white transition-all duration-300 backdrop-blur-sm cursor-pointer"
            style={{ backgroundColor: 'var(--color-dark)' }}
            aria-label="abrir menu"
          >
            <AiOutlineMenu size={28} />
          </motion.button>
        </div>
      )}
    </>
  );
};

export default Navbar;
