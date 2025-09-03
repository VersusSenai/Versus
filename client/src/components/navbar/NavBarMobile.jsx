import { FaSignOutAlt } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.svg';
import { FaUser } from 'react-icons/fa';

export const NavbarMobile = ({
  show,
  toggle,
  user,
  allowedLinks,
  activePath,
  onNavigate,
  onLogout,
}) => (
  <AnimatePresence>
    {show && (
      <motion.aside
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '-100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className="fixed top-0 left-0 w-[80%] h-full bg-[rgba(0,0,0,0.8)] backdrop-blur-md z-40 text-white p-5 md:hidden shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <img src={logo} alt="Logo" className="h-10" />
          <button onClick={toggle} aria-label="Fechar menu" className="hover:text-gray-300">
            <AiOutlineClose size={28} />
          </button>
        </div>

        {user && (
          <div className="mb-6 text-sm font-medium">
            Olá, <span className="text-[var(--color-2)]">{user.name || user.username}</span>!
          </div>
        )}

        <nav className="flex flex-col gap-2">
          {allowedLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => onNavigate(link.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-all ${
                activePath === `/${link.path}`
                  ? 'bg-[var(--color-2)] text-white shadow-md'
                  : 'hover:bg-[rgba(255,255,255,0.1)]'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="text-base">{link.label}</span>
            </button>
          ))}

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-[rgba(255,255,255,0.1)]"
          >
            <FaSignOutAlt className="text-xl" />
            <span className="text-base">Sair</span>
          </button>
        </nav>
      </motion.aside>
    )}
  </AnimatePresence>
);
