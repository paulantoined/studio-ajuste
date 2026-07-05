# Handoff — Chatbot Telegram Studio Ajuste

> Résumé de session pour reprise dans un nouveau chat. Dernière mise à jour : 2026-07-05.

## Objectif de la demande

Créer un **chatbot Telegram** permettant d'interroger, en langage naturel, les
projets de meubles, l'état des chantiers (process), la doc et la config métier —
avec **accès complet en lecture aux fichiers `.md` (et autres)** du projet.

## Contexte du dépôt

- **Repo** : `paulantoined/studio-ajuste`
- **Projet** : configurateur Next.js 14 (TypeScript) de mobilier sur mesure
  « Studio Ajuste » (préqualification premium + moteur de pricing).
- **Branche de travail** : `claude/telegram-furniture-chatbot-x5ws2p`
- **Pull Request** : **#4** — https://github.com/paulantoined/studio-ajuste/pull/4
  (créée depuis l'UI Claude Code ; pousser sur la branche met à jour cette PR).

## Ce qui a été livré (commit poussé)

Bot Telegram propulsé par **Claude Opus 4.8** (`claude-opus-4-8`) via le SDK
officiel `@anthropic-ai/sdk`. Choix d'architecture clé : au lieu de pré-charger
les docs, **Claude dispose d'outils** et lit lui-même les fichiers pertinents à
chaque question → « full access » réel à tous les fichiers.

### Arborescence ajoutée

```
bot/
  config.ts      # charge .env (sans dépendance), variables d'env, listes d'exclusion
  knowledge.ts   # parcours repo + outils list_files / read_file / search + garde-fous
  claude.ts      # boucle agentique manuelle (tool use) + prompt système FR
  telegram.ts    # client Telegram : long polling getUpdates, sendMessage, chat action
  index.ts       # boucle principale, commandes, contrôle d'accès, historique par chat
  README.md      # doc d'installation / usage
projets/
  README.md                          # convention des notes de chantier
  _template.md                       # gabarit projet (statut, étapes, journal)
  2026-06-bibliotheque-durand.md     # exemple : statut "En fabrication"
  2026-05-dressing-martin.md         # exemple : statut "En attente client"
.env.example     # gabarit des variables d'environnement
```

Fichiers modifiés : `package.json` (script `bot`, deps `@anthropic-ai/sdk` +
`tsx`, bump `zod` en `^3.25.0`), `.gitignore` (ignore `.env*`), `README.md`
(section Assistant Telegram).

### Outils exposés à Claude (lecture seule)

- `list_files(pattern?)` — liste/filtre les fichiers (glob simple).
- `read_file(path)` — lit un fichier (cap 200 000 caractères).
- `search(query)` — recherche texte insensible à la casse, renvoie `fichier:ligne`.

### Sécurité

- Lecture seule, **confinée à `KNOWLEDGE_ROOT`** (défaut : racine du projet).
- Exclusions : `.env*`, `node_modules`, `.git`, `.next`, `dist`, `build`,
  lockfiles.
- Protection anti-traversée (`../`, chemins absolus) → refusée. **Testé.**
- Accès restreint par `TELEGRAM_ALLOWED_CHAT_IDS` (au 1er message, le bot
  renvoie le chat ID à autoriser).

### Configuration (variables d'environnement)

| Variable | Rôle | Défaut |
| --- | --- | --- |
| `TELEGRAM_BOT_TOKEN` | Jeton BotFather (obligatoire) | — |
| `ANTHROPIC_API_KEY` | Clé API Anthropic (obligatoire) | — |
| `TELEGRAM_ALLOWED_CHAT_IDS` | Chat IDs autorisés (virgules) | tout le monde |
| `ANTHROPIC_MODEL` | Modèle Claude | `claude-opus-4-8` |
| `THINKING` | `adaptive` (+ malin) / `disabled` (+ rapide) | `disabled` |
| `KNOWLEDGE_ROOT` | Racine des fichiers accessibles | dossier courant |
| `MAX_TOKENS` | Tokens max par réponse | `2048` |

### Lancement

```bash
npm install
cp .env.example .env   # renseigner TELEGRAM_BOT_TOKEN + ANTHROPIC_API_KEY
npm run bot
```

Commandes du bot : `/help`, `/files` (liste les `.md`), `/reset` (efface le
contexte de conversation).

## Détails techniques notables

- **Telegram** : long polling (`getUpdates`, `timeout=30`) via `fetch` natif —
  pas de webhook ni serveur public à héberger. Découpage des messages > 4096
  caractères. Réponses en **texte brut** (pas de parse_mode Markdown).
- **Claude** : boucle agentique manuelle (`stop_reason === 'tool_use'`), max 12
  itérations d'outils. `thinking` désactivé par défaut (rapide) + consigne
  « réponse finale directe, sans méta-commentaire » pour éviter le raisonnement
  verbeux. Un index de l'arborescence est injecté dans le prompt système.
- **Historique** : conservé par `chat_id`, trimmé à ~24 messages sur des
  frontières propres (début sur un message user texte) pour éviter les erreurs
  d'alternance / d'appariement tool_use↔tool_result.
- **Exemples `projets/`** : créés pour fournir immédiatement des « états de
  process » réels à interroger (le repo n'avait pas de données projet).

## Vérifications effectuées

- ✅ `npm install` OK (SDK résolu en `0.109.1`).
- ✅ Bump `zod` `3.23.8 → ^3.25.0` pour résoudre un conflit de peer dependency
  du SDK (rétrocompatible dans la 3.x).
- ✅ `npx tsc --noEmit` : aucune erreur (types SDK réels).
- ✅ Outils fichiers testés : list, search, read, et **garde-fous
  anti-traversée** (`../`, `/etc/passwd`, `.env` → refusés).

## Non testé (nécessite des clés réelles)

- Appel effectif à l'API Anthropic (les shapes de requête sont validées par le
  typecheck).
- Connexion effective à Telegram (`getMe`, réception de messages).

## Pistes / suite possible

- **Surveillance PR #4** : CI + commentaires de revue, correctifs automatiques.
- **Déploiement continu** : Dockerfile / service systemd pour tourner en 24/7.
- **Mode webhook** (au lieu du long polling).
- **Persistance de l'historique** sur disque (actuellement en mémoire).
- Élargir les extensions indexées ou ajouter un outil d'écriture (créer/mettre à
  jour une note de projet depuis Telegram) — non implémenté volontairement
  (lecture seule).
