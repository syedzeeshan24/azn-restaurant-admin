import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { Settings as SettingsIcon, Save, Shield, CreditCard, FileText, Map, PhoneCall, Zap } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    deliveryFee: 5.0,
    vatPercentage: 10,
    termsAndConditions: '',
    trackOrderInfo: '',
    contactEmail: '',
    contactPhone: '',
    currencySymbol: 'Rs.',
    mapDefaultCity: 'Lahore',
    enableLiveTracking: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/settings`);
      setSettings(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch settings failed', err);
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/api/settings`, settings);
      alert('Neural Core Synchronized: Global parameters updated successfully!');
      setSaving(false);
    } catch (err) {
      alert('Error updating neural settings');
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-brand-light rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-8 text-sm font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Syncing System Params</p>
    </div>
  );

  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-4 mb-8">
      <div className="p-3 bg-brand-light/10 rounded-2xl border border-brand-light/20">
        <Icon size={24} className="text-brand-light" />
      </div>
      <h2 className="text-2xl font-black text-white tracking-tighter">{title}</h2>
    </div>
  );

  return (
    <div className="p-10 space-y-12 animate-in pb-32">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-3">System Control</h1>
          <p className="text-slate-500 font-bold tracking-tight">Configure global parameters and neural core settings.</p>
        </div>
        <div className="bg-brand-light/10 px-6 py-3 rounded-2xl border border-brand-light/20 flex items-center gap-3">
          <Shield size={20} className="text-brand-light" />
          <span className="text-sm font-black text-white uppercase tracking-widest">Core Security: Level 1</span>
        </div>
      </div>
      
      <form onSubmit={handleSave} className="space-y-12">
        {/* Brand Theme Section */}
        <div className="bg-dark-surface p-10 rounded-[3rem] border border-white/5 shadow-2xl">
          <SectionHeader icon={Zap} title="Mobile Brand Identity" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Brand Color</label>
              <div className="flex items-center space-x-4">
                <input 
                  type="color" 
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                  className="w-16 h-16 rounded-2xl cursor-pointer border border-white/10 bg-dark-deep"
                />
                <input 
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                  className="flex-1 p-5 bg-dark-deep border border-white/10 rounded-2xl text-sm font-black text-white font-mono uppercase tracking-widest outline-none focus:border-brand-light/30 transition-all"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Global Currency Symbol</label>
              <input 
                type="text"
                placeholder="Rs., PKR, $, etc."
                value={settings.currencySymbol}
                onChange={(e) => setSettings({...settings, currencySymbol: e.target.value})}
                className="w-full p-5 bg-dark-deep border border-white/10 rounded-2xl text-lg font-black text-white outline-none focus:border-brand-light/30 transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">System Maintenance</label>
              <div className="flex items-center space-x-4 h-[68px]">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.isMaintenanceMode}
                    onChange={(e) => setSettings({...settings, isMaintenanceMode: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-dark-deep peer-focus:outline-none rounded-full border border-white/10 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-700 after:border-transparent after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-light peer-checked:after:bg-white"></div>
                  <span className={`ml-4 text-xs font-black uppercase tracking-widest ${settings.isMaintenanceMode ? 'text-red-500' : 'text-brand-light'}`}>
                    {settings.isMaintenanceMode ? 'Offline' : 'Live'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="bg-dark-surface p-10 rounded-[3rem] border border-white/5 shadow-2xl">
          <SectionHeader icon={CreditCard} title="Financial Configuration" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Base Delivery Fee ({settings.currencySymbol})</label>
              <input 
                type="number" 
                step="0.01"
                value={settings.deliveryFee}
                onChange={(e) => setSettings({...settings, deliveryFee: parseFloat(e.target.value)})}
                className="w-full p-5 bg-dark-deep border border-white/10 rounded-2xl text-lg font-black text-white outline-none focus:border-brand-light/30 transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Service Fee ({settings.currencySymbol})</label>
              <input 
                type="number" 
                step="0.01"
                value={settings.serviceFee}
                onChange={(e) => setSettings({...settings, serviceFee: parseFloat(e.target.value)})}
                className="w-full p-5 bg-dark-deep border border-white/10 rounded-2xl text-lg font-black text-white outline-none focus:border-brand-light/30 transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">VAT / Tax Percentage (%)</label>
              <input 
                type="number" 
                value={settings.vatPercentage}
                onChange={(e) => setSettings({...settings, vatPercentage: parseInt(e.target.value)})}
                className="w-full p-5 bg-dark-deep border border-white/10 rounded-2xl text-lg font-black text-white outline-none focus:border-brand-light/30 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Legal & Content */}
        <div className="bg-dark-surface p-10 rounded-[3rem] border border-white/5 shadow-2xl">
          <SectionHeader icon={FileText} title="Legal & System Content" />
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Terms & Conditions</label>
              <textarea 
                rows="8"
                value={settings.termsAndConditions}
                onChange={(e) => setSettings({...settings, termsAndConditions: e.target.value})}
                className="w-full p-6 bg-dark-deep border border-white/10 rounded-3xl text-sm font-bold text-slate-300 leading-relaxed outline-none focus:border-brand-light/30 transition-all resize-none shadow-inner"
                placeholder="Initialize global terms and conditions..."
              />
            </div>
          </div>
        </div>

        {/* Logistics & Maps */}
        <div className="bg-dark-surface p-10 rounded-[3rem] border border-white/5 shadow-2xl">
          <SectionHeader icon={Map} title="Logistics & Map Configuration" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Default Map Center (City/Area)</label>
              <input 
                type="text" 
                value={settings.mapDefaultCity}
                onChange={(e) => setSettings({...settings, mapDefaultCity: e.target.value})}
                className="w-full p-5 bg-dark-deep border border-white/10 rounded-2xl text-lg font-black text-white outline-none focus:border-brand-light/30 transition-all"
                placeholder="e.g. Lahore, Pakistan"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Live Tracking Protocol</label>
              <div className="flex items-center space-x-4 h-[68px]">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.enableLiveTracking}
                    onChange={(e) => setSettings({...settings, enableLiveTracking: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-dark-deep peer-focus:outline-none rounded-full border border-white/10 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-700 after:border-transparent after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-light peer-checked:after:bg-white"></div>
                  <span className="ml-4 text-xs font-black uppercase tracking-widest text-slate-500">
                    {settings.enableLiveTracking ? 'Real-time Link Active' : 'Static Vector Only'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-dark-surface p-10 rounded-[3rem] border border-white/5 shadow-2xl">
          <SectionHeader icon={PhoneCall} title="Support & Communications" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Enterprise Support Email</label>
              <input 
                type="email" 
                value={settings.contactEmail}
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                className="w-full p-5 bg-dark-deep border border-white/10 rounded-2xl text-lg font-black text-white outline-none focus:border-brand-light/30 transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Official Contact Phone</label>
              <input 
                type="text" 
                value={settings.contactPhone}
                onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                className="w-full p-5 bg-dark-deep border border-white/10 rounded-2xl text-lg font-black text-white outline-none focus:border-brand-light/30 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Global Save Button */}
        <div className="fixed bottom-12 right-12 z-[100] animate-in group">
          <button 
            type="submit" 
            disabled={saving}
            className={`flex items-center space-x-4 px-12 py-6 bg-brand-light text-dark-deep rounded-[2.5rem] font-black text-lg uppercase tracking-widest shadow-[0_20px_50px_rgba(142,36,140,0.3)] transition-all ${saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:scale-105 active:scale-95'}`}
          >
            {saving ? (
              <div className="flex items-center space-x-3">
                 <div className="w-5 h-5 border-2 border-dark-deep border-t-transparent rounded-full animate-spin"></div>
                 <span>Syncing...</span>
              </div>
            ) : (
              <>
                <Save size={24} />
                <span>Save Neural Config</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
