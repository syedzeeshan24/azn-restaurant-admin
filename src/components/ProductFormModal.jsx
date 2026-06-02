import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const ProductFormModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    isAvailable: true,
    rating: 4.5,
    modifierGroups: []
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        price: product.price.toString(),
        modifierGroups: product.modifierGroups || []
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addModifierGroup = () => {
    setFormData(prev => ({
      ...prev,
      modifierGroups: [
        ...prev.modifierGroups, 
        { name: '', minSelection: 0, maxSelection: 1, options: [] }
      ]
    }));
  };

  const addOption = (groupIndex) => {
    const newGroups = [...formData.modifierGroups];
    newGroups[groupIndex].options.push({ name: '', price: 0 });
    setFormData({ ...formData, modifierGroups: newGroups });
  };

  const updateGroup = (index, field, value) => {
    const newGroups = [...formData.modifierGroups];
    newGroups[index][field] = (field === 'minSelection' || field === 'maxSelection') ? Number(value) : value;
    setFormData({ ...formData, modifierGroups: newGroups });
  };

  const updateOption = (groupIndex, optionIndex, field, value) => {
    const newGroups = [...formData.modifierGroups];
    newGroups[groupIndex].options[optionIndex][field] = field === 'price' ? Number(value) : value;
    setFormData({ ...formData, modifierGroups: newGroups });
  };

  const removeGroup = (index) => {
    setFormData(prev => ({
      ...prev,
      modifierGroups: prev.modifierGroups.filter((_, i) => i !== index)
    }));
  };

  const removeOption = (groupIndex, optionIndex) => {
    const newGroups = [...formData.modifierGroups];
    newGroups[groupIndex].options = newGroups[groupIndex].options.filter((_, i) => i !== optionIndex);
    setFormData({ ...formData, modifierGroups: newGroups });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price)
      };

      if (product) {
        await axios.put(`${API_BASE_URL}/api/products/${product._id}`, payload);
      } else {
        await axios.post(`${API_BASE_URL}/api/products`, payload);
      }
      onSave();
    } catch (err) {
      console.error('Save failed', err);
      alert('Error saving product');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-in">
      <div className="bg-dark-surface rounded-[3rem] p-12 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_20px_70px_rgba(0,0,0,0.5)] border border-white/5 relative group">
        <div className="absolute top-0 left-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex justify-between items-center mb-12 relative z-10">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">{product ? 'Update Matrix Item' : 'New Neural Asset'}</h2>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Catalog Entry Protocol</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all shadow-sm">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Product Identity</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-brand/10 focus:bg-white/10 outline-none transition-all font-bold placeholder:text-slate-500" placeholder="Item Name" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category Segment</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                required 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-brand/10 focus:bg-white/10 outline-none transition-all font-bold"
              >
                <option value="">Select Domain</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Operational Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-brand/10 focus:bg-white/10 outline-none transition-all font-bold placeholder:text-slate-500 resize-none" placeholder="Describe the neural-enhanced features..."></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pricing (Rs)</label>
              <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-brand/10 focus:bg-white/10 outline-none transition-all font-bold" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Neural Rating</label>
              <input type="number" step="0.1" min="0" max="5" name="rating" value={formData.rating} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-brand/10 focus:bg-white/10 outline-none transition-all font-bold" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Image Asset Link</label>
              <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-brand/10 focus:bg-white/10 outline-none transition-all font-bold placeholder:text-slate-500" placeholder="https://..." />
            </div>
          </div>

          <div className="flex items-center p-6 bg-white/5 border border-white/10 rounded-3xl">
            <input type="checkbox" name="isAvailable" id="isAvailable" checked={formData.isAvailable} onChange={handleChange} className="h-6 w-6 text-brand-light rounded-lg border-white/10 bg-dark-deep focus:ring-brand-light" />
            <label htmlFor="isAvailable" className="ml-4 block text-sm font-black text-white uppercase tracking-widest">Active in Catalog Matrix</label>
          </div>

          <div className="pt-10 border-t border-white/10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-black text-white">Customization Layers</h3>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Modifier groups and add-ons</p>
              </div>
              <button type="button" onClick={addModifierGroup} className="px-6 py-3 bg-brand-light text-dark-deep rounded-2xl hover:bg-white hover:scale-105 transition-all text-xs font-black uppercase tracking-widest shadow-xl">
                + Add Layer
              </button>
            </div>
            
            <div className="space-y-8">
              {formData.modifierGroups.map((group, gIndex) => (
                <div key={gIndex} className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 mr-6">
                        <input 
                        type="text" 
                        placeholder="Layer Name" 
                        value={group.name} 
                        onChange={(e) => updateGroup(gIndex, 'name', e.target.value)} 
                        className="bg-dark-deep border border-white/10 rounded-xl px-4 py-3 text-sm font-black text-white outline-none focus:border-brand-light"
                      />
                      <div className="flex items-center space-x-3 bg-dark-deep px-4 py-3 rounded-xl border border-white/10">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Min</span>
                        <input type="number" value={group.minSelection} onChange={(e) => updateGroup(gIndex, 'minSelection', e.target.value)} className="w-full text-sm font-black text-white bg-transparent outline-none" />
                      </div>
                      <div className="flex items-center space-x-3 bg-dark-deep px-4 py-3 rounded-xl border border-white/10">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max</span>
                        <input type="number" value={group.maxSelection} onChange={(e) => updateGroup(gIndex, 'maxSelection', e.target.value)} className="w-full text-sm font-black text-white bg-transparent outline-none" />
                      </div>
                    </div>
                    <button type="button" onClick={() => removeGroup(gIndex)} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-all shadow-sm">✕</button>
                  </div>

                  <div className="space-y-3">
                    {group.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center space-x-4 animate-in">
                        <div className="flex-1 relative">
                            <input 
                            type="text" 
                            placeholder="Option Detail" 
                            value={opt.name} 
                            onChange={(e) => updateOption(gIndex, oIndex, 'name', e.target.value)} 
                            className="w-full bg-dark-deep border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-brand-light"
                          />
                        </div>
                        <div className="w-32 relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">Rs</span>
                          <input 
                            type="number" 
                            placeholder="0" 
                            value={opt.price} 
                            onChange={(e) => updateOption(gIndex, oIndex, 'price', e.target.value)} 
                            className="w-full bg-dark-deep border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-white outline-none focus:border-brand-light"
                          />
                        </div>
                        <button type="button" onClick={() => removeOption(gIndex, oIndex)} className="text-slate-500 hover:text-red-500 p-2">✕</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addOption(gIndex)} className="text-[10px] font-black text-brand-light uppercase tracking-widest hover:text-white flex items-center gap-2 px-2 py-2">
                      + Add Neural Option
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-10 flex justify-end space-x-6 border-t border-white/10">
            <button type="button" onClick={onClose} className="px-10 py-4 bg-white/5 text-slate-400 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">Cancel</button>
            <button type="submit" className="px-12 py-4 bg-brand-light text-dark-deep rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white shadow-[0_0_20px_rgba(179,136,255,0.4)] transition-all active:scale-95">
              {product ? 'Synchronize Asset' : 'Commit to Matrix'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
