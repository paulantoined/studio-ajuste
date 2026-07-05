import fs from 'node:fs';
import path from 'node:path';

/**
 * Charge un éventuel fichier .env (KEY=VALUE) sans dépendance externe.
 * Les variables déjà présentes dans process.env ne sont pas écrasées.
 */
function loadEnvFile(root: string): void {
  const envPath = path.join(root, '.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

const ROOT = path.resolve(process.env.KNOWLEDGE_ROOT || process.cwd());
loadEnvFile(ROOT);

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `Variable d'environnement manquante : ${name}. ` +
        `Renseigne-la dans bot/.env ou dans ton environnement (voir bot/README.md).`,
    );
  }
  return v;
}

function parseChatIds(raw: string | undefined): number[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n));
}

export const CONFIG = {
  /** Racine des fichiers auxquels le bot a accès (par défaut : racine du projet). */
  root: ROOT,
  /** Jeton du bot Telegram (via @BotFather). */
  telegramToken: required('TELEGRAM_BOT_TOKEN'),
  /** Clé API Anthropic. */
  anthropicApiKey: required('ANTHROPIC_API_KEY'),
  /** Modèle Claude à utiliser. */
  model: process.env.ANTHROPIC_MODEL || 'claude-opus-4-8',
  /** 'adaptive' pour activer le raisonnement étendu, sinon désactivé (plus rapide). */
  thinking: (process.env.THINKING || 'disabled') as 'adaptive' | 'disabled',
  /** Chat IDs autorisés. Vide = tout le monde (déconseillé). */
  allowedChatIds: parseChatIds(process.env.TELEGRAM_ALLOWED_CHAT_IDS),
  /** Extensions considérées comme lisibles en texte. */
  textExtensions: (
    process.env.KNOWLEDGE_EXTENSIONS ||
    '.md,.mdx,.txt,.ts,.tsx,.js,.jsx,.json,.css,.yml,.yaml'
  )
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
  maxTokens: Number(process.env.MAX_TOKENS || 2048),
} as const;

/** Répertoires/fichiers jamais exposés au bot (secrets, artefacts, gros dossiers). */
export const IGNORED = {
  dirs: new Set([
    'node_modules',
    '.next',
    '.git',
    '.vercel',
    'dist',
    'build',
    'coverage',
  ]),
  /** Fichiers exclus (secrets et lockfiles volumineux). */
  matches: (name: string): boolean =>
    name === '.env' ||
    name.startsWith('.env.') ||
    name === 'package-lock.json' ||
    name === 'yarn.lock' ||
    name === 'pnpm-lock.yaml',
};
