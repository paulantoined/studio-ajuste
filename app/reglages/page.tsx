import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { STUDIO_BUSINESS_CONFIG } from '@/lib/business-config';

function enforceInternalAccess() {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const internalAccessKey = process.env.INTERNAL_SETTINGS_ACCESS_KEY;
  const requestAccessKey = headers().get('x-studio-access-key');

  if (!internalAccessKey || requestAccessKey !== internalAccessKey) {
    notFound();
  }
}

export default function ReglagesPage() {
  enforceInternalAccess();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="card space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Réglages Studio (interne)</h1>
          <Link href="/" className="rounded-xl border border-stone px-3 py-2 text-sm">
            Retour configurateur
          </Link>
        </div>
        <p className="text-sm text-ink/70">
          Les paramètres métier sont externalisés dans <code>lib/business-config.ts</code> pour préserver une expérience client
          fluide.
        </p>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-stone/60 p-4">
            <h2 className="mb-2 font-medium">Coûts et coefficients</h2>
            <ul className="space-y-1 text-sm text-ink/75">
              <li>Prix module : {STUDIO_BUSINESS_CONFIG.moduleUnitPrice} €</li>
              <li>Prix volume : {STUDIO_BUSINESS_CONFIG.volumeUnitPrice} €</li>
              <li>Addon LED : {STUDIO_BUSINESS_CONFIG.ledAddon} €</li>
              <li>Frais pose : {STUDIO_BUSINESS_CONFIG.installationFee} €</li>
              <li>Frais livraison : {STUDIO_BUSINESS_CONFIG.deliveryFee} €</li>
            </ul>
          </article>

          <article className="rounded-xl border border-stone/60 p-4">
            <h2 className="mb-2 font-medium">Lead scoring</h2>
            <ul className="space-y-1 text-sm text-ink/75">
              <li>Seuil budget : {STUDIO_BUSINESS_CONFIG.leadScoring.budgetThreshold} €</li>
              <li>Zone cible : {STUDIO_BUSINESS_CONFIG.leadScoring.preferredZonesRegex}</li>
              <li>Points local : {STUDIO_BUSINESS_CONFIG.leadScoring.points.localProject}</li>
              <li>Points installation : {STUDIO_BUSINESS_CONFIG.leadScoring.points.needsInstallation}</li>
            </ul>
          </article>
        </section>
      </div>
    </main>
  );
}
