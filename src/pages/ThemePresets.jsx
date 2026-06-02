import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { 
  Palette, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Sparkles,
  Layout,
  RefreshCw
} from 'lucide-react';

const ThemePresets = () => {
  const [presets, setPresets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newPreset, setNewPreset] = useState({
    name: '',
    primaryColor: '#8E248C',
    secondaryColor: '#E91E63'
  });

  const fetchPresets = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/theme/presets`);
      setPresets(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch presets failed', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresets();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/theme/presets`, newPreset);
      setShowModal(false);
      setNewPreset({ name: '', primaryColor: '#8E248C', secondaryColor: '#E91E63' });
      fetchPresets();
    } catch (err) {
      alert('Error creating preset');
    }
  };

  const handleActivate = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/api/theme/presets/${id}/activate`);
      fetchPresets();
      alert('Design Preset Activated! Mobile app will update instantly.');
    } catch (err) {
      alert('Error activating preset');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this design preset?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/theme/presets/${id}`);
        fetchPresets();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting preset');
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl font-black text-white">Design Presets</h1>
          <p className="text-slate-400 font-medium">Create and switch between multiple app themes instantly.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-brand text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-brand/20 hover:bg-brand-light transition-all flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create New Preset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {presets.map((preset) => (
          <div 
            key={preset._id} 
            className={`bg-dark-surface rounded-[2.5rem] p-8 border-2 transition-all duration-300 relative overflow-hidden group ${
              preset.isActive ? 'border-brand-light shadow-xl shadow-brand-light/10' : 'border-white/5 shadow-sm hover:border-white/20'
            }`}
          >
            {preset.isActive && (
              <div className="absolute top-0 right-0 bg-brand text-white px-6 py-2 rounded-bl-3xl flex items-center space-x-2">
                <CheckCircle2 size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Active UI</span>
              </div>
            )}

            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5">
                <Palette size={24} className={preset.isActive ? 'text-brand-light' : 'text-slate-400'} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{preset.name}</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Enterprise Theme</p>
              </div>
            </div>

            {/* Mobile App Preview Mockup */}
            <div className="bg-white/5 rounded-3xl p-6 mb-8 border border-white/10">
              <div className="flex justify-between items-center mb-4">
                 <div className="w-8 h-2 bg-white/20 rounded-full"></div>
                 <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primaryColor }}></div>
              </div>
              <div className="space-y-3">
                 <div className="h-10 rounded-xl flex items-center px-3" style={{ backgroundColor: preset.primaryColor }}>
                    <div className="w-20 h-2 bg-white/40 rounded-full"></div>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <div className="h-16 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center">
                       <div className="w-8 h-8 rounded-full" style={{ backgroundColor: preset.secondaryColor }}></div>
                    </div>
                    <div className="h-16 rounded-xl bg-white/5 shadow-sm border border-white/10"></div>
                 </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
               <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: preset.primaryColor }}></div>
                  <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: preset.secondaryColor }}></div>
               </div>
               <div className="flex space-x-3">
                  {!preset.isActive && (
                    <>
                      <button 
                        onClick={() => handleActivate(preset._id)}
                        className="px-6 py-2 bg-brand-light text-dark-deep rounded-xl text-xs font-black hover:bg-white transition-colors"
                      >
                        Activate
                      </button>
                      <button 
                        onClick={() => handleDelete(preset._id)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in zoom-in-95 duration-200">
          <div className="bg-dark-surface rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl border border-white/5">
            <div className="flex items-center space-x-3 mb-6">
               <div className="w-10 h-10 bg-brand-light/10 rounded-2xl flex items-center justify-center">
                  <Sparkles size={20} className="text-brand-light" />
               </div>
               <h2 className="text-2xl font-black text-white">New Design Preset</h2>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Preset Name</label>
                <input 
                  type="text" 
                  value={newPreset.name} 
                  onChange={(e) => setNewPreset({...newPreset, name: e.target.value})}
                  required
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-light/20 focus:bg-white/10 outline-none transition-all font-bold text-white placeholder:text-slate-500"
                  placeholder="e.g. Royal Gold Edition"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Primary</label>
                  <input 
                    type="color" 
                    value={newPreset.primaryColor}
                    onChange={(e) => setNewPreset({...newPreset, primaryColor: e.target.value})}
                    className="w-full h-14 rounded-2xl cursor-pointer border-none bg-white/5 p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Secondary</label>
                  <input 
                    type="color" 
                    value={newPreset.secondaryColor}
                    onChange={(e) => setNewPreset({...newPreset, secondaryColor: e.target.value})}
                    className="w-full h-14 rounded-2xl cursor-pointer border-none bg-white/5 p-2"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-400 font-bold hover:bg-white/10 rounded-2xl transition">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-brand-light text-dark-deep rounded-2xl font-black shadow-[0_0_20px_rgba(179,136,255,0.4)] hover:bg-white transition">
                  Create Preset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemePresets;
