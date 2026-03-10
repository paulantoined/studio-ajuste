# Studio Ajuste · Module de préqualification premium (V3)

## Vision
Un site unique avec deux espaces :
- **Expérience client** : configurateur premium guidé, visuel, conversion-oriented.
- **Réglages studio** : paramètres métier externalisés (`lib/business-config.ts`) pour piloter coûts, marges, scoring et délais sans polluer l'UX client.

## UX/UI direction
- Style éditorial, neutre chaud, inspiré du langage Studio Ajuste.
- Diagramme axonométrique dynamique (esthétique Notion) qui évolue en temps réel selon dimensions, trame et options.
- Motion discret (slide/fade) pour fluidifier la progression.
- Inspiration benchmark sur les meilleures pratiques de configurateurs de sur-mesure (ex: Mobibam), sans copie de marque.

## Modules
1. Landing premium
2. Wizard configurateur (9 étapes)
3. Schéma visuel dynamique par étape
4. Summary sticky avec prix + délai indicatif
5. Moteur de pricing paramétrable
6. Scoring lead
7. Payload automation (n8n-ready)
8. Page interne de réglages

## Complexification sur-mesure ajoutée
- Compartiments invisibles
- Panneau acoustique
- Effet meuble suspendu
- Cadre métal apparent
- Niveau de gestion des câbles (0/1/2)

## Fichiers clés
- `app/page.tsx` : parcours utilisateur + contrôles complexité
- `components/visuals/stage-visual.tsx` : visuel axo dynamique
- `lib/business-config.ts` : paramètres métier et addons de complexité
- `lib/pricing.ts` : moteur de prix enrichi
- `app/reglages/page.tsx` : vue interne studio
