import { PrismaClient } from '@prisma/client';
import { Fee, CreateFeeInput, UpdateFeeInput } from '@/app/features/fees/types';

const prisma = new PrismaClient();

export async function getFees(): Promise<Fee[]> {
  const fees = await prisma.fee.findMany({
    orderBy: { month: 'desc' },
  });
  return fees;
}

export async function getFeeById(id: string): Promise<Fee | null> {
  return await prisma.fee.findUnique({
    where: { id },
  });
}

export async function createFee(input: CreateFeeInput): Promise<Fee> {
  const player = await prisma.player.findUnique({
    where: { id: input.playerId },
  });

  if (!player) {
    throw new Error('Player not found');
  }

  return await prisma.fee.create({
    data: {
      playerId: input.playerId,
      playerName: player.name,
      month: input.month,
      amount: input.amount,
    },
  });
}

export async function updateFee(id: string, input: UpdateFeeInput): Promise<Fee> {
  const data: Record<string, unknown> = {};

  if (input.amount !== undefined) data.amount = input.amount;
  if (input.paid !== undefined) data.paid = input.paid;
  if (input.paidDate !== undefined) data.paidDate = input.paidDate;

  return await prisma.fee.update({
    where: { id },
    data,
  });
}

export async function deleteFee(id: string): Promise<Fee> {
  return await prisma.fee.delete({
    where: { id },
  });
}
