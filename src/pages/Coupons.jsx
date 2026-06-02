import React, { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, Copy, X, Ticket } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config';

const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', type: 'Percentage', expiry: '' });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/coupons`);
            setCoupons(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching coupons:', error);
            setLoading(false);
        }
    };

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        alert(`Code ${code} copied!`);
    };

    const handleCreate = async () => {
        if (!newCoupon.code || !newCoupon.discount || !newCoupon.expiry) return alert('Neural Error: Please populate all fields to generate a token.');
        try {
            await axios.post(`${API_BASE_URL}/api/coupons`, newCoupon);
            fetchCoupons();
            setIsModalOpen(false);
            setNewCoupon({ code: '', discount: '', type: 'Percentage', expiry: '' });
            alert('Elite Token generated successfully!');
        } catch (error) {
            alert('Failed to generate Elite Token: ' + (error.response?.data?.message || error.message));
        }
    };

    const deleteCoupon = async (id) => {
        if (window.confirm('Erase this token from the active stream?')) {
            try {
                await axios.delete(`${API_BASE_URL}/api/coupons/${id}`);
                fetchCoupons();
            } catch (error) {
                alert('Failed to delete coupon');
            }
        }
    };

    return (
        <div className="p-4 md:p-10 space-y-12 animate-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-3">Elite Tokens</h1>
                    <p className="text-slate-500 font-bold tracking-tight">Create and manage premium promo codes and discount vectors.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-light text-dark-deep px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-2xl shadow-brand/20 flex items-center space-x-3"
                >
                    <Plus size={20} />
                    <span>Create New Token</span>
                </button>
            </div>

            <div className="bg-dark-surface border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto w-full -mx-4 md:mx-0 px-4 md:px-0">
        <table className="w-full text-left min-w-[800px]">
                    <thead>
                        <tr className="border-b border-white/5 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                            <th className="px-10 py-8">Token Identity</th>
                            <th className="px-10 py-8">Value Vector</th>
                            <th className="px-10 py-8">Protocol</th>
                            <th className="px-10 py-8">Utilization</th>
                            <th className="px-10 py-8">Expiration</th>
                            <th className="px-10 py-8">Status</th>
                            <th className="px-10 py-8 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {coupons.map((coupon) => (
                            <tr key={coupon._id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-10 py-8">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-brand-light/10 rounded-xl border border-brand-light/20">
                                            <Tag className="text-brand-light" size={18} />
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-white font-black font-mono tracking-wider text-lg">{coupon.code}</span>
                                            <button onClick={() => handleCopy(coupon.code)} className="text-slate-700 hover:text-white transition-colors">
                                                <Copy size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <span className="text-white font-black text-lg tracking-tighter">{coupon.discount}</span>
                                </td>
                                <td className="px-10 py-8">
                                    <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">{coupon.type}</span>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-24 h-1.5 bg-dark-deep rounded-full overflow-hidden border border-white/5">
                                            <div 
                                                className="h-full bg-brand-light shadow-[0_0_8px_rgba(179,136,255,0.6)]" 
                                                style={{ width: '0%' }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400">0/∞</span>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <span className="text-slate-400 font-mono text-xs">{new Date(coupon.expiry).toLocaleDateString()}</span>
                                </td>
                                <td className="px-10 py-8">
                                    <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl border ${
                                        coupon.status === 'Active' 
                                            ? 'bg-brand-light/5 border-brand-light/20 text-brand-light' 
                                            : 'bg-red-500/5 border-red-500/20 text-red-500'
                                    }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${coupon.status === 'Active' ? 'bg-brand-light animate-pulse shadow-[0_0_5px_rgba(179,136,255,0.8)]' : 'bg-red-500'}`}></div>
                                        <span className="text-[9px] font-black uppercase tracking-widest">{coupon.status}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <button onClick={() => deleteCoupon(coupon._id)} className="text-slate-800 hover:text-red-500 transition-all p-3 hover:bg-white/5 rounded-2xl">
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
      </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-dark-deep/90 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-in zoom-in-95">
                    <div className="bg-dark-surface rounded-[3rem] p-12 w-full max-w-xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-4">
                                <Ticket className="text-brand-light" size={32} />
                                New Elite Token
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-600 hover:text-white p-2">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Token Identifier</label>
                                <input 
                                    className="w-full bg-dark-deep border border-white/10 rounded-2xl px-6 py-5 text-white focus:ring-2 focus:ring-brand-light/20 focus:border-brand-light/30 outline-none transition-all font-bold font-mono placeholder:text-slate-700 shadow-inner"
                                    placeholder="e.g. CYBER50"
                                    value={newCoupon.code}
                                    onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Value Magnitude</label>
                                <input 
                                    className="w-full bg-dark-deep border border-white/10 rounded-2xl px-6 py-5 text-white focus:ring-2 focus:ring-brand-light/20 focus:border-brand-light/30 outline-none transition-all font-bold placeholder:text-slate-700 shadow-inner"
                                    placeholder="e.g. 20% or $10"
                                    value={newCoupon.discount}
                                    onChange={e => setNewCoupon({...newCoupon, discount: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Protocol Type</label>
                                    <select 
                                        className="w-full bg-dark-deep border border-white/10 rounded-2xl px-6 py-5 text-white focus:ring-2 focus:ring-brand-light/20 focus:border-brand-light/30 outline-none transition-all font-bold appearance-none cursor-pointer"
                                        value={newCoupon.type}
                                        onChange={e => setNewCoupon({...newCoupon, type: e.target.value})}
                                    >
                                        <option>Percentage</option>
                                        <option>Fixed Amount</option>
                                        <option>Product</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Expiration Cycle</label>
                                    <input 
                                        type="date"
                                        className="w-full bg-dark-deep border border-white/10 rounded-2xl px-6 py-5 text-white focus:ring-2 focus:ring-brand-light/20 focus:border-brand-light/30 outline-none transition-all font-bold cursor-pointer"
                                        value={newCoupon.expiry}
                                        onChange={e => setNewCoupon({...newCoupon, expiry: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button 
                                onClick={handleCreate}
                                className="w-full bg-brand-light hover:bg-white text-dark-deep py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-brand/20 transition-all mt-6"
                            >
                                Generate Elite Token
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coupons;
