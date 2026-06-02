import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Edit3, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Zap,
  Plus,
  ChevronDown,
  Layers,
  Megaphone,
  Ticket,
  Star,
  LifeBuoy,
  Palette,
  User,
  ShieldAlert,
  Bike
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState(['store', 'growth']);
  const isActive = (path) => location.pathname === path;

  const toggleMenu = (menu) => {
    setOpenMenus(prev => prev.includes(menu) ? [] : [menu]);
  };

  const NavItem = ({ to, icon: Icon, label, badge }) => (
    <Link 
      to={to} 
      className={`flex items-center justify-between px-6 py-3 rounded-xl transition-all duration-300 group relative mb-1 ${
        isActive(to) 
          ? 'text-white' 
          : 'text-slate-500 hover:text-white'
      }`}
    >
      <div className="flex items-center space-x-3 z-10">
        <Icon size={18} className={isActive(to) ? 'text-brand-light' : 'group-hover:text-brand-light transition-colors'} />
        <span className={`font-bold tracking-tight text-xs ${isActive(to) ? 'opacity-100' : 'opacity-60 group-hover:opacity-100 transition-opacity'}`}>
          {label}
        </span>
      </div>
      {badge && (
        <span className="bg-brand-light/20 text-brand-light text-[8px] px-2 py-0.5 rounded-lg font-black tracking-widest z-10 border border-brand-light/30">
          {badge}
        </span>
      )}
      {isActive(to) && (
        <motion.div 
          layoutId="active-nav-pill"
          className="absolute inset-0 bg-white/5 rounded-xl border-l-4 border-brand-light"
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        />
      )}
    </Link>
  );

  const MenuGroup = ({ label, id, children }) => {
    const isOpen = openMenus.includes(id);
    return (
      <div className="mb-4">
        <button 
          onClick={() => toggleMenu(id)}
          className="w-full flex items-center justify-between px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 hover:text-slate-400 transition"
        >
          <span>{label}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={12} />
          </motion.div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="mt-1 px-2 space-y-1 overflow-hidden"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <aside className="w-80 bg-dark-deep min-h-screen flex flex-col border-r border-white/5 z-50 relative">
      {/* Brand Logo */}
      <div className="p-10 flex flex-col">
        <div className="flex items-center space-x-3 mb-2">
          <Zap size={32} className="text-brand-light fill-brand-light" />
          <h1 className="text-3xl font-black tracking-tighter text-white">AZN <span className="text-slate-500 font-medium text-lg">Admin</span></h1>
        </div>
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">Neuro-Operations Matrix</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar pt-6 pb-20">
        <div className="px-2 mb-8">
          <NavItem to="/" icon={LayoutDashboard} label="Neural Dashboard" />
        </div>

        <MenuGroup label="Store Logistics" id="store">
          <NavItem to="/orders" icon={ShoppingBag} label="Order Management" badge="LIVE" />
          <NavItem to="/riders" icon={Bike} label="Fleet Logistics" />
          <NavItem to="/menu" icon={Edit3} label="Menu Editor" />
          <NavItem to="/categories" icon={Layers} label="Taxonomy" />
        </MenuGroup>

        <MenuGroup label="Neural Marketing" id="growth">
          <NavItem to="/marketing" icon={Megaphone} label="Hero Banners" />
          <NavItem to="/promotions" icon={Zap} label="Broadcast Deals" />
          <NavItem to="/coupons" icon={Ticket} label="Elite Tokens" />
          <NavItem to="/customers" icon={Users} label="User Base" />
          <NavItem to="/users-control" icon={ShieldAlert} label="User & Staff Control" />
        </MenuGroup>

        <MenuGroup label="Intelligence" id="analytics">
          <NavItem to="/analytics" icon={BarChart3} label="Growth Analytics" />
          <NavItem to="/reviews" icon={Star} label="Customer Reviews" />
        </MenuGroup>

        <MenuGroup label="System Control" id="system">
          <NavItem to="/design" icon={Palette} label="Aesthetic Presets" />
          <NavItem to="/support" icon={LifeBuoy} label="Support Nexus" />
          <NavItem to="/settings" icon={Settings} label="Global Params" />
          <NavItem to="/profile" icon={User} label="Master Profile" />
        </MenuGroup>
      </nav>

      {/* Footer Action */}
      <div className="p-8 bg-dark-deep/80 backdrop-blur-md border-t border-white/5">
        <button 
          onClick={() => navigate('/marketing')}
          className="w-full bg-brand-light text-dark-deep py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-2xl shadow-brand/20 flex items-center justify-center space-x-3 mb-6"
        >
          <Plus size={20} />
          <span>New Campaign</span>
        </button>
        <button 
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
          className="flex items-center justify-center space-x-3 w-full text-slate-600 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest"
        >
          <LogOut size={14} />
          <span>Terminate Link</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
