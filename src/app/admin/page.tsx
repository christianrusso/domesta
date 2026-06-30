'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogoWithText } from '@/components/Logo';
import { formatZone } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'CLIENT' | 'DOMESTIC' | 'ADMIN';
  zone: string | null;
  isApproved: boolean;
  isSuspended: boolean;
  createdAt: string;
}

export default function AdminPanel() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRole, setFilterRole] = useState<'ALL' | 'CLIENT' | 'DOMESTIC' | 'ADMIN'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchUsers(token);
  }, [router]);

  const fetchUsers = async (token: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setError('No autorizado. Solo administradores pueden acceder.');
        return;
      }

      const data = await res.json();
      setUsers(data.users || []);
      setFilteredUsers(data.users || []);
    } catch (err) {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = users;
    if (filterRole !== 'ALL') filtered = filtered.filter((u) => u.role === filterRole);
    if (filterStatus === 'SUSPENDED') filtered = filtered.filter((u) => u.isSuspended);
    else if (filterStatus === 'ACTIVE') filtered = filtered.filter((u) => !u.isSuspended);
    if (searchText) filtered = filtered.filter((u) => u.name.toLowerCase().includes(searchText.toLowerCase()) || u.email.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredUsers(filtered);
  }, [filterRole, filterStatus, searchText, users]);

  const handleToggleSuspend = async (userId: string, currentState: boolean) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No hay token disponible');
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isSuspended: !currentState }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(users.map((u) => u.id === userId ? { ...u, isSuspended: !currentState } : u));
      } else {
        alert(data.error || 'Error al actualizar usuario');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al contactar el servidor');
    }
  };

  const handleToggleApprove = async (userId: string, currentState: boolean) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No hay token disponible');
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isApproved: !currentState }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(users.map((u) => u.id === userId ? { ...u, isApproved: !currentState } : u));
      } else {
        alert(data.error || 'Error al actualizar usuario');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al contactar el servidor');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br slate-950"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;

  const clientCount = users.filter((u) => u.role === 'CLIENT').length;
  const domesticCount = users.filter((u) => u.role === 'DOMESTIC').length;
  const suspendedCount = users.filter((u) => u.isSuspended).length;

  return (
    <div className="min-h-screen bg-gradient-to-br slate-950">
      <nav className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/"><LogoWithText /></Link>
          <div className="flex gap-6">
            <Link href="/dashboard" className="text-white/70 hover:text-white transition">Dashboard</Link>
            <button onClick={() => { localStorage.removeItem('token'); router.push('/'); }} className="text-red-400 hover:text-red-300 transition">Salir</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {error && <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8"><p className="text-red-200">{error}</p></div>}
        
        <div className="grid grid-cols-4 gap-4 mb-12">
          <div className="bg-white/10 border border-white/20 rounded-lg p-6"><p className="text-white/60 text-sm mb-2">Total Usuarios</p><p className="text-3xl font-bold text-white">{users.length}</p></div>
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-6"><p className="text-blue-200 text-sm mb-2">Clientes</p><p className="text-3xl font-bold text-blue-300">{clientCount}</p></div>
          <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-6"><p className="text-purple-200 text-sm mb-2">Niñeras</p><p className="text-3xl font-bold text-purple-300">{domesticCount}</p></div>
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6"><p className="text-red-200 text-sm mb-2">Suspendidos</p><p className="text-3xl font-bold text-red-300">{suspendedCount}</p></div>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Filtros</h3>
          <div className="grid grid-cols-4 gap-4">
            <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Buscar..." className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value as any)} className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="ALL">Todos los roles</option>
              <option value="CLIENT">Clientes</option>
              <option value="DOMESTIC">Niñeras</option>
              <option value="ADMIN">Administradores</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="ALL">Todos los estados</option>
              <option value="ACTIVE">Activos</option>
              <option value="SUSPENDED">Suspendidos</option>
            </select>
            <button onClick={() => { setSearchText(''); setFilterRole('ALL'); setFilterStatus('ALL'); }} className="px-4 py-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-lg transition">Limpiar</button>
          </div>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20 bg-white/5">
                <th className="px-6 py-4 text-left text-white font-semibold">Nombre</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Rol</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Zona</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Estado</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Registrado</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center"><p className="text-white/60">No se encontraron usuarios</p></td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-white/70 text-xs">{user.email}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'CLIENT' ? 'bg-blue-600/50 text-blue-100' : user.role === 'DOMESTIC' ? 'bg-purple-600/50 text-purple-100' : 'bg-yellow-600/50 text-yellow-100'}`}>{user.role === 'CLIENT' ? 'Cliente' : user.role === 'DOMESTIC' ? 'Niñera' : 'Admin'}</span></td>
                    <td className="px-6 py-4 text-white/70 text-sm">{formatZone(user.zone)}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isSuspended ? 'bg-red-600/50 text-red-100' : 'bg-green-600/50 text-green-100'}`}>{user.isSuspended ? 'Suspendido' : 'Activo'}</span></td>
                    <td className="px-6 py-4 text-white/70 text-xs">{new Date(user.createdAt).toLocaleDateString('es-AR')}</td>
                    <td className="px-6 py-4"><div className="flex gap-2">
                      <button onClick={() => handleToggleSuspend(user.id, user.isSuspended)} className={`px-3 py-1 rounded text-xs font-semibold transition ${user.isSuspended ? 'bg-green-600/50 hover:bg-green-600/70 text-green-100' : 'bg-red-600/50 hover:bg-red-600/70 text-red-100'}`}>{user.isSuspended ? 'Desbloquear' : 'Bloquear'}</button>
                      {user.role === 'DOMESTIC' && <button onClick={() => handleToggleApprove(user.id, user.isApproved)} className={`px-3 py-1 rounded text-xs font-semibold transition ${user.isApproved ? 'bg-yellow-600/50 hover:bg-yellow-600/70 text-yellow-100' : 'bg-green-600/50 hover:bg-green-600/70 text-green-100'}`}>{user.isApproved ? 'Desaprobar' : 'Aprobar'}</button>}
                    </div></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="text-white/60 text-sm mt-4">Mostrando {filteredUsers.length} de {users.length} usuarios</p>
      </main>
    </div>
  );
}
