import logo from '../../assets/logo.svg';
import { NavLinks } from './NavLinks';

export const NavbarDesktop = ({
  collapsed,
  toggleCollapse,
  user,
  allowedLinks,
  activePath,
  onNavigate,
  onLogout,
}) => (
  <aside
    className={`hidden md:flex flex-col fixed bg-[#f8f9fa] p-5 min-h-screen z-50 transition-all duration-300 ${
      collapsed ? 'w-20' : 'w-64'
    }`}
  >
    <div className="flex flex-col items-center mb-8">
      <img
        src={logo}
        alt="Logo"
        className={`transition-all duration-300 ${collapsed ? 'w-16' : 'w-32'}`}
      />
      {!collapsed && user && (
        <div className="mt-4 text-center text-sm font-semibold text-gray-700">
          Olá, <span className="text-1">{user.name || user.username}</span>!
        </div>
      )}
    </div>

    <div className="mt-4 flex flex-col gap-2">
      <NavLinks
        links={allowedLinks.map((link) => link)}
        collapsed={collapsed}
        activePath={activePath}
        onNavigate={onNavigate}
      />
    </div>

    <button
      onClick={toggleCollapse}
      className="absolute bottom-5 left-5 bg-[var(--color-2)] text-white p-2 rounded-full"
      aria-label="Toggle Navbar"
    >
      {collapsed ? '>' : '<'}
    </button>
  </aside>
);
