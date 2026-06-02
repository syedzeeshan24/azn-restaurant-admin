import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Users, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';

const COLORS = ['#8E248C', '#B388FF', '#FF7EB3', '#4B5563'];

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [userGrowth, setUserGrowth] = useState([]);
  const [orderVolume, setOrderVolume] = useState([]);
  const [revenueDist, setRevenueDist] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('Rs.');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [usersRes, ordersRes, settingsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/users`),
          axios.get(`${API_BASE_URL}/api/orders`),
          axios.get(`${API_BASE_URL}/api/settings`).catch(() => ({ data: { currencySymbol: 'Rs.' } }))
        ]);

        const users = usersRes.data;
        const orders = ordersRes.data;

        // Overall Stats
        const revenue = orders.filter(o => o.status !== 'Cancelled').reduce((acc, o) => acc + o.grandTotal, 0);
        setCurrencySymbol(settingsRes.data?.currencySymbol || 'Rs.');
        setStats({
          totalUsers: users.length,
          totalOrders: orders.length,
          totalRevenue: revenue
        });

        // User Growth (Last 7 Days)
        const last7Days = Array.from({length: 7}, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toISOString().split('T')[0];
        });

        const usersByDay = last7Days.reduce((acc, date) => ({...acc, [date]: 0}), {});
        users.forEach(u => {
          const date = new Date(u.createdAt || new Date()).toISOString().split('T')[0];
          if (usersByDay[date] !== undefined) {
             usersByDay[date] += 1;
          }
        });
        
        let cumulativeUsers = users.length - Object.values(usersByDay).reduce((a,b)=>a+b,0);
        const growthData = last7Days.map(date => {
          cumulativeUsers += usersByDay[date];
          return {
            name: new Date(date).toLocaleDateString('en-US', {weekday: 'short'}),
            users: cumulativeUsers
          };
        });
        setUserGrowth(growthData);

        // Order Volume (Last 7 Days)
        const ordersByDay = last7Days.reduce((acc, date) => ({...acc, [date]: 0}), {});
        orders.forEach(o => {
          if (o.status !== 'Cancelled') {
            const date = new Date(o.createdAt || new Date()).toISOString().split('T')[0];
            if (ordersByDay[date] !== undefined) {
               ordersByDay[date] += 1;
            }
          }
        });
        setOrderVolume(last7Days.map(date => ({
          name: new Date(date).toLocaleDateString('en-US', {weekday: 'short'}),
          orders: ordersByDay[date]
        })));

        // Revenue Distribution by Status
        const statusRev = {};
        orders.forEach(o => {
          if (o.status !== 'Cancelled') {
            statusRev[o.status] = (statusRev[o.status] || 0) + o.grandTotal;
          }
        });
        const distData = Object.keys(statusRev).map(key => ({
          name: key,
          value: statusRev[key]
        }));
        setRevenueDist(distData.length > 0 ? distData : [{name: 'Delivered', value: revenue}]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-brand-light rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-4 border-4 border-brand rounded-full border-b-transparent animate-spin-slow"></div>
      </div>
      <p className="mt-8 text-sm font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Computing Analytics</p>
    </div>
  );

  return (
    <div className="p-4 md:p-10 space-y-12 animate-in fade-in duration-500 pb-32">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-3">Growth Analytics</h1>
        <p className="text-slate-500 font-bold tracking-tight">Deep dive into user acquisition and order volume metrics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-dark-surface border border-white/5 p-8 rounded-[2rem] flex items-center space-x-6 hover:border-brand-light/20 transition-all group">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-light/10 transition-colors">
            <Users size={28} className="text-brand-light" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Users</p>
            <h3 className="text-3xl font-black text-white">{stats.totalUsers.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-dark-surface border border-white/5 p-8 rounded-[2rem] flex items-center space-x-6 hover:border-brand-light/20 transition-all group">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-light/10 transition-colors">
            <ShoppingBag size={28} className="text-brand-light" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Orders</p>
            <h3 className="text-3xl font-black text-white">{stats.totalOrders.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-dark-surface border border-white/5 p-8 rounded-[2rem] flex items-center space-x-6 hover:border-brand-light/20 transition-all group">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-light/10 transition-colors">
            <DollarSign size={28} className="text-brand-light" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Revenue</p>
            <h3 className="text-3xl font-black text-white">{currencySymbol}{stats.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* User Growth Chart */}
        <div className="bg-dark-surface border border-white/5 rounded-[3rem] p-10">
          <h3 className="text-xl font-black text-white mb-8">User Growth</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowth} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8E248C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8E248C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff' }}
                  itemStyle={{ color: '#8E248C', fontWeight: '900' }}
                />
                <Area type="monotone" dataKey="users" stroke="#8E248C" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Volume Chart */}
        <div className="bg-dark-surface border border-white/5 rounded-[3rem] p-10">
          <h3 className="text-xl font-black text-white mb-8">Order Volume</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderVolume} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff' }}
                  itemStyle={{ color: '#B388FF', fontWeight: '900' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="orders" fill="#B388FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Revenue Distribution Chart */}
      <div className="bg-dark-surface border border-white/5 rounded-[3rem] p-10 w-full md:w-2/3 lg:w-1/2">
        <h3 className="text-xl font-black text-white mb-8">Revenue by Status</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={revenueDist}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {revenueDist.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontWeight: '900' }}
                  formatter={(value) => `${currencySymbol}${value.toFixed(2)}`}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
