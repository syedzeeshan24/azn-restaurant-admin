import React, { useState, useEffect } from 'react';
import { Reply, UserCircle, Loader, MessageCircle, Send, Clock, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config';

const Support = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState({});

    useEffect(() => {
        fetchTickets();
        // Poll for new support messages every 15 seconds
        const interval = setInterval(fetchTickets, 15000);
        return () => clearInterval(interval);
    }, []);

    const fetchTickets = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get(`${API_BASE_URL}/api/support`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(res.data)) {
                setTickets(res.data);
            }
        } catch (err) {
            console.error('Fetch tickets error:', err);
            // Fallback mock data for visual testing
            setTickets([
                { _id: '1', name: 'Zane Vector', email: 'zane@cyber.com', subject: 'Order Delay', message: 'My order #AZN-882 is stuck in processing for 30 minutes. Need immediate assist.', status: 'Open', createdAt: new Date().toISOString() },
                { _id: '2', name: 'Luna Stark', email: 'luna@neuro.net', subject: 'Payment Glitch', message: 'The payment link failed twice but the amount was deducted from my elite token balance.', status: 'Open', createdAt: new Date().toISOString() }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (id) => {
        if (!replyText[id]) return alert('Neural Communication Error: Please enter a response message.');
        
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`${API_BASE_URL}/api/support/${id}/reply`, { reply: replyText[id] }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`Transmission sent to user node!`);
            setReplyText({ ...replyText, [id]: '' });
            // Immediately update local state and also refetch
            setTickets(tickets.map(t => t._id === id ? {...t, status: 'Resolved', reply: replyText[id]} : t));
            fetchTickets(); // Sync with DB
        } catch (err) {
            console.error('Reply error:', err);
            alert('Failed to send reply.');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-brand-light rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-8 text-sm font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Decrypting Support Stream</p>
            </div>
        );
    }

    return (
        <div className="p-10 space-y-12 animate-in pb-32">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-3">Support Nexus</h1>
                    <p className="text-slate-500 font-bold tracking-tight">Monitor and resolve critical customer assistance requests.</p>
                </div>
                <div className="bg-brand-light/10 px-6 py-3 rounded-2xl border border-brand-light/20 flex items-center gap-3">
                    <ShieldCheck size={20} className="text-brand-light" />
                    <span className="text-sm font-black text-white uppercase tracking-widest">Protocol: Direct Assist</span>
                </div>
            </div>

            <div className="space-y-8">
                {(!tickets || tickets.length === 0) ? (
                    <div className="text-center py-32 bg-dark-surface border border-dashed border-white/10 rounded-[3rem]">
                        <MessageCircle size={64} className="mx-auto mb-6 text-slate-800" />
                        <p className="text-sm font-black text-slate-600 uppercase tracking-widest">No Active Distress Signals</p>
                    </div>
                ) : (
                    tickets.map(ticket => (
                        <div key={ticket._id} className="bg-dark-surface border border-white/5 rounded-[3rem] p-10 hover:border-brand-light/20 transition-all duration-500 group shadow-2xl">
                            <div className="flex flex-wrap justify-between items-start mb-8 gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-dark-deep rounded-[1.5rem] flex items-center justify-center text-brand-light border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                                        <UserCircle size={36} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-black text-xl tracking-tight group-hover:text-brand-light transition-colors">{ticket.name || 'Anonymous Node'}</h3>
                                        <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-tight">{ticket.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`inline-flex items-center space-x-2 px-5 py-2 rounded-xl border ${
                                        ticket.status === 'Open' ? 'bg-red-500/5 text-red-500 border-red-500/20' : 'bg-brand-light/5 text-brand-light border-brand-light/20'
                                    }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${ticket.status === 'Open' ? 'bg-red-500 animate-pulse' : 'bg-brand-light shadow-[0_0_5px_rgba(179,136,255,0.8)]'}`}></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">{ticket.status}</span>
                                    </div>
                                    <div className="flex items-center justify-end gap-2 text-slate-600 text-[10px] font-black uppercase tracking-widest mt-3">
                                        <Clock size={12} />
                                        {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'Cycle Unknown'}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-dark-deep/80 rounded-[2rem] p-8 mb-8 border border-white/10 shadow-inner">
                                <h4 className="text-brand-light text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-brand-light rounded-full"></div>
                                    Subject: {ticket.subject || 'Complaint Transmission'}
                                </h4>
                                <p className="text-slate-300 text-base font-medium leading-relaxed italic">"{ticket.message}"</p>
                            </div>

                            {ticket.reply && (
                                <div className="bg-brand-light/5 border border-brand-light/10 rounded-[2rem] p-8 mb-8">
                                    <p className="text-[10px] font-black text-brand-light uppercase mb-3 tracking-widest">Neural Response Injected:</p>
                                    <p className="text-slate-500 text-sm font-bold italic leading-relaxed">"{ticket.reply}"</p>
                                </div>
                            )}

                            {ticket.status === 'Open' && (
                                <div className="mt-8 pt-8 border-t border-white/5">
                                    <textarea 
                                        className="w-full bg-dark-deep border border-white/10 rounded-[2rem] px-8 py-6 text-white focus:ring-2 focus:ring-brand-light/20 focus:border-brand-light/30 outline-none font-bold text-sm mb-6 transition-all min-h-[150px] shadow-inner placeholder:text-slate-700 resize-none"
                                        placeholder="Compose high-fidelity response to the user node..."
                                        value={replyText[ticket._id] || ''}
                                        onChange={(e) => setReplyText({ ...replyText, [ticket._id]: e.target.value })}
                                    />
                                    <div className="flex justify-end">
                                        <button 
                                            onClick={() => handleReply(ticket._id)}
                                            className="flex items-center gap-4 bg-brand-light hover:bg-white text-dark-deep px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-brand/20 active:scale-95 group"
                                        >
                                            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            <span>Inject Transmission</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Support;
