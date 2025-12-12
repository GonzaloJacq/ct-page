import { PrismaClient } from '@prisma/client';
import { Player, CreatePlayerInput, UpdatePlayerInput } from '@/app/features/players/types';

const prisma = new PrismaClient();

export async function getPlayers(): Promise<Player[]> {
  const players = await prisma.player.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return players;
}

export async function getPlayerById(id: string): Promise<Player | null> {
  return await prisma.player.findUnique({
    where: { id },
  });
}

export async function createPlayer(input: CreatePlayerInput): Promise<Player> {
  return await prisma.player.create({
    data: {
      name: input.name,
      age: input.age,
      phone: input.phone,
      shirtNumber: input.shirtNumber,
    },
  });
}

export async function updatePlayer(id: string, input: UpdatePlayerInput): Promise<Player> {
  return await prisma.player.update({
    where: { id },
    data: input,
  });
}

export async function deletePlayer(id: string): Promise<Player> {
  return await prisma.player.delete({
    where: { id },
  });
}
