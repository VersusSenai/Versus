export const VersusIconButton = ({
  icon,
  onClick,
  color = 'default',
}: {
  icon: React.ReactNode;
  onClick?: () => void;
  color?: 'default' | 'danger' | 'primary';
}) => {
  const baseClasses = 'flex items-center justify-center p-3 rounded-lg transition-all duration-200';

  const colorClasses = {
    default: 'bg-transparent text-white hover:bg-white/10 hover:scale-[1.05] cursor-pointer',
    danger:
      'border border-red-500 text-red-500 hover:bg-red-500/10 hover:scale-[1.05] cursor-pointer',
    primary:
      'border bg-transparent border-[var(--color-2)] text-[var(--color-2)] border-3 hover:text-white hover:bg-[var(--color-2)] hover:scale-[1.05] cursor-pointer',
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${colorClasses[color]}`}>
      {icon}
    </button>
  );
};
