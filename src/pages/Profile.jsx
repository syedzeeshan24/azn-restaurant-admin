import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Shield, Save, Loader2, Phone, Camera } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config';

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setName(res.data.name || '');
            setEmail(res.data.email || '');
            setPhone(res.data.phone || '');
            setAvatar(res.data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop');
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('adminToken');
            const payload = { name, email, phone, avatar };
            if (password) payload.password = password; // Option to change password if provided
            
            const res = await axios.put(`${API_BASE_URL}/api/auth/profile`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            localStorage.setItem('adminUser', JSON.stringify({
                id: res.data._id,
                name: res.data.name,
                email: res.data.email,
                phone: res.data.phone,
                avatar: res.data.avatar
            }));
            // Trigger storage sync for Header / Sidebar
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new Event('adminUserUpdated'));

            alert('Neural Link: Master Chief profile synchronized successfully.');
            setPassword('');
        } catch (err) {
            alert(err.response?.data?.message || 'Error updating profile credentials.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <Loader2 className="w-16 h-16 text-brand-light animate-spin" />
                <p className="mt-8 text-sm font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Syncing Master Node</p>
            </div>
        );
    }

    return (
        <div className="p-10 space-y-12 animate-in">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-3">Master Profile</h1>
                    <p className="text-slate-500 font-bold tracking-tight">Configure core administrative credentials and access levels.</p>
                </div>
                <div className="bg-dark-surface px-8 py-4 rounded-2xl border border-brand-light/20 flex items-center space-x-3 shadow-2xl">
                  <Shield size={20} className="text-brand-light" />
                  <span className="text-sm font-black text-white uppercase tracking-widest">Level 5 Clearance</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Profile Card */}
                <div className="bg-dark-surface border border-white/5 rounded-[3rem] p-12 text-center flex flex-col items-center justify-center space-y-6">
                    <div className="w-48 h-48 rounded-[2.5rem] overflow-hidden border-2 border-white/5 relative shadow-xl shadow-brand/10">
                        <img 
                            src={avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"} 
                            className="w-full h-full object-cover" 
                            alt="Avatar" 
                        />
                        <span className="absolute bottom-4 right-4 w-5 h-5 bg-brand-light rounded-full border-4 border-dark-surface"></span>
                    </div>

                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">{name || 'AZN Admin'}</h2>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">System Architect</p>
                    </div>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">
                        Full administrative control over the AZN Neuro-Operations Matrix. Access to all nodes verified.
                    </p>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2 bg-dark-surface border border-white/5 rounded-[3rem] p-12 shadow-2xl">
                    <h3 className="text-2xl font-black text-white mb-8 tracking-tighter flex items-center gap-3">
                        <User size={24} className="text-brand-light" />
                        Credentials
                    </h3>
                    
                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Alias</label>
                            <div className="relative">
                                <User className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-dark-deep border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-brand-light/30 transition-all font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Secure Communication Link (Email)</label>
                            <div className="relative">
                                <Mail className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-dark-deep border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-brand-light/30 transition-all font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Phone Identity</label>
                            <div className="relative">
                                <Phone className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type="text" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-dark-deep border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-brand-light/30 transition-all font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Profile Image URL</label>
                            <div className="relative">
                                <Camera className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type="text" 
                                    value={avatar}
                                    onChange={(e) => setAvatar(e.target.value)}
                                    className="w-full bg-dark-deep border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-brand-light/30 transition-all font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">New Encryption Key (Password)</label>
                            <div className="relative">
                                <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Leave blank to keep current key"
                                    className="w-full bg-dark-deep border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-brand-light/30 transition-all font-bold"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={saving}
                                className="bg-brand-light text-dark-deep px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-2xl shadow-brand/20 flex items-center justify-center space-x-3 ml-auto disabled:opacity-55"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Synchronizing Core...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Synchronize Data</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
