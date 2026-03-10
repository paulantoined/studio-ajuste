'use client';

type SliderNumberProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
};

export function SliderNumber({ label, value, min, max, step = 1, onChange }: SliderNumberProps) {
  return (
    <label className="label block">
      <div className="flex items-center justify-between">
        <span>{label}</span>
        <span className="text-xs text-ink/60">{value}</span>
      </div>
      <input className="input" type="number" value={value} min={min} max={max} step={step} onChange={(e) => onChange(Number(e.target.value))} />
      <input
        className="mt-2 w-full accent-[#8B6A4A]"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
