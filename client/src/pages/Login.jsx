import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';
import BlurText from '../ui/blocks/TextAnimations/BlurText/BlurText.jsx';
import Particles from '../ui/blocks/Backgrounds/Particles/Particles.jsx';
import { toast, ToastContainer } from 'react-toastify';
import Logo from '../assets/logo-branco.svg';
import api from '../api';

import { useDispatch } from 'react-redux';
import { login } from '../redux/userSlice';

const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Preencha todos os campos!');
      return;
    }

    setLoading(true);
    try {
      console.log('Enviando:', { email, password });

      const response = await api.post(
        '/auth/login',
        { email, password },
        {
          withCredentials: true,
        }
      );

      if ((response.status = 200)) {
        toast.success('Login bem-sucedido!');
        localStorage.setItem('token', response.data.token);

        dispatch(login(response.data.user));

        setTimeout(() => {
          navigate('/jogadores');
        }, 1500);
      } else {
        toast.error('Usuário ou senha incorretos!');
      }
    } catch {
      toast.error('Erro ao conectar ao servidor!');
    }
    setLoading(false);
  };

  return (
    <div className="relative w-full h-screen bg-black bg-linear-to-t from-[var(--color-dark)] to-[var(--color-2)] bg-cover bg-no-repeat">
      {/* Background */}
      <Particles
        particleColors={['#ffffff', '#ffffff']}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
        className="absolute top-0 left-0 w-full h-full"
      />

      {/* Container */}
      <div className="p-5 absolute top-1/2 right-0 pointer-events-none transform max-h-screen overflow-auto -translate-x-0 -translate-y-1/2 flex flex-col xl:p-0 xl:flex-row items-center justify-center w-full max-w-[1200px] xl:mr-15">
        {/* Bem-vindo Text */}
        <div className="relative pb-7 text-[var(--color-text)] text-5xl font-bold justify-center xl:text-6xl text-center mb-8 w-full max-w-[450px] xl:max-w-[1000px]">
          <BlurText
            text="Seja bem-vindo ao Versus!"
            delay={150}
            animateBy="letters"
            direction="bottom"
            onAnimationComplete={handleAnimationComplete}
            className="hidden xl:block xl:w-full xl:justify-center xl:select-none"
          />
          <BlurText
            text="Bem-vindo!"
            delay={150}
            animateBy="letters"
            direction="bottom"
            onAnimationComplete={handleAnimationComplete}
            className="block justify-center xl:hidden xl:w-full xl:justify-center xl:select-none"
          />
          <div className="absolute bottom-0 right-0 w-0 h-[5px] animate-underline"></div>
        </div>

        {/* Login Box */}
        <div className="relative pointer-events-auto bg-[var(--color-surface)] p-10 rounded-2xl shadow-lg w-full xl:max-w-[420px] max-w-[400px] text-[var(--color-text)] backdrop-blur-xl flex flex-col items-center">
          <img src={Logo} alt="Logo" className="hidden xl:block w-[120px]" />

          {/* Input Fields */}
          <label
            htmlFor="email"
            className="text-sm text-[var(--color-muted)] mb-2 w-full text-left"
          >
            Entrar
          </label>
          <input
            id="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-3 rounded-xl bg-[var(--color-input-bg)] border border-[var(--color-input-border)] focus:outline-none"
          />

          <div className="relative w-full mb-3">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-[var(--color-input-bg)] border border-[var(--color-input-border)] focus:outline-none"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center w-full mb-4">
            <input type="checkbox" id="remember" className="mr-2" />
            <label htmlFor="remember" className="text-sm text-[var(--color-muted)]">
              Se lembre de mim
            </label>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full p-3 bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] rounded font-semibold hover:opacity-80"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Entrar'}
          </button>

          {/* Forgot Password */}
          <p
            onClick={() => {
              navigate('/');
            }}
            className="text-center text-sm mt-3 cursor-pointer hover:underline"
          >
            Esqueceu a senha?
          </p>

          {/* Social Login */}
          <div className="flex items-center my-4 w-full">
            <div className="flex-1 border-t border-[var(--color-input-border)]"></div>
            <p className="mx-2 text-sm text-[var(--color-muted)]">Ou</p>
            <div className="flex-1 border-t border-[var(--color-input-border)]"></div>
          </div>

          <div className="flex justify-center gap-4 mb-15">
            <FaGoogle className="text-2xl cursor-pointer transition-transform transform hover:rotate-12 duration-300" />
            <FaGithub className="text-2xl cursor-pointer transition-transform transform hover:rotate-12 duration-300" />
          </div>

          {/* Register Link */}
          <p
            onClick={() => {
              navigate('/register');
            }}
            className="text-center text-sm text-[var(--color-muted)]"
          >
            Ainda não tem uma conta?{' '}
            <span className="text-[var(--color-1)] cursor-pointer hover:underline">
              Cadastre-se
            </span>
          </p>

          {/* Terms & Support */}
          <div className="flex justify-between w-full text-xs mt-4">
            <p className="cursor-pointer hover:underline">Termos & Condições</p>
            <p className="cursor-pointer hover:underline">Suporte</p>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: 'var(--color-dark)',
          color: 'var(--color-text)',
          borderRadius: '12px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
          padding: '12px 16px',
          fontSize: '14px',
          fontFamily: 'var(--font-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      />
    </div>
  );
};

export default Login;
