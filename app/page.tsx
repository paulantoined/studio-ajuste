'use client';

import { useForm } from 'react-hook-form';
import { StepHeader } from '@/components/step-header';
import { SummaryPanel } from '@/components/summary-panel';
import { StageVisual } from '@/components/visuals/stage-visual';
import { buildAutomationPayload, LeadFormValues, leadFormSchema } from '@/lib/payload';
import { calculateEstimate, euro } from '@/lib/pricing';
import { useWizardStore } from '@/lib/store';
import { FurnitureType } from '@/lib/types';

const furnitureTypes: { value: FurnitureType; label: string; description: string }[] = [
  { value: 'bibliotheque', label: 'Bibliothèque', description: 'Composition murale élégante, sur proportions et rythmes.' },
  { value: 'meuble-tv', label: 'Meuble TV', description: 'Rangement média et ligne basse intégrée à votre espace.' }
];

export default function Home() {
  const { step, setStep, state, patchState, patchNested } = useWizardStore();
  const estimate = calculateEstimate(state);
  const form = useForm<LeadFormValues>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      location: '',
      desiredTimeline: 'Sous 2 à 3 mois',
      budget: 4500,
      stage: 'Recherche active',
      comments: '',
      hasAssets: false,
      consent: true
    }
  });

  const next = () => setStep(Math.min(step + 1, 8));
  const prev = () => setStep(Math.max(step - 1, 0));

  const onSubmitLead = form.handleSubmit((values) => {
    const parsed = leadFormSchema.safeParse(values);
    if (!parsed.success) return;
    const payload = buildAutomationPayload(state, parsed.data);
    console.log('Webhook payload n8n-ready', payload);
    next();
  });

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 md:grid-cols-[1fr_340px]">
      <section className="card">
        <StepHeader step={step} />

        <div className="motion-enter space-y-6">
          {step === 0 && (
            <div className="space-y-5 text-ink/80">
              <p className="text-lg leading-relaxed">
                Configurez votre meuble sur mesure avec une expérience guidée, visuelle et précise. Vous obtenez une estimation indicative et un brief exploitable par Studio Ajuste.
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                {['Parcours premium', 'Schémas pédagogiques', 'Estimation évolutive'].map((item) => (
                  <div key={item} className="rounded-xl border border-stone/70 bg-[#fcfaf7] p-3 text-sm">{item}</div>
                ))}
              </div>
              <button onClick={next} className="rounded-xl bg-ink px-5 py-3 text-white">
                Commencer la configuration
              </button>
            </div>
          )}

          {step >= 1 && step <= 6 && <StageVisual step={step} furnitureType={state.furnitureType} />}

          {step === 1 && (
            <div className="grid gap-4 md:grid-cols-2">
              {furnitureTypes.map((item) => (
                <button
                  key={item.value}
                  onClick={() => patchState({ furnitureType: item.value })}
                  className={`rounded-2xl border p-5 text-left transition ${state.furnitureType === item.value ? 'border-ink bg-warm' : 'border-stone hover:border-accent'}`}
                >
                  <p className="font-semibold">{item.label}</p>
                  <p className="mt-2 text-sm text-ink/70">{item.description}</p>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 md:grid-cols-3">
              {([
                ['widthCm', 'Largeur (cm)'],
                ['heightCm', 'Hauteur (cm)'],
                ['depthCm', 'Profondeur (cm)']
              ] as const).map(([key, label]) => (
                <label key={key} className="label">
                  {label}
                  <input
                    type="number"
                    className="input"
                    value={state.dimensions[key]}
                    onChange={(e) => patchNested('dimensions', { [key]: Number(e.target.value) })}
                  />
                </label>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <label className="label">Colonnes<input type="number" className="input" value={state.layout.columns} onChange={(e) => patchNested('layout', { columns: Number(e.target.value) })} /></label>
                <label className="label">Lignes<input type="number" className="input" value={state.layout.rows} onChange={(e) => patchNested('layout', { rows: Number(e.target.value) })} /></label>
                <label className="label">Modules larges spécifiques<input type="number" className="input" value={state.layout.customLargeModules} onChange={(e) => patchNested('layout', { customLargeModules: Number(e.target.value) })} /></label>
              </div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={state.layout.asymmetry} onChange={(e) => patchNested('layout', { asymmetry: e.target.checked })} />
                Composition asymétrique
              </label>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="label">Matériau principal
                <select className="input" value={state.material} onChange={(e) => patchState({ material: e.target.value as typeof state.material })}>
                  <option value="melamine">Mélaminé</option>
                  <option value="placage-bois">Placage bois</option>
                  <option value="bois-massif">Bois massif</option>
                  <option value="laque">Laque</option>
                </select>
              </label>
              <label className="label">Niveau de finition
                <select className="input" value={state.finish} onChange={(e) => patchState({ finish: e.target.value as typeof state.finish })}>
                  <option value="standard-mat">Standard mat</option>
                  <option value="satin">Satin</option>
                  <option value="premium-laque">Premium laqué</option>
                </select>
              </label>
            </div>
          )}

          {step === 5 && (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="label">Portes<input type="number" className="input" value={state.options.doors} onChange={(e) => patchNested('options', { doors: Number(e.target.value) })} /></label>
              <label className="label">Tiroirs<input type="number" className="input" value={state.options.drawers} onChange={(e) => patchNested('options', { drawers: Number(e.target.value) })} /></label>
              {([
                ['led', 'Éclairage LED'],
                ['backPanel', 'Panneau de fond'],
                ['wallFixings', 'Fixations murales'],
                ['installation', 'Pose incluse'],
                ['delivery', 'Livraison']
              ] as const).map(([key, label]) => (
                <label key={key} className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={state.options[key]} onChange={(e) => patchNested('options', { [key]: e.target.checked })} />
                  {label}
                </label>
              ))}
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <p className="text-3xl font-semibold">{euro(estimate.lowRange)} – {euro(estimate.highRange)}</p>
              <p className="text-sm text-ink/70">Cette estimation est fournie à titre indicatif. Délai projet : {estimate.indicativeDelay}.</p>
              <div className="flex flex-wrap gap-2">
                {estimate.drivers.map((driver) => (
                  <span key={driver} className="rounded-full border border-stone px-3 py-1 text-xs">{driver}</span>
                ))}
              </div>
            </div>
          )}

          {step === 7 && (
            <form className="space-y-4" onSubmit={onSubmitLead}>
              <div className="grid gap-4 md:grid-cols-2">
                <input className="input" placeholder="Nom" {...form.register('name')} />
                <input className="input" placeholder="Email" {...form.register('email')} />
                <input className="input" placeholder="Téléphone" {...form.register('phone')} />
                <input className="input" placeholder="Ville / localisation" {...form.register('location')} />
                <input className="input" placeholder="Délai souhaité" {...form.register('desiredTimeline')} />
                <input className="input" type="number" placeholder="Budget" {...form.register('budget')} />
              </div>
              <input className="input" placeholder="Niveau d'avancement" {...form.register('stage')} />
              <textarea className="input" placeholder="Contrainte, prise, radiateur, inspiration..." {...form.register('comments')} />
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register('hasAssets')} />
                Je dispose de photos/plans/inspirations
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register('consent')} />
                J'accepte d'être recontacté par Studio Ajuste
              </label>
              <button className="rounded-xl bg-ink px-5 py-3 text-white" type="submit">Envoyer ma demande qualifiée</button>
            </form>
          )}

          {step === 8 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Merci, votre demande a bien été transmise.</h2>
              <p className="text-ink/70">Notre studio vous recontacte avec un devis ajusté après étude technique et contextuelle.</p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between">
          <button onClick={prev} className="rounded-xl border border-stone px-4 py-2" disabled={step === 0}>
            Retour
          </button>
          {step > 0 && step < 7 && (
            <button onClick={next} className="rounded-xl bg-ink px-4 py-2 text-white">
              Continuer
            </button>
          )}
        </div>
      </section>

      <SummaryPanel />
    </main>
  );
}
