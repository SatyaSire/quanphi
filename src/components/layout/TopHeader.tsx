import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleDrawer, toggleRightPanel, toggleNotificationsPane } from '../../app/slices/uiSlice';
import { useAuth } from '../../hooks/useAuth';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  PlusIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  ChevronDownIcon,
  DocumentArrowDownIcon,
  FolderPlusIcon,
  UserPlusIcon,
  CurrencyDollarIcon,
  ClockIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

interface AddMenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
}

const addMenuItems: AddMenuItem[] = [
  {
    name: 'New Project',
    href: '/projects/new',
    icon: FolderPlusIcon,
    description: 'Create a new project'
  },
  {
    name: 'New Quotation',
    href: '/quotations/new',
    icon: DocumentArrowDownIcon,
    description: 'Generate a new quotation'
  },
  {
    name: 'New Client',
    href: '/clients/new',
    icon: UserPlusIcon,
    description: 'Add a new client'
  },
  {
    name: 'New Expense',
    href: '/expenses/new',
    icon: CurrencyDollarIcon,
    description: 'Record a new expense'
  },
  {
    name: 'Mark Attendance',
    href: '/attendance/mark',
    icon: ClockIcon,
    description: 'Mark attendance for today'
  },
];

const TopHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.session);
  const { rightPanelOpen, notificationsPaneOpen } = useAppSelector((state) => state.ui);
  const { logout } = useAuth();
  
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  
  const addMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setAddMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Global search shortcut (g)
      if (event.key === 'g' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const target = event.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          event.preventDefault();
          searchRef.current?.focus();
        }
      }
      
      // Quick search shortcut (/)
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const target = event.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          event.preventDefault();
          searchRef.current?.focus();
        }
      }
      
      // Escape to close search
      if (event.key === 'Escape' && searchFocused) {
        searchRef.current?.blur();
        setSearchQuery('');
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchFocused]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      searchRef.current?.blur();
    }
  };
  
  const handleAddMenuClick = (href: string) => {
    setAddMenuOpen(false);
    navigate(href);
  };
  
  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
  };
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => dispatch(toggleDrawer())}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-label="Open sidebar"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            {/* Add Button */}
            <div className="relative ml-4 lg:ml-0" ref={addMenuRef}>
              <button
                onClick={() => setAddMenuOpen(!addMenuOpen)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add
                <ChevronDownIcon className="h-4 w-4 ml-2" />
              </button>
              
              {/* Add Menu Dropdown */}
              {addMenuOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    {addMenuItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleAddMenuClick(item.href)}
                        className="group flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                      >
                        <item.icon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-gray-500" />
                        <div className="text-left">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Center Section - Search */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors duration-200"
                  placeholder="Search projects, clients, quotations... (Press 'g' or '/')"
                />
              </div>
            </form>
          </div>
          
          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* PDF Menu - Contextual */}
            <button
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors duration-200"
              title="Export PDF"
            >
              <DocumentArrowDownIcon className="h-6 w-6" />
            </button>
            
            {/* Notifications */}
            <button
              onClick={() => dispatch(toggleNotificationsPane())}
              className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors duration-200 ${
                notificationsPaneOpen
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
              }`}
              title="Notifications"
            >
              <BellIcon className="h-6 w-6" />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
            </button>
            
            {/* AI Chat Toggle */}
            <button
              onClick={() => dispatch(toggleRightPanel())}
              className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors duration-200 ${
                rightPanelOpen
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
              }`}
              title="AI Assistant"
            >
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
            </button>
            
            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                  {user?.fullName || 'User'}
                </span>
                <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-400 hidden md:block" />
              </button>
              
              {/* User Menu Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">{user?.fullName}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate('/profile');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <UserCircleIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Profile
                    </button>
                    
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate('/settings');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Cog6ToothIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Settings
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;