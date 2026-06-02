import { Search, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';

const Header = ({ onMenuClick }) => {
  const [adminUser, setAdminUser] = useState(() => {
    return JSON.parse(localStorage.getItem('adminUser') || '{"name":"AZN Admin", "email":""}');
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setAdminUser(JSON.parse(localStorage.getItem('adminUser') || '{"name":"AZN Admin", "email":""}'));
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('adminUserUpdated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('adminUserUpdated', handleStorageChange);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 px-5 md:px-10 py-4 md:py-6 flex justify-between items-center bg-dark-deep/80 backdrop-blur-md gap-4">
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-3 bg-dark-surface rounded-2xl border border-white/5 text-slate-400 hover:text-white transition-colors"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center flex-1 max-w-2xl">
        <div className="relative w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-light transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search analytics, orders, or customers..." 
            className="w-full pl-14 pr-6 py-4 bg-dark-surface border border-white/5 rounded-2xl focus:ring-2 focus:ring-brand-light/20 focus:border-brand-light/30 transition-all outline-none text-sm text-white placeholder:text-slate-600 font-bold shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 md:space-x-10">
        <div className="flex items-center space-x-4 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-white group-hover:text-brand-light transition-colors tracking-tight">{adminUser.name}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{adminUser.email ? 'System Admin' : 'Master Chief'}</p>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden border-2 border-white/5 group-hover:border-brand-light/50 transition-all shadow-xl shrink-0">
             <img 
               src={adminUser.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop"} 
               className="w-full h-full object-cover transition-all" 
               alt={adminUser.name} 
             />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
