// Types para Formations
export interface PlayerPosition {
  x: number; // Porcentaje 0-100
  y: number; // Porcentaje 0-100
}

export interface DrawingPath {
  type: 'line' | 'arrow';
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

export interface FormationPlayerData {
  [playerId: string]: PlayerPosition;
}

export interface FormationData {
  players: FormationPlayerData;
  drawings?: DrawingPath[];
}

export interface Formation {
  id: string;
  name: string;
  formationData: FormationData;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFormationInput {
  name: string;
  formationData: FormationData;
}

export interface UpdateFormationInput {
  name?: string;
  formationData?: FormationData;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}