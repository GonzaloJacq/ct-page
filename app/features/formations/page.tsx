"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { Player } from "../players/types";
import { Formation, FormationData, ApiResponse } from "./types";
import { FormationBuilder } from "./components/FormationBuilder";
import { FormationsList } from "./components/FormationList";

export default function FormationsPage() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const [players, setPlayers] = useState<Player[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlayers();
    fetchFormations();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch("/api/players");
      const data: ApiResponse<Player[]> = await response.json();
      
      if (data.success && data.data) {
        setPlayers(data.data);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
      setError("Error al cargar jugadores");
    }
  };

  const fetchFormations = async () => {
    try {
      const response = await fetch("/api/formations");
      const data: ApiResponse<Formation[]> = await response.json();
      
      if (data.success && data.data) {
        setFormations(data.data);
      }
    } catch (error) {
      console.error("Error fetching formations:", error);
      setError("Error al cargar formaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFormation = async (name: string, formationData: FormationData) => {
    try {
      setError(null);
      const method = selectedFormation ? "PUT" : "POST";
      const url = selectedFormation
        ? `/api/formations/${selectedFormation.id}`
        : "/api/formations";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, formationData }),
      });

      const data: ApiResponse<Formation> = await response.json();

      if (data.success) {
        await fetchFormations();
        setShowBuilder(false);
        setSelectedFormation(null);
      } else {
        setError(data.error || "Error al guardar formación");
      }
    } catch (error) {
      console.error("Error saving formation:", error);
      setError("Error al guardar formación");
    }
  };

  const handleEditFormation = (formation: Formation) => {
    setSelectedFormation(formation);
    setShowBuilder(true);
    setError(null);
  };

  const handleDeleteFormation = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta formación?")) return;

    try {
      setError(null);
      const response = await fetch(`/api/formations/${id}`, {
        method: "DELETE",
      });

      const data: ApiResponse<void> = await response.json();

      if (data.success) {
        await fetchFormations();
      } else {
        setError(data.error || "Error al eliminar formación");
      }
    } catch (error) {
      console.error("Error deleting formation:", error);
      setError("Error al eliminar formación");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl text-gray-400 group-hover:text-gray-200 transition">
              ←
            </span>
            <h1 className="text-4xl font-bold text-gray-100">
              Armador de Formaciones
            </h1>
          </Link>
          {isAuthenticated && !showBuilder && (
            <button
              onClick={() => {
                setSelectedFormation(null);
                setShowBuilder(true);
                setError(null);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              + Nueva Formación
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-900 border border-red-700 text-red-100 rounded">
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
              setError(null);
            }}
          />
        ) : (
          <FormationsList
            formations={formations}
            players={players}
            loading={loading}
            isAuthenticated={isAuthenticated}
            onEdit={handleEditFormation}
            onDelete={handleDeleteFormation}
          />
        )}
      </div>
    </div>
  );
}