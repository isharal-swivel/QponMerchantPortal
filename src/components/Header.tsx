import React from 'react';
import { Moon, Sun, User, LogOut, Bell } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigateToProfile: () => void;
  onLogout?: () => void;
  merchantName: string;
  planName: string;
}

export function Header({ 
  isDarkMode, 
  onToggleDarkMode, 
  onNavigateToProfile,
  onLogout,
  merchantName,
  planName
}: HeaderProps) {
  const [unreadCount] = React.useState(3);
  
  // Sample notifications data - extended for scrolling
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
      title: 'New Coupon Purchase',
      message: 'Customer purchased "Dinner Deal" coupon',
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

  return (
    <header className="h-16 bg-white dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-[#2A2A2A] shadow-sm dark:shadow-lg sticky top-0 z-20 hidden lg:flex items-center justify-end px-6 gap-3 transition-colors duration-300">
      {/* Dark/Light Mode Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleDarkMode}
        className="rounded-full bg-gray-50 dark:bg-[#1C1C1C] hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors"
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5 text-gray-600 dark:text-yellow-300" />
        ) : (
          <Moon className="h-5 w-5 text-gray-600 dark:text-blue-300" />
        )}
      </Button>

      {/* Notifications Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-600 dark:text-blue-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E35000] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-md">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2A2A2A] dark:shadow-2xl p-0">
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

      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/10 rounded-lg px-3 py-2 transition-colors cursor-pointer border border-gray-200 dark:border-[#2A2A2A] dark:bg-[#141414]"
            aria-label="Profile menu"
          >
            <div className="bg-gradient-to-br from-[#E35000] to-[#FF8000] p-2 rounded-full shadow-md dark:shadow-lg">
              <User size={18} className="text-white" />
            </div>
            <div className="text-left hidden xl:block">
              <p className="text-sm font-semibold text-[#0E2250] dark:text-white truncate max-w-[150px]">
                {merchantName}
              </p>
              <p className="text-xs text-gray-500 dark:text-blue-200/70 truncate max-w-[150px]">
                {planName}
              </p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2A2A2A] dark:shadow-2xl">
          <DropdownMenuLabel>
            <div>
              <p className="font-semibold text-[#0E2250] dark:text-white">{merchantName}</p>
              <p className="text-xs text-gray-500 dark:text-blue-200/70 font-normal mt-0.5">{planName}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#2A2A2A]" />
          <DropdownMenuItem 
            onClick={onNavigateToProfile}
            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-blue-100"
          >
            <User className="mr-2 h-4 w-4" />
            <span>View Profile</span>
          </DropdownMenuItem>
          {onLogout && (
            <>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#2A2A2A]" />
              <DropdownMenuItem 
                onClick={onLogout}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-blue-100"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}