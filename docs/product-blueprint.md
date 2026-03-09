# Studio Ajuste · Module de préqualification premium (V1)

## 1) Reformulation produit
Un configurateur éditorial qui convertit un besoin flou en demande de devis qualifiée, via une expérience guidée, esthétique et techniquement crédible.

## 2) Parcours utilisateur idéal
1. Introduction premium et rassurante.
2. Choix typologie meuble.
3. Saisie dimensions.
4. Composition structure/modularité.
5. Matériaux et finitions.
6. Options et contraintes.
7. Estimation indicative + facteurs prix.
8. Formulaire de devis intelligent.
9. Confirmation + prochaine étape.

## 3) Variables métier
- Typologie meuble
- Dimensions (L/H/P)
- Colonnes/lignes/modules
- Asymétrie et modules custom
- Portes/tiroirs/LED
- Matériau + finition
- Pose + livraison
- Budget client
- Localisation + délai
- Maturité projet + assets

## 4) Pricing V1
Formule modulaire :
- Base par typologie
- Ajustements volume + nombre de modules
- Add-ons portes/tiroirs/LED
- Coefficients matériau + finition
- Majoration asymétrie + modules spéciaux
- Frais pose/livraison
- Minimum de facturation
- Fourchette avec buffer d'incertitude

## 5) Types TypeScript
Voir `lib/types.ts` :
- `FurnitureType`
- `ConfigurationDimensions`
- `ModuleLayout`
- `MaterialOption`
- `FinishOption`
- `PricingEstimate`
- `LeadQualification`
- `QuoteRequestPayload`
- `AutomationPayload`

## 6) Architecture écrans
- `app/page.tsx` pilote le wizard (9 écrans logiques)
- `components/step-header.tsx` pour progression
- `components/summary-panel.tsx` sticky summary

## 7) Wireframes logiques
- Colonne principale = étape active
- Colonne droite = synthèse + estimation live
- Mobile = stack verticale

## 8) Design system initial
- Fond chaud clair, contrastes doux
- Cartes arrondies bord fin
- Typographie sobre, hiérarchie nette
- Accent discret brun naturel

## 9) Architecture frontend
- Next.js App Router
- Zustand pour état global
- React Hook Form + Zod pour formulaire lead
- Fonctions pures de pricing/qualification

## 10) Composants React
- `StepHeader`
- `SummaryPanel`
- Sections par étape dans `Home`

## 11) Moteur pricing exemple
Voir `lib/pricing.ts`.

## 12) Payload webhook n8n exemple
Voir `lib/payload.ts` avec `buildAutomationPayload`.

## 13) Base de code des écrans
Voir `app/page.tsx` pour les 9 étapes.
