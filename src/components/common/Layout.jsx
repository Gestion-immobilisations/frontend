import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import '../../styles/components/layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-body">
        <main className="app-content">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
