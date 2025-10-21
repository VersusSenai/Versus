import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import Tournaments from './pages/TournamentPage';
import CreateTournaments from './pages/CreateTournamentsPage';
import Layout from './components/Layout';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { AnimatePresence } from 'framer-motion';
import PageWrapper from './components/transition/PageTransition';
import ProtectedRoute from './components/ProtectedRoute';
import Users from './pages/Users';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccountPage from './pages/AccountPage';
import AccountEditPage from './pages/AccountEditPage';
import { Teams } from './pages/TeamsPage';
import { DataTableProvider } from './context/DataTableContext';
import { NavbarProvider } from './context/NavbarContext';
import { TeamsPageProvider } from './context/TeamsPageContext';
import { NotificationProvider } from './context/NotificationContext';

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
            <ProtectedRoute allowedRoles={['A']}>
              <Layout>
                <PageWrapper>
                  <DataTableProvider>
                    <Users />
                  </DataTableProvider>
                </PageWrapper>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tournaments"
          element={
            <ProtectedRoute>
              <Layout>
                <PageWrapper>
                  <Tournaments />
                </PageWrapper>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/createTournaments"
          allowedRoles={['A', 'O']}
          element={
            <ProtectedRoute>
              <Layout>
                <PageWrapper>
                  <CreateTournaments />
                </PageWrapper>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <ProtectedRoute allowedRoles={['A', 'P']}>
              <Layout>
                <PageWrapper>
                  <TeamsPageProvider>
                    <Teams />
                  </TeamsPageProvider>
                </PageWrapper>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Layout>
                <PageWrapper>
                  <AccountPage />
                </PageWrapper>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <PageWrapper>
                  <AccountEditPage />
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <NotificationProvider>
        <NavbarProvider>
          <Router>
            <AnimatedRoutes />
          </Router>
        </NavbarProvider>
      </NotificationProvider>
    </Provider>
  );
}

export default App;
