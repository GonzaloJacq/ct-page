"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Player } from "../players/types";
import { Formation, FormationData, ApiResponse } from "./types";
import { FormationBuilder } from "./components/FormationBuilder";
import { FormationsList } from "./components/FormationList";
import { usePlayer } from "../players/hooks/usePlayer";
import { useFormations } from "./hooks/useFormations";

export default function FormationsPage() {
  const { data: session } = useSession();
  const isAdmin = !!session?.user?.isAdmin;

  const { players, fetchPlayers } = usePlayer();
  const { 
    formations, 
    loading: formationsLoading, 
    error: formationsError, 
    fetchFormations, 
    createFormation, 
    updateFormation, 
    deleteFormation 
  } = useFormations();

  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  // Local error state to combine errors if needed, or just use hook errors
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlayers();
    fetchFormations();
  }, [fetchPlayers, fetchFormations]);

  const error = localError || formationsError;
  const loading = formationsLoading;

  const handleSaveFormation = async (name: string, formationData: FormationData) => {
    setLocalError(null);
    let result;
    if (selectedFormation) {
      result = await updateFormation(selectedFormation.id, { name, formationData });
    } else {
      result = await createFormation({ name, formationData });
    }

    if (result) {
      setShowBuilder(false);
      setSelectedFormation(null);
    }
  };

  const handleEditFormation = (formation: Formation) => {
    setSelectedFormation(formation);
    setShowBuilder(true);
    setLocalError(null);
  };

  const handleDeleteFormation = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta formación?")) return;
    await deleteFormation(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display text-white">
            ARMADOR TÁCTICO
          </h1>
          <p className="text-slate-400 text-sm mt-1">Diseña y guarda las estrategias de juego</p>
        </div>
        
        {isAdmin && !showBuilder && (
          <button
            onClick={() => {
              setSelectedFormation(null);
              setShowBuilder(true);
              setLocalError(null);
            }}
            className="btn-primary flex items-center gap-2 cursor-pointer"
          >
            + Nueva Formación
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {showBuilder ? (
        <FormationBuilder
          players={players}
          initialFormation={selectedFormation}
          onSave={handleSaveFormation}
          onCancel={() => {
            setShowBuilder(false);
            setSelectedFormation(null);
            setLocalError(null);
          }}
        />
      ) : (
        <FormationsList
          formations={formations}
          players={players}
          loading={loading}
          isAdmin={isAdmin}
          onEdit={handleEditFormation}
          onDelete={handleDeleteFormation}
        />
      )}
    </div>
  );
}