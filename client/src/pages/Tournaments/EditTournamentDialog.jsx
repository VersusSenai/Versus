import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import api from '../../api';

export default function EditTournamentDialog({ event, open, setOpen, onUpdated }) {
  const [nome, setNome] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('8');
  const [multiplayer, setMultiplayer] = useState(false);
  const [model, setModel] = useState('P');
  const [privado, setPrivado] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setNome(event.name);
      setDescription(event.description);
      setStartDate(new Date(event.startDate).toISOString().slice(0, 16));
      setEndDate(new Date(event.endDate).toISOString().slice(0, 16));
      setMaxPlayers(event.maxPlayers.toString());
      setMultiplayer(event.multiplayer);
      setPrivado(event.private);
      setModel(event.model);
    }
  }, [event]);

  const handleUpdate = async () => {
    if (!nome || !description || !startDate || !endDate || !maxPlayers || !model) {
      toast.error('Preencha todos os campos corretamente.');
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
      await api.put(`/event/${event.id}`, {
        id: event.id,
        name: nome,
        description,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        maxPlayers: parseInt(maxPlayers),
        multiplayer,
        model,
        private: privado,
      });
      toast.success('Evento atualizado com sucesso!');
      setOpen(false);
      if (onUpdated) onUpdated();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erro ao atualizar torneio');
    } finally {
      setLoading(false);
    }
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="p-6 bg-[var(--color-dark)] text-white rounded-2xl border border-white/20"
        style={{ maxHeight: '90vh', overflow: 'auto' }}
      >
        <CardHeader className="flex items-center gap-3 pb-4 pt-6 px-6">
          <CalendarHeart className="text-pink-500" size={28} />
          <CardTitle className="text-2xl font-bold">Editar Torneio</CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-6 px-6 pb-8 pt-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="nome">Nome do Torneio</Label>
            <Input
              id="nome"
              className="bg-white text-black"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
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

          <div className="md:col-span-2 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="multiplayer" className="cursor-pointer">
                Evento Multiplayer
              </Label>
              <Switch
                id="multiplayer"
                checked={multiplayer}
                onCheckedChange={(val) => setMultiplayer(!!val)}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="privado" className="cursor-pointer">
                Torneio Privado
              </Label>
              <Switch
                id="privado"
                checked={privado}
                onCheckedChange={(val) => setPrivado(!!val)}
                className="data-[state=checked]:bg-pink-600"
              />
            </div>
          </div>

          <div className="md:col-span-2 flex gap-2 mt-6">
            <Button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-pink-600 hover:bg-pink-700 flex-1"
            >
              {loading ? 'Atualizando...' : 'Salvar Alterações'}
            </Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
}
