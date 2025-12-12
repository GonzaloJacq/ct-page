'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFees } from './hooks/useFees';
import { usePlayer } from '@/app/features/players/hooks/usePlayer';
import { FeeForm, FeeList } from './components';
import { Fee, CreateFeeInput } from './types';

export default function FeesPage() {
  const { fees, loading, error, fetchFees, createFee, updateFee, deleteFee } = useFees();
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
    if (confirm('¿Eliminar esta cuota?')) {
      await deleteFee(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl text-gray-400 group-hover:text-gray-200 transition">←</span>
            <h1 className="text-4xl font-bold text-gray-100">Gestión de Cuotas</h1>
          </Link>
          {!showForm && (
            <button
              onClick={() => {
                setEditingFee(null);
                setShowForm(true);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              + Nueva Cuota
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-900 border border-red-700 text-red-100 rounded">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">
              {editingFee ? 'Editar Cuota' : 'Nueva Cuota'}
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
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Cuotas</h2>
          {loading && !showForm ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Cargando...</p>
            </div>
          ) : (
            <FeeList
              fees={fees}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
