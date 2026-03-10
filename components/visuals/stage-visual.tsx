import { ConfiguratorState } from '@/lib/types';

type StageVisualProps = {
  step: number;
  state: ConfiguratorState;
};

const copyByStep: Record<number, { title: string; hint: string }> = {
  1: { title: 'Typologie', hint: 'Base bibliothèque ou meuble TV, à enrichir ensuite.' },
  2: { title: 'Dimensions', hint: "Le schéma évolue à l'échelle selon largeur/hauteur/profondeur." },
  3: { title: 'Structure', hint: 'La grille reflète colonnes, lignes et asymétrie.' },
  4: { title: 'Matières', hint: 'Le ton et les masses guident le rendu visuel final.' },
  5: { title: 'Complexité', hint: 'Options sur-mesure et détails techniques augmentent la complexité.' },
  6: { title: 'Estimation', hint: 'Projection budgétaire dynamique selon vos réglages.' }
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export function StageVisual({ step, state }: StageVisualProps) {
  const label = copyByStep[step];
  if (!label) return null;

  const { widthCm, heightCm, depthCm } = state.dimensions;
  const width = clamp((widthCm / 320) * 320, 170, 320);
  const height = state.furnitureType === 'meuble-tv' ? clamp((heightCm / 120) * 135, 55, 135) : clamp((heightCm / 280) * 220, 90, 220);
  const depth = clamp((depthCm / 60) * 45, 15, 45);

  const x = 95;
  const y = 280 - height;
  const cols = clamp(state.layout.columns, 1, 7);
  const rows = clamp(state.layout.rows, 1, 7);

  const colLines = Array.from({ length: cols - 1 }, (_, i) => x + ((i + 1) * width) / cols);
  const rowLines = Array.from({ length: rows - 1 }, (_, i) => y + ((i + 1) * height) / rows);

  const complexity = state.options.complexity;

  return (
    <div className="rounded-2xl border border-stone/70 bg-[#fcfaf7] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-ink">{label.title}</p>
        <span className="rounded-full bg-white px-2 py-1 text-xs text-ink/60">Aperçu axonométrique</span>
      </div>

      <svg viewBox="0 0 540 320" className="h-auto w-full rounded-xl border border-stone/60 bg-[#fffdf9] p-3">
        <line x1="70" y1="285" x2="475" y2="285" stroke="#dfd7cd" />

        <polygon points={`${x},${y} ${x + width},${y} ${x + width + depth},${y - depth} ${x + depth},${y - depth}`} fill="#f3ede3" stroke="#cabfab" />
        <polygon points={`${x + width},${y} ${x + width + depth},${y - depth} ${x + width + depth},${y + height - depth} ${x + width},${y + height}`} fill="#ede5d9" stroke="#cabfab" />
        <rect x={x} y={y} width={width} height={height} fill="#f8f5ef" stroke="#8b6a4a" strokeWidth="1.5" />

        {colLines.map((lineX) => (
          <line key={`c-${lineX}`} x1={lineX} y1={y} x2={lineX} y2={y + height} stroke="#3c352d" strokeOpacity="0.35" />
        ))}
        {rowLines.map((lineY) => (
          <line key={`r-${lineY}`} x1={x} y1={lineY} x2={x + width} y2={lineY} stroke="#3c352d" strokeOpacity="0.35" />
        ))}

        {state.layout.asymmetry && <rect x={x + width * 0.52} y={y + height * 0.18} width={width * 0.3} height={height * 0.42} fill="#e8dfd2" />}
        {state.options.led && <line x1={x + 8} y1={y + 8} x2={x + width - 8} y2={y + 8} stroke="#d9b57a" strokeWidth="2" />}

        {complexity.floatingDesign && <line x1={x + 10} y1={y + height + 8} x2={x + width - 10} y2={y + height + 8} stroke="#8b6a4a" strokeDasharray="4 4" />}
        {complexity.metalFrame && <rect x={x - 6} y={y - 6} width={width + 12} height={height + 12} fill="none" stroke="#676767" strokeOpacity="0.45" />}
        {complexity.hiddenCompartments && <rect x={x + width * 0.08} y={y + height * 0.58} width={width * 0.2} height={height * 0.2} fill="#f8f5ef" stroke="#8b6a4a" strokeDasharray="3 3" />}

        <text x={x + width / 2} y="302" textAnchor="middle" fontSize="10" fill="#5b5248">{widthCm} cm</text>
        <text x="55" y={y + height / 2} textAnchor="middle" fontSize="10" fill="#5b5248" transform={`rotate(-90 55 ${y + height / 2})`}>
          {heightCm} cm
        </text>
        <text x={x + width + depth / 2 + 6} y={y - depth / 2 - 4} textAnchor="middle" fontSize="10" fill="#5b5248">{depthCm} cm</text>
      </svg>

      <p className="mt-3 text-sm text-ink/65">{label.hint}</p>
    </div>
  );
}
