import React, { useState } from 'react';
import api from '../api'; // Ajuste conforme necessário

const CreateTournaments = ({ fetchTorneios }) => {
  const [nome, setNome] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [multiplayer, setMultiplayer] = useState(false);
  const [model, setModel] = useState('P'); // 'P' = Presencial, 'O' = Online
  const [loading, setLoading] = useState(false);

  const criarTorneio = async () => {
    if (!nome || !description || !startDate || !endDate || maxPlayers < 2 || !model) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    if (description.length > 250) {
      alert('A descrição deve ter no máximo 250 caracteres.');
      return;
    }

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < now) {
      alert('A data de início deve ser no futuro.');
      return;
    }

    if (start > end) {
      alert('A data de início não pode ser após a data de término.');
      return;
    }

    if (maxPlayers % 2 !== 0) {
      alert('A quantidade de jogadores deve ser par.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/event', {
        name: nome,
        description,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        maxPlayers: parseInt(maxPlayers),
        multiplayer,
        model,
      });

      alert('Evento criado com sucesso!');
      setNome('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setMaxPlayers(8);
      setMultiplayer(false);
      setModel('P');
      if (fetchTorneios) fetchTorneios();
    } catch (e) {
      alert(e.response?.data?.message || 'Erro ao criar torneio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Criar Novo Torneio</h2>

      <div className="mb-2">
        <label className="block font-medium">Nome do Torneio</label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <label className="block font-medium">Descrição</label>
        <textarea
          className="border p-2 w-full rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={250}
          rows={3}
          placeholder="Descrição do evento (máx. 250 caracteres)"
        />
      </div>

      <div className="mb-2">
        <label className="block font-medium">Modelo do Evento</label>
        <select
          className="border p-2 w-full rounded"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="P">Presencial</option>
          <option value="O">Online</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="block font-medium">Data de Início</label>
        <input
          type="datetime-local"
          className="border p-2 w-full rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <label className="block font-medium">Data de Término</label>
        <input
          type="datetime-local"
          className="border p-2 w-full rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate}
        />
      </div>

      <div className="mb-2">
        <label className="block font-medium">Quantidade Máxima de Jogadores</label>
        <input
          type="number"
          className="border p-2 w-full rounded"
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(e.target.value)}
          min={2}
        />
      </div>

      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={multiplayer}
            onChange={(e) => setMultiplayer(e.target.checked)}
            className="mr-2"
          />
          Evento Multiplayer
        </label>
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={criarTorneio}
        disabled={loading}
      >
        {loading ? 'Criando...' : 'Criar Evento'}
      </button>
    </div>
  );
};

export default CreateTournaments;
