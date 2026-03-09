# Studio Ajuste · Module de préqualification premium (V2)

## Vision
Un site unique avec deux espaces :
- **Expérience client** : configurateur premium guidé, visuel, conversion-oriented.
- **Réglages studio** : paramètres métier externalisés (`lib/business-config.ts`) pour piloter coûts, marges, scoring et délais sans polluer l'UX client.

## UX/UI direction
- Style éditorial, neutre chaud, inspiré du langage Studio Ajuste.
- Visuels schématiques synthétiques (style Notion / axonométrie légère) à chaque étape clé.
- Motion discret (slide/fade) pour fluidifier la progression.

## Modules
1. Landing premium
2. Wizard configurateur (9 étapes)
3. Schémas visuels par étape
4. Summary sticky avec prix + délai indicatif
5. Moteur de pricing paramétrable
6. Scoring lead
7. Payload automation (n8n-ready)
8. Page interne de réglages

## Fichiers clés
- `app/page.tsx` : parcours utilisateur
- `components/visuals/stage-visual.tsx` : visuels étape
- `public/visuals/*.svg` : schémas
- `lib/business-config.ts` : paramètres métier
- `app/reglages/page.tsx` : vue interne studio
