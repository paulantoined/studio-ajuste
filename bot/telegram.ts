import { CONFIG } from './config';

const API = `https://api.telegram.org/bot${CONFIG.telegramToken}`;
const MAX_MESSAGE_LEN = 4096;

export interface TelegramMessage {
  message_id: number;
  chat: { id: number; type: string; first_name?: string; title?: string };
  from?: { id: number; first_name?: string; username?: string };
  text?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

async function call<T>(method: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as { ok: boolean; result: T; description?: string };
  if (!data.ok) {
    throw new Error(`Telegram ${method} a échoué : ${data.description || res.status}`);
  }
  return data.result;
}

export async function getUpdates(offset: number): Promise<TelegramUpdate[]> {
  const res = await fetch(
    `${API}/getUpdates?timeout=30&offset=${offset}&allowed_updates=${encodeURIComponent(
      '["message"]',
    )}`,
  );
  const data = (await res.json()) as {
    ok: boolean;
    result: TelegramUpdate[];
    description?: string;
  };
  if (!data.ok) {
    throw new Error(`Telegram getUpdates a échoué : ${data.description || res.status}`);
  }
  return data.result;
}

export async function sendChatAction(chatId: number, action = 'typing'): Promise<void> {
  try {
    await call('sendChatAction', { chat_id: chatId, action });
  } catch {
    /* non bloquant */
  }
}

export async function sendMessage(chatId: number, text: string): Promise<void> {
  const safe = text.trim() || '(réponse vide)';
  for (let i = 0; i < safe.length; i += MAX_MESSAGE_LEN) {
    await call('sendMessage', {
      chat_id: chatId,
      text: safe.slice(i, i + MAX_MESSAGE_LEN),
    });
  }
}

export async function getMe(): Promise<{ username?: string; first_name?: string }> {
  return call('getMe', {});
}
