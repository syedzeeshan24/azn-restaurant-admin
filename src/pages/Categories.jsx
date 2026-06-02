import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { Plus, Edit3, Trash2, Layers } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', imageUrl: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error('Fetch categories failed', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/categories/${editingId}`, newCategory);
      } else {
        await axios.post(`${API_BASE_URL}/api/categories`, newCategory);
      }
      setShowModal(false);
      setNewCategory({ name: '', imageUrl: '' });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      alert('Error saving category');
    }
  };

  const handleEdit = (cat) => {
    setNewCategory({ name: cat.name, imageUrl: cat.imageUrl });
    setEditingId(cat._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Erase this category vector?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/categories/${id}`);
        fetchCategories();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  return (
    <div className="p-10 space-y-12 animate-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-3">Neural Taxonomy</h1>
          <p className="text-slate-500 font-bold tracking-tight">Organize your operational structure and storefront segments.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-brand-light text-dark-deep px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-2xl shadow-brand/20 flex items-center space-x-3"
        >
          <Plus size={20} />
          <span>Create New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {categories.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-dark-surface border border-white/5 rounded-[3rem]">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-dark-deep rounded-full flex items-center justify-center mb-8 border border-white/5">
                <Layers size={40} className="text-slate-700" />
              </div>
              <p className="text-slate-500 font-black text-lg uppercase tracking-widest">No Taxonomy Data</p>
            </div>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat._id} className="bg-dark-surface rounded-[2.5rem] overflow-hidden border border-white/5 group hover:border-brand-light/30 transition-all duration-500 shadow-2xl">
              <div className="relative h-56 overflow-hidden">
                <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-deep via-dark-deep/40 to-transparent"></div>
                <h3 className="absolute bottom-6 left-8 font-black text-2xl text-white tracking-tighter group-hover:text-brand-light transition-colors">{cat.name}</h3>
              </div>
              <div className="px-8 py-6 flex justify-between items-center bg-dark-surface/50 backdrop-blur-md border-t border-white/5">
                <div className="flex items-center space-x-2">
                   <div className="w-2 h-2 bg-brand-light rounded-full shadow-[0_0_8px_rgba(179,136,255,0.6)]"></div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Linked</span>
                </div>
                <div className="flex space-x-5">
                  <button onClick={() => handleEdit(cat)} className="text-slate-500 hover:text-brand-light transition-colors">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => handleDelete(cat._id)} className="text-slate-500 hover:text-red-500 transition-colors">
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
          <div className="bg-dark-surface rounded-[3rem] p-12 w-full max-w-xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10">
            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">{editingId ? 'Modify Category' : 'Initialize Category'}</h2>
            <p className="text-slate-500 font-bold mb-10 tracking-tight">Configure the neural parameters for this segment.</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Segment Identity</label>
                <input 
                  type="text" 
                  value={newCategory.name} 
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  required
                  className="w-full p-5 bg-dark-deep border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-light/20 focus:border-brand-light/30 outline-none transition-all font-bold text-white placeholder:text-slate-700"
                  placeholder="e.g. Cyber Burgers"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Visual Nexus (URL)</label>
                <input 
                  type="url" 
                  value={newCategory.imageUrl} 
                  onChange={(e) => setNewCategory({...newCategory, imageUrl: e.target.value})}
                  required
                  className="w-full p-5 bg-dark-deep border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-light/20 focus:border-brand-light/30 outline-none transition-all font-bold text-white placeholder:text-slate-700"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div className="flex space-x-6 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 text-slate-500 font-black uppercase text-xs tracking-widest hover:text-white transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-5 bg-brand-light text-dark-deep rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-brand/20 hover:bg-white transition-all">
                  {editingId ? 'Update Vector' : 'Deploy Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
