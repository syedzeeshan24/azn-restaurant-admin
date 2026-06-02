import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, UserPlus, ShieldAlert, UserCheck, 
  Search, Shield, Trash2, Mail, Phone, Key, X, Loader2, Edit, Camera
} from 'lucide-react';
import API_BASE_URL from '../config';

const UserControl = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
  });
  const [editModeId, setEditModeId] = useState(null); // null if creating, ID if editing
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      let res;
      if (editModeId) {
        // Edit Mode
        res = await axios.put(`${API_BASE_URL}/api/users/staff/${editModeId}`, newUserData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // If editing the currently logged in admin themselves, sync local storage
        const currentAdmin = JSON.parse(localStorage.getItem('adminUser') || '{}');
        if (currentAdmin.id === editModeId) {
          localStorage.setItem('adminUser', JSON.stringify({
            id: res.data._id,
            name: res.data.name,
            email: res.data.email,
            phone: res.data.phone,
            avatar: res.data.avatar
          }));
          // Trigger custom storage event to alert other components (Header, Sidebar)
          window.dispatchEvent(new Event('storage'));
        }
      } else {
        // Create Mode
        res = await axios.post(`${API_BASE_URL}/api/users/staff`, newUserData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      setIsModalOpen(false);
      setEditModeId(null);
      setNewUserData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
      });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing request.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditClick = (u) => {
    setEditModeId(u._id);
    setNewUserData({
      name: u.name || '',
      email: u.email || '',
      phone: u.phone || '',
      password: '', // leave empty
      role: u.role || 'customer',
      avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
    });
    setIsModalOpen(true);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/10 border-red-500/20 text-red-500';
      case 'rider':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-500';
      default:
        return 'bg-brand-light/10 border-brand-light/20 text-brand-light';
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search);
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="w-16 h-16 text-brand-light animate-spin" />
        <p className="mt-8 text-sm font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Syncing User Grid</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 space-y-12 animate-in pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-3">Staff & User Control</h1>
          <p className="text-slate-500 font-bold tracking-tight">Configure core access clearances, rider vectors, and user segmentations.</p>
        </div>
        <button 
          onClick={() => {
            setEditModeId(null);
            setNewUserData({
              name: '',
              email: '',
              phone: '',
              password: '',
              role: 'customer',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
            });
            setIsModalOpen(true);
          }}
          className="bg-brand-light text-dark-deep px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-2xl shadow-brand/20 flex items-center justify-center space-x-3"
        >
          <UserPlus size={18} />
          <span>Initialize User Node</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-brand-light transition-colors" size={20} />
          <input
            placeholder="Search nodes by name, email, or phone identifier..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-dark-surface border border-white/10 rounded-[2rem] pl-16 pr-8 py-5 text-white focus:ring-2 focus:ring-brand-light/20 focus:border-brand-light/30 outline-none transition-all font-bold placeholder:text-slate-700"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="bg-dark-surface border border-white/10 rounded-[2rem] px-8 py-5 text-white outline-none font-black text-xs uppercase tracking-widest cursor-pointer focus:border-brand-light/30"
        >
          <option value="all">ALL CLEARANCES</option>
          <option value="admin">ADMIN (LEVEL 5)</option>
          <option value="rider">RIDER (LOGISTICS)</option>
          <option value="customer">CUSTOMER (CORE)</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-dark-surface border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto w-full -mx-4 md:mx-0 px-4 md:px-0">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black text-slate-600 uppercase tracking-widest">
              <th className="px-10 py-8">Identity Segment</th>
              <th className="px-10 py-8">Secure Contact Info</th>
              <th className="px-10 py-8">Access Clearance</th>
              <th className="px-10 py-8">Created On</th>
              <th className="px-10 py-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map(u => (
              <tr key={u._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-10 py-8">
                  <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 rounded-[1.2rem] overflow-hidden border border-brand-light/20 flex items-center justify-center shadow-xl shadow-brand/10">
                      <img 
                        src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'} 
                        className="w-full h-full object-cover" 
                        alt={u.name} 
                      />
                    </div>
                    <div>
                      <span className="text-lg font-black text-white group-hover:text-brand-light transition-colors">{u.name}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-1.5 h-1.5 bg-brand-light rounded-full"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{u.role === 'customer' ? 'Core Segment' : 'Operations Staff'}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm font-bold text-slate-400">
                      <Mail size={14} className="text-slate-700" />
                      <span>{u.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                      <Phone size={12} className="text-slate-800" />
                      <span>{u.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl border font-black text-[10px] uppercase tracking-widest ${getRoleBadgeColor(u.role)}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-10 py-8 text-slate-500 font-bold text-xs">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-10 py-8 text-right">
                  <button 
                    onClick={() => handleEditClick(u)}
                    className="p-3 bg-white/5 text-slate-400 hover:text-brand-light rounded-xl hover:bg-white/10 transition"
                  >
                    <Edit size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-dark-deep/80 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className="bg-dark-surface border border-white/5 rounded-[3rem] w-full max-w-xl p-12 shadow-2xl relative animate-in">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-slate-500 hover:text-white p-3 hover:bg-white/5 rounded-2xl transition"
            >
              <X size={20} />
            </button>

            <h3 className="text-3xl font-black text-white tracking-tighter mb-8 flex items-center gap-3">
              {editModeId ? <Edit size={28} className="text-brand-light" /> : <UserPlus size={28} className="text-brand-light" />}
              {editModeId ? 'Configure User Node' : 'Initialize Node'}
            </h3>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold leading-relaxed">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Alias Name</label>
                  <input
                    type="text"
                    required
                    value={newUserData.name}
                    onChange={e => setNewUserData({...newUserData, name: e.target.value})}
                    className="w-full bg-dark-deep border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-light/30 transition font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Clearance Level</label>
                  <select
                    value={newUserData.role}
                    onChange={e => setNewUserData({...newUserData, role: e.target.value})}
                    className="w-full bg-dark-deep border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-light/30 transition font-bold uppercase tracking-wider"
                  >
                    <option value="customer">CUSTOMER</option>
                    <option value="rider">RIDER (LOGISTICS)</option>
                    <option value="admin">ADMIN (LEVEL 5)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Node</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input
                    type="email"
                    required
                    value={newUserData.email}
                    onChange={e => setNewUserData({...newUserData, email: e.target.value})}
                    className="w-full bg-dark-deep border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-brand-light/30 transition font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Identity</label>
                <div className="relative">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input
                    type="text"
                    required
                    value={newUserData.phone}
                    onChange={e => setNewUserData({...newUserData, phone: e.target.value})}
                    className="w-full bg-dark-deep border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-brand-light/30 transition font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Profile Image URL</label>
                <div className="relative">
                  <Camera className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input
                    type="text"
                    required
                    value={newUserData.avatar}
                    onChange={e => setNewUserData({...newUserData, avatar: e.target.value})}
                    className="w-full bg-dark-deep border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-brand-light/30 transition font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Encryption Key (Password)</label>
                <div className="relative">
                  <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input
                    type="password"
                    placeholder={editModeId ? "Leave blank to keep key" : "Enter key"}
                    required={!editModeId}
                    value={newUserData.password}
                    onChange={e => setNewUserData({...newUserData, password: e.target.value})}
                    className="w-full bg-dark-deep border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-brand-light/30 transition font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={createLoading}
                className="w-full mt-4 bg-brand-light text-dark-deep py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-2xl shadow-brand/20 flex items-center justify-center space-x-3 disabled:opacity-50"
              >
                {createLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Synchronizing Core...</span>
                  </>
                ) : (
                  <span>{editModeId ? 'Update Node Configuration' : 'Commit Authorization'}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserControl;
