import { motion } from 'framer-motion';

export const NavButton = ({
  label,
  icon,
  onClick,
  active,
  collapsed,
  variant = 'outlined',
}) => {
  // validação básica
  if (!label) {
    console.error('NavButton: label é obrigatório');
    return null;
  }

  const finalVariant = active ? 'contained' : variant;

  const variantClasses = {
    contained: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg',
    outlined: 'bg-white/10 text-purple-200 border border-purple-600/30 hover:bg-white/20',
    text: 'text-purple-200 hover:bg-white/10',
  };

  const baseClasses = `
    w-full flex items-center gap-3 px-4 py-3 rounded-xl
    transition-all duration-300 ease-out
    hover:shadow-lg hover:scale-105 cursor-pointer
    ${variantClasses[finalVariant]}
  `;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={baseClasses}
      aria-label={label}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      
      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="font-medium text-sm truncate"
        >
          {label}
        </motion.span>
      )}
    </motion.button>
  );
};
