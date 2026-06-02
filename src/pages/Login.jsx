import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Zap, Shield, Lock, User, Loader2 } from 'lucide-react';
import API_BASE_URL from '../config';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
                identifier,
                password
            });

            if (res.data.role !== 'admin') {
                setError('Neural Access Denied: Admin privileges required.');
                setLoading(false);
                return;
            }

            localStorage.setItem('adminToken', res.data.token);
            localStorage.setItem('adminUser', JSON.stringify({
                id: res.data._id,
                name: res.data.name,
                email: res.data.email,
                phone: res.data.phone,
                avatar: res.data.avatar
            }));

            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Access Denied: Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-deep flex flex-col justify-center items-center px-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-light/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-md bg-dark-surface border border-white/5 rounded-[3rem] p-12 shadow-2xl relative z-10">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="p-4 bg-brand-light/10 rounded-[1.5rem] border border-brand-light/20 mb-4 shadow-xl shadow-brand/10">
                        <Zap size={36} className="text-brand-light fill-brand-light animate-pulse" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter">AZN Admin</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1.5 flex items-center gap-1.5">
                        <Shield size={10} className="text-brand-light" />
                        Level 5 Clearance Required
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold leading-relaxed">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Identifier (Email / Phone)</label>
                        <div className="relative">
                            <User className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-600" size={18} />
                            <input 
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder="Enter secure link"
                                required
                                className="w-full bg-dark-deep border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-brand-light/30 transition-all font-bold placeholder:text-slate-700"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Encryption Key (Password)</label>
                        <div className="relative">
                            <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-600" size={18} />
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter key"
                                required
                                className="w-full bg-dark-deep border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-brand-light/30 transition-all font-bold placeholder:text-slate-700"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full mt-4 bg-brand-light text-dark-deep py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-2xl shadow-brand/20 flex items-center justify-center space-x-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <span>Establish Secure Link</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
