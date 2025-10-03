import api from '../api';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../redux/userSlice';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // se não tem usuário no Redux, vai direto para login
    if (!user) {
      navigate('/login', { replace: true });
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    navigate('/homepage', {
      replace: true,
      state: { toast: 'Você não tem permissão para acessar esta rota.' },
    });
    return null;
  }

  return children;
};

export default ProtectedRoute;
