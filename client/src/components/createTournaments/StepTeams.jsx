import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export default function StepTeams({ setStep }) {
  return (
    <motion.div
      key="teams"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <Card className="max-w-2xl mx-auto mt-16 bg-[var(--color-dark)] text-white border border-white/10 shadow-md text-center py-6 px-6">
        <h2 className="text-2xl font-bold mb-4">🚧 Em Construção</h2>
        <p className="text-white/70">
          A funcionalidade de torneios por times ainda está sendo desenvolvida.
        </p>
        <Button className="mt-6 bg-green-600 hover:bg-green-700" onClick={() => setStep('choose')}>
          Voltar
        </Button>
      </Card>
    </motion.div>
  );
}
