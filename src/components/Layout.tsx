import React from 'react';
import { LayoutDashboard, PlusCircle, ScanLine, BarChart3, Wallet, Menu, X, LogOut, User, HelpCircle, ShoppingBag, Moon, Sun, Bell } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import logoImage from 'figma:asset/991ae2b932337e09452e4b99d1ed6a73c11299d5.png';
import { Header } from './Header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from './ui/dropdown-menu';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onChangeView: (view: string) => void;
  onOpenVideo: () => void;
  onLogout?: () => void;
}

export function Layout({ children, currentView, onChangeView, onOpenVideo, onLogout }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    // Initialize from localStorage
    const savedMode = localStorage.getItem('qp_dark_mode');
    return savedMode === 'true';
  });
  const [showGuidePopup, setShowGuidePopup] = React.useState(true);
  const [unreadCount] = React.useState(3);

  // Merchant profile data from sidebar
  const merchantData = {
    name: 'Cinnamon Grand',
    planName: 'Onboarding Free Trial'
  };

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: 'purchase',
      title: 'New Coupon Purchase',
      message: '5 coupons purchased for "50% Off Deal"',
      time: '5 min ago',
      unread: true
    },
    {
      id: 2,
      type: 'expiration',
      title: 'Deal Expiring Soon',
      message: '"Weekend Special" expires in 2 days',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'purchase',
      title: 'Coupon Redeemed',
      message: '3 coupons redeemed at your location',
      time: '3 hours ago',
      unread: true
    },
    {
      id: 4,
      type: 'expiration',
      title: 'Deal Expired',
      message: '"Happy Hour Deal" has ended',
      time: '1 day ago',
      unread: false
    },
    {
      id: 5,
      type: 'purchase',
      title: 'New Coupon Purchase',
      message: '2 coupons purchased for "Lunch Special"',
      time: '2 days ago',
      unread: false
    },
    {
      id: 6,
      type: 'purchase',
      title: 'Bulk Purchase',
      message: '10 coupons purchased for "Dinner Deal"',
      time: '3 days ago',
      unread: false
    },
    {
      id: 7,
      type: 'expiration',
      title: 'Deal Expiring Soon',
      message: '"Breakfast Combo" expires in 1 day',
      time: '3 days ago',
      unread: false
    },
    {
      id: 8,
      type: 'purchase',
      title: 'Coupon Redeemed',
      message: '7 coupons redeemed at your location',
      time: '4 days ago',
      unread: false
    }
  ];

  // Apply dark class to document root
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    // Persist to localStorage
    localStorage.setItem('qp_dark_mode', newMode.toString());
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'create', label: 'New Deal', icon: PlusCircle },
    { id: 'my-deals', label: 'My Deals', icon: ShoppingBag },
    { id: 'scan', label: 'Redeem', icon: ScanLine },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const NavContent = ({ isMobile = false }) => (
    <div className={cn("flex flex-col h-full", isMobile ? "" : "")}>
      <div className={cn("flex items-center justify-center h-20 border-b border-gray-800/30", isMobile ? "hidden" : "")}>
        <img src={logoImage} alt="QPON.lk" className="h-10 w-auto" />
      </div>
      
      <nav className={cn("flex-1 py-6 space-y-2", isMobile ? "px-4" : "")}>
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              id={`nav-item-${item.id}`}
              key={item.id}
              onClick={() => {
                onChangeView(item.id);
                if (isMobile) setIsMobileMenuOpen(false);
              }}
              className={cn(
                "flex items-center w-full px-6 py-3 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "text-[#E35000] bg-white/10 border-r-4 border-[#E35000]" 
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5 mr-3", isActive ? "text-[#E35000]" : "text-gray-400")} />
              {item.label}
            </button>
          );
        })}
        
        {/* Start Guide - Mobile Only */}
        {isMobile && (
          <button 
            id="sidebar-guide-btn-mobile"
            onClick={() => {
              onOpenVideo();
              if (isMobile) setIsMobileMenuOpen(false);
            }}
            className="flex items-center w-full px-6 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <HelpCircle className="w-5 h-5 mr-3 text-gray-400" />
            Start Guide
          </button>
        )}
      </nav>

      <div className={cn("mt-auto space-y-4", isMobile ? "p-4" : "p-6")}>
        {!isMobile && (
          <div className="relative">
            <button 
              id="sidebar-guide-btn-desktop"
              onClick={() => {
                onOpenVideo();
                if (isMobile) setIsMobileMenuOpen(false);
              }}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-white hover:text-white/90 hover:bg-white/10 rounded-lg transition-colors border border-white/20 bg-white/5"
            >
              <HelpCircle className="w-5 h-5 mr-3 text-[#E35000]" />
              Starter Guide
            </button>

            {/* Guidance Popup */}
            {showGuidePopup && (
              <div 
                className="absolute bottom-full left-0 right-0 mb-3 bg-gradient-to-br from-[#6B5CE7] to-[#4A90E2] rounded-xl p-4 shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-500"
                style={{
                  animation: 'slideInUp 0.5s ease-out'
                }}
              >
                {/* Animated Pulsing Dot */}
                <div className="absolute -top-1 -right-1 flex items-center justify-center">
                  <div 
                    className="w-3 h-3 bg-[#FFD700] rounded-full"
                    style={{
                      animation: 'blingPulse 2s ease-in-out infinite'
                    }}
                  ></div>
                  <div 
                    className="absolute w-3 h-3 bg-white rounded-full opacity-75"
                    style={{
                      animation: 'blingRipple 2s ease-in-out infinite'
                    }}
                  ></div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => {
                    setShowGuidePopup(false);
                  }}
                  className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                  aria-label="Close popup"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Content */}
                <div className="pr-6">
                  <p className="text-white text-sm leading-relaxed">
                    Learn how to complete merchant profile and manage deals.
                  </p>
                </div>

                {/* Pointer/Arrow */}
                <div className="absolute -bottom-2 left-6 w-4 h-4 bg-gradient-to-br from-[#6B5CE7] to-[#4A90E2] rotate-45"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] flex font-sans transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-[#0E2250] dark:bg-[#0A0A0A] shadow-xl fixed h-full z-30 transition-colors duration-300">
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#0E2250] dark:bg-[#0A0A0A] z-40 h-16 flex items-center justify-between px-4 shadow-md transition-colors duration-300">
        <img src={logoImage} alt="QPON.lk" className="h-8 w-auto" />
        <div className="flex items-center gap-1">
          {/* Dark/Light Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleDarkMode}
            className="rounded-full hover:bg-white/10 transition-colors w-10 h-10 flex items-center justify-center flex-shrink-0"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-300" />
            ) : (
              <Moon className="h-5 w-5 text-white" />
            )}
          </Button>
          
          {/* Notifications Dropdown - Mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/10 transition-colors relative w-10 h-10 flex items-center justify-center flex-shrink-0"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#E35000] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold shadow-md">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] max-w-md bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2A2A2A] dark:shadow-2xl p-0 mr-4">
              <DropdownMenuLabel className="border-b border-gray-200 dark:border-[#2A2A2A] py-3 px-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#0E2250] dark:text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-[#E35000] text-white px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
              </DropdownMenuLabel>
              <div className="max-h-[400px] overflow-y-auto scroll-smooth modern-scrollbar">
                <style>{`
                  .modern-scrollbar::-webkit-scrollbar {
                    width: 4px;
                  }
                  .modern-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                    margin: 4px 0;
                  }
                  .modern-scrollbar::-webkit-scrollbar-thumb {
                    background: transparent;
                    border-radius: 10px;
                    transition: background 0.2s ease;
                  }
                  .modern-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: rgba(156, 163, 175, 0.3);
                  }
                  .modern-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(107, 114, 128, 0.5);
                  }
                  .dark .modern-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: rgba(156, 163, 175, 0.2);
                  }
                  .dark .modern-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(156, 163, 175, 0.4);
                  }
                `}</style>
                {notifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors ${notification.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-2 rounded-full ${notification.type === 'purchase' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
                          {notification.type === 'purchase' ? (
                            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#0E2250] dark:text-white mb-0.5">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-blue-200/70 mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-[#E35000] rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                    {index < notifications.length - 1 && (
                      <div className="border-b border-gray-100 dark:border-[#2A2A2A]"></div>
                    )}
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Merchant Avatar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onChangeView('profile');
              setIsMobileMenuOpen(false);
            }}
            className="rounded-full hover:bg-white/10 transition-colors w-10 h-10 flex items-center justify-center flex-shrink-0"
            aria-label="View Profile"
          >
            <User className="h-5 w-5 text-white" />
          </Button>
          {/* Hamburger Menu */}
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white hover:bg-white/10 ext-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-[35] backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Menu Panel */}
          <div className="lg:hidden fixed top-16 left-0 right-0 bottom-0 z-[36] bg-[#0E2250] dark:bg-[#0A0A0A] overflow-y-auto transition-colors duration-300">
            <NavContent isMobile={true} />
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 transition-all duration-300">
        {/* Desktop Header */}
        <Header 
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onNavigateToProfile={() => onChangeView('profile')}
          onLogout={onLogout}
          merchantName={merchantData.name}
          planName={merchantData.planName}
        />
        
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav (Alternative to Hamburger, usually specific for actions) */}
      {!isMobileMenuOpen && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0A0A0A] border-t border-gray-200 dark:border-[#2A2A2A] z-40 flex justify-around items-center py-2 px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.5)] transition-colors duration-300">
          {navItems.slice(0, 2).map((item) => {
             const isActive = currentView === item.id;
             return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={cn(
                  "flex flex-col items-center p-2 text-xs font-medium transition-colors flex-1",
                  isActive ? "text-[#0E2250] dark:text-white" : "text-gray-400 dark:text-blue-300/60"
                )}
              >
                <item.icon className={cn("w-5 h-5 mb-1", isActive ? "text-[#E35000]" : "text-gray-400 dark:text-blue-300/60")} />
                {item.label}
              </button>
             )
          })}
          
          {/* Scan button centered */}
          {(() => {
            const scanItem = navItems.find(item => item.id === 'scan');
            if (!scanItem) return null;
            return (
              <button
                key="scan"
                onClick={() => onChangeView('scan')}
                className="relative -top-6 bg-[#0E2250] dark:bg-gradient-to-br dark:from-[#E35000] dark:to-[#FF6B35] text-white p-4 rounded-full shadow-lg hover:scale-105 transition-all duration-300 border-4 border-[#F4F7F9] dark:border-[#0A0A0A] flex-shrink-0"
              >
                <scanItem.icon className="w-6 h-6" />
              </button>
            );
          })()}
          
          {navItems.filter(item => item.id !== 'scan').slice(2).map((item) => {
             const isActive = currentView === item.id;
             return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={cn(
                  "flex flex-col items-center p-2 text-xs font-medium transition-colors flex-1",
                  isActive ? "text-[#0E2250] dark:text-white" : "text-gray-400 dark:text-blue-300/60"
                )}
              >
                <item.icon className={cn("w-5 h-5 mb-1", isActive ? "text-[#E35000]" : "text-gray-400 dark:text-blue-300/60")} />
                {item.label}
              </button>
             )
          })}
        </div>
      )}
    </div>
  );
}