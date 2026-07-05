# Bot Telegram — Assistant Studio Ajuste

Un chatbot Telegram pour interroger tes projets de meubles, l'état des chantiers,
la doc produit et la config métier. Il est propulsé par **Claude (Opus 4.8)** et a
un **accès en lecture à tous les fichiers du projet** (via des outils
`list_files` / `read_file` / `search`), donc il peut répondre sur n'importe quel
fichier `.md` ou source — pas seulement du contenu pré-chargé.

## Ce dont tu as besoin

1. **Un bot Telegram** : écris à [@BotFather](https://t.me/BotFather), commande
   `/newbot`, récupère le **jeton** (`TELEGRAM_BOT_TOKEN`).
2. **Une clé API Anthropic** : [console.anthropic.com](https://console.anthropic.com)
   (`ANTHROPIC_API_KEY`).

## Installation

```bash
npm install
cp .env.example .env   # puis renseigne tes clés dans .env
npm run bot
```

Au premier lancement, écris n'importe quoi à ton bot sur Telegram : il te
répondra avec ton **chat ID**. Ajoute-le à `.env` :

```
TELEGRAM_ALLOWED_CHAT_IDS=123456789
```

puis relance `npm run bot`. Sans cette variable, le bot répond à tout le monde.

## Utilisation

Écris simplement au bot, en langage naturel :

- « Où en est la bibliothèque Durand ? »
- « Quels projets sont en attente de validation client ? »
- « Quel est le délai pour un dressing en complexité avancée ? »
- « Combien coûte l'option panneau acoustique ? »
- « Résume le blueprint produit. »

Commandes : `/help`, `/files` (liste les notes Markdown), `/reset` (efface le
contexte de la conversation).

## Ajouter des projets

Dépose une note Markdown par projet dans le dossier [`projets/`](../projets/)
(voir `projets/_template.md`). Le bot les lit automatiquement — aucune
réindexation nécessaire.

## Configuration (variables d'environnement)

| Variable | Rôle | Défaut |
| --- | --- | --- |
| `TELEGRAM_BOT_TOKEN` | Jeton BotFather (obligatoire) | — |
| `ANTHROPIC_API_KEY` | Clé API Anthropic (obligatoire) | — |
| `TELEGRAM_ALLOWED_CHAT_IDS` | Chat IDs autorisés (virgules) | tout le monde |
| `ANTHROPIC_MODEL` | Modèle Claude | `claude-opus-4-8` |
| `THINKING` | `adaptive` (+ malin) ou `disabled` (+ rapide) | `disabled` |
| `KNOWLEDGE_ROOT` | Racine des fichiers accessibles | dossier courant |
| `MAX_TOKENS` | Tokens max par réponse | `2048` |

## Sécurité

- Le bot n'a qu'un accès **lecture**. Il ne peut rien modifier.
- Les fichiers sensibles (`.env`, `node_modules`, `.git`, lockfiles) sont exclus.
- La lecture est confinée à `KNOWLEDGE_ROOT` : toute tentative de sortie du
  dossier est refusée.
- Utilise **toujours** `TELEGRAM_ALLOWED_CHAT_IDS` en production.

## Fonctionnement

- Communication Telegram en *long polling* (`getUpdates`) — pas de serveur ni de
  webhook public à héberger.
- À chaque question, Claude choisit les fichiers à lire via ses outils, puis
  répond. L'historique de conversation est conservé par chat (avec `/reset`
  pour repartir de zéro).
