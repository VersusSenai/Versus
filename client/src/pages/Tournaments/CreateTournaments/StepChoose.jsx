import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Gamepad } from 'lucide-react';
import teamImage from '../../../assets/team.jpeg';
import soloImage from '../../../assets/solo.jpg';

const variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export default function StepChoose({ setStep }) {
  return (
    <motion.div
      key="choose"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
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
  );
}
