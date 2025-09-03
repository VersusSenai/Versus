import React from 'react';

export const VersusInput = ({
  type = 'text',
  placeholder,
  value,
  onChange,
}: {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3 rounded-xl bg-[var(--color-input-bg)] border border-[var(--color-input-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-2)] text-white placeholder-gray-300"
    />
  );
};
