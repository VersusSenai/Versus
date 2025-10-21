import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import StepChoose from './StepChoose';
import StepTeams from './StepTeams';
import StepSolo from './StepSolo';

export default function CreateTournaments({ fetchTorneios }) {
  const [step, setStep] = useState('choose');

  return (
    <div className="max-w-4xl mx-auto relative flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <AnimatePresence mode="wait" initial={false}>
        {step === 'choose' && <StepChoose setStep={setStep} />}
        {step === 'teams' && (
          <StepSolo setStep={setStep} fetchTorneios={fetchTorneios} multiplayer={true} />
        )}
        {step === 'solo' && (
          <StepSolo setStep={setStep} fetchTorneios={fetchTorneios} multiplayer={false} />
        )}
      </AnimatePresence>
    </div>
  );
}
