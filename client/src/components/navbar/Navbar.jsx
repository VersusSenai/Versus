import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  MdOutlineEmojiEvents,
  MdOutlinePeopleAlt,
  MdOutlineAddBox,
  MdGroups,
} from 'react-icons/md';
import { AiOutlineMenu } from 'react-icons/ai';
import { logout } from '../../redux/userSlice';
import { NavbarDesktop } from './NavBarDesktop';
import { NavbarMobile } from './NavBarMobile';
import { FaUser } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';

const Navbar = ({ onWidthChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    onWidthChange(collapsed ? 80 : 256);
  }, [collapsed, onWidthChange]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setShowMobileMenu(false);
  };

  const links = useMemo(
    () => [
      {
        label: 'Usuários',
        icon: <MdOutlinePeopleAlt />,
        path: 'users',
        roles: ['A'],
        variant: 'outlined',
      },
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
        icon: <MdGroups />,
        path: 'teams',
        roles: ['A'],
        variant: 'outlined',
      },
      {
        label: 'Conta',
        icon: <FaUser />,
        path: 'account',
        roles: ['A', 'P', 'O'],
        variant: 'outlined',
      },

      {
        label: 'Sair',
        icon: <FaSignOutAlt />,
        action: handleLogout,
        roles: ['A', 'P', 'O'],
        variant: 'text',
      },
    ],
    [handleLogout]
  );

  // depois filtra só os links do usuário
  const allowedLinks = user ? links.filter((l) => l.roles.includes(user.role)) : [];

  const handleNavigate = (path) => {
    navigate(`/${path}`);
    setShowMobileMenu(false);
  };

  if (user === null) {
    return (
      <aside
        className={`hidden md:flex flex-col fixed bg-[#f8f9fa] p-5 min-h-screen z-50 ${collapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex items-center justify-center h-full text-gray-500">Carregando...</div>
      </aside>
    );
  }

  return (
    <>
      <NavbarDesktop
        collapsed={collapsed}
        toggleCollapse={() => setCollapsed(!collapsed)}
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
          <button
            onClick={() => setShowMobileMenu(true)}
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
