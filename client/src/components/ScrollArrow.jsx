import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ScrollArrow = ({ targetId, direction = 'down' }) => {
  const scrollToSection = () => {
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={scrollToSection}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-[var(--color-2)] text-black p-3 rounded-full shadow-lg animate-bounce z-50"
    >
      {direction === 'up' ? (
        <FaChevronUp className="text-2xl" />
      ) : (
        <FaChevronDown className="text-2xl" />
      )}
    </button>
  );
};

export default ScrollArrow;
