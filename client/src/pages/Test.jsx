import React from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";

import BlurText from "../ui/blocks/TextAnimations/BlurText/BlurText.jsx";
import Aurora from "../ui/blocks/Backgrounds/Aurora/Aurora";

const handleAnimationComplete = () => {
  console.log("Animation completed!");
};

const Login = () => {
  return (
    <div className="relative w-full h-screen bg-[var(--color-accent)] xl:bg-[url(./assets/bg.gaming.png)] bg-cover bg-no-repeat">
      {/* Background */}
      <Aurora
        colorStops={["rgba(0, 0, 0, 0.3)"]}
        blend={0.5}
        amplitude={0.5}
        speed={0.5}
        className="fixed top-0 left-0 w-full h-full -z-10"
      />

      {/* Container */}
      <div className="p-5 absolute top-1/2 right-0 transform -translate-x-0 -translate-y-1/2 z-10 flex flex-col xl:p-0 xl:flex-row items-center justify-center w-full max-w-[1200px] xl:mr-15">
        {/* Bem-vindo Text */}
        <div className="relative pb-7 text-[var(--color-text)] text-5xl font-bold justify-center xl:text-6xl text-center mb-8 w-full max-w-[450px] xl:max-w-[1000px]">
          <BlurText
            text="Seja bem-vindo ao Versus!"
            delay={3000}
            animateBy="letters"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="w-full"
          />
          {/* Underline */}
          <div className="absolute bottom-0 right-0 w-0 h-[3px] bg-[var(--color-primary)] animate-underline"></div>
          </div>

        {/* Login Box */}
        <div className="bg-[var(--color-surface)] p-10 rounded-2xl shadow-lg w-full max-w-[420px] md:max-w-[400px] text-[var(--color-text)] backdrop-blur-xl flex flex-col items-center">
          {/* User Input Label */}
          <label
            htmlFor="username"
            className="text-sm text-[var(--color-muted)] mb-2 w-full text-left"
          >
            Entrar
          </label>
          <input
            id="username"
            type="text"
            placeholder="Usuário"
            className="w-full p-3 mb-3 rounded-xl bg-[var(--color-input-bg)] border border-[var(--color-input-border)] focus:outline-none"
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-3 mb-3 rounded-xl bg-[var(--color-input-bg)] border border-[var(--color-input-border)] focus:outline-none"
          />

          {/* Remember Me */}
          <div className="flex items-center w-full mb-4">
            <input type="checkbox" id="remember" className="mr-2" />
            <label
              htmlFor="remember"
              className="text-sm text-[var(--color-muted)]"
            >
              Se lembre de mim
            </label>
          </div>

          {/* Login Button */}
          <button className="w-full p-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded font-semibold hover:opacity-80">
            Go!
          </button>

          {/* Forgot Password */}
          <p className="text-center text-sm mt-3 cursor-pointer hover:underline">
            Esqueceu a senha?
          </p>

          {/* Social Login */}
          <div className="flex items-center my-4 w-full">
            <div className="flex-1 border-t border-[var(--color-input-border)]"></div>
            <p className="mx-2 text-sm text-[var(--color-muted)]">Ou</p>
            <div className="flex-1 border-t border-[var(--color-input-border)]"></div>
          </div>

          <div className="flex justify-center gap-4 mb-15">
            <FaGoogle className="text-2xl cursor-pointer" />
            <FaGithub className="text-2xl cursor-pointer" />
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-[var(--color-muted)]">
            Ainda não tem uma conta?{" "}
            <span className="text-[var(--color-primary)] cursor-pointer hover:underline">
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
    </div>
  );
};

export default Login;
