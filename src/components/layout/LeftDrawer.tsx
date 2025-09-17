import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleDrawer, setDrawerOpen } from '../../app/slices/uiSlice';
import {
  HomeIcon,
  FolderIcon,
  UsersIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CubeIcon,
  UserGroupIcon,
  BanknotesIcon,
  ArchiveBoxIcon,
  GlobeAltIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: number;
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Projects', href: '/projects', icon: FolderIcon, badge: 3 },
  { name: 'Clients', href: '/clients', icon: UsersIcon },
  { name: 'Quotations', href: '/quotations', icon: DocumentTextIcon, badge: 2 },
  { name: 'Expenses', href: '/expenses', icon: CurrencyDollarIcon },
  { name: 'Material', href: '/materials', icon: CubeIcon },
  { name: "Worker's Profile", href: '/workers', icon: IdentificationIcon },
  { name: 'Attendance', href: '/attendance', icon: ClockIcon },
  
  { name: "Worker's Payment", href: '/payments', icon: BanknotesIcon },
  { name: 'Documents', href: '/documents', icon: ArchiveBoxIcon },
  { name: 'Client Portal', href: '/client-portal', icon: GlobeAltIcon },
  { name: 'Worker Portal', href: '/worker-portal', icon: UserGroupIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

const LeftDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { drawerOpen } = useAppSelector((state) => state.ui);
  const location = useLocation();
  const handleToggleDrawer = () => {
    dispatch(toggleDrawer());
  };
  
  const handleCloseDrawer = () => {
    dispatch(setDrawerOpen(false));
  };
  
  return (
    <>
      {/* Desktop Drawer */}
      <div
        className={`hidden lg:flex lg:flex-shrink-0 transition-all duration-300 ease-in-out ${
          drawerOpen ? 'lg:w-64' : 'lg:w-16'
        }`}
      >
        <div className="flex flex-col w-full">
          {/* Drawer Header */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-r border-gray-200">
            <div className="flex items-center justify-between w-full">
              {drawerOpen && (
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">CP</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h1 className="text-lg font-semibold text-gray-900">ContractorPro</h1>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleToggleDrawer}
                className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-label={drawerOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                {drawerOpen ? (
                  <ChevronLeftIcon className="h-5 w-5" />
                ) : (
                  <ChevronRightIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 bg-white border-r border-gray-200 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive: navIsActive }) => {
                    const active = navIsActive || isActive;
                    return `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      active
                        ? 'bg-primary-100 text-primary-900 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`;
                  }}
                  title={!drawerOpen ? item.name : undefined}
                >
                  <item.icon
                    className={`flex-shrink-0 h-5 w-5 ${
                      drawerOpen ? 'mr-3' : 'mx-auto'
                    } ${
                      location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                        ? 'text-primary-600'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {drawerOpen && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {!drawerOpen && item.badge && item.badge > 0 && (
                    <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white min-w-[18px] h-[18px]">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* Mobile Drawer */}
      <div className={`lg:hidden fixed inset-0 z-40 ${drawerOpen ? 'block' : 'hidden'}`}>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={handleCloseDrawer}
        />
        
        {/* Drawer Panel */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          {/* Close Button */}
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={handleCloseDrawer}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          
          {/* Mobile Header */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CP</span>
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-gray-900">ContractorPro</h1>
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation */}
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={handleCloseDrawer}
                    className={({ isActive: navIsActive }) => {
                      const active = navIsActive || isActive;
                      return `group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                        active
                          ? 'bg-primary-100 text-primary-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`;
                    }}
                  >
                    <item.icon
                      className={`mr-4 flex-shrink-0 h-6 w-6 ${
                        location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                          ? 'text-primary-600'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
        </div>
      </div>
    </>
  );
};

export default LeftDrawer;