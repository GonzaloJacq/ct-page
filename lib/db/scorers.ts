import { Scorer, CreateScorerInput, UpdateScorerInput } from '@/app/features/scorers/types';

const scorers: Map<string, Scorer> = new Map();
let scorerCounter = 1;

export const getScorers = (): Scorer[] => {
  return Array.from(scorers.values());
};

export const getScorerById = (id: string): Scorer | null => {
  return scorers.get(id) || null;
};

export const createScorer = (input: CreateScorerInput): Scorer => {
  const id = scorerCounter.toString();
  scorerCounter++;

  const scorer: Scorer = {
    id,
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  scorers.set(id, scorer);
  return scorer;
};

export const updateScorer = (id: string, input: UpdateScorerInput): Scorer | null => {
  const scorer = scorers.get(id);
  if (!scorer) return null;

  const updated: Scorer = {
    ...scorer,
    ...input,
    updatedAt: new Date(),
  };

  scorers.set(id, updated);
  return updated;
};

export const deleteScorer = (id: string): boolean => {
  return scorers.delete(id);
};
