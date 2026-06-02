import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-dark-deep">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-dark-deep">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
