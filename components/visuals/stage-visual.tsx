'use client';

import { useMemo, useRef, useState } from 'react';
import { calculateEstimate } from '@/lib/pricing';
import { ConfiguratorState } from '@/lib/types';

type StageVisualProps = {
  step: number;
  state: ConfiguratorState;
};

const copyByStep: Record<number, { title: string; hint: string }> = {
  1: { title: 'Typologie', hint: 'Base bibliothèque ou meuble TV, à enrichir ensuite.' },
  2: { title: 'Dimensions', hint: "Le schéma évolue à l'échelle selon largeur/hauteur/profondeur." },
  3: { title: 'Structure', hint: 'La grille reflète colonnes, lignes et asymétrie.' },
  4: { title: 'Matières', hint: 'Textures collage activées selon matériau et finition sélectionnés.' },
  5: { title: 'Complexité', hint: 'Options sur-mesure et détails techniques augmentent la complexité.' },
  6: { title: 'Estimation', hint: 'Projection budgétaire dynamique selon vos réglages.' }
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export function StageVisual({ step, state }: StageVisualProps) {
  const [tab, setTab] = useState<'axo' | 'render'>('axo');
  const svgRef = useRef<SVGSVGElement | null>(null);
  const label = copyByStep[step];
  const estimate = calculateEstimate(state);

  const geometry = useMemo(() => {
    const { widthCm, heightCm, depthCm } = state.dimensions;
    const width = clamp((widthCm / 320) * 320, 170, 320);
    const height = state.furnitureType === 'meuble-tv' ? clamp((heightCm / 120) * 135, 55, 135) : clamp((heightCm / 280) * 220, 90, 220);
    const depth = clamp((depthCm / 60) * 45, 15, 45);
    const x = 95;
    const y = 280 - height;
    const cols = clamp(state.layout.columns, 1, 7);
    const rows = clamp(state.layout.rows, 1, 7);
    return { widthCm, heightCm, depthCm, width, height, depth, x, y, cols, rows };
  }, [state]);

  if (!label) return null;

  const exportAsPng = async () => {
    const svg = svgRef.current;
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1400;
      canvas.height = 900;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#f3f0eb';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 80, 120, 740, 450);

      ctx.fillStyle = '#1E1D1B';
      ctx.font = '600 34px Inter, sans-serif';
      ctx.fillText('Studio Ajuste · Prévisualisation projet', 80, 70);
      ctx.font = '400 24px Inter, sans-serif';
      ctx.fillText(`Type: ${state.furnitureType}`, 860, 180);
      ctx.fillText(`Dimensions: ${geometry.widthCm} × ${geometry.heightCm} × ${geometry.depthCm} cm`, 860, 225);
      ctx.fillText(`Estimation: ${estimate.lowRange}€ - ${estimate.highRange}€`, 860, 270);
      ctx.fillText('Estimation indicative, non contractuelle.', 860, 315);

      const out = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = out;
      a.download = `studio-ajuste-${state.furnitureType}.png`;
      a.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const textureId = state.material === 'bois-massif' ? 'wood' : state.material === 'laque' ? 'lacquer' : 'paper';

  return (
    <div className="rounded-2xl border border-stone/70 bg-[#fcfaf7] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-ink">{label.title}</p>
        <div className="flex items-center gap-2">
          <button className={`rounded-full px-3 py-1 text-xs ${tab === 'axo' ? 'bg-ink text-white' : 'bg-white text-ink/70'}`} onClick={() => setTab('axo')}>
            Axonométrie
          </button>
          <button className={`rounded-full px-3 py-1 text-xs ${tab === 'render' ? 'bg-ink text-white' : 'bg-white text-ink/70'}`} onClick={() => setTab('render')}>
            Vue 3D
          </button>
          <button className="rounded-full bg-white px-3 py-1 text-xs text-ink/70" onClick={exportAsPng}>
            Export PNG
          </button>
        </div>
      </div>

      {tab === 'axo' ? (
        <svg ref={svgRef} viewBox="0 0 540 320" className="h-auto w-full rounded-xl border border-stone/60 bg-[#fffdf9] p-3">
          <defs>
            <pattern id="paper" width="24" height="24" patternUnits="userSpaceOnUse">
              <rect width="24" height="24" fill="#f5efe3" />
              <circle cx="6" cy="6" r="1" fill="#e6dccd" />
              <circle cx="17" cy="11" r="1" fill="#e6dccd" />
              <path d="M0 12 L24 12" stroke="#e8dfd1" strokeWidth="0.8" />
            </pattern>
            <pattern id="wood" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#eadfce" />
              <path d="M0 5 C4 2, 8 8, 12 5 C15 3, 18 8, 20 5" stroke="#c8b398" strokeWidth="1.2" fill="none" />
              <path d="M0 15 C3 12, 8 18, 12 14 C16 12, 18 17, 20 14" stroke="#c2ab8e" strokeWidth="1" fill="none" />
            </pattern>
            <pattern id="lacquer" width="18" height="18" patternUnits="userSpaceOnUse">
              <rect width="18" height="18" fill="#ece7df" />
              <path d="M0 0 L18 18" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1" />
              <path d="M18 0 L0 18" stroke="#d8d0c4" strokeOpacity="0.6" strokeWidth="0.8" />
            </pattern>
          </defs>

          <line x1="70" y1="285" x2="475" y2="285" stroke="#dfd7cd" />
          <polygon
            points={`${geometry.x},${geometry.y} ${geometry.x + geometry.width},${geometry.y} ${geometry.x + geometry.width + geometry.depth},${geometry.y - geometry.depth} ${geometry.x + geometry.depth},${geometry.y - geometry.depth}`}
            fill={`url(#${textureId})`}
            stroke="#cabfab"
          />
          <polygon
            points={`${geometry.x + geometry.width},${geometry.y} ${geometry.x + geometry.width + geometry.depth},${geometry.y - geometry.depth} ${geometry.x + geometry.width + geometry.depth},${geometry.y + geometry.height - geometry.depth} ${geometry.x + geometry.width},${geometry.y + geometry.height}`}
            fill="#ede5d9"
            stroke="#cabfab"
          />
          <rect x={geometry.x} y={geometry.y} width={geometry.width} height={geometry.height} fill={`url(#${textureId})`} stroke="#8b6a4a" strokeWidth="1.5" />

          {Array.from({ length: geometry.cols - 1 }, (_, i) => geometry.x + ((i + 1) * geometry.width) / geometry.cols).map((lineX) => (
            <line key={`c-${lineX}`} x1={lineX} y1={geometry.y} x2={lineX} y2={geometry.y + geometry.height} stroke="#3c352d" strokeOpacity="0.35" />
          ))}
          {Array.from({ length: geometry.rows - 1 }, (_, i) => geometry.y + ((i + 1) * geometry.height) / geometry.rows).map((lineY) => (
            <line key={`r-${lineY}`} x1={geometry.x} y1={lineY} x2={geometry.x + geometry.width} y2={lineY} stroke="#3c352d" strokeOpacity="0.35" />
          ))}

          {state.layout.asymmetry && <rect x={geometry.x + geometry.width * 0.52} y={geometry.y + geometry.height * 0.18} width={geometry.width * 0.3} height={geometry.height * 0.42} fill="#e8dfd2" />}
          {state.options.led && <line x1={geometry.x + 8} y1={geometry.y + 8} x2={geometry.x + geometry.width - 8} y2={geometry.y + 8} stroke="#d9b57a" strokeWidth="2" />}
          {state.options.complexity.floatingDesign && <line x1={geometry.x + 10} y1={geometry.y + geometry.height + 8} x2={geometry.x + geometry.width - 10} y2={geometry.y + geometry.height + 8} stroke="#8b6a4a" strokeDasharray="4 4" />}
          {state.options.complexity.metalFrame && <rect x={geometry.x - 6} y={geometry.y - 6} width={geometry.width + 12} height={geometry.height + 12} fill="none" stroke="#676767" strokeOpacity="0.45" />}

          <text x={geometry.x + geometry.width / 2} y="302" textAnchor="middle" fontSize="10" fill="#5b5248">{geometry.widthCm} cm</text>
          <text x="55" y={geometry.y + geometry.height / 2} textAnchor="middle" fontSize="10" fill="#5b5248" transform={`rotate(-90 55 ${geometry.y + geometry.height / 2})`}>
            {geometry.heightCm} cm
          </text>
          <text x={geometry.x + geometry.width + geometry.depth / 2 + 6} y={geometry.y - geometry.depth / 2 - 4} textAnchor="middle" fontSize="10" fill="#5b5248">{geometry.depthCm} cm</text>
        </svg>
      ) : (
        <div className="h-[320px] rounded-xl border border-stone/60 bg-gradient-to-b from-[#f7f4ee] to-[#ebe4d8] p-4">
          <div className="flex h-full items-end justify-center">
            <div className="relative h-[160px] w-[300px] rounded-md border border-[#b6a48c] bg-[linear-gradient(160deg,#efe6d8,#d9c7ab)] shadow-[0_30px_35px_rgba(0,0,0,0.18)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_45%)]" />
              <div className="absolute -bottom-3 left-5 right-5 h-4 rounded-full bg-black/20 blur-md" />
            </div>
          </div>
          <p className="mt-3 text-xs text-ink/65">
            Mode 3D réaliste (HDRI/PBR/ombres physiques) nécessite un pipeline WebGL dédié (Three.js + assets PBR). Cette vue est un placeholder premium en attendant l’intégration.
          </p>
        </div>
      )}

      <p className="mt-3 text-sm text-ink/65">{label.hint}</p>
    </div>
  );
}
