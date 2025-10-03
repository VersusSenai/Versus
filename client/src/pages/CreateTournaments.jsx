import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-toastify';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { CalendarHeart, Users, Gamepad, ArrowLeft } from 'lucide-react';
import api from '../api';

import teamImage from '../assets/team.jpeg';
import soloImage from '../assets/solo.jpg';

const transition = { duration: 0.4, ease: 'easeInOut' };
const variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const CreateTournaments = ({ fetchTorneios }) => {
  const [step, setStep] = useState('choose');
  const [nome, setNome] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('8');
  const [multiplayer, setMultiplayer] = useState(false);
  const [model, setModel] = useState('P');
  const [loading, setLoading] = useState(false);

  const criarTorneio = async () => {
    if (!nome || !description || !startDate || !endDate || !maxPlayers || !model) {
      toast.error('Preencha todos os campos corretamente.');
      return;
    }

    if (description.length > 250) {
      toast.error('A descrição deve ter no máximo 250 caracteres.');
      return;
    }

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < now) {
      toast.error('A data de início deve ser no futuro.');
      return;
    }

    if (start > end) {
      toast.error('A data de início não pode ser após a data de término.');
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

      toast.success('Evento criado com sucesso!');
      setNome('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setMaxPlayers('8');
      setMultiplayer(false);
      setModel('P');
      if (fetchTorneios) fetchTorneios();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erro ao criar torneio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto relative flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <AnimatePresence mode="wait" initial={false}>
        {step === 'choose' && (
          <motion.div
            key="choose"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={transition}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <Card
              onClick={() => setStep('teams')}
              className="cursor-pointer pt-6 pb-0 overflow-hidden hover:scale-[1.02] transition-transform bg-[var(--color-dark)] text-white border border-white/10 shadow-md rounded-2xl"
            >
              <CardHeader className="flex items-center gap-3 pb-2">
                <Users className="text-green-400" size={28} />
                <CardTitle className="text-xl">Criar Torneio por Times</CardTitle>
              </CardHeader>
              <CardContent className="text-white/70 px-6 pb-4">
                Modo em que os jogadores competem em equipes.
              </CardContent>
              <img
                src={teamImage}
                alt="Torneio por Times"
                className="w-full h-full object-cover rounded-b-2xl"
              />
            </Card>

            <Card
              onClick={() => setStep('solo')}
              className="cursor-pointer pt-6 pb-0 overflow-hidden hover:scale-[1.02] transition-transform bg-[var(--color-dark)] text-white border border-white/10 shadow-md rounded-2xl"
            >
              <CardHeader className="flex items-center gap-3 pb-2">
                <Gamepad className="text-pink-500" size={28} />
                <CardTitle className="text-xl">Criar Torneio Sem Times</CardTitle>
              </CardHeader>
              <CardContent className="text-white/70 px-6 pb-4">
                Modo individual, cada jogador compete por si só.
              </CardContent>
              <img
                src={soloImage}
                alt="Torneio Solo"
                className="w-full h-full object-cover rounded-b-2xl"
              />
            </Card>
          </motion.div>
        )}

        {step === 'teams' && (
          <motion.div
            key="teams"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={transition}
          >
            <Card className="max-w-2xl mx-auto mt-16 bg-[var(--color-dark)] text-white border border-white/10 shadow-md text-center py-6 px-6">
              <h2 className="text-2xl font-bold mb-4">🚧 Em Construção</h2>
              <p className="text-white/70">
                A funcionalidade de torneios por times ainda está sendo desenvolvida.
              </p>
              <Button
                className="mt-6 bg-green-600 hover:bg-green-700"
                onClick={() => setStep('choose')}
              >
                Voltar
              </Button>
            </Card>
          </motion.div>
        )}

        {step === 'solo' && (
          <motion.div
            key="solo"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={transition}
            className="relative" // Adicionado aqui para o botão absolute funcionar corretamente
          >
            <Button
              variant="ghost"
              className="absolute top-4 left-4 flex items-center gap-1 text-white hover:bg-white/10"
              onClick={() => setStep('choose')}
            >
              <ArrowLeft size={18} />
              Voltar
            </Button>

            <Card className="bg-[var(--color-dark)] text-white border border-white/10 rounded-3xl shadow-md pt-8">
              <CardHeader className="flex items-center gap-3 pb-4 pt-6 px-6">
                <CalendarHeart className="text-pink-500" size={28} />
                <CardTitle className="text-2xl font-bold">Criar Novo Torneio</CardTitle>
              </CardHeader>

              <CardContent className="grid md:grid-cols-2 gap-6 px-6 pb-8 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Torneio</Label>
                  <Input
                    id="nome"
                    className="bg-white text-black"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelo">Modelo do Evento</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="bg-white text-black">
                      <SelectValue placeholder="Selecione o modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P">Presencial</SelectItem>
                      <SelectItem value="O">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={250}
                    placeholder="Descrição do evento (máx. 250 caracteres)"
                    className="bg-white text-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    className="bg-white text-black"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de Término</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    className="bg-white text-black"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPlayers">Máximo de Jogadores</Label>
                  <Select value={maxPlayers} onValueChange={setMaxPlayers}>
                    <SelectTrigger className="bg-white text-black">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">8 Jogadores</SelectItem>
                      <SelectItem value="16">16 Jogadores</SelectItem>
                      <SelectItem value="32">32 Jogadores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 flex items-center gap-2 mt-4">
                  <Label htmlFor="multiplayer" className="cursor-pointer">
                    Evento Multiplayer
                  </Label>
                  <Switch
                    id="multiplayer"
                    checked={multiplayer}
                    onCheckedChange={(value) => setMultiplayer(!!value)}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>

                <div className="md:col-span-2 flex gap-2 mt-6">
                  <Button
                    onClick={criarTorneio}
                    disabled={loading}
                    className="bg-pink-600 hover:bg-pink-700 flex-1"
                  >
                    {loading ? 'Criando...' : 'Criar Evento'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateTournaments;
