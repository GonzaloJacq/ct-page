import { Match, CreateMatchInput, UpdateMatchInput } from '@/app/features/matches/types';

const matches: Map<string, Match> = new Map();
let matchCounter = 1;

export const getMatches = (): Match[] => {
  return Array.from(matches.values());
};

export const getMatchById = (id: string): Match | null => {
  return matches.get(id) || null;
};

export const createMatch = (input: CreateMatchInput): Match => {
  const id = matchCounter.toString();
  matchCounter++;

  const match: Match = {
    id,
    date: input.date,
    opponent: input.opponent,
    playerIds: input.playerIds,
    result: input.result ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  matches.set(id, match);
  return match;
};

export const updateMatch = (id: string, input: UpdateMatchInput): Match | null => {
  const match = matches.get(id);

  if (!match) {
    return null;
  }

  const updated: Match = {
    ...match,
    ...input,
    result: 'result' in input ? (input.result ?? null) : match.result,
    updatedAt: new Date(),
  };

  matches.set(id, updated);
  return updated;
};

export const deleteMatch = (id: string): boolean => {
  return matches.delete(id);
};
