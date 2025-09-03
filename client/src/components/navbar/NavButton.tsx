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
  const baseClasses = 'flex items-center gap-3 px-4 py-2 rounded-lg transition-all';

  const finalVariant = active ? 'contained' : variant;

  const variantClasses = {
    contained:
      'bg-[var(--color-2)] text-white shadow hover:shadow-sm hover:scale-[1.03] hover:cursor-pointer',
    outlined:
      'border border-[var(--color-2)] text-[var(--color-2)] border-3 text-[#23253a] hover:scale-[1.03]  hover:cursor-pointer hover:shadow-sm',
    text: 'text-[#23253a] hover:text-[var(--color-2)] hover:bg-gray-100 hover:scale-[1.03]  hover:cursor-pointer hover:shadow-sm',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[finalVariant]} ${
        collapsed ? 'justify-center' : 'justify-start'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </button>
  );
};
