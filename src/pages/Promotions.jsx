import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { Send, Image as ImageIcon, Megaphone, Trash2, Zap, Layout, Clock } from 'lucide-react';

const Promotions = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/promotions`);
            setHistory(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Fetch promotions failed', err);
            setLoading(false);
        }
    };

    const handleBroadcast = async () => {
        if (!title || !message) return alert('Neural Transmission Failed: Please populate title and message fields.');
        
        try {
            const payload = {
                title,
                message,
                image: imageUrl || 'https://images.unsplash.com/photo-1547530171-85bfa7c13a52?q=80&w=800',
                type: 'broadcast'
            };

            await axios.post(`${API_BASE_URL}/api/promotions`, payload);
            
            setTitle('');
            setMessage('');
            setImageUrl('');
            alert('Transmission Successful: Broadcast deal injected into the user stream!');
            fetchPromotions();
        } catch (err) {
            alert('Broadcast failed: ' + err.message);
        }
    };

    const deletePromotion = async (id) => {
        if (window.confirm('Erase this transmission record from the database?')) {
            try {
                await axios.delete(`${API_BASE_URL}/api/promotions/${id}`);
                setHistory(history.filter(h => h._id !== id));
            } catch (err) {
                // If no delete endpoint, just remove from local state
                setHistory(history.filter(h => h._id !== id));
            }
        }
    };

    return (
        <div className="p-10 space-y-12 animate-in">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-3 flex items-center gap-4">
                        <Zap className="text-brand-light fill-brand-light" size={40} />
                        Neuro-Broadcaster
                    </h1>
                    <p className="text-slate-500 font-bold tracking-tight">Inject real-time deals directly into the mobile user stream.</p>
                </div>
                <div className="bg-brand-light/10 px-6 py-3 rounded-2xl border border-brand-light/20 flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-brand-light rounded-full animate-pulse shadow-[0_0_10px_rgba(179,136,255,0.6)]"></div>
                    <span className="text-[10px] font-black text-brand-light uppercase tracking-widest">Neural Link: Online</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* New Broadcast Form */}
                <div className="lg:col-span-5 bg-dark-surface border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                    <h2 className="text-white font-black text-2xl mb-10 flex items-center gap-3">
                        <Layout size={24} className="text-brand-light" />
                        Campaign Designer
                    </h2>
                    
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Promotion Identity</label>
                            <input 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-dark-deep border border-white/10 rounded-2xl px-6 py-5 text-white focus:ring-2 focus:ring-brand-light/20 focus:border-brand-light/30 outline-none transition-all font-bold placeholder:text-slate-700 shadow-inner"
                                placeholder="e.g. Midnight Cyber-Feast"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Visual Asset (URL)</label>
                            <div className="relative group">
                                <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-brand-light transition-colors" size={20} />
                                <input 
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full bg-dark-deep border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-white focus:ring-2 focus:ring-brand-light/20 focus:border-brand-light/30 outline-none transition-all font-bold placeholder:text-slate-700 shadow-inner"
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Neural Payload</label>
                            <textarea 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full bg-dark-deep border border-white/10 rounded-2xl px-6 py-5 text-white focus:ring-2 focus:ring-brand-light/20 focus:border-brand-light/30 outline-none h-48 transition-all font-bold placeholder:text-slate-700 resize-none shadow-inner"
                                placeholder="Describe the deal parameters in detail..."
                            />
                        </div>

                        {imageUrl && (
                            <div className="relative h-48 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group/preview animate-in">
                                <img src={imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover/preview:scale-110 grayscale group-hover/preview:grayscale-0" alt="Banner Preview" />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-deep/80 to-transparent"></div>
                                <button 
                                    onClick={() => setImageUrl('')}
                                    className="absolute top-6 right-6 bg-dark-deep/40 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-red-500 transition-all border border-white/10"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <div className="absolute bottom-6 left-8 text-white font-black text-[10px] uppercase tracking-widest opacity-60">Neural Preview Active</div>
                            </div>
                        )}

                        <div className="pt-6">
                            <button 
                                onClick={handleBroadcast}
                                className="w-full bg-brand-light hover:bg-white text-dark-deep py-6 rounded-[2rem] font-black transition-all shadow-2xl shadow-brand/20 active:scale-[0.98] flex items-center justify-center gap-4 group"
                            >
                                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                <span className="tracking-widest uppercase text-sm">Execute Transmission</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* History List */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between mb-2 px-4">
                        <h2 className="text-slate-600 font-black text-[10px] uppercase tracking-widest">Transmission Logs</h2>
                        <span className="text-[10px] font-bold text-slate-500 tracking-widest">{history.length} ACTIVE BROADCASTS</span>
                    </div>

                    <div className="space-y-6 max-h-[850px] overflow-y-auto custom-scrollbar pr-4 pb-20">
                        {loading ? (
                            <div className="animate-pulse space-y-6">
                                {[1, 2, 3].map(i => <div key={i} className="h-40 bg-dark-surface border border-white/5 rounded-[3rem]" />)}
                            </div>
                        ) : history.length === 0 ? (
                            <div className="text-center py-32 bg-dark-surface rounded-[3rem] border border-dashed border-white/10">
                                <Megaphone size={64} className="mx-auto mb-6 text-slate-800" />
                                <p className="text-sm font-black text-slate-600 uppercase tracking-widest">No Active Transmissions</p>
                            </div>
                        ) : (
                            history.map(item => (
                                <div key={item._id} className="bg-dark-surface border border-white/5 rounded-[3rem] p-8 hover:border-brand-light/20 transition-all group flex gap-8 shadow-2xl">
                                    <div className="w-32 h-32 rounded-[2rem] overflow-hidden shrink-0 border border-white/5 shadow-xl transition-transform group-hover:scale-105">
                                        <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="text-white font-black text-xl group-hover:text-brand-light transition-colors tracking-tight">{item.title}</h3>
                                                <div className="flex items-center gap-2 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                                                    <Clock size={12} />
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <p className="text-slate-500 text-sm font-bold line-clamp-2 leading-relaxed">{item.message}</p>
                                        </div>
                                        <div className="flex justify-between items-center mt-6">
                                            <div className="flex items-center gap-3">
                                                <span className="px-4 py-1.5 bg-dark-deep rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest border border-white/5">Segment: ALL_USERS</span>
                                                {item.isActive !== false && (
                                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-brand-light/10 rounded-full text-[9px] font-black text-brand-light uppercase tracking-widest border border-brand-light/20">
                                                        <div className="w-1.5 h-1.5 bg-brand-light rounded-full animate-pulse shadow-[0_0_5px_rgba(179,136,255,0.8)]"></div>
                                                        Live
                                                    </div>
                                                )}
                                            </div>
                                            <button 
                                                onClick={() => deletePromotion(item._id)} 
                                                className="text-slate-800 hover:text-red-500 transition-all p-3 hover:bg-white/5 rounded-2xl"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Promotions;
