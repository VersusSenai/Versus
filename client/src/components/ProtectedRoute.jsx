import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      navigate('/homepage', {
        replace: true,
        state: { toast: 'Você não tem permissão para acessar esta rota.' },
      });
    }
  }, [user, allowedRoles, location, navigate]);

  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
