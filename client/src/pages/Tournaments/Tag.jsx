import React from 'react';

const Tag = ({ children }) => (
  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 mb-2 px-3 py-1 rounded-full select-none">
    {children}
  </span>
);

export default Tag;
