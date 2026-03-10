'use client';

import Image from 'next/image';

const moods = ['/visuals/landing/mood-01.svg', '/visuals/landing/mood-02.svg', '/visuals/landing/mood-03.svg'];

export function LandingShowcase() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        {moods.map((src, index) => (
          <article
            key={src}
            className="landing-card rounded-2xl border border-stone/70 bg-[#fffdf8] p-2"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <Image src={src} alt="Moodboard Studio Ajuste" width={520} height={340} className="h-auto w-full rounded-xl" />
          </article>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-xl border border-stone/70 bg-white/70 p-3">
        <div className="landing-marquee flex gap-2 text-xs text-ink/65">
          {[
            'Éditorial premium',
            'Parcours guidé',
            'Matières sensibles',
            'Préqualification intelligente',
            'Estimation non contractuelle',
            'Design & faisabilité'
          ].map((chip) => (
            <span key={chip} className="rounded-full border border-stone px-3 py-1">
              {chip}
            </span>
          ))}
          {[
            'Éditorial premium',
            'Parcours guidé',
            'Matières sensibles',
            'Préqualification intelligente',
            'Estimation non contractuelle',
            'Design & faisabilité'
          ].map((chip, idx) => (
            <span key={`${chip}-${idx}`} className="rounded-full border border-stone px-3 py-1">
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
