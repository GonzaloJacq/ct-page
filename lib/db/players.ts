import { Player, CreatePlayerInput, UpdatePlayerInput } from '@/app/features/players/types';

const players: Map<string, Player> = new Map();
let playerCounter = 1;

export const initializePlayersDb = () => {
  const samplePlayers: Player[] = [
    {
      id: '1',
      name: 'Carlos García',
      age: 28,
      phone: '+34 612 345 678',
      shirtNumber: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Miguel López',
      age: 25,
      phone: '+34 623 456 789',
      shirtNumber: 7,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  samplePlayers.forEach((player) => {
    players.set(player.id, player);
    playerCounter = Math.max(playerCounter, parseInt(player.id) + 1);
  });
};

initializePlayersDb();

export const getPlayers = (): Player[] => {
  return Array.from(players.values());
};

export const getPlayerById = (id: string): Player | null => {
  return players.get(id) || null;
};

export const createPlayer = (input: CreatePlayerInput): Player => {
  const id = playerCounter.toString();
  playerCounter++;

  const player: Player = {
    id,
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  players.set(id, player);
  return player;
};

export const updatePlayer = (id: string, input: UpdatePlayerInput): Player | null => {
  const player = players.get(id);
  if (!player) return null;

  const updated: Player = {
    ...player,
    ...input,
    updatedAt: new Date(),
  };

  players.set(id, updated);
  return updated;
};

export const deletePlayer = (id: string): boolean => {
  return players.delete(id);
};
