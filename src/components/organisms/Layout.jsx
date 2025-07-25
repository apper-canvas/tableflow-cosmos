import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const titles = {
      "/orders": "Orders",
      "/menu": "Menu",
      "/tables": "Tables"
    };
    return titles[location.pathname] || "Dashboard";
  };

  const handleMobileMenuClick = () => {
    setIsMobileSidebarOpen(true);
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:block lg:w-80 lg:flex-shrink-0" />

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={handleMobileSidebarClose} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          title={getPageTitle()} 
          onMenuClick={handleMobileMenuClick}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;