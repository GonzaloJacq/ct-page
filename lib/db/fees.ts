import { Fee, CreateFeeInput, UpdateFeeInput } from '@/app/features/fees/types';
import { getPlayerById } from './players';

const fees: Map<string, Fee> = new Map();
let feeCounter = 1;

export const getFees = (): Fee[] => {
  return Array.from(fees.values());
};

export const getFeeById = (id: string): Fee | null => {
  return fees.get(id) || null;
};

export const createFee = (input: CreateFeeInput): Fee => {
  const id = feeCounter.toString();
  feeCounter++;

  const player = getPlayerById(input.playerId);
  const playerName = player?.name || 'Desconocido';

  const fee: Fee = {
    id,
    playerId: input.playerId,
    playerName,
    month: input.month,
    amount: input.amount,
    paid: false,
    paidDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  fees.set(id, fee);
  return fee;
};

export const updateFee = (id: string, input: UpdateFeeInput): Fee | null => {
  const fee = fees.get(id);
  if (!fee) return null;

  const updated: Fee = {
    ...fee,
    ...input,
    updatedAt: new Date(),
  };

  fees.set(id, updated);
  return updated;
};

export const deleteFee = (id: string): boolean => {
  return fees.delete(id);
};
