import { motion } from 'framer-motion';

export const NavButton = ({
  label,
  icon,
  onClick,
  active,
  collapsed,
  variant = 'outlined',
}: {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  collapsed?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
}) => {
  const finalVariant = active ? 'contained' : variant;

  const variantClasses = {
    contained:
      'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 border-l-4 border-purple-400',
    outlined:
      'text-purple-200 hover:bg-gradient-to-r hover:from-purple-800/50 hover:to-indigo-800/50 hover:text-white backdrop-blur-sm',
    text: 'text-purple-300 hover:text-purple-100 hover:bg-purple-800/30',
  };

  return (
    <motion.button
      whileHover={{ 
        scale: 1.02, 
        x: collapsed ? 0 : 6,
        y: -1
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden cursor-pointer ${
        collapsed ? 'justify-center' : 'justify-start'
      } ${variantClasses[finalVariant]}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/0 to-indigo-400/0 group-hover:from-purple-400/10 group-hover:via-white/5 group-hover:to-indigo-400/10 transition-all duration-300" />
      
      <div className="relative z-10 text-xl transition-all duration-300 group-hover:scale-110">
        {icon}
      </div>
      
      {!collapsed && (
        <motion.span 
          className="relative z-10 font-semibold text-base transition-all duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {label}
        </motion.span>
      )}
      
      
      {active && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 4, opacity: 1 }}
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-b from-purple-400 via-indigo-400 to-purple-400 rounded-r-full"
        />
      )}
    </motion.button>
  );
};
