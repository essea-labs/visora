// Reflective prompts — second-person questions the user can sit with.
// Render as dashed-border cards in the Today's wisdom swipeable set.
//
// All prompts are original Visora writing. Universal (no category
// filter) by default — category-specific prompts can be added later.

import type { ReflectivePrompt } from '@/core/models/wisdom';

export const PROMPTS: ReflectivePrompt[] = [
  { id: 'p-001', text: 'What are you ready to release?' },
  { id: 'p-002', text: 'Where in your body is calm?' },
  { id: 'p-003', text: 'Who do you want to become by sundown?' },
  { id: 'p-004', text: 'What is one small kindness you can offer yourself today?' },
  { id: 'p-005', text: 'What story are you telling yourself that no longer fits?' },
  { id: 'p-006', text: 'Where in your life are you divided?' },
  { id: 'p-007', text: 'What would change if you trusted yourself more?' },
  { id: 'p-008', text: 'What do you know but have not yet acted on?' },
  { id: 'p-009', text: 'What is asking to be tended?' },
  { id: 'p-010', text: 'Where can you choose softness today?' },
  { id: 'p-011', text: 'Who in your life deserves your full attention today?' },
  { id: 'p-012', text: 'What are you pretending not to want?' },
];

/**
 * Deterministic daily rotation. Given a date, returns up to `limit`
 * prompts. Same calendar day always returns the same selection.
 */
export function todaysPrompts(
  limit = 3,
  now: Date = new Date(),
): ReflectivePrompt[] {
  if (PROMPTS.length === 0) return [];
  const start = new Date(now.getFullYear(), 0, 0).getTime();
  const day = Math.floor((now.getTime() - start) / (24 * 60 * 60 * 1000));
  const take = Math.min(limit, PROMPTS.length);
  const out: ReflectivePrompt[] = [];
  for (let i = 0; i < take; i++) {
    out.push(PROMPTS[(day + i) % PROMPTS.length]);
  }
  return out;
}
