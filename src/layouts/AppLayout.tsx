import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import LeftDrawer from '../components/layout/LeftDrawer';
import TopHeader from '../components/layout/TopHeader';
import RightPanel from '../components/layout/RightPanel';
import NotificationPane from '../components/layout/NotificationPane';

const AppLayout: React.FC = () => {
  const { drawerOpen, rightPanelOpen, notificationsPaneOpen } = useAppSelector(
    (state) => state.ui
  );
  
  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Left Drawer */}
      <LeftDrawer />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <TopHeader />
        
        {/* Page Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      
      {/* Right Panel (AI Chat) */}
      {rightPanelOpen && <RightPanel />}
      
      {/* Notifications Pane */}
      {notificationsPaneOpen && <NotificationPane />}
      
      {/* Overlay for mobile when drawer is open */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={() => {
            // Close drawer on mobile when overlay is clicked
            // This will be handled by the drawer component
          }}
        />
      )}
    </div>
  );
};

export default AppLayout;