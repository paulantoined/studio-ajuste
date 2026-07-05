import { CONFIG } from './config';
import { ask, type ChatMessage } from './claude';
import { listFiles } from './knowledge';
import {
  getMe,
  getUpdates,
  sendChatAction,
  sendMessage,
  type TelegramUpdate,
} from './telegram';

/** Historique de conversation par chat (blocs outils inclus). */
const histories = new Map<number, ChatMessage[]>();
const MAX_HISTORY_MESSAGES = 24;

/** Coupe l'historique à des frontières propres (début sur un message user texte). */
function trimHistory(messages: ChatMessage[]): ChatMessage[] {
  let trimmed = messages;
  while (trimmed.length > MAX_HISTORY_MESSAGES) {
    trimmed = trimmed.slice(1);
  }
  while (trimmed.length > 0) {
    const first = trimmed[0];
    if (first.role === 'user' && typeof first.content === 'string') break;
    trimmed = trimmed.slice(1);
  }
  return trimmed;
}

function isAllowed(chatId: number): boolean {
  if (CONFIG.allowedChatIds.length === 0) return true;
  return CONFIG.allowedChatIds.includes(chatId);
}

const HELP = [
  'Assistant Studio Ajuste 🪵',
  '',
  'Pose-moi des questions sur tes projets de meubles, l’état des chantiers, la doc ou la config métier. J’ai accès en lecture à tous tes fichiers.',
  '',
  'Exemples :',
  '- Où en est la bibliothèque Durand ?',
  '- Quels projets sont en attente de validation client ?',
  '- Quel est le délai pour un dressing en complexité avancée ?',
  '- Résume le blueprint produit.',
  '',
  'Commandes :',
  '/help — cette aide',
  '/files — liste les notes de projets (.md)',
  '/reset — efface le contexte de la conversation',
].join('\n');

async function handleText(chatId: number, text: string): Promise<void> {
  const trimmed = text.trim();

  if (trimmed === '/start' || trimmed === '/help') {
    await sendMessage(chatId, HELP);
    return;
  }
  if (trimmed === '/reset') {
    histories.delete(chatId);
    await sendMessage(chatId, 'Contexte effacé. On repart de zéro. 🧹');
    return;
  }
  if (trimmed === '/files') {
    const files = listFiles('**/*.md');
    await sendMessage(
      chatId,
      files.length
        ? 'Fichiers Markdown :\n' + files.map((f) => '- ' + f).join('\n')
        : 'Aucun fichier Markdown trouvé.',
    );
    return;
  }
  if (trimmed.startsWith('/')) {
    await sendMessage(chatId, 'Commande inconnue. Tape /help.');
    return;
  }

  const history = histories.get(chatId) ?? [];
  history.push({ role: 'user', content: trimmed });

  await sendChatAction(chatId, 'typing');
  const keepTyping = setInterval(() => void sendChatAction(chatId, 'typing'), 5000);
  try {
    const { text: answer, messages } = await ask(history);
    histories.set(chatId, trimHistory(messages));
    await sendMessage(chatId, answer);
  } catch (err) {
    console.error('Erreur de traitement :', err);
    await sendMessage(
      chatId,
      "Une erreur est survenue en traitant ta demande. Réessaie dans un instant.",
    );
  } finally {
    clearInterval(keepTyping);
  }
}

async function processUpdate(update: TelegramUpdate): Promise<void> {
  const message = update.message;
  if (!message || !message.text) return;
  const chatId = message.chat.id;

  if (!isAllowed(chatId)) {
    await sendMessage(
      chatId,
      `Accès non autorisé. Ton chat ID est ${chatId} — ajoute-le à TELEGRAM_ALLOWED_CHAT_IDS.`,
    );
    return;
  }
  await handleText(chatId, message.text);
}

async function main(): Promise<void> {
  const me = await getMe();
  console.log(`✅ Bot connecté : @${me.username || me.first_name}`);
  console.log(`📁 Racine des fichiers : ${CONFIG.root}`);
  console.log(`🤖 Modèle : ${CONFIG.model} (thinking: ${CONFIG.thinking})`);
  if (CONFIG.allowedChatIds.length === 0) {
    console.log('⚠️  Aucun TELEGRAM_ALLOWED_CHAT_IDS : le bot répond à tout le monde.');
  }
  console.log('En écoute…');

  let offset = 0;
  for (;;) {
    try {
      const updates = await getUpdates(offset);
      for (const update of updates) {
        offset = update.update_id + 1;
        await processUpdate(update);
      }
    } catch (err) {
      console.error('Erreur de polling :', err);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

main().catch((err) => {
  console.error('Erreur fatale :', err);
  process.exit(1);
});
