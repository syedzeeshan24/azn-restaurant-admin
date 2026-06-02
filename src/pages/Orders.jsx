import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { ShoppingBag, MapPin, Zap, RefreshCw, Clock, ArrowRight } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [riderModalVisible, setRiderModalVisible] = useState(false);
  const [assigningOrderId, setAssigningOrderId] = useState(null);
  const [riderName, setRiderName] = useState('');
  const [riderPhone, setRiderPhone] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('Rs.');

  const fetchOrders = async () => {
    try {
      setError(null);
      const [ordersRes, settingsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/orders`),
        axios.get(`${API_BASE_URL}/api/settings`).catch(() => ({ data: { currencySymbol: 'Rs.' } }))
      ]);
      const data = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sorted);
      setCurrencySymbol(settingsRes.data?.currencySymbol || 'Rs.');
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Neural Link Failure: Unable to sync with the central order matrix.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status, extraData = {}) => {
    try {
      await axios.put(`${API_BASE_URL}/api/orders/${id}/status`, { status, ...extraData });
      fetchOrders();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const handleDispatchClick = (id) => {
    setAssigningOrderId(id);
    setRiderModalVisible(true);
  };

  const submitRiderDispatch = () => {
    if (!riderName || !riderPhone) return alert('Enter Rider Name and Phone');
    updateStatus(assigningOrderId, 'Out for Delivery', { riderName, riderPhone });
    setRiderModalVisible(false);
    setAssigningOrderId(null);
    setRiderName('');
    setRiderPhone('');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Accepted': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Preparing': return 'bg-brand-light/10 text-brand-light border-brand-light/20';
      case 'Out for Delivery': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-brand-light rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-8 text-sm font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Scanning Live Stream</p>
    </div>
  );

  const renderContent = () => {
    if (error) {
      return (
        <div className="bg-dark-surface border border-red-500/20 p-20 rounded-[3rem] text-center flex flex-col items-center shadow-2xl">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
            <Zap size={48} className="text-red-500" />
          </div>
          <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">{error}</h3>
          <p className="text-slate-500 font-bold mb-10 tracking-tight">The central order matrix is currently unreachable.</p>
          <button 
            onClick={fetchOrders}
            className="bg-brand-light text-dark-deep px-12 py-5 rounded-[2rem] font-black text-sm hover:bg-white transition-all flex items-center gap-3 shadow-2xl shadow-brand/20"
          >
            <RefreshCw size={20} />
            <span>Reconnect Neural Core</span>
          </button>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="bg-dark-surface border border-white/5 p-24 rounded-[3rem] text-center flex flex-col items-center shadow-2xl">
          <div className="w-24 h-24 bg-dark-deep rounded-full flex items-center justify-center mb-8 border border-white/5">
            <ShoppingBag size={48} className="text-slate-700" />
          </div>
          <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">Operational Silence</h3>
          <p className="text-slate-500 font-bold tracking-tight">No active transmissions detected in the order buffer.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {orders.map(order => (
          <div key={order._id} className="bg-dark-surface border border-white/5 rounded-[3rem] overflow-hidden group hover:border-brand-light/20 transition-all duration-500 shadow-2xl">
            {/* Header */}
            <div className="bg-dark-deep/50 px-12 py-10 border-b border-white/5 flex justify-between items-center group-hover:bg-brand-light/5 transition-colors duration-500">
              <div>
                <div className="flex items-center space-x-5">
                  <div className="w-2 h-8 bg-brand-light rounded-full shadow-[0_0_10px_rgba(179,136,255,0.6)]"></div>
                  <h3 className="text-2xl font-black text-white tracking-tighter">
                    #{order._id.substring(order._id.length - 6).toUpperCase()}
                  </h3>
                  <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 ml-7">
                  <Clock size={14} className="text-slate-600" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Transmission: {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
              <div className="text-right">
                 <p className="text-4xl font-black text-white tracking-tighter">{currencySymbol} {order.grandTotal.toLocaleString()}</p>
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Total Payload</p>
              </div>
            </div>

            {/* Content */}
            <div className="px-12 py-10">
              <div className="grid grid-cols-2 gap-10 mb-12">
                <div>
                  <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 ml-1">Recipient Node</h4>
                  <p className="text-white font-black text-xl group-hover:text-brand-light transition-colors">{order.user?.name || 'Anonymous User'}</p>
                  <div className="flex items-start mt-3 group/map">
                    <p className="text-slate-500 text-sm font-bold leading-relaxed flex-1">{order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress?.street + ', ' + order.deliveryAddress?.city)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-5 text-slate-600 hover:text-brand-light transition-all p-3 bg-dark-deep rounded-2xl border border-white/5 group-hover/map:border-brand-light/30 shadow-inner"
                      title="View Vector Coordinate"
                    >
                      <MapPin size={20} />
                    </a>
                  </div>
                </div>
                <div className="text-right">
                  <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 mr-1">Settlement Protocol</h4>
                  <p className="text-white font-black text-xl tracking-tight">{order.paymentMethod}</p>
                  <div className="text-brand-light text-[10px] font-black uppercase mt-3 flex items-center justify-end gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-light rounded-full shadow-[0_0_5px_rgba(179,136,255,0.8)]"></div>
                      Neural Verified
                  </div>
                </div>
              </div>

              <div className="bg-dark-deep/80 border border-white/10 rounded-[2.5rem] p-10 shadow-inner">
                <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-8">Order Manifest</h4>
                <ul className="space-y-8">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-start group/item">
                      <div className="flex space-x-5">
                        <div className="w-10 h-10 bg-brand-light/10 border border-brand-light/20 rounded-2xl flex items-center justify-center text-sm font-black text-brand-light shadow-xl shadow-brand/5 group-hover/item:scale-110 transition-transform">
                          {item.quantity}
                        </div>
                        <div>
                          <p className="text-white text-lg font-black tracking-tight">{item.product?.name || 'Item Vector'}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.selectedModifiers.map((mod, i) => (
                              <span key={i} className="text-[9px] text-slate-500 font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg">+ {mod.name}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-white text-lg font-black tracking-tighter">{currencySymbol} {item.itemTotal.toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-12 py-10 bg-dark-deep/30 border-t border-white/5 flex justify-end">
                {order.status === 'Pending' && (
                  <button onClick={() => updateStatus(order._id, 'Preparing')} className="w-full bg-brand-light text-dark-deep py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-brand/20 hover:bg-white transition-all flex items-center justify-center space-x-3">
                    <span>Accept & Process</span>
                    <ArrowRight size={20} />
                  </button>
                )}
                {order.status === 'Preparing' && (
                  <button onClick={() => handleDispatchClick(order._id)} className="w-full bg-brand-light text-dark-deep py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-brand/20 hover:bg-white transition-all flex items-center justify-center space-x-3">
                    <span>Initiate Dispatch</span>
                    <ArrowRight size={20} />
                  </button>
                )}
                {order.status === 'Out for Delivery' && (
                  <button onClick={() => updateStatus(order._id, 'Delivered')} className="w-full bg-green-500 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-green-500/20 hover:bg-white hover:text-green-600 transition-all flex items-center justify-center space-x-3">
                    <span>Confirm Arrival</span>
                    <Zap size={20} className="fill-current" />
                  </button>
                )}
                {['Cancelled', 'Delivered'].includes(order.status) && (
                  <button className="w-full bg-white/5 text-slate-700 py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] cursor-not-allowed border border-white/5">
                    Transmission Archived
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-10 space-y-12 animate-in pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-3">Live Operations</h1>
          <p className="text-slate-500 font-bold tracking-tight ml-1">Real-time order tracking and kitchen management matrix.</p>
        </div>
        <div className="bg-dark-surface px-8 py-4 rounded-2xl border border-white/5 flex items-center space-x-3 shadow-2xl">
          <div className="w-2.5 h-2.5 bg-brand-light rounded-full animate-pulse shadow-[0_0_10px_rgba(179,136,255,0.8)]"></div>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Link: Online</span>
        </div>
      </div>

      {renderContent()}

      {riderModalVisible && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-dark-surface border border-brand-light/20 p-12 rounded-[3rem] shadow-2xl max-w-xl w-full scale-105 animate-in zoom-in-95">
            <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">Assign Delivery Rider</h3>
            <p className="text-slate-500 mb-10 text-sm font-bold">Enter the details for the delivery expert handling this payload.</p>
            
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2">Rider Name</label>
                <input 
                  type="text" 
                  value={riderName} 
                  onChange={(e) => setRiderName(e.target.value)} 
                  className="w-full bg-dark-deep border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-brand-light/50" 
                  placeholder="e.g. Kenji S." 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2">Contact Number</label>
                <input 
                  type="text" 
                  value={riderPhone} 
                  onChange={(e) => setRiderPhone(e.target.value)} 
                  className="w-full bg-dark-deep border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-brand-light/50" 
                  placeholder="e.g. +81 90-XXXX-XXXX" 
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setRiderModalVisible(false)} 
                className="flex-1 border border-white/10 text-white py-4 rounded-2xl font-bold hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={submitRiderDispatch} 
                className="flex-1 bg-brand-light text-dark-deep py-4 rounded-2xl font-black hover:bg-white transition-all shadow-lg shadow-brand/20"
              >
                Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
