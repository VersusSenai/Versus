import api from '@/api';
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
    const fetchUser = async () => {
      try {
        const response = await api.get("/user/me");
        dispatch(login(response.data));
      } catch (error) {
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [dispatch, navigate]); // ❌ não inclui `user` aqui

  if (loading) {
    return <div>Carregando...</div>;
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
