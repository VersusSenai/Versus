import React, { useState, useRef } from 'react';
import { HiCamera, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const AvatarUpload = ({ currentImage, onImageChange, className = '', disabled = false }) => {
  const [preview, setPreview] = useState(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        if (onImageChange) {
          onImageChange(file, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageChange) {
      onImageChange('REMOVE', null);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative group">
        {/* Avatar Circle */}
        <motion.div
          whileHover={disabled ? {} : { scale: 1.05 }}
          className={`relative w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-300 ${
            disabled ? 'cursor-default' : 'cursor-pointer'
          } ${
            isDragging
              ? 'border-[var(--color-2)] shadow-lg shadow-[var(--color-2)]/50'
              : 'border-[var(--color-1)] shadow-xl shadow-[var(--color-1)]/25'
          }`}
          onClick={handleClick}
          onDragOver={disabled ? undefined : handleDragOver}
          onDragLeave={disabled ? undefined : handleDragLeave}
          onDrop={disabled ? undefined : handleDrop}
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-1)] to-[var(--color-2)]" />

          {/* Preview Image or Placeholder */}
          {preview ? (
            <img
              src={preview}
              alt="Avatar Preview"
              className="relative z-10 w-full h-full object-cover"
            />
          ) : (
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <svg className="text-white w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {/* Overlay with Camera Icon */}
          {!disabled && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
              <motion.div
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.2, rotate: 5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <HiCamera className="text-white w-10 h-10" />
              </motion.div>
            </div>
          )}

          {/* Dragging Overlay */}
          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[var(--color-2)]/80 flex items-center justify-center z-30"
              >
                <p className="text-white font-bold text-center px-4">Solte a imagem aqui</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Remove Button */}
        <AnimatePresence>
          {preview && !disabled && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg flex items-center justify-center z-30 transition-colors duration-200"
              type="button"
            >
              <HiX size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Instructions */}
      {!disabled && (
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            type="button"
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[var(--color-1)]/20 to-[var(--color-2)]/20 hover:from-[var(--color-1)]/30 hover:to-[var(--color-2)]/30 text-[var(--color-2)] hover:text-white border border-[var(--color-2)]/30 hover:border-[var(--color-2)]/50 transition-all duration-300 font-medium text-sm"
          >
            Escolher Imagem
          </motion.button>
          <p className="text-white/60 text-xs mt-2">ou arraste e solte uma imagem</p>
          <p className="text-white/40 text-xs mt-1">PNG, JPG ou GIF (máx. 5MB)</p>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
export { AvatarUpload };
