import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Calendar,
  Search,
  ChevronLeft,
  Tag,
  RotateCcw,
  MoreHorizontal,
  Smartphone,
  CalendarDays,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { useTheme } from "next-themes@0.4.6";

interface Deal {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  category: string;
  promoType: string;
  status: string;
  dealOfTheDayDate: string | null;
  expiry: string;
  originalPrice: number;
  deductionType: "percentage" | "amount";
  deductionValue: number;
  sold: number;
  revenue: number;
}

interface DealsOfTheDayProps {
  deals: Deal[];
  onBack: () => void;
}

export function DealsOfTheDay({ deals, onBack }: DealsOfTheDayProps) {
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === "dark" || resolvedTheme === "dark";

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [promoFilter, setPromoFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [dropdownAlign, setDropdownAlign] = useState<"left" | "right">("left");
  const datePickerButtonRef = useRef<HTMLButtonElement>(null);

  // Set New Deals popup
  const [setNewDealsOpen, setSetNewDealsOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleSearchQuery, setScheduleSearchQuery] = useState("");
  const [selectedDealsForSchedule, setSelectedDealsForSchedule] = useState<string[]>([]);
  const [schedulePurchaseFilter, setSchedulePurchaseFilter] = useState("all");

  // Filter deals that are marked as Deal of the Day
  const dealOfTheDayDeals = deals.filter((deal) => deal.dealOfTheDayDate);

  // Get available deals for scheduling (active deals not already scheduled)
  const availableDealsForSchedule = useMemo(() => {
    let filtered = deals.filter((deal) => deal.status === "Active");

    if (scheduleSearchQuery) {
      filtered = filtered.filter((deal) =>
        deal.title.toLowerCase().includes(scheduleSearchQuery.toLowerCase())
      );
    }

    // Filter by purchase status
    if (schedulePurchaseFilter === "high") {
      filtered = filtered.filter((deal) => deal.sold > 50);
    } else if (schedulePurchaseFilter === "medium") {
      filtered = filtered.filter((deal) => deal.sold >= 20 && deal.sold <= 50);
    } else if (schedulePurchaseFilter === "low") {
      filtered = filtered.filter((deal) => deal.sold < 20);
    }

    return filtered;
  }, [deals, scheduleSearchQuery, schedulePurchaseFilter]);

  // Date range helper functions
  const getDateRangeDisplay = () => {
    if (dateRange === "custom" && selectedStartDate) {
      const formatDate = (date: Date) => {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
      };

      if (selectedEndDate) {
        return `${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`;
      }
      return formatDate(selectedStartDate);
    }
    return dateRange === "today"
      ? "Today"
      : dateRange === "tomorrow"
        ? "Tomorrow"
        : dateRange === "next7days"
          ? "Next 7 Days"
          : dateRange === "next14days"
            ? "Next 14 Days"
            : dateRange === "nextmonth"
              ? "Next Month"
              : dateRange === "custom"
                ? "Custom Range"
                : "All Upcoming";
  };

  const handlePresetSelect = (preset: string) => {
    setDateRange(preset);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setShowDatePicker(false);
  };

  // Check dropdown position when opening
  useEffect(() => {
    if (showDatePicker && datePickerButtonRef.current) {
      const buttonRect =
        datePickerButtonRef.current.getBoundingClientRect();
      const dropdownWidth = 420;
      const viewportWidth = window.innerWidth;
      const spaceOnRight = viewportWidth - buttonRect.left;

      // If there's not enough space on the right, align to the right
      if (spaceOnRight < dropdownWidth + 16) {
        setDropdownAlign("right");
      } else {
        setDropdownAlign("left");
      }
    }
  }, [showDatePicker]);

  // Calendar helper functions
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isInRange = (date: Date) => {
    if (!selectedStartDate) return false;
    const endDate =
      hoverDate && !selectedEndDate
        ? hoverDate
        : selectedEndDate;
    if (!endDate) return false;

    const start =
      selectedStartDate < endDate ? selectedStartDate : endDate;
    const end =
      selectedStartDate < endDate ? endDate : selectedStartDate;

    return date >= start && date <= end;
  };

  const isRangeStart = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate)
      return isSameDay(date, selectedStartDate);
    return (
      isSameDay(date, selectedStartDate) ||
      isSameDay(date, selectedEndDate)
    );
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(
      currentYear,
      currentMonth,
      day,
    );

    if (
      !selectedStartDate ||
      (selectedStartDate && selectedEndDate)
    ) {
      setSelectedStartDate(selectedDate);
      setSelectedEndDate(null);
      setDateRange("custom");
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
    const daysInMonth = getDaysInMonth(
      currentMonth,
      currentYear,
    );
    const firstDay = getFirstDayOfMonth(
      currentMonth,
      currentYear,
    );
    const days = [];
    const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

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
              ? "bg-[#E35000] text-white font-semibold rounded-md z-10"
              : isInRangeDate
                ? "bg-orange-50 dark:bg-orange-900/30 text-[#E35000] dark:text-orange-300"
                : isToday
                  ? "font-semibold text-[#E35000] dark:text-orange-400"
                  : "hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200"
          }`}
        >
          {day}
        </button>,
      );
    }

    return (
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
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
              onChange={(e) => {
                e.stopPropagation();
                setCurrentMonth(Number(e.target.value));
              }}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-medium text-gray-700 dark:text-white bg-transparent border-none focus:outline-none cursor-pointer transition-colors duration-300"
            >
              {months.map((month, idx) => (
                <option key={idx} value={idx}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={currentYear}
              onChange={(e) => {
                e.stopPropagation();
                setCurrentYear(Number(e.target.value));
              }}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-medium text-gray-700 dark:text-white bg-transparent border-none focus:outline-none cursor-pointer transition-colors duration-300"
            >
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
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

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((name, idx) => (
            <div
              key={idx}
              className="text-[10px] text-center font-medium text-gray-500 dark:text-gray-400"
            >
              {name}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  // Apply filters
  const filteredDeals = useMemo(() => {
    let filtered = [...dealOfTheDayDeals];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (deal) =>
          deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.promoType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((deal) => deal.category === categoryFilter);
    }

    // Promo type filter
    if (promoFilter !== "all") {
      filtered = filtered.filter((deal) => deal.promoType === promoFilter);
    }

    // Date range filter
    if (dateRange !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filtered = filtered.filter((deal) => {
        if (!deal.dealOfTheDayDate) return false;
        const dealDate = new Date(deal.dealOfTheDayDate);
        dealDate.setHours(0, 0, 0, 0);

        if (dateRange === "today") {
          return dealDate.getTime() === today.getTime();
        } else if (dateRange === "next7days") {
          const next7Days = new Date(today);
          next7Days.setDate(today.getDate() + 7);
          return dealDate >= today && dealDate <= next7Days;
        } else if (dateRange === "nextmonth") {
          const nextMonth = new Date(today);
          nextMonth.setMonth(today.getMonth() + 1);
          return dealDate >= today && dealDate <= nextMonth;
        }
        return true;
      });
    }

    return filtered;
  }, [dealOfTheDayDeals, searchQuery, categoryFilter, promoFilter, dateRange]);

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setPromoFilter("all");
    setDateRange("all");
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="flex-shrink-0 -ml-2"
          >
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">
              Deals of the Day
            </h2>
            <p className="text-gray-500 dark:text-blue-200/70 transition-colors duration-300">
              View and manage your featured daily deals.
            </p>
          </div>
        </div>
        <Button
          onClick={() => setSetNewDealsOpen(true)}
          className="bg-[#E35000] hover:bg-[#c44500] text-white transition-colors duration-300 flex items-center gap-2"
        >
          <Plus size={18} />
          Set New Deals of the Day
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search by title, category, or promo type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {/* Filters */}
      <Card className="p-4 border-none shadow-sm bg-white dark:bg-[#1A2F5A]/20 transition-colors duration-300">
        <div className="flex flex-col lg:flex-row gap-4 items-end lg:items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 w-full">
            <div className="space-y-2">
              <Label className="text-xs">Category</Label>
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Categories
                  </SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="dining">Dining</SelectItem>
                  <SelectItem value="cafe">Cafe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 bg-[rgba(133,109,109,0)]">
              <Label className="text-xs">Promo Type</Label>
              <Select
                value={promoFilter}
                onValueChange={setPromoFilter}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Promo Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="discount">
                    Discount
                  </SelectItem>
                  <SelectItem value="bogo">
                    Buy 1 Get 1
                  </SelectItem>
                  <SelectItem value="bundle">Bundle</SelectItem>
                  <SelectItem value="flash">
                    Flash Sale
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-1 sm:col-span-2 lg:col-span-1">
              <Label className="text-xs">Date Range</Label>
              <div className="relative">
                <button
                  ref={datePickerButtonRef}
                  onClick={() =>
                    setShowDatePicker(!showDatePicker)
                  }
                  className="flex items-center justify-between gap-2 px-3 w-full h-9 bg-[rgb(245,245,245)] dark:bg-[#1C1C1C] border border-input dark:border-[#2A2A2A] rounded-md hover:bg-gray-50 dark:hover:bg-[#141414] transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring duration-300"
                >
                  <CalendarDays className="w-4 h-4 text-gray-500 dark:text-gray-200 flex-shrink-0" />
                  <span className="text-sm truncate flex-1 text-left text-gray-900 dark:text-white">
                    {getDateRangeDisplay()}
                  </span>
                  <ChevronRight
                    className={`w-3 h-3 text-gray-400 dark:text-gray-400 transition-transform flex-shrink-0 ${showDatePicker ? "rotate-90" : ""}`}
                  />
                </button>

                {/* Custom Date Picker Dropdown */}
                {showDatePicker && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowDatePicker(false)}
                    />
                    <div
                      className={`absolute top-full mt-2 bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C] rounded-lg shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-gray-200 dark:border-[#2A2A2A] overflow-hidden z-50 flex max-h-[400px] transition-colors duration-300 ${dropdownAlign === "right" ? "right-0" : "left-0"}`}
                      style={{
                        width: "420px",
                        maxWidth: "calc(100vw - 32px)",
                      }}
                    >
                      {/* Left Sidebar with Presets */}
                      <div className="w-32 bg-gray-50 dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-[#2A2A2A] p-1.5 overflow-y-auto flex-shrink-0 transition-colors duration-300">
                        {[
                          { label: "Today", value: "today" },
                          {
                            label: "Tomorrow",
                            value: "tomorrow",
                          },
                          {
                            label: "Next 7 Days",
                            value: "next7days",
                          },
                          {
                            label: "Next 14 Days",
                            value: "next14days",
                          },
                          {
                            label: "Next Month",
                            value: "nextmonth",
                          },
                        ].map((preset) => (
                          <button
                            key={preset.value}
                            onClick={() =>
                              handlePresetSelect(preset.value)
                            }
                            className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                              dateRange === preset.value &&
                              !selectedStartDate
                                ? "bg-[#E35000] text-white font-medium"
                                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>

                      {/* Right Calendar Area */}
                      <div className="flex-1 overflow-y-auto">
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
                            className="flex-1 bg-[#E35000] hover:bg-[#c44500] text-white border-none text-xs py-1.5 transition-colors duration-300"
                            onClick={() => {
                              if (selectedStartDate) {
                                setDateRange("custom");
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
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            className="text-gray-500 dark:text-blue-200/70 hover:text-[#E35000] dark:hover:text-[#E35000] flex-shrink-0 transition-colors duration-300"
            title="Clear Filters"
          >
            <RotateCcw size={18} />
          </Button>
        </div>
      </Card>

      {/* Deals Grid - Same as MyDeals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        {filteredDeals.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#1A2F5A]/20 rounded-lg border border-dashed dark:border-[#1A2F5A] col-span-full transition-colors duration-300">
            <p className="text-gray-500 dark:text-blue-200/70 transition-colors duration-300">
              No deals found matching your filters.
            </p>
            <Button
              variant="link"
              onClick={clearFilters}
              className="text-[#E35000]"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          filteredDeals.map((deal) => (
            <Card
              key={deal.id}
              className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow dark:bg-[#1A2F5A]/20 dark:transition-colors dark:duration-300"
            >
              <div className="flex flex-row h-40">
                <div
                  className="w-32 sm:w-40 h-full relative flex-shrink-0 cursor-pointer"
                >
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge
                      className={`text-[10px] px-2 py-0.5 ${deal.status === "Active" ? "bg-emerald-500" : deal.status === "Expired" ? "bg-red-500" : "bg-gray-500"}`}
                    >
                      {deal.status}
                    </Badge>
                  </div>
                </div>

                <div
                  className="flex-1 p-4 flex flex-col justify-between min-w-0 cursor-pointer"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <h3 className="font-bold text-base text-[#0E2250] dark:text-white truncate max-w-[180px] transition-colors duration-300">
                          {deal.title}
                        </h3>
                        {deal.dealOfTheDayDate && (
                          <Badge
                            variant="outline"
                            className="border-[#E35000] text-[#E35000] bg-orange-50 dark:bg-[#E35000]/20 dark:border-[#E35000] flex items-center gap-1 text-[10px] px-1.5 h-5 transition-colors duration-300"
                          >
                            <Smartphone size={10} />{" "}
                            {deal.dealOfTheDayDate}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-blue-200/70 transition-colors duration-300">
                        <span className="flex items-center gap-1 capitalize">
                          <Tag size={10} /> {deal.category}
                        </span>
                        <span>•</span>
                        <span>Exp: {deal.expiry}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-blue-200/70 mt-2 line-clamp-1 sm:line-clamp-2 pr-4 h-4 sm:h-8 transition-colors duration-300">
                        {deal.description}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 -mt-1 -mr-2 flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          More details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          View Coupons
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Remove from Deal of the Day
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                        >
                          Deactivate Deal
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 dark:text-blue-200/70 uppercase transition-colors duration-300">
                        Sold
                      </span>
                      <span className="font-bold text-[#0E2250] dark:text-white transition-colors duration-300">
                        {deal.sold}
                      </span>
                    </div>
                    <div className="w-px h-8 bg-gray-100 dark:bg-[#1A2F5A] transition-colors duration-300"></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 dark:text-blue-200/70 uppercase transition-colors duration-300">
                        Earning
                      </span>
                      <span className="font-bold text-[#0E2250] dark:text-white transition-colors duration-300">
                        LKR {(deal.revenue / 1000).toFixed(1)}k
                      </span>
                    </div>

                    <div className="flex-1"></div>

                    {/* Hide buttons on mobile, show on sm and up */}
                    <div className="hidden sm:flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Coupons
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 text-xs px-2 bg-orange-100 dark:bg-[#E35000]/20 text-[#E35000] hover:bg-orange-200 dark:hover:bg-[#E35000]/30 transition-colors duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Featured
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Set New Deals of the Day Dialog */}
      <Dialog open={setNewDealsOpen} onOpenChange={setSetNewDealsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2A2A2A] transition-colors duration-300">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-900 dark:text-white transition-colors duration-300">
              Schedule Deal of the Day
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Select a date and choose deals to feature as Deal of the Day.
            </DialogDescription>
          </DialogHeader>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-50 dark:bg-[#1C1C1C] rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">{deals.filter(d => d.status === "Active").length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">Active deals</div>
            </div>
            <div className="bg-orange-50 dark:bg-[#1C1C1C] rounded-xl p-4 border border-orange-200 dark:border-orange-800/30 transition-colors duration-300">
              <div className="text-2xl font-bold text-[#E35000] dark:text-[#FF6B35] transition-colors duration-300">{selectedDealsForSchedule.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">Selected</div>
            </div>
            <div className="bg-emerald-50 dark:bg-[#1C1C1C] rounded-xl p-4 border border-emerald-200 dark:border-emerald-800/30 transition-colors duration-300">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-300">{availableDealsForSchedule.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">Available</div>
            </div>
          </div>

          {/* Date Input */}
          <div className="space-y-2 mt-4">
            <Label htmlFor="schedule-date" className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
              Date
            </Label>
            <Input
              id="schedule-date"
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              placeholder="yyyy-mm-dd"
              className="dark:bg-[#1C1C1C] dark:border-[#2A2A2A] dark:text-white transition-colors duration-300 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
          </div>

          {/* Search and Filter Row */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {/* Search Input */}
            <div className="space-y-2">
              <Label htmlFor="schedule-search" className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Search Deals
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="schedule-search"
                  type="text"
                  placeholder="Search deals..."
                  value={scheduleSearchQuery}
                  onChange={(e) => setScheduleSearchQuery(e.target.value)}
                  className="pl-9 dark:bg-[#1C1C1C] dark:border-[#2A2A2A] dark:text-white transition-colors duration-300"
                />
              </div>
            </div>

            {/* Purchase Filter */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Filter by Purchase
              </Label>
              <Select
                value={schedulePurchaseFilter}
                onValueChange={setSchedulePurchaseFilter}
              >
                <SelectTrigger className="dark:bg-[#1C1C1C] dark:border-[#2A2A2A] dark:text-white transition-colors duration-300">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All
                  </SelectItem>
                  <SelectItem value="high">
                    High (Sold &gt; 50)
                  </SelectItem>
                  <SelectItem value="medium">
                    Medium (20-50 Sold)
                  </SelectItem>
                  <SelectItem value="low">
                    Low (Sold &lt; 20)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Deals List */}
          <div className="space-y-2 mt-4">
            <Label className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
              Select Deals
            </Label>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 max-h-[300px] overflow-y-auto bg-white dark:bg-[#0A0A0A] transition-colors duration-300">
              {availableDealsForSchedule.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  No deals available
                </div>
              ) : (
                availableDealsForSchedule.map((deal) => (
                  <div
                    key={deal.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-[#1C1C1C]/50 border-b last:border-b-0 border-gray-200 dark:border-gray-700 transition-colors duration-300"
                  >
                    <Checkbox
                      checked={selectedDealsForSchedule.includes(deal.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedDealsForSchedule([...selectedDealsForSchedule, deal.id]);
                        } else {
                          setSelectedDealsForSchedule(selectedDealsForSchedule.filter((id) => id !== deal.id));
                        }
                      }}
                      className="flex-shrink-0"
                    />
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-12 h-12 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-200 truncate transition-colors duration-300">
                        {deal.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        Sold: {deal.sold}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter className="mt-6 gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSetNewDealsOpen(false);
                setScheduleDate("");
                setScheduleSearchQuery("");
                setSelectedDealsForSchedule([]);
                setSchedulePurchaseFilter("all");
              }}
              className="h-11 text-sm font-medium border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#1C1C1C] hover:border-gray-300 dark:hover:border-gray-500 text-gray-900 dark:text-gray-200 transition-colors duration-300"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // TODO: Implement schedule functionality
                setSetNewDealsOpen(false);
                setScheduleDate("");
                setScheduleSearchQuery("");
                setSelectedDealsForSchedule([]);
                setSchedulePurchaseFilter("all");
              }}
              disabled={selectedDealsForSchedule.length === 0 || !scheduleDate}
              className="h-11 text-sm font-medium bg-[#E35000] hover:bg-[#c44500] text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Schedule {selectedDealsForSchedule.length > 0 ? `${selectedDealsForSchedule.length} ` : ""}Deal{selectedDealsForSchedule.length !== 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}