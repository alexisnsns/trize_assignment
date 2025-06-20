'use client';
import { ReactNode, useState } from 'react';
import { Stepper, Step, StepLabel, Button, Box } from '@mui/material';

export default function WizardLayout({ steps }: { steps: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const next = () => setActive((s) => s + 1);
  const back = () => setActive((s) => s - 1);

  return (
    <>
      <Stepper activeStep={active}>
        {['Asset', 'Docs', 'Review'].map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>
      <Box mt={4}>{steps[active]}</Box>
      <Box mt={2}>
        {active > 0 && <Button onClick={back}>Back</Button>}
        {active < steps.length - 1 && <Button onClick={next}>Next</Button>}
      </Box>
    </>
  );
}
