import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, Edit, Trash2, Mail, Phone, X, Loader2, Camera, CheckCircle, 
  MapPin, Clock, ArrowRight, ShieldAlert, Sparkles, Bike
} from 'lucide-react';
import API_BASE_URL from '../config';

const Riders = () => {
  const [riders, setRiders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState('Rs.');
  
  const [newRiderData, setNewRiderData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'rider',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
  });
  
  const [editModeId, setEditModeId] = useState(null); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRiders, setSelectedRiders] = useState({}); 

  const handleRiderChange = (orderId, riderId) => {
    setSelectedRiders(prev => ({
      ...prev,
      [orderId]: riderId
    }));
  };

  const fetchRiderData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const [usersRes, ordersRes, settingsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/orders`),
        axios.get(`${API_BASE_URL}/api/settings`).catch(() => ({ data: { currencySymbol: 'Rs.' } }))
      ]);

      // Filter riders
      const ridersFiltered = (usersRes.data || []).filter(u => u.role === 'rider');
      setRiders(ridersFiltered);

      // Filter active orders (Pending, Accepted, Preparing, Out for Delivery)
      const activeOrd = (ordersRes.data || []).filter(o => 
        ['Pending', 'Accepted', 'Preparing', 'Out for Delivery'].includes(o.status)
      );
      setActiveOrders(activeOrd);
      setCurrencySymbol(settingsRes.data?.currencySymbol || 'Rs.');
    } catch (err) {
      console.error('Error syncing Logistics core:', err);
      setError('Neural Link Failure: Unable to sync logistics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderData();
  }, []);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      if (editModeId) {
        // Edit Mode
        await axios.put(`${API_BASE_URL}/api/users/staff/${editModeId}`, newRiderData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Fleet Agent profile updated successfully.');
      } else {
        // Create Mode
        await axios.post(`${API_BASE_URL}/api/users/staff`, newRiderData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('New Fleet Agent profile initialized.');
      }
      
      setIsModalOpen(false);
      setEditModeId(null);
      setNewRiderData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'rider',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
      });
      fetchRiderData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing request.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditClick = (r) => {
    setEditModeId(r._id);
    setNewRiderData({
      name: r.name || '',
      email: r.email || '',
      phone: r.phone || '',
      password: '', 
      role: 'rider',
      avatar: r.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
    });
    setIsModalOpen(true);
  };

  const handleAssignOrder = async (orderId, riderId) => {
    if (!riderId) {
      alert('Please select a rider from the matrix.');
      return;
    }
    const rider = riders.find(r => r._id === riderId);
    if (!rider) return;

    try {
      setError('');
      setSuccess('');
      // Assign the order and transition status to 'Out for Delivery' (or stay current status)
      await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        status: 'Out for Delivery',
        riderName: rider.name,
        riderPhone: rider.phone,
        assignedRider: rider._id
      });
      
      setSuccess(`Order successfully assigned and dispatched to ${rider.name}!`);
      fetchRiderData();
    } catch (err) {
      console.error('Error assigning rider:', err);
      setError('Logistics update failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="w-16 h-16 text-brand-light animate-spin" />
        <p className="mt-8 text-sm font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Initializing Logistics Core</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 space-y-12 animate-in pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-3">Logistics Fleet Command</h1>
          <p className="text-slate-500 font-bold tracking-tight">Configure logistics personnel profiles, assign delivery agents, and deploy active payloads.</p>
        </div>
        <button 
          onClick={() => {
            setEditModeId(null);
            setNewRiderData({
              name: '',
              email: '',
              phone: '',
              password: '',
              role: 'rider',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
            });
            setIsModalOpen(true);
          }}
          className="bg-brand-light text-dark-deep px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-2xl shadow-brand/20 flex items-center justify-center space-x-3"
        >
          <Bike size={18} />
          <span>Deploy New Rider</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-xs font-bold leading-relaxed">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold leading-relaxed">
          {error}
        </div>
      )}

      {/* Grid: Riders Grid & Active Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Riders Matrix (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center space-x-3">
            <Users className="text-brand-light" size={24} />
            <h2 className="text-2xl font-black text-white tracking-tighter">Active Fleet Agents ({riders.length})</h2>
          </div>

          <div className="bg-dark-surface border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto w-full -mx-4 md:mx-0 px-4 md:px-0">
        <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                  <th className="px-8 py-6">Rider Segment</th>
                  <th className="px-8 py-6">Contact Number</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {riders.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-8 py-12 text-center text-slate-500 font-bold">
                      No active riders deployed. Click "Deploy New Rider" to start.
                    </td>
                  </tr>
                ) : (
                  riders.map(r => (
                    <tr key={r._id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-[1rem] overflow-hidden border border-brand-light/20 flex items-center justify-center shadow-lg">
                            <img 
                              src={r.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'} 
                              className="w-full h-full object-cover" 
                              alt={r.name} 
                            />
                          </div>
                          <div>
                            <span className="text-base font-black text-white group-hover:text-brand-light transition-colors">{r.name}</span>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{r.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-400">
                        <div className="flex items-center space-x-2">
                          <Phone size={14} className="text-slate-600" />
                          <span>{r.phone}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => handleEditClick(r)}
                          className="p-3 bg-white/5 text-slate-400 hover:text-brand-light rounded-xl hover:bg-white/10 transition"
                          title="Edit Rider Credentials"
                        >
                          <Edit size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
      </div>
          </div>
        </div>

        {/* Order Assignment Matrix (Right 1 Column) */}
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <Sparkles className="text-brand-light" size={24} />
            <h2 className="text-2xl font-black text-white tracking-tighter">Logistics Dispatch</h2>
          </div>

          <div className="space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
            {activeOrders.length === 0 ? (
              <div className="bg-dark-surface border border-white/5 p-12 rounded-[2.5rem] text-center shadow-2xl">
                <p className="text-slate-500 font-bold">No active orders awaiting dispatch.</p>
              </div>
            ) : (
              activeOrders.map(order => {
                const selectedRiderId = selectedRiders[order._id] || '';
                return (
                  <div key={order._id} className="bg-dark-surface border border-white/5 p-8 rounded-[2.5rem] space-y-5 hover:border-brand-light/20 transition-all duration-300 shadow-2xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-black text-white tracking-tight">#{order._id.substring(order._id.length - 6).toUpperCase()}</h3>
                        <p className="text-[10px] font-black text-brand-light uppercase tracking-widest mt-1">Status: {order.status}</p>
                      </div>
                      <p className="text-xl font-black text-white tracking-tighter">{currencySymbol} {order.grandTotal.toLocaleString()}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start text-xs font-bold text-slate-400 space-x-2 leading-relaxed">
                        <MapPin size={14} className="text-slate-600 mt-0.5" />
                        <span>{order.deliveryAddress.street}, {order.deliveryAddress.city}</span>
                      </div>
                    </div>

                    {order.riderName && (
                      <div className="bg-dark-deep/50 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center space-x-2">
                        <Bike size={12} className="text-brand-light" />
                        <span>Assigned to: {order.riderName} ({order.riderPhone})</span>
                      </div>
                    )}

                    <div className="space-y-3 pt-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Deploy Agent</label>
                      <select 
                        value={selectedRiderId}
                        onChange={(e) => handleRiderChange(order._id, e.target.value)}
                        className="w-full bg-dark-deep border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-light/30 transition text-xs font-bold font-black"
                      >
                        <option value="">SELECT FLEET AGENT...</option>
                        {riders.map(r => (
                          <option key={r._id} value={r._id}>{r.name} ({r.phone})</option>
                        ))}
                      </select>

                      <button 
                        onClick={() => handleAssignOrder(order._id, selectedRiderId)}
                        disabled={!selectedRiderId}
                        className="w-full bg-brand-light text-dark-deep py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <span>Dispatch Payload</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Creation/Edit Modal */}
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
              {editModeId ? <Edit size={28} className="text-brand-light" /> : <Bike size={28} className="text-brand-light" />}
              {editModeId ? 'Configure Rider profile' : 'Initialize Fleet Node'}
            </h3>

            <form onSubmit={handleCreateOrUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Rider Full Name</label>
                <input
                  type="text"
                  required
                  value={newRiderData.name}
                  onChange={e => setNewRiderData({...newRiderData, name: e.target.value})}
                  className="w-full bg-dark-deep border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-light/30 transition font-bold"
                  placeholder="e.g. Kenji S."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input
                    type="text"
                    required
                    value={newRiderData.phone}
                    onChange={e => setNewRiderData({...newRiderData, phone: e.target.value})}
                    className="w-full bg-dark-deep border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-brand-light/30 transition font-bold"
                    placeholder="e.g. +81 90-XXXX-XXXX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Logistics Email Node</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input
                    type="email"
                    required
                    value={newRiderData.email}
                    onChange={e => setNewRiderData({...newRiderData, email: e.target.value})}
                    className="w-full bg-dark-deep border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-brand-light/30 transition font-bold"
                    placeholder="e.g. kenji@azn.com"
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
                    value={newRiderData.avatar}
                    onChange={e => setNewRiderData({...newRiderData, avatar: e.target.value})}
                    className="w-full bg-dark-deep border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-brand-light/30 transition font-bold"
                  />
                </div>
              </div>

              {!editModeId && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Encryption Key (Password)</label>
                  <input
                    type="password"
                    required
                    value={newRiderData.password}
                    onChange={e => setNewRiderData({...newRiderData, password: e.target.value})}
                    className="w-full bg-dark-deep border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-brand-light/30 transition font-bold"
                    placeholder="Create secure key"
                  />
                </div>
              )}

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

export default Riders;
