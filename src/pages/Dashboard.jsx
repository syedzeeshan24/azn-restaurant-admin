import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Clock,
  ArrowUpRight,
  MoreHorizontal,
  Download,
  Zap,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    activeOrders: 0,
    completedOrders: 0,
    customers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('Rs.');
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('weekly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, usersRes, settingsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/orders`),
          axios.get(`${API_BASE_URL}/api/users`),
          axios.get(`${API_BASE_URL}/api/settings`).catch(() => ({ data: { currencySymbol: 'Rs.' } }))
        ]);

        const orders = ordersRes.data;
        const revenue = orders
          .filter(o => o.status !== 'Cancelled')
          .reduce((sum, o) => sum + o.grandTotal, 0);
        
        const active = orders.filter(o => ['Pending', 'Accepted', 'Preparing', 'Out for Delivery'].includes(o.status)).length;
        
        setCurrencySymbol(settingsRes.data?.currencySymbol || 'Rs.');
        setStats({
          revenue,
          activeOrders: active,
          completedOrders: orders.filter(o => o.status === 'Delivered').length,
          customers: usersRes.data?.length || 0
        });

        let cData = [];
        if (timeframe === 'weekly') {
          const last7Days = Array.from({length: 7}, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
          });
          const revByDay = last7Days.reduce((acc, date) => ({...acc, [date]: 0}), {});
          orders.forEach(o => {
             if (o.status !== 'Cancelled') {
               const date = new Date(o.createdAt || new Date()).toISOString().split('T')[0];
               if (revByDay[date] !== undefined) {
                  revByDay[date] += o.grandTotal || 0;
               }
             }
          });
          cData = last7Days.map(date => ({
            name: new Date(date).toLocaleDateString('en-US', {weekday: 'short'}),
            revenue: revByDay[date]
          }));
        } else {
          const last6Months = Array.from({length: 6}, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          });
          const revByMonth = last6Months.reduce((acc, m) => ({...acc, [m]: 0}), {});
          orders.forEach(o => {
             if (o.status !== 'Cancelled') {
               const date = new Date(o.createdAt || new Date());
               const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
               if (revByMonth[month] !== undefined) {
                  revByMonth[month] += o.grandTotal || 0;
               }
             }
          });
          cData = last6Months.map(month => {
            const [y, m] = month.split('-');
            const date = new Date(y, parseInt(m)-1, 1);
            return {
              name: date.toLocaleDateString('en-US', {month: 'short'}),
              revenue: revByMonth[month]
            };
          });
        }
        setChartData(cData);

        const itemCounts = {};
        orders.forEach(o => {
           if (o.status !== 'Cancelled' && o.items) {
             o.items.forEach(item => {
               const p = item.product;
               if (p && p._id) {
                 if (!itemCounts[p._id]) {
                   itemCounts[p._id] = {
                     name: p.name,
                     count: 0,
                     price: p.price,
                     img: p.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop'
                   };
                 }
                 itemCounts[p._id].count += item.quantity || 1;
               }
             });
           }
        });
        const tItems = Object.values(itemCounts).sort((a,b) => b.count - a.count).slice(0,3);
        setTopItems(tItems.length > 0 ? tItems : [
               { name: 'Neon Smash Burger', count: 0, price: 18.00, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop' },
               { name: 'Cyber Truffle Pizza', count: 0, price: 24.00, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&auto=format&fit=crop' },
               { name: 'Zenith Sushi Roll', count: 0, price: 22.00, img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=200&auto=format&fit=crop' }
        ]);

        setRecentOrders(orders.slice(0, 5));
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [timeframe]);

  const handleDownloadCSV = () => {
    if (!recentOrders || recentOrders.length === 0) return;
    const headers = ['Order ID', 'Customer', 'Item', 'Total', 'Status'];
    const rows = recentOrders.map(o => [
      `AZN-${o._id.substring(o._id.length - 4)}`,
      o.user?.name || 'Guest User',
      o.items?.[0]?.product?.name || 'Multiple Items',
      o.grandTotal,
      o.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "recent_orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, badge }) => (
    <div className="bg-dark-surface border border-white/5 p-8 rounded-[2rem] hover:border-brand-light/20 transition-all group">
      <div className="flex justify-between items-start mb-6">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</p>
        {trend && (
          <div className="flex items-center space-x-1 text-brand-light text-xs font-black">
            <TrendingUp size={14} />
            <span>{trendValue}</span>
          </div>
        )}
        {badge && (
          <span className="bg-brand/20 text-brand-light px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest">
            {badge}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-black text-white tracking-tighter">{value}</h3>
        <div className="flex -space-x-2">
           {[1, 2, 3].map(i => (
             <div key={i} className={`w-8 h-8 rounded-full border-2 border-dark-surface bg-slate-800 flex items-center justify-center overflow-hidden ${i === 1 ? 'z-30' : i === 2 ? 'z-20' : 'z-10'}`}>
                <div className={`w-full h-full bg-brand-light/${i * 20}`}></div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-brand-light rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-4 border-4 border-brand rounded-full border-b-transparent animate-spin-slow"></div>
      </div>
      <p className="mt-8 text-sm font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Syncing Neural Data</p>
    </div>
  );

  return (
    <div className="p-4 md:p-10 space-y-12 animate-in pb-32">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-3">Welcome back, Admin</h1>
        <p className="text-slate-500 font-bold tracking-tight">Performance overview for your premium locations.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Total Revenue" 
          value={`${currencySymbol}${stats.revenue.toLocaleString()}`} 
          trend="up" 
          trendValue="14%" 
        />
        <StatCard 
          title="Active Orders" 
          value={stats.activeOrders} 
          badge="In Progress"
        />
        <StatCard 
          title="Avg Prep Time" 
          value="12m 30s" 
          trend="down" 
          trendValue="-2%" 
        />
        <StatCard 
          title="New Customers" 
          value={stats.customers} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Revenue Trends Chart Section */}
        <div className="lg:col-span-2 bg-dark-surface border border-white/5 rounded-[3rem] p-6 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 md:gap-0">
            <h3 className="text-2xl font-black text-white">Revenue Trends</h3>
            <div className="flex w-full md:w-auto bg-dark-deep p-1 rounded-2xl border border-white/5">
               <button onClick={() => setTimeframe('weekly')} className={`flex-1 md:flex-none px-6 py-3 md:py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${timeframe === 'weekly' ? 'bg-brand-light text-dark-deep' : 'text-slate-500 hover:text-white'}`}>Weekly</button>
               <button onClick={() => setTimeframe('monthly')} className={`flex-1 md:flex-none px-6 py-3 md:py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${timeframe === 'monthly' ? 'bg-brand-light text-dark-deep' : 'text-slate-500 hover:text-white'}`}>Monthly</button>
            </div>
          </div>
          <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B388FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#B388FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${currencySymbol}${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff' }}
                  itemStyle={{ color: '#B388FF', fontWeight: '900' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#B388FF" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Items Section */}
        <div className="bg-dark-surface border border-white/5 rounded-[3rem] p-6 md:p-12 flex flex-col">
          <h3 className="text-2xl font-black text-white mb-10">Top Selling Items</h3>
          <div className="space-y-8 flex-1">
             {topItems.map((item, i) => (
               <div key={i} className="flex items-center justify-between group cursor-pointer">
                 <div className="flex items-center space-x-5">
                   <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/5 group-hover:border-brand-light/30 transition-all">
                      <img src={item.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={item.name} />
                   </div>
                   <div>
                     <p className="text-sm font-black text-white group-hover:text-brand-light transition-colors">{item.name}</p>
                     <p className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-widest">{item.count} orders</p>
                   </div>
                 </div>
                 <p className="text-sm font-black text-white">{currencySymbol}{typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</p>
               </div>
             ))}
          </div>
          <button className="w-full mt-12 py-4 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all">
            View Menu Analytics
          </button>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-dark-surface border border-white/5 rounded-[3rem] p-6 md:p-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4 md:gap-0">
          <h3 className="text-2xl font-black text-white">Recent Orders</h3>
          <button onClick={handleDownloadCSV} className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-light transition-all">
            <Download size={16} />
            <span>Download CSV</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                <th className="pb-8 pl-4">Order ID</th>
                <th className="pb-8">Customer</th>
                <th className="pb-8">Item</th>
                <th className="pb-8">Total</th>
                <th className="pb-8">Status</th>
                <th className="pb-8 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.map((order, i) => (
                <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-8 pl-4 text-sm font-black text-brand-light uppercase">#AZN-{order._id.substring(order._id.length - 4)}</td>
                  <td className="py-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs font-black text-slate-500">
                        {order.user?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">{order.user?.name || 'Guest User'}</span>
                    </div>
                  </td>
                  <td className="py-8 text-sm font-bold text-slate-500 group-hover:text-white transition-colors">
                    {order.items?.[0]?.product?.name || 'Multiple Items'} {order.items?.length > 1 ? `x${order.items.length}` : ''}
                  </td>
                  <td className="py-8 text-sm font-black text-white">{currencySymbol}{order.grandTotal.toLocaleString()}</td>
                  <td className="py-8">
                    <span className="px-4 py-1.5 bg-brand-light/10 text-brand-light rounded-xl text-[9px] font-black uppercase tracking-widest border border-brand-light/20">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-8 pr-4 text-right">
                    <button className="text-slate-700 hover:text-white transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
