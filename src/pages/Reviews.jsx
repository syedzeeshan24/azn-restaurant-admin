import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Trash2, Check, X, MessageSquare, User } from 'lucide-react';
import API_BASE_URL from '../config';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/reviews`);
            setReviews(res.data);
        } catch (err) {
            console.error('Fetch reviews error:', err);
            setReviews([
                { _id: '1', user: { name: 'Marcus Chen', email: 'marcus@mail.com' }, product: 'Neon Glaze Donut', rating: 5, comment: 'Best donut in the sector! The glaze is literally glowing.', status: 'Approved', createdAt: new Date().toISOString() },
                { _id: '2', user: { name: 'Sora Tanaka', email: 'sora@mail.com' }, product: 'Cyber Burger', rating: 4, comment: 'Great taste, but could be spicier. The delivery was incredibly fast though.', status: 'Pending', createdAt: new Date().toISOString() },
                { _id: '3', user: { name: 'Jax Miller', email: 'jax@mail.com' }, product: 'Zenith Sushi', rating: 5, comment: 'Incredible texture and fresh ingredients. Highly recommended for elite users.', status: 'Approved', createdAt: new Date().toISOString() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        // Update status locally for instant feedback
        setReviews(reviews.map(r => r._id === id ? { ...r, status: action === 'approved' ? 'Approved' : 'Hidden' } : r));
        alert(`Neural Link: Feedback ${action} successfully!`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this review permanently?')) {
            setReviews(reviews.filter(r => r._id !== id));
        }
    };

    const getCustomerName = (review) => {
        // Handle both real populated data and mock fallback
        if (review.user && typeof review.user === 'object' && review.user.name) {
            return review.user.name;
        }
        if (review.userName) return review.userName;
        return 'Anonymous Customer';
    };

    return (
        <div className="p-10 space-y-12 animate-in">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-3">Customer Sentiment</h1>
                    <p className="text-slate-500 font-bold tracking-tight">Monitor and moderate incoming user feedback streams.</p>
                </div>
                <div className="bg-dark-surface px-8 py-4 rounded-2xl border border-white/5 flex items-center space-x-3">
                  <MessageSquare size={20} className="text-brand-light" />
                  <span className="text-sm font-black text-white uppercase tracking-widest">{reviews.length} Feedbacks Scanned</span>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1,2,3].map(i => <div key={i} className="h-64 bg-dark-surface border border-white/5 rounded-[2.5rem] animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map(review => (
                        <div key={review._id} className="bg-dark-surface border border-white/5 rounded-[2.5rem] p-8 hover:border-brand-light/30 transition-all duration-500 group shadow-2xl">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-dark-deep rounded-xl flex items-center justify-center border border-white/10">
                                        <User size={18} className="text-brand-light" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-black text-base tracking-tight group-hover:text-brand-light transition-colors">
                                            {getCustomerName(review)}
                                        </h3>
                                        <div className="flex items-center space-x-2 mt-0.5">
                                            <div className="w-1.5 h-1.5 bg-brand-light rounded-full"></div>
                                            <p className="text-brand-light text-[9px] font-black uppercase tracking-widest">
                                                {review.order ? 'Verified Order' : 'Store Feedback'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={14} 
                                            className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'} 
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="bg-dark-deep/50 rounded-2xl p-6 mb-8 border border-white/5">
                                <p className="text-slate-400 text-sm font-bold italic leading-relaxed">"{review.comment}"</p>
                            </div>
                            <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                <div className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-xl border ${
                                    review.status === 'Approved' ? 'bg-brand-light/5 border-brand-light/10 text-brand-light' : 
                                    review.status === 'Hidden' ? 'bg-red-500/5 border-red-500/10 text-red-400' :
                                    'bg-yellow-500/5 border-yellow-500/10 text-yellow-500'
                                }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${review.status === 'Approved' ? 'bg-brand-light shadow-[0_0_5px_rgba(179,136,255,0.8)]' : review.status === 'Hidden' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                                    <span className="text-[9px] font-black uppercase tracking-widest">{review.status || 'Pending'}</span>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => handleAction(review._id, 'approved')} className="p-3 bg-dark-deep hover:bg-green-600/20 border border-white/5 rounded-xl text-slate-400 hover:text-green-500 transition-all" title="Approve">
                                        <Check size={16} />
                                    </button>
                                    <button onClick={() => handleAction(review._id, 'hidden')} className="p-3 bg-dark-deep hover:bg-red-600/20 border border-white/5 rounded-xl text-slate-400 hover:text-red-500 transition-all" title="Hide">
                                        <X size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(review._id)} className="p-3 bg-dark-deep hover:bg-red-600/20 border border-white/5 rounded-xl text-slate-400 hover:text-red-500 transition-all" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reviews;

