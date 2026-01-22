import React from 'react';
import { Users, CreditCard, Activity, Clock, CheckCircle2, Star, CalendarDays, TrendingUp, Zap, Calendar, Info, ShoppingCart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar } from 'recharts';
import { useTheme } from 'next-themes@0.4.6';

interface OverviewProps {
  onNavigate: (view: string) => void;
}

export function Overview({ onNavigate }: OverviewProps) {
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === 'dark' || resolvedTheme === 'dark';
  const [dateRange, setDateRange] = React.useState("last7days");
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
  const [selectedStartDate, setSelectedStartDate] = React.useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = React.useState<Date | null>(null);
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);
  const [activityPage, setActivityPage] = React.useState(1);
  const itemsPerPage = 7;
  const [mounted, setMounted] = React.useState(false);

  // Ensure component is mounted before rendering charts
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Get the actual date range based on preset or custom selection
  const getActualDateRange = (): { start: Date; end: Date } => {
    // Use Dec 29, 2024 as reference since that's when our demo data ends
    const now = new Date(2024, 11, 29); // December 29, 2024
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (dateRange === "custom" && selectedStartDate) {
      const start = new Date(selectedStartDate);
      const end = selectedEndDate ? new Date(selectedEndDate) : new Date(selectedStartDate);
      return { start, end };
    }

    let start = new Date(today);
    let end = new Date(today);

    switch (dateRange) {
      case "today":
        start = new Date(today);
        end = new Date(today);
        break;
      case "yesterday":
        start = new Date(today);
        start.setDate(start.getDate() - 1);
        end = new Date(start);
        break;
      case "thisweek":
        const dayOfWeek = today.getDay();
        start = new Date(today);
        start.setDate(start.getDate() - dayOfWeek);
        end = new Date(today);
        break;
      case "last7days":
        start = new Date(today);
        start.setDate(start.getDate() - 6);
        end = new Date(today);
        break;
      case "thismonth":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today);
        break;
      case "last3months":
        start = new Date(today);
        start.setMonth(start.getMonth() - 3);
        end = new Date(today);
        break;
      case "thisyear":
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today);
        break;
      default:
        start = new Date(today);
        start.setDate(start.getDate() - 6);
        end = new Date(today);
    }

    return { start, end };
  };

  // All earning data with dates for filtering - same as Analytics
  const allEarningData = [
    // December 2024 (Last 30 days)
    { date: "Dec 1", fullDate: new Date(2024, 11, 1), earnings: 10200 },
    { date: "Dec 2", fullDate: new Date(2024, 11, 2), earnings: 12700 },
    { date: "Dec 3", fullDate: new Date(2024, 11, 3), earnings: 15200 },
    { date: "Dec 4", fullDate: new Date(2024, 11, 4), earnings: 17800 },
    { date: "Dec 5", fullDate: new Date(2024, 11, 5), earnings: 22000 },
    { date: "Dec 6", fullDate: new Date(2024, 11, 6), earnings: 26200 },
    { date: "Dec 7", fullDate: new Date(2024, 11, 7), earnings: 23700 },
    { date: "Dec 8", fullDate: new Date(2024, 11, 8), earnings: 16900 },
    { date: "Dec 9", fullDate: new Date(2024, 11, 9), earnings: 14400 },
    { date: "Dec 10", fullDate: new Date(2024, 11, 10), earnings: 16100 },
    { date: "Dec 11", fullDate: new Date(2024, 11, 11), earnings: 19500 },
    { date: "Dec 12", fullDate: new Date(2024, 11, 12), earnings: 22900 },
    { date: "Dec 13", fullDate: new Date(2024, 11, 13), earnings: 28000 },
    { date: "Dec 14", fullDate: new Date(2024, 11, 14), earnings: 32200 },
    { date: "Dec 15", fullDate: new Date(2024, 11, 15), earnings: 25400 },
    { date: "Dec 16", fullDate: new Date(2024, 11, 16), earnings: 20300 },
    { date: "Dec 17", fullDate: new Date(2024, 11, 17), earnings: 17800 },
    { date: "Dec 18", fullDate: new Date(2024, 11, 18), earnings: 21200 },
    { date: "Dec 19", fullDate: new Date(2024, 11, 19), earnings: 24500 },
    { date: "Dec 20", fullDate: new Date(2024, 11, 20), earnings: 29600 },
    { date: "Dec 21", fullDate: new Date(2024, 11, 21), earnings: 34700 },
    { date: "Dec 22", fullDate: new Date(2024, 11, 22), earnings: 30500 },
    { date: "Dec 23", fullDate: new Date(2024, 11, 23), earnings: 23700 },
    { date: "Dec 24", fullDate: new Date(2024, 11, 24), earnings: 27100 },
    { date: "Dec 25", fullDate: new Date(2024, 11, 25), earnings: 33900 },
    { date: "Dec 26", fullDate: new Date(2024, 11, 26), earnings: 42400 },
    { date: "Dec 27", fullDate: new Date(2024, 11, 27), earnings: 46600 },
    { date: "Dec 28", fullDate: new Date(2024, 11, 28), earnings: 50800 },
    { date: "Dec 29", fullDate: new Date(2024, 11, 29), earnings: 44000 },
    // November
    { date: "Nov 1", fullDate: new Date(2024, 10, 1), earnings: 9300 },
    { date: "Nov 5", fullDate: new Date(2024, 10, 5), earnings: 21200 },
    { date: "Nov 10", fullDate: new Date(2024, 10, 10), earnings: 16100 },
    { date: "Nov 15", fullDate: new Date(2024, 10, 15), earnings: 17800 },
    { date: "Nov 20", fullDate: new Date(2024, 10, 20), earnings: 33000 },
    { date: "Nov 25", fullDate: new Date(2024, 10, 25), earnings: 30500 },
    { date: "Nov 30", fullDate: new Date(2024, 10, 30), earnings: 22000 },
    // October
    { date: "Oct 1", fullDate: new Date(2024, 9, 1), earnings: 8500 },
    { date: "Oct 5", fullDate: new Date(2024, 9, 5), earnings: 20300 },
    { date: "Oct 10", fullDate: new Date(2024, 9, 10), earnings: 16100 },
    { date: "Oct 15", fullDate: new Date(2024, 9, 15), earnings: 16900 },
    { date: "Oct 20", fullDate: new Date(2024, 9, 20), earnings: 32200 },
    { date: "Oct 25", fullDate: new Date(2024, 9, 25), earnings: 26200 },
    { date: "Oct 31", fullDate: new Date(2024, 9, 31), earnings: 24500 },
  ];

  // All deal details data
  const allDealDetailsData = [
    // December 2024
    { date: "Dec 1", fullDate: new Date(2024, 11, 1), purchased: 12, redeemed: 10 },
    { date: "Dec 2", fullDate: new Date(2024, 11, 2), purchased: 15, redeemed: 13 },
    { date: "Dec 3", fullDate: new Date(2024, 11, 3), purchased: 18, redeemed: 16 },
    { date: "Dec 4", fullDate: new Date(2024, 11, 4), purchased: 21, redeemed: 19 },
    { date: "Dec 5", fullDate: new Date(2024, 11, 5), purchased: 26, redeemed: 23 },
    { date: "Dec 6", fullDate: new Date(2024, 11, 6), purchased: 31, redeemed: 28 },
    { date: "Dec 7", fullDate: new Date(2024, 11, 7), purchased: 28, redeemed: 25 },
    { date: "Dec 8", fullDate: new Date(2024, 11, 8), purchased: 20, redeemed: 18 },
    { date: "Dec 9", fullDate: new Date(2024, 11, 9), purchased: 17, redeemed: 15 },
    { date: "Dec 10", fullDate: new Date(2024, 11, 10), purchased: 19, redeemed: 17 },
    { date: "Dec 11", fullDate: new Date(2024, 11, 11), purchased: 23, redeemed: 21 },
    { date: "Dec 12", fullDate: new Date(2024, 11, 12), purchased: 27, redeemed: 24 },
    { date: "Dec 13", fullDate: new Date(2024, 11, 13), purchased: 33, redeemed: 30 },
    { date: "Dec 14", fullDate: new Date(2024, 11, 14), purchased: 38, redeemed: 35 },
    { date: "Dec 15", fullDate: new Date(2024, 11, 15), purchased: 30, redeemed: 27 },
    { date: "Dec 16", fullDate: new Date(2024, 11, 16), purchased: 24, redeemed: 22 },
    { date: "Dec 17", fullDate: new Date(2024, 11, 17), purchased: 21, redeemed: 19 },
    { date: "Dec 18", fullDate: new Date(2024, 11, 18), purchased: 25, redeemed: 23 },
    { date: "Dec 19", fullDate: new Date(2024, 11, 19), purchased: 29, redeemed: 26 },
    { date: "Dec 20", fullDate: new Date(2024, 11, 20), purchased: 35, redeemed: 32 },
    { date: "Dec 21", fullDate: new Date(2024, 11, 21), purchased: 41, redeemed: 38 },
    { date: "Dec 22", fullDate: new Date(2024, 11, 22), purchased: 36, redeemed: 33 },
    { date: "Dec 23", fullDate: new Date(2024, 11, 23), purchased: 28, redeemed: 25 },
    { date: "Dec 24", fullDate: new Date(2024, 11, 24), purchased: 32, redeemed: 29 },
    { date: "Dec 25", fullDate: new Date(2024, 11, 25), purchased: 40, redeemed: 36 },
    { date: "Dec 26", fullDate: new Date(2024, 11, 26), purchased: 50, redeemed: 45 },
    { date: "Dec 27", fullDate: new Date(2024, 11, 27), purchased: 55, redeemed: 50 },
    { date: "Dec 28", fullDate: new Date(2024, 11, 28), purchased: 60, redeemed: 55 },
    { date: "Dec 29", fullDate: new Date(2024, 11, 29), purchased: 52, redeemed: 47 },
    // November
    { date: "Nov 1", fullDate: new Date(2024, 10, 1), purchased: 11, redeemed: 9 },
    { date: "Nov 5", fullDate: new Date(2024, 10, 5), purchased: 25, redeemed: 22 },
    { date: "Nov 10", fullDate: new Date(2024, 10, 10), purchased: 19, redeemed: 17 },
    { date: "Nov 15", fullDate: new Date(2024, 10, 15), purchased: 21, redeemed: 19 },
    { date: "Nov 20", fullDate: new Date(2024, 10, 20), purchased: 39, redeemed: 35 },
    { date: "Nov 25", fullDate: new Date(2024, 10, 25), purchased: 36, redeemed: 33 },
    { date: "Nov 30", fullDate: new Date(2024, 10, 30), purchased: 26, redeemed: 23 },
    // October
    { date: "Oct 1", fullDate: new Date(2024, 9, 1), purchased: 10, redeemed: 8 },
    { date: "Oct 5", fullDate: new Date(2024, 9, 5), purchased: 24, redeemed: 21 },
    { date: "Oct 10", fullDate: new Date(2024, 9, 10), purchased: 19, redeemed: 17 },
    { date: "Oct 15", fullDate: new Date(2024, 9, 15), purchased: 20, redeemed: 18 },
    { date: "Oct 20", fullDate: new Date(2024, 9, 20), purchased: 38, redeemed: 34 },
    { date: "Oct 25", fullDate: new Date(2024, 9, 25), purchased: 31, redeemed: 28 },
    { date: "Oct 31", fullDate: new Date(2024, 9, 31), purchased: 29, redeemed: 26 },
  ];

  // Filter data based on selected date range
  const { start: rangeStart, end: rangeEnd } = getActualDateRange();
  
  const earningData = React.useMemo(() => {
    return allEarningData.filter(item => {
      const itemDate = new Date(item.fullDate);
      return itemDate >= rangeStart && itemDate <= rangeEnd;
    });
  }, [dateRange, selectedStartDate, selectedEndDate]);

  const dealDetailsData = React.useMemo(() => {
    return allDealDetailsData.filter(item => {
      const itemDate = new Date(item.fullDate);
      return itemDate >= rangeStart && itemDate <= rangeEnd;
    });
  }, [dateRange, selectedStartDate, selectedEndDate]);

  // Calculate dynamic stats based on filtered data
  const totalEarnings = React.useMemo(() => {
    const sum = earningData.reduce((acc, item) => acc + item.earnings, 0);
    return `LKR ${sum.toLocaleString()}`;
  }, [earningData]);

  const totalRedemptions = React.useMemo(() => {
    const sum = dealDetailsData.reduce((acc, item) => acc + item.redeemed, 0);
    return sum.toString();
  }, [dealDetailsData]);

  const totalSoldCoupons = React.useMemo(() => {
    const sum = dealDetailsData.reduce((acc, item) => acc + item.purchased, 0);
    return sum.toString();
  }, [dealDetailsData]);

  // Format date range display
  const getDateRangeDisplay = () => {
    if (dateRange === 'custom' && selectedStartDate) {
      const formatDate = (date: Date) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
      };
      
      if (selectedEndDate) {
        return `${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`;
      }
      return formatDate(selectedStartDate);
    }
    return dateRange === 'today' ? 'Today' :
           dateRange === 'yesterday' ? 'Yesterday' :
           dateRange === 'thisweek' ? 'This Week' :
           dateRange === 'last7days' ? 'Last 7 Days' :
           dateRange === 'thismonth' ? 'This Month' :
           dateRange === 'last3months' ? 'Last 3 Months' :
           dateRange === 'thisyear' ? 'This Year' :
           dateRange === 'custom' ? 'Custom Range' : 'Last 7 Days';
  };

  const handlePresetSelect = (preset: string) => {
    setDateRange(preset);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setShowDatePicker(false);
  };

  // Calendar helper functions
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isInRange = (date: Date) => {
    if (!selectedStartDate) return false;
    const endDate = hoverDate && !selectedEndDate ? hoverDate : selectedEndDate;
    if (!endDate) return false;
    
    const start = selectedStartDate < endDate ? selectedStartDate : endDate;
    const end = selectedStartDate < endDate ? endDate : selectedStartDate;
    
    return date >= start && date <= end;
  };

  const isRangeStart = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return isSameDay(date, selectedStartDate);
    return isSameDay(date, selectedStartDate) || isSameDay(date, selectedEndDate);
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(selectedDate);
      setSelectedEndDate(null);
      setDateRange('custom');
    } else {
      if (selectedDate < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(selectedDate);
      } else {
        setSelectedEndDate(selectedDate);
      }
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className=""></div>);
    }

    // Add day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isSelected = isRangeStart(date);
      const isInRangeDate = isInRange(date);
      const isToday = isSameDay(date, new Date());

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          onMouseEnter={() => setHoverDate(date)}
          onMouseLeave={() => setHoverDate(null)}
          className={`h-7 text-xs transition-colors relative ${
            isSelected 
              ? 'bg-[#E35000] text-white font-semibold rounded-md z-10' 
              : isInRangeDate
              ? 'bg-orange-50 dark:bg-orange-900/30 text-[#E35000] dark:text-orange-300'
              : isToday
              ? 'font-semibold text-[#E35000] dark:text-orange-400'
              : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200'
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}
            className="p-0.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-200" />
          </button>
          
          <div className="flex items-center gap-2">
            <select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(Number(e.target.value))}
              className="text-xs font-medium text-gray-700 dark:text-white bg-transparent border-none focus:outline-none cursor-pointer transition-colors duration-300"
            >
              {months.map((month, idx) => (
                <option key={idx} value={idx}>{month}</option>
              ))}
            </select>
            
            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
              className="text-xs font-medium text-gray-700 dark:text-white bg-transparent border-none focus:outline-none cursor-pointer transition-colors duration-300"
            >
              {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}
            className="p-0.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-200" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {dayNames.map((day, index) => (
            <div key={index} className="text-center text-[10px] font-medium text-gray-400 dark:text-blue-300/60 py-1 transition-colors duration-300">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-0.5">
          {days}
        </div>

        {selectedStartDate && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-[#2A2A2A] transition-colors duration-300">
            <p className="text-[10px] text-gray-600 dark:text-gray-300 transition-colors duration-300">
              <span className="font-medium">Selected: </span>
              {selectedStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {selectedEndDate && ` - ${selectedEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Format date for tooltip
  const formatTooltipDate = (fullDate: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[fullDate.getMonth()];
    const day = fullDate.getDate();
    const year = fullDate.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const stats = [
    {
      title: "Total Earnings",
      tooltip: "Total earned from all redeemed deals in the selected date period (deal price minus discount).",
      value: totalEarnings,
      change: "+12.5%",
      trend: "up",
      icon: CreditCard,
      color: "text-blue-600",
      bg: "bg-gradient-to-br from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      borderColor: "border-l-blue-500"
    },
    {
      title: "Active Deals",
      tooltip: "Number of deals that are live and available for customers in the selected date period.",
      value: "12",
      change: "+2",
      trend: "up",
      icon: Activity,
      color: "text-[#E35000]",
      bg: "bg-gradient-to-br from-[#E35000] to-[#FF6B35]",
      bgLight: "bg-orange-50",
      borderColor: "border-l-orange-500"
    },
    {
      title: "Redemptions",
      tooltip: "Total coupon redemptions made by customers in the selected date period.",
      value: totalRedemptions,
      change: "+18%",
      trend: "up",
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      bgLight: "bg-emerald-50",
      borderColor: "border-l-emerald-500"
    },
    {
      title: "Sold Coupons",
      tooltip: "Total coupons purchased by customers in the selected date period.",
      value: totalSoldCoupons,
      change: "Active",
      trend: "neutral",
      icon: ShoppingCart,
      color: "text-yellow-600",
      bg: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      bgLight: "bg-yellow-50",
      borderColor: "border-l-yellow-500"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Coupon redeemed",
      detail: "Luxury Spa Day Package",
      time: "2 mins ago",
      amount: "+ LKR 8,500",
      status: "success"
    },
    {
      id: 2,
      action: "Coupon redeemed",
      detail: "Seafood Platter for Two",
      time: "15 mins ago",
      amount: "+ LKR 5,200",
      status: "success"
    },
    {
      id: 3,
      action: "New Deal Published",
      detail: "Weekend Getaway Special",
      time: "2 hours ago",
      amount: "",
      status: "info"
    },
    {
      id: 4,
      action: "Deal Updated",
      detail: "Happy Hour Cocktails",
      time: "3 hours ago",
      amount: "",
      status: "info"
    },
    {
      id: 5,
      action: "Coupon redeemed",
      detail: "Afternoon Tea Set",
      time: "5 hours ago",
      amount: "+ LKR 3,800",
      status: "success"
    },
    {
      id: 6,
      action: "Coupon redeemed",
      detail: "Breakfast Buffet",
      time: "6 hours ago",
      amount: "+ LKR 4,200",
      status: "success"
    },
    {
      id: 7,
      action: "Coupon redeemed",
      detail: "Couple's Massage Session",
      time: "8 hours ago",
      amount: "+ LKR 9,500",
      status: "success"
    },
    {
      id: 8,
      action: "New Deal Published",
      detail: "Sunset Dinner Cruise",
      time: "10 hours ago",
      amount: "",
      status: "info"
    },
    {
      id: 9,
      action: "Deal Updated",
      detail: "Wine & Cheese Tasting",
      time: "12 hours ago",
      amount: "",
      status: "info"
    },
    {
      id: 10,
      action: "Coupon redeemed",
      detail: "Premium Coffee & Pastry",
      time: "14 hours ago",
      amount: "+ LKR 1,800",
      status: "success"
    },
    {
      id: 11,
      action: "Coupon redeemed",
      detail: "Gym Day Pass",
      time: "16 hours ago",
      amount: "+ LKR 2,500",
      status: "success"
    },
    {
      id: 12,
      action: "Coupon redeemed",
      detail: "Italian Dinner for Two",
      time: "18 hours ago",
      amount: "+ LKR 6,800",
      status: "success"
    },
    {
      id: 13,
      action: "New Deal Published",
      detail: "Yoga Retreat Package",
      time: "20 hours ago",
      amount: "",
      status: "info"
    },
    {
      id: 14,
      action: "Coupon redeemed",
      detail: "Weekend Brunch Special",
      time: "22 hours ago",
      amount: "+ LKR 4,900",
      status: "success"
    },
    {
      id: 15,
      action: "Deal Updated",
      detail: "Pool Bar Happy Hour",
      time: "1 day ago",
      amount: "",
      status: "info"
    },
    {
      id: 16,
      action: "Coupon redeemed",
      detail: "Sushi Platter",
      time: "1 day ago",
      amount: "+ LKR 7,200",
      status: "success"
    },
    {
      id: 17,
      action: "Coupon redeemed",
      detail: "Rooftop BBQ Night",
      time: "1 day ago",
      amount: "+ LKR 8,900",
      status: "success"
    },
    {
      id: 18,
      action: "New Deal Published",
      detail: "Monday Madness - 50% Off",
      time: "2 days ago",
      amount: "",
      status: "info"
    },
    {
      id: 19,
      action: "Coupon redeemed",
      detail: "Kids Play Area Pass",
      time: "2 days ago",
      amount: "+ LKR 1,500",
      status: "success"
    },
    {
      id: 20,
      action: "Coupon redeemed",
      detail: "Afternoon High Tea",
      time: "2 days ago",
      amount: "+ LKR 3,200",
      status: "success"
    },
    {
      id: 21,
      action: "Coupon redeemed",
      detail: "Cocktail Masterclass",
      time: "3 days ago",
      amount: "+ LKR 5,500",
      status: "success"
    },
    {
      id: 22,
      action: "New Deal Published",
      detail: "Beach Volleyball Tournament",
      time: "3 days ago",
      amount: "",
      status: "info"
    },
    {
      id: 23,
      action: "Deal Updated",
      detail: "Spa Package - Deluxe",
      time: "3 days ago",
      amount: "",
      status: "info"
    },
    {
      id: 24,
      action: "Coupon redeemed",
      detail: "Sunday Brunch Buffet",
      time: "4 days ago",
      amount: "+ LKR 12,500",
      status: "success"
    },
    {
      id: 25,
      action: "Coupon redeemed",
      detail: "Live Music Night",
      time: "4 days ago",
      amount: "+ LKR 3,000",
      status: "success"
    },
    {
      id: 26,
      action: "Coupon redeemed",
      detail: "BBQ Grill Platter",
      time: "5 days ago",
      amount: "+ LKR 6,700",
      status: "success"
    },
    {
      id: 27,
      action: "New Deal Published",
      detail: "Family Fun Day Package",
      time: "5 days ago",
      amount: "",
      status: "info"
    },
    {
      id: 28,
      action: "Coupon redeemed",
      detail: "Thai Cuisine Special",
      time: "5 days ago",
      amount: "+ LKR 5,400",
      status: "success"
    },
    {
      id: 29,
      action: "Deal Updated",
      detail: "Sunset Rooftop Dinner",
      time: "6 days ago",
      amount: "",
      status: "info"
    },
    {
      id: 30,
      action: "Coupon redeemed",
      detail: "Signature Mocktail Set",
      time: "6 days ago",
      amount: "+ LKR 2,800",
      status: "success"
    },
    {
      id: 31,
      action: "Coupon redeemed",
      detail: "Continental Breakfast Deluxe",
      time: "6 days ago",
      amount: "+ LKR 4,100",
      status: "success"
    },
    {
      id: 32,
      action: "New Deal Published",
      detail: "Mid-Week Escape - Hotel Stay",
      time: "7 days ago",
      amount: "",
      status: "info"
    }
  ];

  // Pagination calculations
  const totalPages = Math.ceil(recentActivity.length / itemsPerPage);
  const paginatedActivity = recentActivity.slice(
    (activityPage - 1) * itemsPerPage,
    activityPage * itemsPerPage
  );

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">Dashboard Overview</h2>
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Welcome back, Cinnamon Grand Colombo</p>
        </div>
        <div className="flex gap-3 items-center relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-[#2A2A2A] rounded-lg hover:bg-gray-50 dark:hover:bg-[#141414] transition-colors duration-300"
          >
            <CalendarDays className="w-4 h-4 text-gray-500 dark:text-gray-200" />
            <span className="text-sm text-gray-700 dark:text-white transition-colors duration-300">{getDateRangeDisplay()}</span>
            <ChevronRight className={`w-4 h-4 text-gray-400 dark:text-blue-300 transition-all duration-300 ${showDatePicker ? 'rotate-90' : ''}`} />
          </button>

          {/* Custom Date Picker Dropdown */}
          {showDatePicker && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowDatePicker(false)}
              />
              <div className="fixed md:absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-full md:right-0 md:left-auto md:translate-x-0 md:translate-y-0 md:mt-2 bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C] rounded-lg shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-gray-200 dark:border-[#2A2A2A] overflow-hidden z-50 flex w-[95vw] max-w-[420px] md:w-[420px] transition-colors duration-300">
                {/* Left Sidebar with Presets */}
                <div className="w-32 bg-gray-50 dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-[#2A2A2A] p-1.5 transition-colors duration-300">
                  {[
                    { label: 'Today', value: 'today' },
                    { label: 'Yesterday', value: 'yesterday' },
                    { label: 'This Week', value: 'thisweek' },
                    { label: 'Last 7 Days', value: 'last7days' },
                    { label: 'This Month', value: 'thismonth' },
                    { label: 'Last 3 Months', value: 'last3months' },
                    { label: 'This Year', value: 'thisyear' },
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => handlePresetSelect(preset.value)}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                        dateRange === preset.value && !selectedStartDate
                          ? 'bg-[#E35000] text-white font-medium'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Right Calendar Area */}
                <div className="flex-1">
                  {renderCalendar()}
                  <div className="flex gap-2 px-3 pb-3">
                    <Button 
                      className="flex-1 bg-gray-100 dark:bg-[#1C1C1C] hover:bg-gray-200 dark:hover:bg-[#141414] text-gray-700 dark:text-gray-200 border-none text-xs py-1.5 transition-colors duration-300" 
                      onClick={() => {
                        setSelectedStartDate(null);
                        setSelectedEndDate(null);
                        setShowDatePicker(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 bg-[#E35000] hover:bg-[#c44500] text-white border-none text-xs py-1.5" 
                      onClick={() => {
                        if (selectedStartDate) {
                          setDateRange('custom');
                          setShowDatePicker(false);
                        }
                      }}
                      disabled={!selectedStartDate}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className={`border-none shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 overflow-hidden relative group border-l-4 ${stat.borderColor} bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]`}>
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgLight} dark:bg-transparent rounded-full blur-3xl opacity-30 -mr-16 -mt-16 group-hover:opacity-50 transition-opacity`} />
            <CardContent className="p-5 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-semibold">{stat.change}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-blue-300/70 uppercase tracking-wide transition-colors duration-300">{stat.title}</p>
                  <div className="group/tooltip relative">
                    <Info className="w-3.5 h-3.5 text-gray-400 dark:text-blue-300/50 cursor-help transition-colors duration-300" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-56 z-50">
                      <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-gray-700">
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45"></div>
                        {stat.tooltip}
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid - Side by Side */}
      <div className={`grid grid-cols-1 gap-6 ${dateRange === 'last3months' || dateRange === 'thisyear' ? '' : 'lg:grid-cols-2'}`}>
        {/* Earning Trend Chart */}
        <Card className="border-none shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 overflow-hidden bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
          <CardHeader className="border-b border-gray-100 dark:border-[#2A2A2A] bg-gradient-to-r from-gray-50 to-white dark:from-[#0A0A0A] dark:to-[#141414] transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <CardTitle className="text-[#0E2250] dark:text-white text-[18px] transition-colors duration-300">Earning Trends</CardTitle>
                  <div className="group/tooltip relative">
                    <Info className="w-3.5 h-3.5 text-gray-400 dark:text-blue-300/50 cursor-help transition-colors duration-300" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/tooltip:block w-56 z-50 pointer-events-none">
                      <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-gray-700">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45"></div>
                        Shows total earnings in the selected date period.
                      </div>
                    </div>
                  </div>
                </div>
            
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="w-full h-[200px] sm:h-[240px] lg:h-[280px]" style={{ width: '100%', height: '200px', minHeight: '200px', minWidth: 0 }}>
              {mounted && (
              <ResponsiveContainer width="100%" height={200} minWidth={0} minHeight={200} key={`earnings-${isDark}`}>
                <AreaChart data={earningData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E35000" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#E35000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip 
                    wrapperStyle={{ outline: 'none' }}
                    contentStyle={{
                      backgroundColor: isDark ? '#141414' : '#fff',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                      borderRadius: '8px',
                      boxShadow: isDark ? '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      fontSize: '12px'
                    }}
                    labelStyle={{
                      color: isDark ? '#fff' : '#000',
                      fontWeight: 'bold'
                    }}
                    itemStyle={{
                      color: isDark ? '#fff' : '#000'
                    }}
                    cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }}
                    labelFormatter={(label: string, payload: any) => {
                      if (payload && payload[0] && payload[0].payload.fullDate) {
                        return formatTooltipDate(payload[0].payload.fullDate);
                      }
                      return label;
                    }}
                    formatter={(value: number) => [`LKR ${value.toLocaleString()}`, 'Earnings']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#E35000" 
                    strokeWidth={2}
                    fill="url(#colorEarnings)"
                    dot={{ fill: '#E35000', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, fill: '#E35000', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Deal Details Chart */}
        <Card className="border-none shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 overflow-hidden bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
          <CardHeader className="border-b border-gray-100 dark:border-[#2A2A2A] bg-gradient-to-r from-gray-50 to-white dark:from-[#0A0A0A] dark:to-[#141414] transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <CardTitle className="text-[#0E2250] dark:text-white transition-colors duration-300">Deal Details</CardTitle>
                  <div className="group/tooltip relative">
                    <Info className="w-3.5 h-3.5 text-gray-400 dark:text-blue-300/50 cursor-help transition-colors duration-300" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/tooltip:block w-64 z-50">
                      <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-gray-700">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45"></div>
                        Shows the number of sold and redeemed coupons in the selected date period.
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm" />
                  <span className="text-[10px] text-gray-600 dark:text-gray-400 transition-colors duration-300">Sold</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-[#E35000] rounded-sm" />
                  <span className="text-[10px] text-gray-600 dark:text-gray-400 transition-colors duration-300">Redeemed</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="w-full h-[200px] sm:h-[240px] lg:h-[280px]" style={{ width: '100%', height: '200px', minHeight: '200px', minWidth: 0 }}>
              {mounted && (
              <ResponsiveContainer width="100%" height={200} minWidth={0} minHeight={200} key={`deal-details-${isDark}`}>
                <BarChart data={dealDetailsData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorPurchased" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E35000" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#FF6B35" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="colorRedeemed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6BB6FF" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip 
                    wrapperStyle={{ outline: 'none' }}
                    contentStyle={{
                      backgroundColor: isDark ? '#141414' : '#fff',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                      borderRadius: '8px',
                      boxShadow: isDark ? '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      fontSize: '12px'
                    }}
                    labelStyle={{
                      color: isDark ? '#fff' : '#000',
                      fontWeight: 'bold'
                    }}
                    itemStyle={{
                      color: isDark ? '#fff' : '#000'
                    }}
                    cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }}
                    labelFormatter={(label: string, payload: any) => {
                      if (payload && payload[0] && payload[0].payload.fullDate) {
                        return formatTooltipDate(payload[0].payload.fullDate);
                      }
                      return label;
                    }}
                    formatter={(value: number, name: string) => {
                      const label = name === 'purchased' ? 'Sold' : name === 'redeemed' ? 'Redeemed' : name;
                      return [value, label];
                    }}
                  />
                  <Bar 
                    dataKey="purchased" 
                    fill="url(#colorPurchased)" 
                    radius={[6, 6, 0, 0]}
                    maxBarSize={30}
                  />
                  <Bar 
                    dataKey="redeemed" 
                    fill="url(#colorRedeemed)" 
                    radius={[6, 6, 0, 0]}
                    maxBarSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-none shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
          <CardHeader>
            <div className="flex items-center gap-1.5">
              <CardTitle className="text-[#0E2250] dark:text-white transition-colors duration-300">Recent Activity</CardTitle>
              <div className="group/tooltip relative">
                <Info className="w-3.5 h-3.5 text-gray-400 dark:text-blue-300/50 cursor-help transition-colors duration-300" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/tooltip:block w-64 z-50">
                  <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-gray-700">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45"></div>
                    Real-time log of all deal activities including redemptions, publications, and updates across your merchant account.
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paginatedActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-3 border-b border-gray-50 dark:border-[#2A2A2A] last:border-0 pb-4 last:pb-0 transition-colors duration-300">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${item.status === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-blue-50 dark:bg-blue-900/30'} transition-colors duration-300`}>
                    {item.status === 'success' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#0E2250] dark:text-white text-xs text-[14px] transition-colors duration-300">{item.action}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate text-[14px] transition-colors duration-300">{item.detail}</p>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-[10px] text-gray-400 dark:text-blue-300/60 whitespace-nowrap transition-colors duration-300">{item.time}</span>
                    {item.amount && (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap mt-0.5">{item.amount}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-[#2A2A2A] transition-colors duration-300">
                <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Page {activityPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    className="bg-gray-100 dark:bg-[#1C1C1C] hover:bg-gray-200 dark:hover:bg-[#141414] text-gray-700 dark:text-gray-200 border-none text-xs py-1.5 px-3 transition-colors duration-300"
                    onClick={() => setActivityPage(activityPage - 1)}
                    disabled={activityPage === 1}
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </Button>
                  <Button
                    className="bg-gray-100 dark:bg-[#1C1C1C] hover:bg-gray-200 dark:hover:bg-[#141414] text-gray-700 dark:text-gray-200 border-none text-xs py-1.5 px-3 transition-colors duration-300"
                    onClick={() => setActivityPage(activityPage + 1)}
                    disabled={activityPage >= totalPages}
                  >
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column: Quick Actions + Top Performing Deals */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-none shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
            <CardHeader>
              <CardTitle className="text-[#0E2250] dark:text-white transition-colors duration-300">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button
                  onClick={() => onNavigate('create')}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-[#E35000] hover:bg-[#c44500] text-white rounded-lg transition-all text-sm"
                >
                  <Zap className="w-4 h-4" />
                  <span>Create Deal</span>
                </button>

                <button
                  onClick={() => onNavigate('my-deals')}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#1C1C1C] hover:bg-gray-50 dark:hover:bg-[#141414] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#2A2A2A] rounded-lg transition-all text-sm duration-300"
                >
                  <Activity className="w-4 h-4" />
                  <span>Manage Deals</span>
                </button>

                <button
                  onClick={() => onNavigate('analytics')}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#1C1C1C] hover:bg-gray-50 dark:hover:bg-[#141414] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#2A2A2A] rounded-lg transition-all text-sm duration-300"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>View Analytics</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Deals */}
          <Card className="border-none shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
            <CardHeader>
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-[#0E2250] dark:text-white transition-colors duration-300">Top Performing Deals</CardTitle>
                <div className="group/tooltip relative">
                  <Info className="w-3.5 h-3.5 text-gray-400 dark:text-blue-300/50 cursor-help transition-colors duration-300" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/tooltip:block w-64 z-50">
                    <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-gray-700">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45"></div>
                      Ranked by total revenue generated from redemptions in the selected date period. Shows your most profitable deals.
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Deal 1 */}
                <div className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 dark:border-[#2A2A2A] hover:border-[#E35000] hover:bg-orange-50/30 dark:hover:bg-white/5 transition-all duration-300">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 text-white font-bold text-xs shadow-md">
                    1
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#0E2250] dark:text-white text-xs truncate text-[14px] transition-colors duration-300">Weekend Brunch Special</h4>
                    <p className="text-[12px] text-gray-500 dark:text-gray-400 transition-colors duration-300">Dining</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">145K</p>
                    <p className="text-[10px] text-gray-500 dark:text-blue-300/60 transition-colors duration-300">87 redeem</p>
                  </div>
                </div>

                {/* Deal 2 */}
                <div className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 dark:border-[#2A2A2A] hover:border-[#E35000] hover:bg-orange-50/30 dark:hover:bg-white/5 transition-all duration-300">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 text-white font-bold text-xs shadow-md">
                    2
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#0E2250] dark:text-white text-xs truncate text-[14px] transition-colors duration-300">Happy Hour Cocktails</h4>
                    <p className="text-[12px] text-gray-500 dark:text-gray-400 transition-colors duration-300">Bar</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">98K</p>
                    <p className="text-[10px] text-gray-500 dark:text-blue-300/60 transition-colors duration-300">125 redeem</p>
                  </div>
                </div>

                {/* Deal 3 */}
                <div className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 dark:border-[#2A2A2A] hover:border-[#E35000] hover:bg-orange-50/30 dark:hover:bg-white/5 transition-all duration-300">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-orange-300 to-orange-400 text-white font-bold text-xs shadow-md">
                    3
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#0E2250] dark:text-white text-xs truncate text-[14px] transition-colors duration-300">Afternoon Tea Set</h4>
                    <p className="text-[12px] text-gray-500 dark:text-gray-400 transition-colors duration-300">Cafe</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">76K</p>
                    <p className="text-[10px] text-gray-500 dark:text-blue-300/60 transition-colors duration-300">96 redeem</p>
                  </div>
                </div>

                {/* Deal 4 */}
                <div className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 dark:border-[#2A2A2A] hover:border-[#E35000] hover:bg-orange-50/30 dark:hover:bg-white/5 transition-all duration-300">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 font-bold text-xs shadow-sm">
                    4
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#0E2250] dark:text-white text-xs truncate text-[14px] transition-colors duration-300">Seafood Platter for Two</h4>
                    <p className="text-[12px] text-gray-500 dark:text-gray-400 transition-colors duration-300">Dining</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">62K</p>
                    <p className="text-[10px] text-gray-500 dark:text-blue-300/60 transition-colors duration-300">45 redeem</p>
                  </div>
                </div>

               
                
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}