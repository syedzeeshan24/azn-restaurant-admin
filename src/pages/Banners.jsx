import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { Plus, Edit3, Trash2, Megaphone, Image as ImageIcon, Link as LinkIcon, ExternalLink } from 'lucide-react';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    linkType: 'none',
    linkId: '',
    isActive: true
  });

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/banners/all`);
      setBanners(res.data);
    } catch (err) {
      console.error('Fetch banners failed', err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/banners/${editingId}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/api/banners`, formData);
      }
      setShowModal(false);
      resetForm();
      fetchBanners();
    } catch (err) {
      alert('Error saving banner');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      imageUrl: '',
      linkType: 'none',
      linkId: '',
      isActive: true
    });
    setEditingId(null);
  };

  const handleEdit = (banner) => {
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl,
      linkType: banner.linkType || 'none',
      linkId: banner.linkId || '',
      isActive: banner.isActive
    });
    setEditingId(banner._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Erase this marketing asset from the mobile stream?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/banners/${id}`);
        fetchBanners();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const toggleStatus = async (banner) => {
    try {
      await axios.put(`${API_BASE_URL}/api/banners/${banner._id}`, {
        isActive: !banner.isActive
      });
      fetchBanners();
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="p-4 md:p-10 space-y-12 animate-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-3">Hero Banners</h1>
          <p className="text-slate-500 font-bold tracking-tight">Manage your high-impact marketing visuals and home screen real estate.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-brand-light text-dark-deep px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-2xl shadow-brand/20 flex items-center space-x-3"
        >
          <Plus size={20} />
          <span>Create New Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {banners.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-dark-surface border border-white/5 rounded-[3rem]">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-dark-deep rounded-full flex items-center justify-center mb-8 border border-white/5">
                <ImageIcon size={40} className="text-slate-700" />
              </div>
              <p className="text-slate-500 font-black text-lg uppercase tracking-widest">No Active Campaigns</p>
            </div>
          </div>
        ) : (
          banners.map((banner) => (
            <div key={banner._id} className="bg-dark-surface border border-white/5 rounded-[3rem] overflow-hidden group hover:border-brand-light/20 transition-all duration-700 shadow-2xl">
              <div className="relative h-72 overflow-hidden">
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                
                <div className="absolute top-8 right-8">
                  <button 
                    onClick={() => toggleStatus(banner)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-md border border-white/10 transition-all ${
                      banner.isActive ? 'bg-brand-light/90 text-dark-deep shadow-brand/20' : 'bg-dark-deep/90 text-slate-500'
                    }`}
                  >
                    {banner.isActive ? 'Live Stream' : 'Buffered'}
                  </button>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-dark-deep via-dark-deep/40 to-transparent"></div>
                
                <div className="absolute bottom-10 left-10 right-10">
                  <h3 className="text-3xl font-black text-white tracking-tighter leading-tight group-hover:text-brand-light transition-colors">{banner.title}</h3>
                  <p className="text-slate-400 text-sm font-bold mt-2 line-clamp-1">{banner.subtitle}</p>
                </div>
              </div>

              <div className="px-10 py-8 flex justify-between items-center bg-dark-surface/50 backdrop-blur-md border-t border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-brand-light rounded-full shadow-[0_0_8px_rgba(179,136,255,0.6)]"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {banner.linkType === 'none' ? 'Display Only' : `Redirect: ${banner.linkType.toUpperCase()}`}
                  </span>
                </div>
                <div className="flex space-x-6">
                  <button onClick={() => handleEdit(banner)} className="text-slate-500 hover:text-brand-light transition-colors">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => handleDelete(banner._id)} className="text-slate-500 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-dark-deep/90 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-in zoom-in-95">
          <div className="bg-dark-surface rounded-[3rem] p-12 w-full max-w-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10">
            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">{editingId ? 'Modify Campaign' : 'Initialize Campaign'}</h2>
            <p className="text-slate-500 font-bold mb-10 tracking-tight">Configure the visual and navigational parameters for this asset.</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Asset Identity (Title)</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    className="w-full p-5 bg-dark-deep border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-brand-light/20 focus:border-brand-light/30 outline-none transition-all font-bold placeholder:text-slate-700 shadow-inner"
                    placeholder="e.g. Midnight Feast Deal"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Narrative Payload (Subtitle)</label>
                  <input 
                    type="text" 
                    value={formData.subtitle} 
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full p-5 bg-dark-deep border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-brand-light/20 focus:border-brand-light/30 outline-none transition-all font-bold placeholder:text-slate-700 shadow-inner"
                    placeholder="e.g. Get 20% off on all bucket meals"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Visual Nexus (Image URL)</label>
                  <div className="relative group">
                    <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-brand-light transition-colors" size={20} />
                    <input 
                      type="url" 
                      value={formData.imageUrl} 
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      required
                      className="w-full p-5 bg-dark-deep border border-white/10 rounded-2xl pl-16 pr-6 text-white focus:ring-2 focus:ring-brand-light/20 focus:border-brand-light/30 outline-none transition-all font-bold placeholder:text-slate-700 shadow-inner"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Redirection Protocol</label>
                  <div className="relative group">
                    <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-brand-light transition-colors" size={18} />
                    <select 
                      value={formData.linkType}
                      onChange={(e) => setFormData({...formData, linkType: e.target.value})}
                      className="w-full p-5 bg-dark-deep border border-white/10 rounded-2xl pl-16 text-white focus:ring-2 focus:ring-brand-light/20 focus:border-brand-light/30 outline-none transition-all font-bold appearance-none cursor-pointer"
                    >
                      <option value="none">No External Link</option>
                      <option value="category">Link to Segment</option>
                      <option value="product">Link to Product</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Target Vector (ID/Name)</label>
                  <input 
                    type="text" 
                    value={formData.linkId} 
                    onChange={(e) => setFormData({...formData, linkId: e.target.value})}
                    className="w-full p-5 bg-dark-deep border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-brand-light/20 focus:border-brand-light/30 outline-none transition-all font-bold placeholder:text-slate-700 shadow-inner"
                    placeholder="e.g. Burgers or Product_ID"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <label className="relative inline-flex items-center cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-dark-deep peer-focus:outline-none rounded-full border border-white/10 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-700 after:border-transparent after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-light peer-checked:after:bg-white transition-all"></div>
                  <span className="ml-4 text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">Inject into Mobile Stream</span>
                </label>
              </div>

              <div className="flex space-x-6 pt-10">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-6 text-slate-500 font-black uppercase text-xs tracking-widest hover:text-white transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-6 bg-brand-light text-dark-deep rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-brand/20 hover:bg-white transition-all flex items-center justify-center space-x-3">
                  <ExternalLink size={18} />
                  <span>Deploy Campaign</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;
