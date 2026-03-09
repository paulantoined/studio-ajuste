'use client';

import { calculateEstimate, euro } from '@/lib/pricing';
import { useWizardStore } from '@/lib/store';

export function SummaryPanel() {
  const state = useWizardStore((s) => s.state);
  const estimate = calculateEstimate(state);

  return (
    <aside className="card sticky top-6 space-y-4">
      <h3 className="text-lg font-semibold">Synthèse projet</h3>
      <div className="text-sm space-y-1 text-ink/80">
        <p>Type : {state.furnitureType}</p>
        <p>
          Dimensions : {state.dimensions.widthCm} × {state.dimensions.heightCm} × {state.dimensions.depthCm} cm
        </p>
        <p>
          Modules : {state.layout.columns} × {state.layout.rows}
        </p>
        <p>
          Matériau : {state.material} · Finition : {state.finish}
        </p>
      </div>
      <div className="rounded-xl bg-warm p-4">
        <p className="text-sm text-ink/70">Estimation indicative</p>
        <p className="text-2xl font-semibold">
          {euro(estimate.lowRange)} – {euro(estimate.highRange)}
        </p>
        <p className="mt-2 text-xs text-ink/60">Devis final après étude technique, esthétique et contextuelle.</p>
      </div>
    </aside>
  );
}
