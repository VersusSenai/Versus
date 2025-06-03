// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import Torneios from './pages/Torneios';
import Jogadores from './pages/Jogadores';
import Layout from './components/Layout';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { AnimatePresence } from 'framer-motion';
import PageWrapper from './components/transition/PageTransition';
import ProtectedRoute from './components/ProtectedRoute';
import Relatorios from './pages/Relatorios';
import Users from './pages/Users';

// Componente simples para a página 404
const NotFound = () => (
  <div className="flex justify-center items-center h-screen">
    <h1 className="text-4xl font-bold">404 - Página não encontrada</h1>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<HomePage />} />

        {/* Rotas privadas */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout>
                <PageWrapper>
                  <Users />
                </PageWrapper>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/torneios"
          element={
            <ProtectedRoute>
              <Layout>
                <PageWrapper>
                  <Torneios />
                </PageWrapper>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/relatorios"
          element={
            <ProtectedRoute>
              <Layout>
                <PageWrapper>
                  <Relatorios />
                </PageWrapper>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rota 404 */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <NotFound />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AnimatedRoutes />
      </Router>
    </Provider>
  );
}

export default App;
