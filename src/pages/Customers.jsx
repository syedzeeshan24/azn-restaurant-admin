import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { Users, ShoppingBag, TrendingUp, Search, User, Mail, Phone, Calendar, Star } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, ordersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/users`),
        axios.get(`${API_BASE_URL}/api/orders`)
      ]);
      setCustomers(usersRes.data.filter(u => u.role !== 'admin'));
      setOrders(ordersRes.data);
    } catch (err) {
      console.error('Customers fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCustomerStats = (customerId) => {
    const customerOrders = orders.filter(o => 
      o.user && (o.user._id === customerId || o.user === customerId)
    );
    const totalSpend = customerOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    return { orderCount: customerOrders.length, totalSpend };
  };

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand-light rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-8 text-sm font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Scanning User Base</p>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-12 animate-in">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-3">User Base</h1>
          <p className="text-slate-500 font-bold tracking-tight">Monitor and manage your elite customer segments.</p>
        </div>
        <div className="bg-dark-surface px-8 py-4 rounded-2xl border border-white/5 flex items-center space-x-3">
          <Users size={20} className="text-brand-light" />
          <span className="text-sm font-black text-white uppercase tracking-widest">{customers.length} Nodes Online</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-dark-surface border border-white/5 p-8 rounded-[2rem] hover:border-brand-light/20 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <Users size={24} className="text-brand-light" />
            <div className="px-3 py-1 bg-brand-light/10 rounded-lg text-[10px] font-black text-brand-light uppercase tracking-widest">Growth</div>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Customers</p>
          <h3 className="text-3xl font-black text-white tracking-tighter">{customers.length}</h3>
        </div>
        <div className="bg-dark-surface border border-white/5 p-8 rounded-[2rem] hover:border-brand-light/20 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <ShoppingBag size={24} className="text-brand-light" />
            <div className="px-3 py-1 bg-brand-light/10 rounded-lg text-[10px] font-black text-brand-light uppercase tracking-widest">Active</div>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Orders</p>
          <h3 className="text-3xl font-black text-white tracking-tighter">{orders.length}</h3>
        </div>
        <div className="bg-dark-surface border border-white/5 p-8 rounded-[2rem] hover:border-brand-light/20 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <TrendingUp size={24} className="text-brand-light" />
            <div className="px-3 py-1 bg-brand-light/10 rounded-lg text-[10px] font-black text-brand-light uppercase tracking-widest">Revenue</div>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Value</p>
          <h3 className="text-3xl font-black text-white tracking-tighter">Rs. {totalRevenue.toLocaleString()}</h3>
        </div>
        <div className="bg-dark-surface border border-white/5 p-8 rounded-[2rem] hover:border-brand-light/20 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <Star size={24} className="text-brand-light" />
            <div className="px-3 py-1 bg-brand-light/10 rounded-lg text-[10px] font-black text-brand-light uppercase tracking-widest">Elite</div>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Avg. LTV</p>
          <h3 className="text-3xl font-black text-white tracking-tighter">
            Rs. {customers.length > 0 ? (totalRevenue / customers.length).toFixed(0).toLocaleString() : 0}
          </h3>
        </div>
      </div>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-brand-light transition-colors" size={20} />
        <input
          placeholder="Search by name, email, or phone identity..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-dark-surface border border-white/10 rounded-[2rem] pl-16 pr-8 py-6 text-white focus:ring-2 focus:ring-brand-light/20 focus:border-brand-light/30 outline-none transition-all font-bold placeholder:text-slate-700 shadow-2xl"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-dark-surface border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black text-slate-600 uppercase tracking-widest">
              <th className="px-10 py-8">Customer Segment</th>
              <th className="px-10 py-8">Contact Nodes</th>
              <th className="px-10 py-8">Activity</th>
              <th className="px-10 py-8">Total Spend</th>
              <th className="px-10 py-8">Initialized</th>
              <th className="px-10 py-8 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-10 py-32 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-dark-deep rounded-full flex items-center justify-center mb-8 border border-white/5">
                      <Users size={40} className="text-slate-700" />
                    </div>
                    <p className="text-slate-500 font-black text-lg uppercase tracking-widest">No User Match</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCustomers.map(customer => {
                const stats = getCustomerStats(customer._id);
                return (
                  <tr key={customer._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center space-x-5">
                        <div className="w-14 h-14 rounded-[1.2rem] bg-brand-light/10 text-brand-light border border-brand-light/20 flex items-center justify-center text-xl font-black group-hover:scale-110 transition-transform shadow-xl shadow-brand/10">
                          {customer.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <span className="text-lg font-black text-white group-hover:text-brand-light transition-colors">{customer.name || 'Anonymous User'}</span>
                          <div className="flex items-center space-x-2 mt-1">
                             <div className="w-1.5 h-1.5 bg-brand-light rounded-full"></div>
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Core User</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm font-bold text-slate-400">
                          <Mail size={14} className="text-slate-700" />
                          <span>{customer.email || '—'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                          <Phone size={12} className="text-slate-800" />
                          <span>{customer.phone || '—'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center space-x-3">
                         <div className="px-4 py-1.5 bg-dark-deep rounded-xl text-brand-light text-xs font-black border border-white/5">
                           {stats.orderCount}
                         </div>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Transmissions</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-xl font-black text-white tracking-tighter">Rs. {stats.totalSpend.toLocaleString()}</span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center space-x-2 text-slate-500">
                        <Calendar size={14} className="text-slate-700" />
                        <span className="text-xs font-bold">
                          {new Date(customer.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-light/5 rounded-xl border border-brand-light/10">
                         <div className="w-1.5 h-1.5 bg-brand-light rounded-full animate-pulse shadow-[0_0_5px_rgba(179,136,255,0.8)]"></div>
                         <span className="text-[9px] font-black text-brand-light uppercase tracking-widest">Active</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
