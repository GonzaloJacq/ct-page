"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useEstadisticas } from "./hooks/useEstadisticas";
import { EstadisticaList } from "./components";


export default function EstadisticasPage() {
  const { estadisticas, loading, error, fetchEstadisticas } = useEstadisticas();

  useEffect(() => {
    fetchEstadisticas();
  }, [fetchEstadisticas]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 group">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-2xl text-foreground-muted group-hover:text-white transition">
            ←
          </span>
        </Link>
        <h1 className="text-4xl font-bold text-white font-display uppercase tracking-wide">
          Estadísticas
        </h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900 border border-red-700 text-red-100 rounded">
          {error}
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-white mb-4 font-display uppercase tracking-wide">
          Estadísticas de Jugadores
        </h2>
        <EstadisticaList estadisticas={estadisticas} isLoading={loading} />
      </div>
    </div>
  );
}
