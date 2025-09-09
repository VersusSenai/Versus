export const VersusButton = ({
  label,
  icon,
  onClick,
  variant = 'contained',
  fullWidth = false,
}: {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: 'contained' | 'outlined' | 'text';
  fullWidth?: boolean;
}) => {
  const baseClasses =
    'flex items-center justify-center gap-3 px-4 py-2 rounded-lg font-semibold transition-all duration-200';

  const variantClasses = {
    contained:
      'bg-[var(--color-2)] text-white shadow hover:shadow-sm hover:scale-[1.03] cursor-pointer',
    outlined:
      'border border-[var(--color-2)] text-[var(--color-2)] bg-transparent hover:scale-[1.03] cursor-pointer hover:shadow-sm',
    text: 'text-white hover:text-[var(--color-3)] hover:bg-white/10 hover:scale-[1.03] cursor-pointer hover:shadow-sm',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {label}
    </button>
  );
};
