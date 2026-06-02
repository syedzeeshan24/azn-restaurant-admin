import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductFormModal from '../components/ProductFormModal';
import API_BASE_URL from '../config';
import { Menu as MenuIcon, Plus, Edit3, Trash2 } from 'lucide-react';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState('Rs.');

  const fetchProducts = async () => {
    try {
      const [prodRes, settingsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/products`),
        axios.get(`${API_BASE_URL}/api/settings`).catch(() => ({ data: { currencySymbol: 'Rs.' } }))
      ]);
      setProducts(prodRes.data);
      setCurrencySymbol(settingsRes.data?.currencySymbol || 'Rs.');
    } catch (err) {
      console.error('Error fetching products', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Terminate this product record?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchProducts();
  };

  return (
    <div className="p-4 md:p-10 space-y-12 animate-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-3">Digital Catalog</h1>
          <p className="text-slate-500 font-bold tracking-tight">Manage your premium menu items and customization modules.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-brand-light text-dark-deep px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-2xl shadow-brand/20 flex items-center space-x-3"
        >
          <Plus size={20} />
          <span>Add New Item</span>
        </button>
      </div>

      <div className="bg-dark-surface border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto w-full -mx-4 md:mx-0 px-4 md:px-0">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black text-slate-600 uppercase tracking-widest">
              <th className="px-10 py-8">Product Spec</th>
              <th className="px-10 py-8">Segment</th>
              <th className="px-10 py-8">Pricing</th>
              <th className="px-10 py-8">Status</th>
              <th className="px-10 py-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-10 py-32 text-center">
                   <div className="flex flex-col items-center">
                      <div className="w-24 h-24 bg-dark-deep rounded-full flex items-center justify-center mb-8 border border-white/5">
                        <MenuIcon size={40} className="text-slate-700" />
                      </div>
                      <p className="text-slate-500 font-black text-lg uppercase tracking-widest">Neural Catalog Empty</p>
                      <p className="text-slate-600 font-bold mt-2">Initialize your menu data to begin operations.</p>
                   </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-6">
                      <div className="h-20 w-20 rounded-[2rem] overflow-hidden border border-white/5 shadow-xl transition-transform group-hover:scale-110">
                        <img className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src={product.imageUrl} alt="" />
                      </div>
                      <div>
                        <div className="text-lg font-black text-white group-hover:text-brand-light transition-colors">{product.name}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{product.modifierGroups?.length || 0} Modification Vectors</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="bg-dark-deep text-slate-400 text-[10px] font-black px-5 py-2 rounded-xl uppercase tracking-widest border border-white/5">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                     <div className="text-xl font-black text-white tracking-tighter">{currencySymbol} {product.price.toLocaleString()}</div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-3">
                       <div className={`w-2.5 h-2.5 rounded-full ${product.isAvailable ? 'bg-brand-light shadow-[0_0_10px_rgba(179,136,255,0.5)]' : 'bg-red-500 animate-pulse'}`}></div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                         {product.isAvailable ? 'Verified Online' : 'Offline'}
                       </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end space-x-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-4">
                      <button onClick={() => handleEditClick(product)} className="text-slate-500 hover:text-brand-light transition-colors p-2 hover:bg-white/5 rounded-xl">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="text-slate-500 hover:text-red-500 transition-colors p-2 hover:bg-white/5 rounded-xl">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>

      {isModalOpen && (
        <ProductFormModal 
          product={editingProduct} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
};

export default Menu;
