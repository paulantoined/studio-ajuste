import Anthropic from '@anthropic-ai/sdk';
import { CONFIG } from './config';
import { buildIndex, executeTool, TOOLS } from './knowledge';

const client = new Anthropic({ apiKey: CONFIG.anthropicApiKey });

const MAX_TOOL_ITERATIONS = 12;

export type ChatMessage = Anthropic.MessageParam;

function systemPrompt(): string {
  return [
    "Tu es l'assistant personnel de Studio Ajuste, un atelier de mobilier sur mesure.",
    "Tu réponds au fondateur à propos de ses projets de meubles, de l'état d'avancement des chantiers, de la doc produit et de la configuration métier.",
    '',
    'Tu as un accès EN LECTURE à tous les fichiers du projet via les outils :',
    '- list_files : lister/filtrer les fichiers',
    '- read_file : lire un fichier',
    '- search : chercher un texte dans les fichiers',
    '',
    'Règles :',
    "- Utilise les outils pour lire les fichiers concernés AVANT de répondre. Ne devine jamais un contenu.",
    "- Les notes de projets meuble sont en Markdown dans le dossier projets/. La config métier (prix, délais, scoring) est dans lib/business-config.ts.",
    "- Réponds en français, de façon directe, concrète et concise. Pas de méta-commentaire sur ta démarche.",
    "- Si l'information n'existe pas dans les fichiers, dis-le clairement.",
    "- Le rendu Telegram est en texte brut : évite le Markdown lourd (pas de tableaux), tu peux utiliser des tirets pour les listes.",
    '',
    'Index des fichiers disponibles :',
    buildIndex(),
  ].join('\n');
}

function extractText(content: Anthropic.ContentBlock[]): string {
  return content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();
}

/**
 * Envoie l'historique à Claude, exécute les outils demandés en boucle,
 * et renvoie le texte final + l'historique mis à jour (blocs outils inclus).
 */
export async function ask(
  messages: ChatMessage[],
): Promise<{ text: string; messages: ChatMessage[] }> {
  const thinkingParam =
    CONFIG.thinking === 'adaptive'
      ? { thinking: { type: 'adaptive' as const } }
      : {};
  const outputConfig =
    CONFIG.thinking === 'adaptive'
      ? { output_config: { effort: 'medium' as const } }
      : {};

  for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
    const response = await client.messages.create({
      model: CONFIG.model,
      max_tokens: CONFIG.maxTokens,
      system: systemPrompt(),
      tools: TOOLS,
      messages,
      ...thinkingParam,
      ...outputConfig,
    });

    messages.push({ role: 'assistant', content: response.content });

    if (response.stop_reason !== 'tool_use') {
      const text =
        extractText(response.content) ||
        "Je n'ai pas de réponse à afficher.";
      return { text, messages };
    }

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type !== 'tool_use') continue;
      try {
        const result = executeTool(
          block.name,
          block.input as Record<string, unknown>,
        );
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: result,
        });
      } catch (err) {
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: err instanceof Error ? err.message : String(err),
          is_error: true,
        });
      }
    }
    messages.push({ role: 'user', content: toolResults });
  }

  return {
    text: "Trop d'étapes de recherche. Reformule ta question plus précisément.",
    messages,
  };
}
