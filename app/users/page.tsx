'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user?.isAdmin) {
      router.push('/');
      return;
    }

    fetchUsers();
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Error al cargar usuarios');
      const data = await res.json();
      setUsers(data.data || []);
    } catch (err) {
      setError('No se pudieron cargar los usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (userId: string, currentStatus: boolean) => {
    // Optimistic update
    setUsers(users.map(u => u.id === userId ? { ...u, isAdmin: !currentStatus } : u));

    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, isAdmin: !currentStatus }),
      });

      if (!res.ok) {
        throw new Error('Error limit');
      }
    } catch (error) {
      // Revert
      setUsers(users.map(u => u.id === userId ? { ...u, isAdmin: currentStatus } : u));
      alert('Error al actualizar el usuario');
    }
  };

  if (status === 'loading' || (loading && users.length === 0)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session?.user?.isAdmin) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/" className="flex items-center gap-3 group mb-2 w-fit">
            <span className="text-foreground-muted group-hover:text-white transition">← Volver</span>
          </Link>
          <h1 className="text-3xl font-display text-white">
            GESTIÓN DE USUARIOS
          </h1>
          <p className="text-foreground-muted text-sm mt-1">Administra accesos y roles</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="overflow-x-auto bg-surface rounded-lg shadow border border-white/5">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-surface">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-white font-display uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white font-display uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white font-display uppercase tracking-wider">
                Fecha Registro
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-white font-display uppercase tracking-wider">
                Admin
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition">
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {user.name}
                  {user.id === session.user.id && <span className="ml-2 text-xs text-primary">(Tú)</span>}
                </td>
                <td className="px-6 py-4 text-sm text-foreground-muted">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-foreground-muted">
                  {new Date(user.createdAt).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => toggleAdmin(user.id, user.isAdmin)}
                    className={`cursor-pointer w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                      user.isAdmin ? 'bg-primary' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        user.isAdmin ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="ml-2 text-xs text-foreground-muted">
                    {user.isAdmin ? 'Sí' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
