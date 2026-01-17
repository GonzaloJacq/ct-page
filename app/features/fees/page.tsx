"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useFees } from "./hooks/useFees";
import { usePlayer } from "@/app/features/players/hooks/usePlayer";
import { FeeForm, FeeList } from "./components";
import { Fee, CreateFeeInput } from "./types";


export default function FeesPage() {
  const { data: session } = useSession();
  const isAdmin = !!session?.user?.isAdmin;
  const { fees, loading, error, fetchFees, createFee, updateFee, deleteFee } =
    useFees();
  const { players, fetchPlayers } = usePlayer();
  const [showForm, setShowForm] = useState(false);
  const [editingFee, setEditingFee] = useState<Fee | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchFees();
    fetchPlayers();
  }, [fetchFees, fetchPlayers]);

  const handleSubmit = async (data: CreateFeeInput) => {
    setFormLoading(true);
    try {
      if (editingFee) {
        await updateFee(editingFee.id, { amount: data.amount });
      } else {
        await createFee(data);
      }
      setShowForm(false);
      setEditingFee(null);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (fee: Fee) => {
    setEditingFee(fee);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFee(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar esta cuota?")) {
      await deleteFee(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/" className="flex items-center gap-3 group mb-2 w-fit">
            <span className="text-foreground-muted group-hover:text-white transition">← Volver</span>
          </Link>
          <h1 className="text-3xl font-display text-white">
            GESTIÓN DE CUOTAS
          </h1>
          <p className="text-foreground-muted text-sm mt-1">Control de pagos y mensualidades</p>
        </div>
        
        {isAdmin && !showForm && (
          <button
            onClick={() => {
              setEditingFee(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center gap-2 cursor-pointer"
          >
            <span>+ Nueva Cuota</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {showForm && (
        <div className="dashboard-card mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {editingFee ? "Editar Cuota" : "Nueva Cuota"}
          </h2>
          <FeeForm
            onSubmit={handleSubmit}
            initialData={editingFee}
            isLoading={formLoading}
            onCancel={handleCancel}
            players={players}
          />
        </div>
      )}

      <div>
        {!showForm && (
          <>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-slate-400 mt-4">Cargando...</p>
              </div>
            ) : (
              <FeeList
                fees={fees}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={loading}
                isAdmin={isAdmin}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
