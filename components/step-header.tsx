'use client';

const labels = [
  'Introduction',
  'Typologie',
  'Dimensions',
  'Structure',
  'Finitions',
  'Options',
  'Estimation',
  'Demande de devis',
  'Confirmation'
];

export function StepHeader({ step }: { step: number }) {
  return (
    <header className="mb-8 space-y-3">
      <p className="text-sm uppercase tracking-[0.2em] text-ink/50">Studio Ajuste · Préqualification</p>
      <h1 className="text-3xl font-semibold">{labels[step]}</h1>
      <div className="h-1 w-full rounded-full bg-stone/60">
        <div className="h-1 rounded-full bg-ink transition-all" style={{ width: `${((step + 1) / labels.length) * 100}%` }} />
      </div>
    </header>
  );
}
