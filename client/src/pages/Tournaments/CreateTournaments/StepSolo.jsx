import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { CalendarHeart, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '@/api';

const variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export default function StepSolo({ setStep, fetchTorneios, multiplayer }) {
  const [nome, setNome] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('8');
  const [model, setModel] = useState('P');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const criarTorneio = async () => {
    console.log(image);
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
      const formData = new FormData();
      formData.append('image', image);
      formData.append('name', nome);
      formData.append('description', description);
      formData.append('startDate', start.toISOString());
      formData.append('endDate', end.toISOString());
      formData.append('maxPlayers', parseInt(maxPlayers));
      formData.append('multiplayer', multiplayer);
      formData.append('model', model);
      formData.append('private', isPrivate);
      setLoading(true);
      await api.post('/event', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Evento criado com sucesso!');
      setNome('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setImage('');
      setMaxPlayers('8');
      setModel('P');
      setIsPrivate(false);
      if (fetchTorneios) fetchTorneios();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erro ao criar torneio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="solo"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="relative"
    >
      <Button
        variant="ghost"
        className="absolute top-4 left-4 flex items-center gap-1 text-white hover:bg-white/10"
        onClick={() => setStep('choose')}
      >
        <ArrowLeft size={18} /> Voltar
      </Button>

      <Card className="bg-[var(--color-dark)] text-white border border-white/10 rounded-3xl shadow-md pt-8">
        <CardHeader className="flex items-center gap-3 pb-4 pt-6 px-6">
          <CalendarHeart className="text-pink-500" size={28} />
          <CardTitle className="text-2xl font-bold">
            Criar Novo Torneio {multiplayer ? 'Para Times' : 'Solo'}
          </CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-6 px-6 pb-8 pt-2">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="nome">Imagem do torneio</Label>
            <Input
              type="file"
              id="nome"
              className="bg-white text-black"
              value={image?.filename}
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
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

          <div className="md:col-span-2 flex items-center gap-2">
            <div className="flex items-center gap-2"></div>
            <div className="flex items-center gap-2">
              <Label htmlFor="private" className="cursor-pointer">
                Torneio Privado
              </Label>
              <Switch
                id="private"
                checked={isPrivate}
                onCheckedChange={(value) => setIsPrivate(!!value)}
                className="data-[state=checked]:bg-pink-600"
              />
            </div>
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
  );
}
