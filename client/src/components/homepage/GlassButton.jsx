import React from 'react';
import { motion } from 'framer-motion';

/**
 * Botão com estilo Glass Morphism consistente com o design da homepage
 * @param {Object} props
 * @param {Function} props.onClick - Função chamada ao clicar
 * @param {React.ReactNode} props.children - Conteúdo do botão
 * @param {boolean} props.disabled - Se o botão está desabilitado
 * @param {string} props.variant - Variante do botão: 'primary' (roxo) ou 'secondary' (branco)
 * @param {string} props.className - Classes adicionais
 * @param {string} props.ariaLabel - Label para acessibilidade
 * @param {string} props.type - Tipo do botão (button, submit, reset)
 * @param {boolean} props.fullWidth - Se o botão deve ocupar toda a largura
 */
const GlassButton = ({
  onClick,
  children,
  disabled = false,
  variant = 'primary',
  className = '',
  ariaLabel,
  type = 'button',
  fullWidth = false,
}) => {
  const isPrimary = variant === 'primary';

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`relative group cursor-pointer ${fullWidth ? 'w-full' : ''} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {/* Glow effect */}
      <span
        className="absolute inset-0 rounded-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isPrimary
            ? 'radial-gradient(closest-side, color-mix(in oklch, var(--color-2) 25%, transparent), transparent 70%)'
            : 'radial-gradient(closest-side, rgba(255,255,255,0.15), transparent 70%)',
          filter: 'blur(12px)',
          zIndex: -1,
        }}
      />
      
      {/* Button body com borda gradiente */}
      <div
        className="relative rounded-xl"
        style={{
          padding: 1.5,
          background: isPrimary
            ? 'conic-gradient(from 180deg at 50% 50%, var(--color-1), var(--color-2), var(--color-1))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
        }}
      >
        {/* Inner background */}
        <div 
          className="relative rounded-[10px] overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Overlay escuro */}
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] group-hover:bg-[rgba(0,0,0,0.4)] transition-colors rounded-[10px]" />
          
          {/* Content */}
          <div className="relative flex items-center justify-center gap-2 py-3 px-6 text-white font-semibold">
            {children}
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default GlassButton;
