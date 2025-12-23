import { PrismaClient } from "@prisma/client";

import {
  Formation,
  FormationData,
  UpdateFormationInput,
} from "@/app/features/formations/types";

const prisma = new PrismaClient();

export async function getFormations(): Promise<Formation[]> {
  const formations = await prisma.formation.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return formations.map((formation) => ({
    ...formation,
    formationData: formation.formationData as FormationData,
  }));
}

/**
 * Obtiene una formación por ID
 */
export async function getFormationById(id: string): Promise<Formation | null> {
  const formation = await prisma.formation.findUnique({
    where: { id },
  });

  if (!formation) return null;

  return {
    ...formation,
    formationData: formation.formationData as FormationData,
  };
}

/**
 * Crea una nueva formación
 */
export async function createFormation(
  data: CreateFormationInput
): Promise<Formation> {
  const formation = await prisma.formation.create({
    data: {
      name: data.name,
      formationData: data.formationData as any, // Prisma maneja el JSON
    },
  });

  return {
    ...formation,
    formationData: formation.formationData as FormationData,
  };
}

/**
 * Actualiza una formación existente
 */
export async function updateFormation(
  id: string,
  data: UpdateFormationInput
): Promise<Formation | null> {
  try {
    const formation = await prisma.formation.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.formationData && { formationData: data.formationData as any }),
      },
    });

    return {
      ...formation,
      formationData: formation.formationData as FormationData,
    };
  } catch (error: any) {
    if (error.code === "P2025") {
      return null; // Formation not found
    }
    throw error;
  }
}

/**
 * Elimina una formación
 */
export async function deleteFormation(id: string): Promise<boolean> {
  try {
    await prisma.formation.delete({
      where: { id },
    });
    return true;
  } catch (error: any) {
    if (error.code === "P2025") {
      return false; // Formation not found
    }
    throw error;
  }
}
