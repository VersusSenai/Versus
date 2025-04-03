import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.user.user !== null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!isAuthenticated) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="homepage">
      <h1>Bem-vindo, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
};

export default Homepage;
