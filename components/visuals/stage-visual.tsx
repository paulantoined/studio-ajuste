import Image from 'next/image';

type StageVisualProps = {
  step: number;
  furnitureType: string;
};

const copyByStep: Record<number, { title: string; hint: string }> = {
  1: { title: 'Typologie', hint: 'Choisissez une base claire pour cadrer le projet.' },
  2: { title: 'Dimensions', hint: 'Ajustez le gabarit global avant de détailler.' },
  3: { title: 'Structure', hint: 'La trame modulaire influence fortement le budget.' },
  4: { title: 'Matières', hint: 'Le rendu final dépend du matériau et de la finition.' },
  5: { title: 'Options', hint: 'Ajoutez les fonctions utiles à votre usage.' },
  6: { title: 'Estimation', hint: 'Une base de discussion, jamais un prix figé.' }
};

export function StageVisual({ step, furnitureType }: StageVisualProps) {
  const visual = furnitureType === 'meuble-tv' ? '/visuals/meuble-tv.svg' : '/visuals/bibliotheque.svg';
  const label = copyByStep[step];

  if (!label) return null;

  return (
    <div className="rounded-2xl border border-stone/70 bg-[#fcfaf7] p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-ink">{label.title}</p>
        <span className="rounded-full bg-white px-2 py-1 text-xs text-ink/60">Schéma simplifié</span>
      </div>
      <Image src={visual} alt="Schéma mobilier" width={640} height={420} className="h-auto w-full rounded-xl border border-stone/60" />
      <p className="mt-3 text-sm text-ink/65">{label.hint}</p>
    </div>
  );
}
