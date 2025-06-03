import React from 'react';

const Newsletter = () => {
  return (
    <div className="w-full py-16 text-white px-4 rounded-xl">
      <div className="max-w-[1240px] mx-auto grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 my-4">
          <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold py-2">
            Quer ficar por dentro das últimas novidades e dicas para seus torneios?
          </h1>
          <p>Receba atualizações exclusivas, dicas e novidades do Versus direto no seu e-mail.</p>
        </div>
        <div className="my-4">
          <form className="flex flex-col sm:flex-row items-center justify-between w-full">
            <input
              className="p-3 flex w-full rounded-md text-accent border-1"
              type="email"
              placeholder="Digite seu e-mail"
              required
            />
            <button
              type="submit"
              className="bg-[var(--color-2)] text-[var(--color-dark)] rounded-md font-medium w-[200px] ml-4 my-6 px-6 py-3 hover:bg-[var(--color-dark)] hover:text-[var(--color-2)] transition"
            >
              Quero Receber
            </button>
          </form>
          <p className="text-sm mt-2">
            Nós respeitamos sua privacidade e nunca compartilhamos seus dados.{' '}
            <span className="text-accent cursor-pointer hover:underline">
              Política de Privacidade
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
