import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Info,
  FileText,
  FileSpreadsheet,
  Download,
  CalendarDays,
  ChevronRight,
  ChevronLeft,
  Search,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { useTheme } from "next-themes@0.4.6";

export function Analytics() {
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === "dark" || resolvedTheme === "dark";
  const [dateRange, setDateRange] = React.useState("last7days");
  const [showDatePicker, setShowDatePicker] =
    React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(
    new Date().getMonth(),
  );
  const [currentYear, setCurrentYear] = React.useState(
    new Date().getFullYear(),
  );
  const [selectedStartDate, setSelectedStartDate] =
    React.useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] =
    React.useState<Date | null>(null);
  const [hoverDate, setHoverDate] = React.useState<Date | null>(
    null,
  );
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage] = React.useState(5);
  const [selectedEngagementDeals, setSelectedEngagementDeals] = React.useState<string[]>(["all"]);
  const [dealSearchQuery, setDealSearchQuery] = React.useState("");
  const [engagementDealSearch, setEngagementDealSearch] = React.useState("");
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

  // All data with dates for filtering - 4 months of data (Sep-Dec 2024)
  const allRedemptionData = [
    // September 2024
    { day: "Sep 1", redemptions: 6, redeemed: 4, date: new Date(2024, 8, 1) },
    { day: "Sep 2", redemptions: 8, redeemed: 6, date: new Date(2024, 8, 2) },
    { day: "Sep 3", redemptions: 12, redeemed: 9, date: new Date(2024, 8, 3) },
    { day: "Sep 4", redemptions: 10, redeemed: 7, date: new Date(2024, 8, 4) },
    { day: "Sep 5", redemptions: 15, redeemed: 11, date: new Date(2024, 8, 5) },
    { day: "Sep 6", redemptions: 18, redeemed: 14, date: new Date(2024, 8, 6) },
    { day: "Sep 7", redemptions: 20, redeemed: 16, date: new Date(2024, 8, 7) },
    { day: "Sep 8", redemptions: 14, redeemed: 10, date: new Date(2024, 8, 8) },
    { day: "Sep 9", redemptions: 9, redeemed: 7, date: new Date(2024, 8, 9) },
    { day: "Sep 10", redemptions: 11, redeemed: 8, date: new Date(2024, 8, 10) },
    { day: "Sep 11", redemptions: 13, redeemed: 10, date: new Date(2024, 8, 11) },
    { day: "Sep 12", redemptions: 16, redeemed: 12, date: new Date(2024, 8, 12) },
    { day: "Sep 13", redemptions: 22, redeemed: 17, date: new Date(2024, 8, 13) },
    { day: "Sep 14", redemptions: 25, redeemed: 20, date: new Date(2024, 8, 14) },
    { day: "Sep 15", redemptions: 19, redeemed: 15, date: new Date(2024, 8, 15) },
    { day: "Sep 16", redemptions: 12, redeemed: 9, date: new Date(2024, 8, 16) },
    { day: "Sep 17", redemptions: 14, redeemed: 11, date: new Date(2024, 8, 17) },
    { day: "Sep 18", redemptions: 17, redeemed: 13, date: new Date(2024, 8, 18) },
    { day: "Sep 19", redemptions: 20, redeemed: 16, date: new Date(2024, 8, 19) },
    { day: "Sep 20", redemptions: 28, redeemed: 22, date: new Date(2024, 8, 20) },
    { day: "Sep 21", redemptions: 32, redeemed: 26, date: new Date(2024, 8, 21) },
    { day: "Sep 22", redemptions: 24, redeemed: 19, date: new Date(2024, 8, 22) },
    { day: "Sep 23", redemptions: 15, redeemed: 12, date: new Date(2024, 8, 23) },
    { day: "Sep 24", redemptions: 18, redeemed: 14, date: new Date(2024, 8, 24) },
    { day: "Sep 25", redemptions: 21, redeemed: 16, date: new Date(2024, 8, 25) },
    { day: "Sep 26", redemptions: 23, redeemed: 18, date: new Date(2024, 8, 26) },
    { day: "Sep 27", redemptions: 30, redeemed: 24, date: new Date(2024, 8, 27) },
    { day: "Sep 28", redemptions: 35, redeemed: 28, date: new Date(2024, 8, 28) },
    { day: "Sep 29", redemptions: 27, redeemed: 21, date: new Date(2024, 8, 29) },
    { day: "Sep 30", redemptions: 19, redeemed: 15, date: new Date(2024, 8, 30) },
    // October 2024
    { day: "Oct 1", redemptions: 10, redeemed: 8, date: new Date(2024, 9, 1) },
    { day: "Oct 2", redemptions: 12, redeemed: 9, date: new Date(2024, 9, 2) },
    { day: "Oct 3", redemptions: 15, redeemed: 12, date: new Date(2024, 9, 3) },
    { day: "Oct 4", redemptions: 18, redeemed: 14, date: new Date(2024, 9, 4) },
    { day: "Oct 5", redemptions: 24, redeemed: 19, date: new Date(2024, 9, 5) },
    { day: "Oct 6", redemptions: 28, redeemed: 22, date: new Date(2024, 9, 6) },
    { day: "Oct 7", redemptions: 22, redeemed: 17, date: new Date(2024, 9, 7) },
    { day: "Oct 8", redemptions: 16, redeemed: 12, date: new Date(2024, 9, 8) },
    { day: "Oct 9", redemptions: 14, redeemed: 11, date: new Date(2024, 9, 9) },
    { day: "Oct 10", redemptions: 19, redeemed: 15, date: new Date(2024, 9, 10) },
    { day: "Oct 11", redemptions: 21, redeemed: 16, date: new Date(2024, 9, 11) },
    { day: "Oct 12", redemptions: 26, redeemed: 20, date: new Date(2024, 9, 12) },
    { day: "Oct 13", redemptions: 30, redeemed: 24, date: new Date(2024, 9, 13) },
    { day: "Oct 14", redemptions: 25, redeemed: 20, date: new Date(2024, 9, 14) },
    { day: "Oct 15", redemptions: 20, redeemed: 16, date: new Date(2024, 9, 15) },
    { day: "Oct 16", redemptions: 17, redeemed: 13, date: new Date(2024, 9, 16) },
    { day: "Oct 17", redemptions: 22, redeemed: 17, date: new Date(2024, 9, 17) },
    { day: "Oct 18", redemptions: 25, redeemed: 20, date: new Date(2024, 9, 18) },
    { day: "Oct 19", redemptions: 32, redeemed: 26, date: new Date(2024, 9, 19) },
    { day: "Oct 20", redemptions: 38, redeemed: 30, date: new Date(2024, 9, 20) },
    { day: "Oct 21", redemptions: 29, redeemed: 23, date: new Date(2024, 9, 21) },
    { day: "Oct 22", redemptions: 23, redeemed: 18, date: new Date(2024, 9, 22) },
    { day: "Oct 23", redemptions: 26, redeemed: 21, date: new Date(2024, 9, 23) },
    { day: "Oct 24", redemptions: 28, redeemed: 22, date: new Date(2024, 9, 24) },
    { day: "Oct 25", redemptions: 31, redeemed: 25, date: new Date(2024, 9, 25) },
    { day: "Oct 26", redemptions: 40, redeemed: 32, date: new Date(2024, 9, 26) },
    { day: "Oct 27", redemptions: 44, redeemed: 35, date: new Date(2024, 9, 27) },
    { day: "Oct 28", redemptions: 33, redeemed: 26, date: new Date(2024, 9, 28) },
    { day: "Oct 29", redemptions: 27, redeemed: 22, date: new Date(2024, 9, 29) },
    { day: "Oct 30", redemptions: 24, redeemed: 19, date: new Date(2024, 9, 30) },
    { day: "Oct 31", redemptions: 29, redeemed: 23, date: new Date(2024, 9, 31) },
    // November 2024
    { day: "Nov 1", redemptions: 11, redeemed: 9, date: new Date(2024, 10, 1) },
    { day: "Nov 2", redemptions: 14, redeemed: 11, date: new Date(2024, 10, 2) },
    { day: "Nov 3", redemptions: 17, redeemed: 13, date: new Date(2024, 10, 3) },
    { day: "Nov 4", redemptions: 20, redeemed: 16, date: new Date(2024, 10, 4) },
    { day: "Nov 5", redemptions: 25, redeemed: 20, date: new Date(2024, 10, 5) },
    { day: "Nov 6", redemptions: 30, redeemed: 24, date: new Date(2024, 10, 6) },
    { day: "Nov 7", redemptions: 24, redeemed: 19, date: new Date(2024, 10, 7) },
    { day: "Nov 8", redemptions: 18, redeemed: 14, date: new Date(2024, 10, 8) },
    { day: "Nov 9", redemptions: 15, redeemed: 12, date: new Date(2024, 10, 9) },
    { day: "Nov 10", redemptions: 19, redeemed: 15, date: new Date(2024, 10, 10) },
    { day: "Nov 11", redemptions: 22, redeemed: 17, date: new Date(2024, 10, 11) },
    { day: "Nov 12", redemptions: 27, redeemed: 21, date: new Date(2024, 10, 12) },
    { day: "Nov 13", redemptions: 31, redeemed: 25, date: new Date(2024, 10, 13) },
    { day: "Nov 14", redemptions: 26, redeemed: 21, date: new Date(2024, 10, 14) },
    { day: "Nov 15", redemptions: 21, redeemed: 17, date: new Date(2024, 10, 15) },
    { day: "Nov 16", redemptions: 18, redeemed: 14, date: new Date(2024, 10, 16) },
    { day: "Nov 17", redemptions: 23, redeemed: 18, date: new Date(2024, 10, 17) },
    { day: "Nov 18", redemptions: 28, redeemed: 22, date: new Date(2024, 10, 18) },
    { day: "Nov 19", redemptions: 34, redeemed: 27, date: new Date(2024, 10, 19) },
    { day: "Nov 20", redemptions: 39, redeemed: 31, date: new Date(2024, 10, 20) },
    { day: "Nov 21", redemptions: 31, redeemed: 25, date: new Date(2024, 10, 21) },
    { day: "Nov 22", redemptions: 25, redeemed: 20, date: new Date(2024, 10, 22) },
    { day: "Nov 23", redemptions: 28, redeemed: 22, date: new Date(2024, 10, 23) },
    { day: "Nov 24", redemptions: 32, redeemed: 26, date: new Date(2024, 10, 24) },
    { day: "Nov 25", redemptions: 36, redeemed: 29, date: new Date(2024, 10, 25) },
    { day: "Nov 26", redemptions: 42, redeemed: 34, date: new Date(2024, 10, 26) },
    { day: "Nov 27", redemptions: 46, redeemed: 37, date: new Date(2024, 10, 27) },
    { day: "Nov 28", redemptions: 38, redeemed: 30, date: new Date(2024, 10, 28) },
    { day: "Nov 29", redemptions: 30, redeemed: 24, date: new Date(2024, 10, 29) },
    { day: "Nov 30", redemptions: 26, redeemed: 21, date: new Date(2024, 10, 30) },
    // December 2024
    { day: "Dec 1", redemptions: 12, redeemed: 10, date: new Date(2024, 11, 1) },
    { day: "Dec 2", redemptions: 15, redeemed: 12, date: new Date(2024, 11, 2) },
    { day: "Dec 3", redemptions: 18, redeemed: 14, date: new Date(2024, 11, 3) },
    { day: "Dec 4", redemptions: 21, redeemed: 17, date: new Date(2024, 11, 4) },
    { day: "Dec 5", redemptions: 26, redeemed: 21, date: new Date(2024, 11, 5) },
    { day: "Dec 6", redemptions: 31, redeemed: 25, date: new Date(2024, 11, 6) },
    { day: "Dec 7", redemptions: 28, redeemed: 22, date: new Date(2024, 11, 7) },
    { day: "Dec 8", redemptions: 20, redeemed: 16, date: new Date(2024, 11, 8) },
    { day: "Dec 9", redemptions: 17, redeemed: 14, date: new Date(2024, 11, 9) },
    { day: "Dec 10", redemptions: 19, redeemed: 15, date: new Date(2024, 11, 10) },
    { day: "Dec 11", redemptions: 23, redeemed: 18, date: new Date(2024, 11, 11) },
    { day: "Dec 12", redemptions: 27, redeemed: 22, date: new Date(2024, 11, 12) },
    { day: "Dec 13", redemptions: 33, redeemed: 26, date: new Date(2024, 11, 13) },
    { day: "Dec 14", redemptions: 38, redeemed: 30, date: new Date(2024, 11, 14) },
    { day: "Dec 15", redemptions: 30, redeemed: 24, date: new Date(2024, 11, 15) },
    { day: "Dec 16", redemptions: 24, redeemed: 19, date: new Date(2024, 11, 16) },
    { day: "Dec 17", redemptions: 21, redeemed: 17, date: new Date(2024, 11, 17) },
    { day: "Dec 18", redemptions: 25, redeemed: 20, date: new Date(2024, 11, 18) },
    { day: "Dec 19", redemptions: 29, redeemed: 23, date: new Date(2024, 11, 19) },
    { day: "Dec 20", redemptions: 35, redeemed: 28, date: new Date(2024, 11, 20) },
    { day: "Dec 21", redemptions: 41, redeemed: 33, date: new Date(2024, 11, 21) },
    { day: "Dec 22", redemptions: 36, redeemed: 29, date: new Date(2024, 11, 22) },
    { day: "Dec 23", redemptions: 28, redeemed: 22, date: new Date(2024, 11, 23) },
    { day: "Dec 24", redemptions: 32, redeemed: 26, date: new Date(2024, 11, 24) },
    { day: "Dec 25", redemptions: 40, redeemed: 32, date: new Date(2024, 11, 25) },
    { day: "Dec 26", redemptions: 50, redeemed: 40, date: new Date(2024, 11, 26) },
    { day: "Dec 27", redemptions: 55, redeemed: 44, date: new Date(2024, 11, 27) },
    { day: "Dec 28", redemptions: 60, redeemed: 48, date: new Date(2024, 11, 28) },
    { day: "Dec 29", redemptions: 52, redeemed: 42, date: new Date(2024, 11, 29) },
  ];

  const allRevenueData = [
    // September 2024
    { day: "Sep 1", revenue: 5500, date: new Date(2024, 8, 1) },
    { day: "Sep 2", revenue: 7200, date: new Date(2024, 8, 2) },
    { day: "Sep 3", revenue: 9800, date: new Date(2024, 8, 3) },
    { day: "Sep 4", revenue: 8500, date: new Date(2024, 8, 4) },
    { day: "Sep 5", revenue: 12500, date: new Date(2024, 8, 5) },
    { day: "Sep 6", revenue: 15200, date: new Date(2024, 8, 6) },
    { day: "Sep 7", revenue: 17800, date: new Date(2024, 8, 7) },
    { day: "Sep 8", revenue: 11900, date: new Date(2024, 8, 8) },
    { day: "Sep 9", revenue: 7600, date: new Date(2024, 8, 9) },
    { day: "Sep 10", revenue: 9200, date: new Date(2024, 8, 10) },
    { day: "Sep 11", revenue: 10800, date: new Date(2024, 8, 11) },
    { day: "Sep 12", revenue: 13400, date: new Date(2024, 8, 12) },
    { day: "Sep 13", revenue: 18600, date: new Date(2024, 8, 13) },
    { day: "Sep 14", revenue: 21200, date: new Date(2024, 8, 14) },
    { day: "Sep 15", revenue: 16100, date: new Date(2024, 8, 15) },
    { day: "Sep 16", revenue: 10200, date: new Date(2024, 8, 16) },
    { day: "Sep 17", revenue: 11800, date: new Date(2024, 8, 17) },
    { day: "Sep 18", revenue: 14300, date: new Date(2024, 8, 18) },
    { day: "Sep 19", revenue: 16900, date: new Date(2024, 8, 19) },
    { day: "Sep 20", revenue: 23600, date: new Date(2024, 8, 20) },
    { day: "Sep 21", revenue: 27100, date: new Date(2024, 8, 21) },
    { day: "Sep 22", revenue: 20300, date: new Date(2024, 8, 22) },
    { day: "Sep 23", revenue: 12700, date: new Date(2024, 8, 23) },
    { day: "Sep 24", revenue: 15200, date: new Date(2024, 8, 24) },
    { day: "Sep 25", revenue: 17700, date: new Date(2024, 8, 25) },
    { day: "Sep 26", revenue: 19400, date: new Date(2024, 8, 26) },
    { day: "Sep 27", revenue: 25400, date: new Date(2024, 8, 27) },
    { day: "Sep 28", revenue: 29600, date: new Date(2024, 8, 28) },
    { day: "Sep 29", revenue: 22900, date: new Date(2024, 8, 29) },
    { day: "Sep 30", revenue: 16100, date: new Date(2024, 8, 30) },
    // October 2024
    { day: "Oct 1", revenue: 8500, date: new Date(2024, 9, 1) },
    { day: "Oct 2", revenue: 10200, date: new Date(2024, 9, 2) },
    { day: "Oct 3", revenue: 12700, date: new Date(2024, 9, 3) },
    { day: "Oct 4", revenue: 15200, date: new Date(2024, 9, 4) },
    { day: "Oct 5", revenue: 20300, date: new Date(2024, 9, 5) },
    { day: "Oct 6", revenue: 23700, date: new Date(2024, 9, 6) },
    { day: "Oct 7", revenue: 18600, date: new Date(2024, 9, 7) },
    { day: "Oct 8", revenue: 13600, date: new Date(2024, 9, 8) },
    { day: "Oct 9", revenue: 11900, date: new Date(2024, 9, 9) },
    { day: "Oct 10", revenue: 16100, date: new Date(2024, 9, 10) },
    { day: "Oct 11", revenue: 17800, date: new Date(2024, 9, 11) },
    { day: "Oct 12", revenue: 22000, date: new Date(2024, 9, 12) },
    { day: "Oct 13", revenue: 25400, date: new Date(2024, 9, 13) },
    { day: "Oct 14", revenue: 21200, date: new Date(2024, 9, 14) },
    { day: "Oct 15", revenue: 16900, date: new Date(2024, 9, 15) },
    { day: "Oct 16", revenue: 14400, date: new Date(2024, 9, 16) },
    { day: "Oct 17", revenue: 18600, date: new Date(2024, 9, 17) },
    { day: "Oct 18", revenue: 21200, date: new Date(2024, 9, 18) },
    { day: "Oct 19", revenue: 27100, date: new Date(2024, 9, 19) },
    { day: "Oct 20", revenue: 32200, date: new Date(2024, 9, 20) },
    { day: "Oct 21", revenue: 24500, date: new Date(2024, 9, 21) },
    { day: "Oct 22", revenue: 19500, date: new Date(2024, 9, 22) },
    { day: "Oct 23", revenue: 22000, date: new Date(2024, 9, 23) },
    { day: "Oct 24", revenue: 23700, date: new Date(2024, 9, 24) },
    { day: "Oct 25", revenue: 26200, date: new Date(2024, 9, 25) },
    { day: "Oct 26", revenue: 33900, date: new Date(2024, 9, 26) },
    { day: "Oct 27", revenue: 37200, date: new Date(2024, 9, 27) },
    { day: "Oct 28", revenue: 28000, date: new Date(2024, 9, 28) },
    { day: "Oct 29", revenue: 22900, date: new Date(2024, 9, 29) },
    { day: "Oct 30", revenue: 20300, date: new Date(2024, 9, 30) },
    { day: "Oct 31", revenue: 24500, date: new Date(2024, 9, 31) },
    // November 2024
    { day: "Nov 1", revenue: 9300, date: new Date(2024, 10, 1) },
    { day: "Nov 2", revenue: 11900, date: new Date(2024, 10, 2) },
    { day: "Nov 3", revenue: 14400, date: new Date(2024, 10, 3) },
    { day: "Nov 4", revenue: 16900, date: new Date(2024, 10, 4) },
    { day: "Nov 5", revenue: 21200, date: new Date(2024, 10, 5) },
    { day: "Nov 6", revenue: 25400, date: new Date(2024, 10, 6) },
    { day: "Nov 7", revenue: 20300, date: new Date(2024, 10, 7) },
    { day: "Nov 8", revenue: 15200, date: new Date(2024, 10, 8) },
    { day: "Nov 9", revenue: 12700, date: new Date(2024, 10, 9) },
    { day: "Nov 10", revenue: 16100, date: new Date(2024, 10, 10) },
    { day: "Nov 11", revenue: 18600, date: new Date(2024, 10, 11) },
    { day: "Nov 12", revenue: 22900, date: new Date(2024, 10, 12) },
    { day: "Nov 13", revenue: 26200, date: new Date(2024, 10, 13) },
    { day: "Nov 14", revenue: 22000, date: new Date(2024, 10, 14) },
    { day: "Nov 15", revenue: 17800, date: new Date(2024, 10, 15) },
    { day: "Nov 16", revenue: 15200, date: new Date(2024, 10, 16) },
    { day: "Nov 17", revenue: 19500, date: new Date(2024, 10, 17) },
    { day: "Nov 18", revenue: 23700, date: new Date(2024, 10, 18) },
    { day: "Nov 19", revenue: 28800, date: new Date(2024, 10, 19) },
    { day: "Nov 20", revenue: 33000, date: new Date(2024, 10, 20) },
    { day: "Nov 21", revenue: 26200, date: new Date(2024, 10, 21) },
    { day: "Nov 22", revenue: 21200, date: new Date(2024, 10, 22) },
    { day: "Nov 23", revenue: 23700, date: new Date(2024, 10, 23) },
    { day: "Nov 24", revenue: 27100, date: new Date(2024, 10, 24) },
    { day: "Nov 25", revenue: 30500, date: new Date(2024, 10, 25) },
    { day: "Nov 26", revenue: 35600, date: new Date(2024, 10, 26) },
    { day: "Nov 27", revenue: 39000, date: new Date(2024, 10, 27) },
    { day: "Nov 28", revenue: 32200, date: new Date(2024, 10, 28) },
    { day: "Nov 29", revenue: 25400, date: new Date(2024, 10, 29) },
    { day: "Nov 30", revenue: 22000, date: new Date(2024, 10, 30) },
    // December 2024
    { day: "Dec 1", revenue: 10200, date: new Date(2024, 11, 1) },
    { day: "Dec 2", revenue: 12700, date: new Date(2024, 11, 2) },
    { day: "Dec 3", revenue: 15200, date: new Date(2024, 11, 3) },
    { day: "Dec 4", revenue: 17800, date: new Date(2024, 11, 4) },
    { day: "Dec 5", revenue: 22000, date: new Date(2024, 11, 5) },
    { day: "Dec 6", revenue: 26200, date: new Date(2024, 11, 6) },
    { day: "Dec 7", revenue: 23700, date: new Date(2024, 11, 7) },
    { day: "Dec 8", revenue: 16900, date: new Date(2024, 11, 8) },
    { day: "Dec 9", revenue: 14400, date: new Date(2024, 11, 9) },
    { day: "Dec 10", revenue: 16100, date: new Date(2024, 11, 10) },
    { day: "Dec 11", revenue: 19500, date: new Date(2024, 11, 11) },
    { day: "Dec 12", revenue: 22900, date: new Date(2024, 11, 12) },
    { day: "Dec 13", revenue: 28000, date: new Date(2024, 11, 13) },
    { day: "Dec 14", revenue: 32200, date: new Date(2024, 11, 14) },
    { day: "Dec 15", revenue: 25400, date: new Date(2024, 11, 15) },
    { day: "Dec 16", revenue: 20300, date: new Date(2024, 11, 16) },
    { day: "Dec 17", revenue: 17800, date: new Date(2024, 11, 17) },
    { day: "Dec 18", revenue: 21200, date: new Date(2024, 11, 18) },
    { day: "Dec 19", revenue: 24500, date: new Date(2024, 11, 19) },
    { day: "Dec 20", revenue: 29600, date: new Date(2024, 11, 20) },
    { day: "Dec 21", revenue: 34700, date: new Date(2024, 11, 21) },
    { day: "Dec 22", revenue: 30500, date: new Date(2024, 11, 22) },
    { day: "Dec 23", revenue: 23700, date: new Date(2024, 11, 23) },
    { day: "Dec 24", revenue: 27100, date: new Date(2024, 11, 24) },
    { day: "Dec 25", revenue: 33900, date: new Date(2024, 11, 25) },
    { day: "Dec 26", revenue: 42400, date: new Date(2024, 11, 26) },
    { day: "Dec 27", revenue: 46600, date: new Date(2024, 11, 27) },
    { day: "Dec 28", revenue: 50800, date: new Date(2024, 11, 28) },
    { day: "Dec 29", revenue: 44000, date: new Date(2024, 11, 29) },
  ];

  const allDealsData = [
    {
      date: new Date(2024, 11, 29),
      dateStr: "Dec 29, 2024",
      name: "Seafood Platter",
      views: "1,204",
      sold: 154,
      redemptions: 142,
      conv: "12.8%",
      rev: "LKR 568,000",
    },
    {
      date: new Date(2024, 11, 28),
      dateStr: "Dec 28, 2024",
      name: "Ayurveda Spa",
      views: "892",
      sold: 95,
      redemptions: 89,
      conv: "10.7%",
      rev: "LKR 445,000",
    },
    {
      date: new Date(2024, 11, 27),
      dateStr: "Dec 27, 2024",
      name: "Sunset Cocktails",
      views: "1,540",
      sold: 68,
      redemptions: 65,
      conv: "4.4%",
      rev: "LKR 130,000",
    },
    {
      date: new Date(2024, 11, 26),
      dateStr: "Dec 26, 2024",
      name: "City Tour",
      views: "420",
      sold: 14,
      redemptions: 12,
      conv: "3.3%",
      rev: "LKR 60,000",
    },
    {
      date: new Date(2024, 11, 25),
      dateStr: "Dec 25, 2024",
      name: "Beach Yoga Session",
      views: "756",
      sold: 48,
      redemptions: 45,
      conv: "6.3%",
      rev: "LKR 180,000",
    },
    {
      date: new Date(2024, 11, 24),
      dateStr: "Dec 24, 2024",
      name: "Wine Tasting",
      views: "634",
      sold: 72,
      redemptions: 68,
      conv: "11.4%",
      rev: "LKR 288,000",
    },
    {
      date: new Date(2024, 11, 23),
      dateStr: "Dec 23, 2024",
      name: "Cooking Class",
      views: "982",
      sold: 105,
      redemptions: 98,
      conv: "10.7%",
      rev: "LKR 420,000",
    },
    {
      date: new Date(2024, 11, 22),
      dateStr: "Dec 22, 2024",
      name: "Mountain Hike",
      views: "512",
      sold: 38,
      redemptions: 35,
      conv: "7.4%",
      rev: "LKR 152,000",
    },
    {
      date: new Date(2024, 11, 21),
      dateStr: "Dec 21, 2024",
      name: "Cultural Show",
      views: "1,120",
      sold: 142,
      redemptions: 135,
      conv: "12.7%",
      rev: "LKR 568,000",
    },
    {
      date: new Date(2024, 11, 20),
      dateStr: "Dec 20, 2024",
      name: "Boat Ride",
      views: "845",
      sold: 89,
      redemptions: 82,
      conv: "10.5%",
      rev: "LKR 356,000",
    },
    {
      date: new Date(2024, 11, 19),
      dateStr: "Dec 19, 2024",
      name: "Art Workshop",
      views: "423",
      sold: 28,
      redemptions: 25,
      conv: "6.6%",
      rev: "LKR 112,000",
    },
    {
      date: new Date(2024, 11, 18),
      dateStr: "Dec 18, 2024",
      name: "Meditation Session",
      views: "678",
      sold: 54,
      redemptions: 51,
      conv: "8.0%",
      rev: "LKR 216,000",
    },
    // More December deals
    {
      date: new Date(2024, 11, 17),
      dateStr: "Dec 17, 2024",
      name: "Breakfast Buffet",
      views: "1,145",
      sold: 98,
      redemptions: 92,
      conv: "8.6%",
      rev: "LKR 392,000",
    },
    {
      date: new Date(2024, 11, 16),
      dateStr: "Dec 16, 2024",
      name: "Afternoon Tea",
      views: "567",
      sold: 65,
      redemptions: 61,
      conv: "11.5%",
      rev: "LKR 260,000",
    },
    {
      date: new Date(2024, 11, 15),
      dateStr: "Dec 15, 2024",
      name: "Family Dinner",
      views: "892",
      sold: 78,
      redemptions: 74,
      conv: "8.7%",
      rev: "LKR 312,000",
    },
    {
      date: new Date(2024, 11, 14),
      dateStr: "Dec 14, 2024",
      name: "Weekend Brunch",
      views: "1,340",
      sold: 112,
      redemptions: 105,
      conv: "8.4%",
      rev: "LKR 448,000",
    },
    {
      date: new Date(2024, 11, 13),
      dateStr: "Dec 13, 2024",
      name: "Pizza Night",
      views: "743",
      sold: 86,
      redemptions: 81,
      conv: "11.6%",
      rev: "LKR 344,000",
    },
    {
      date: new Date(2024, 11, 12),
      dateStr: "Dec 12, 2024",
      name: "Sushi Platter",
      views: "1,023",
      sold: 95,
      redemptions: 88,
      conv: "9.3%",
      rev: "LKR 380,000",
    },
    {
      date: new Date(2024, 11, 11),
      dateStr: "Dec 11, 2024",
      name: "Thai Cuisine",
      views: "654",
      sold: 71,
      redemptions: 67,
      conv: "10.9%",
      rev: "LKR 284,000",
    },
    {
      date: new Date(2024, 11, 10),
      dateStr: "Dec 10, 2024",
      name: "BBQ Feast",
      views: "1,456",
      sold: 124,
      redemptions: 117,
      conv: "8.5%",
      rev: "LKR 496,000",
    },
    // November deals
    {
      date: new Date(2024, 10, 30),
      dateStr: "Nov 30, 2024",
      name: "Italian Pasta",
      views: "876",
      sold: 89,
      redemptions: 84,
      conv: "10.2%",
      rev: "LKR 356,000",
    },
    {
      date: new Date(2024, 10, 29),
      dateStr: "Nov 29, 2024",
      name: "Seafood Grill",
      views: "1,234",
      sold: 108,
      redemptions: 101,
      conv: "8.8%",
      rev: "LKR 432,000",
    },
    {
      date: new Date(2024, 10, 28),
      dateStr: "Nov 28, 2024",
      name: "Sunday Roast",
      views: "965",
      sold: 92,
      redemptions: 87,
      conv: "9.5%",
      rev: "LKR 368,000",
    },
    {
      date: new Date(2024, 10, 27),
      dateStr: "Nov 27, 2024",
      name: "Tapas Selection",
      views: "734",
      sold: 76,
      redemptions: 71,
      conv: "10.4%",
      rev: "LKR 304,000",
    },
    {
      date: new Date(2024, 10, 26),
      dateStr: "Nov 26, 2024",
      name: "Burger Combo",
      views: "1,567",
      sold: 135,
      redemptions: 128,
      conv: "8.6%",
      rev: "LKR 540,000",
    },
    {
      date: new Date(2024, 10, 25),
      dateStr: "Nov 25, 2024",
      name: "Steak Dinner",
      views: "1,089",
      sold: 103,
      redemptions: 97,
      conv: "9.5%",
      rev: "LKR 412,000",
    },
    {
      date: new Date(2024, 10, 24),
      dateStr: "Nov 24, 2024",
      name: "Vegetarian Special",
      views: "567",
      sold: 58,
      redemptions: 54,
      conv: "10.2%",
      rev: "LKR 232,000",
    },
    {
      date: new Date(2024, 10, 23),
      dateStr: "Nov 23, 2024",
      name: "Champagne Brunch",
      views: "1,345",
      sold: 118,
      redemptions: 112,
      conv: "8.8%",
      rev: "LKR 472,000",
    },
    {
      date: new Date(2024, 10, 22),
      dateStr: "Nov 22, 2024",
      name: "Chef's Tasting Menu",
      views: "456",
      sold: 42,
      redemptions: 39,
      conv: "9.2%",
      rev: "LKR 168,000",
    },
    {
      date: new Date(2024, 10, 21),
      dateStr: "Nov 21, 2024",
      name: "Rooftop Dining",
      views: "1,678",
      sold: 145,
      redemptions: 138,
      conv: "8.6%",
      rev: "LKR 580,000",
    },
    {
      date: new Date(2024, 10, 20),
      dateStr: "Nov 20, 2024",
      name: "Signature Cocktails",
      views: "923",
      sold: 94,
      redemptions: 89,
      conv: "10.2%",
      rev: "LKR 376,000",
    },
    {
      date: new Date(2024, 10, 15),
      dateStr: "Nov 15, 2024",
      name: "Lunch Special",
      views: "1,234",
      sold: 112,
      redemptions: 106,
      conv: "9.1%",
      rev: "LKR 448,000",
    },
    {
      date: new Date(2024, 10, 10),
      dateStr: "Nov 10, 2024",
      name: "Dessert Tasting",
      views: "678",
      sold: 72,
      redemptions: 68,
      conv: "10.6%",
      rev: "LKR 288,000",
    },
    {
      date: new Date(2024, 10, 5),
      dateStr: "Nov 5, 2024",
      name: "Coffee & Pastries",
      views: "845",
      sold: 89,
      redemptions: 84,
      conv: "10.5%",
      rev: "LKR 356,000",
    },
    {
      date: new Date(2024, 10, 1),
      dateStr: "Nov 1, 2024",
      name: "Bistro Dinner",
      views: "956",
      sold: 86,
      redemptions: 81,
      conv: "9.0%",
      rev: "LKR 344,000",
    },
    // October deals
    {
      date: new Date(2024, 9, 31),
      dateStr: "Oct 31, 2024",
      name: "Halloween Special",
      views: "2,145",
      sold: 178,
      redemptions: 169,
      conv: "8.3%",
      rev: "LKR 712,000",
    },
    {
      date: new Date(2024, 9, 27),
      dateStr: "Oct 27, 2024",
      name: "Gourmet Burgers",
      views: "1,345",
      sold: 125,
      redemptions: 118,
      conv: "9.3%",
      rev: "LKR 500,000",
    },
    {
      date: new Date(2024, 9, 20),
      dateStr: "Oct 20, 2024",
      name: "Mediterranean Feast",
      views: "1,067",
      sold: 98,
      redemptions: 92,
      conv: "9.2%",
      rev: "LKR 392,000",
    },
    {
      date: new Date(2024, 9, 15),
      dateStr: "Oct 15, 2024",
      name: "Vegan Delights",
      views: "734",
      sold: 76,
      redemptions: 72,
      conv: "10.4%",
      rev: "LKR 304,000",
    },
    {
      date: new Date(2024, 9, 10),
      dateStr: "Oct 10, 2024",
      name: "Pan-Asian Cuisine",
      views: "1,456",
      sold: 132,
      redemptions: 125,
      conv: "9.1%",
      rev: "LKR 528,000",
    },
    {
      date: new Date(2024, 9, 5),
      dateStr: "Oct 5, 2024",
      name: "Brunch Classics",
      views: "1,189",
      sold: 105,
      redemptions: 99,
      conv: "8.8%",
      rev: "LKR 420,000",
    },
    {
      date: new Date(2024, 9, 1),
      dateStr: "Oct 1, 2024",
      name: "French Cuisine",
      views: "892",
      sold: 83,
      redemptions: 78,
      conv: "9.3%",
      rev: "LKR 332,000",
    },
    // September deals
    {
      date: new Date(2024, 8, 28),
      dateStr: "Sep 28, 2024",
      name: "Grilled Specialties",
      views: "1,234",
      sold: 114,
      redemptions: 108,
      conv: "9.2%",
      rev: "LKR 456,000",
    },
    {
      date: new Date(2024, 8, 21),
      dateStr: "Sep 21, 2024",
      name: "International Buffet",
      views: "1,678",
      sold: 148,
      redemptions: 141,
      conv: "8.8%",
      rev: "LKR 592,000",
    },
    {
      date: new Date(2024, 8, 14),
      dateStr: "Sep 14, 2024",
      name: "Seafood Festival",
      views: "1,456",
      sold: 135,
      redemptions: 128,
      conv: "9.3%",
      rev: "LKR 540,000",
    },
    {
      date: new Date(2024, 8, 7),
      dateStr: "Sep 7, 2024",
      name: "BBQ Weekend",
      views: "1,567",
      sold: 142,
      redemptions: 135,
      conv: "9.1%",
      rev: "LKR 568,000",
    },
    {
      date: new Date(2024, 8, 1),
      dateStr: "Sep 1, 2024",
      name: "Grand Opening Special",
      views: "2,345",
      sold: 198,
      redemptions: 189,
      conv: "8.4%",
      rev: "LKR 792,000",
    },
  ];

  // Filter data based on selected date range
  const { start: rangeStart, end: rangeEnd } = getActualDateRange();
  
  const redemptionData = React.useMemo(() => {
    return allRedemptionData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= rangeStart && itemDate <= rangeEnd;
    }).map(({ date, ...rest }) => rest);
  }, [dateRange, selectedStartDate, selectedEndDate]);

  const revenueData = React.useMemo(() => {
    return allRevenueData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= rangeStart && itemDate <= rangeEnd;
    }).map(({ date, ...rest }) => rest);
  }, [dateRange, selectedStartDate, selectedEndDate]);

  const filteredDeals = React.useMemo(() => {
    let deals = allDealsData.filter(deal => {
      const dealDate = new Date(deal.date);
      return dealDate >= rangeStart && dealDate <= rangeEnd;
    });

    // Apply search filter
    if (dealSearchQuery.trim()) {
      const searchLower = dealSearchQuery.toLowerCase();
      deals = deals.filter(deal => 
        deal.name.toLowerCase().includes(searchLower) ||
        deal.dateStr.toLowerCase().includes(searchLower) ||
        deal.views.toLowerCase().includes(searchLower) ||
        deal.sold.toString().toLowerCase().includes(searchLower) ||
        deal.redemptions.toString().toLowerCase().includes(searchLower) ||
        deal.conv.toLowerCase().includes(searchLower) ||
        deal.rev.toLowerCase().includes(searchLower)
      );
    }

    return deals;
  }, [dateRange, selectedStartDate, selectedEndDate, dealSearchQuery]);

  // Format date range display
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
      : dateRange === "yesterday"
        ? "Yesterday"
        : dateRange === "thisweek"
          ? "This Week"
          : dateRange === "last7days"
            ? "Last 7 Days"
            : dateRange === "thismonth"
              ? "This Month"
              : dateRange === "last3months"
                ? "Last 3 Months"
                : dateRange === "thisyear"
                  ? "This Year"
                  : dateRange === "custom"
                    ? "Custom Range"
                    : "Last 7 Days";
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

  const isSameDay = (
    date1: Date | null,
    date2: Date | null,
  ) => {
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
              onChange={(e) =>
                setCurrentMonth(Number(e.target.value))
              }
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
              onChange={(e) =>
                setCurrentYear(Number(e.target.value))
              }
              className="text-xs font-medium text-gray-700 dark:text-white bg-transparent border-none focus:outline-none cursor-pointer transition-colors duration-300"
            >
              {Array.from(
                { length: 10 },
                (_, i) => currentYear - 5 + i,
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
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
            <div
              key={index}
              className="text-center text-[10px] font-medium text-gray-400 dark:text-gray-400 py-1 transition-colors duration-300"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">{days}</div>

        {selectedStartDate && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-[#2A2A2A] transition-colors duration-300">
            <p className="text-[10px] text-gray-600 dark:text-gray-300 transition-colors duration-300">
              <span className="font-medium">Selected: </span>
              {selectedStartDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              {selectedEndDate &&
                ` - ${selectedEndDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 lg:pb-0 -mx-4 md:mx-0 px-4 md:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">
            Performance Analytics
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 transition-colors duration-300">
            Track your deals and revenue.
          </p>
        </div>
        <div className="flex gap-3 items-center relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-[#2A2A2A] rounded-lg hover:bg-gray-50 dark:hover:bg-[#141414] transition-colors duration-300"
          >
            <CalendarDays className="w-4 h-4 text-gray-500 dark:text-gray-200" />
            <span className="text-sm text-gray-700 dark:text-white">
              {getDateRangeDisplay()}
            </span>
            <ChevronRight
              className={`w-4 h-4 text-gray-400 dark:text-gray-300 transition-transform ${showDatePicker ? "rotate-90" : ""}`}
            />
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
                    { label: "Today", value: "today" },
                    { label: "Yesterday", value: "yesterday" },
                    { label: "This Week", value: "thisweek" },
                    {
                      label: "Last 7 Days",
                      value: "last7days",
                    },
                    { label: "This Month", value: "thismonth" },
                    {
                      label: "Last 3 Months",
                      value: "last3months",
                    },
                    { label: "This Year", value: "thisyear" },
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
                <div className="flex-1">
                  {renderCalendar()}
                  <div className="flex gap-2 px-3 pb-3">
                    <Button
                      className="flex-1 bg-gray-100 dark:bg-[#2A2A2A] hover:bg-gray-200 dark:hover:bg-[#1C1C1C] text-gray-700 dark:text-white border-none text-xs py-1.5 transition-colors duration-300"
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

      <div className={`grid grid-cols-1 gap-4 sm:gap-6 ${dateRange === 'last3months' || dateRange === 'thisyear' ? '' : 'lg:grid-cols-2'}`}>
        <Card className="border-none shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 overflow-hidden bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
          <CardHeader className="border-b border-gray-100 dark:border-[#2A2A2A] bg-gradient-to-r from-gray-50 to-white dark:from-[#0A0A0A] dark:to-[#141414] pb-3 sm:pb-4 transition-colors duration-300">
            <div className="flex flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-1.5">
                  <CardTitle className="text-[#0E2250] dark:text-white text-base sm:text-lg lg:text-xl transition-colors duration-300">
               Deal Details
                  </CardTitle>
                  <div className="group/tooltip relative">
                    <Info className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 dark:text-gray-400 cursor-help transition-colors duration-300 flex-shrink-0" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/tooltip:block w-56 z-50 pointer-events-none">
                      <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-[#2A2A2A]">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45"></div>
                        Track both sold and redeemed coupons each
                        day to understand customer behavior and
                        optimize your deals.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-[#E35000] to-[#FF8C42]"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Sold</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-[#3b82f6] to-[#60a5fa]"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Redeemed</span>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 sm:px-3 flex-shrink-0"
                  >
                    <Download className="w-3.5 h-3.5 sm:mr-1.5" />
                    <span className="hidden sm:inline text-sm">
                      Export
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div
              className="w-full h-[180px] sm:h-[200px] lg:h-[220px]"
              style={{ width: '100%', height: '180px', minHeight: '180px', minWidth: 0 }}
            >
              {mounted && (
              <ResponsiveContainer width="100%" height={180} minWidth={0} minHeight={180} key={`redemption-${isDark}`}>
                <BarChart
                  data={redemptionData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: -20,
                    bottom: 5,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="colorSold"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#E35000"
                        stopOpacity={1}
                      />
                      <stop
                        offset="100%"
                        stopColor="#FF8C42"
                        stopOpacity={1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorRedeemed"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#3b82f6"
                        stopOpacity={1}
                      />
                      <stop
                        offset="100%"
                        stopColor="#60a5fa"
                        stopOpacity={1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "#2A2A2A" : "#f0f0f0"}
                  />
                  <XAxis
                    dataKey="day"
                    stroke={isDark ? "#94a3b8" : "#94a3b8"}
                    fontSize={11}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke={isDark ? "#94a3b8" : "#94a3b8"}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#0A0A0A" : "#fff",
                      border: isDark ? "1px solid #2A2A2A" : "none",
                      borderRadius: "8px",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      fontSize: "12px"
                    }}
                    labelStyle={{
                      color: isDark ? "#fff" : "#000",
                      fontWeight: "bold"
                    }}
                    itemStyle={{
                      color: isDark ? "#fff" : "#000",
                    }}
                    cursor={{ fill: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)" }}
                  />
                  <Bar
                    dataKey="redemptions"
                    fill="url(#colorSold)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={30}
                    name="Sold"
                  />
                  <Bar
                    dataKey="redeemed"
                    fill="url(#colorRedeemed)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={30}
                    name="Redeemed"
                  />
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 overflow-hidden bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
          <CardHeader className="border-b border-gray-100 dark:border-[#2A2A2A] bg-gradient-to-r from-gray-50 to-white dark:from-[#0A0A0A] dark:to-[#141414] pb-3 sm:pb-4 transition-colors duration-300">
            <div className="flex flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <CardTitle className="text-[#0E2250] dark:text-white text-base sm:text-lg lg:text-xl transition-colors duration-300">
                    Earning Trend
                  </CardTitle>
                  <div className="group/tooltip relative">
                    <Info className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 dark:text-gray-400 cursor-help transition-colors duration-300 flex-shrink-0" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/tooltip:block w-56 z-50 pointer-events-none">
                      <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-[#2A2A2A]">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45"></div>
                        Show the total earning in selected data period
                      </div>
                    </div>
                  </div>
                </div>
          
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 sm:px-3 flex-shrink-0"
                  >
                    <Download className="w-3.5 h-3.5 sm:mr-1.5" />
                    <span className="hidden sm:inline text-sm">
                      Export
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div
              className="w-full h-[180px] sm:h-[200px] lg:h-[220px]"
              style={{ width: '100%', height: '180px', minHeight: '180px', minWidth: 0 }}
            >
              {mounted && (
              <ResponsiveContainer width="100%" height={180} minWidth={0} minHeight={180} key={`revenue-${isDark}`}>
                <AreaChart
                  data={revenueData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: -20,
                    bottom: 5,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#E35000"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="#E35000"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "#2A2A2A" : "#f0f0f0"}
                  />
                  <XAxis
                    dataKey="day"
                    stroke={isDark ? "#94a3b8" : "#94a3b8"}
                    fontSize={11}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke={isDark ? "#94a3b8" : "#94a3b8"}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      `${value / 1000}k`
                    }
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#0A0A0A" : "#fff",
                      border: isDark ? "1px solid #2A2A2A" : "none",
                      borderRadius: "8px",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      fontSize: "12px"
                    }}
                    labelStyle={{
                      color: isDark ? "#fff" : "#000",
                      fontWeight: "bold"
                    }}
                    itemStyle={{
                      color: isDark ? "#fff" : "#000",
                    }}
                    cursor={{ fill: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)" }}
                    labelFormatter={(label: string) => label}
                    formatter={(value: number) => [
                      `LKR ${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#E35000"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                    dot={{
                      fill: "#E35000",
                      strokeWidth: 2,
                      r: 3,
                    }}
                    activeDot={{
                      r: 5,
                      fill: "#E35000",
                      stroke: isDark ? "#141414" : "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Deals & Deal Creations Row */}
      <div className={`grid grid-cols-1 gap-6 mb-6 ${dateRange === 'last3months' || dateRange === 'thisyear' ? '' : 'lg:grid-cols-2'}`}>
        {/* Top Performing Deals */}
        <Card className="border-none shadow-sm hover:shadow-lg dark:shadow-2xl transition-all duration-300 bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
          <CardHeader className="pb-3 border-b border-transparent dark:border-[#2A2A2A] transition-colors duration-300">
            <div className="flex flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1">
                <CardTitle className="text-[#0E2250] dark:text-white text-base sm:text-lg lg:text-xl transition-colors duration-300">
                  Top Performing Deals
                </CardTitle>
                <div className="group/tooltip relative">
                  <Info className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 dark:text-gray-400 cursor-help flex-shrink-0 transition-colors duration-300" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/tooltip:block w-56 z-50 pointer-events-none">
                    <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-[#2A2A2A]">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45"></div>
                      Shows the top 5 deals ranked by total sales in the selected time period.
                    </div>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 lg:h-9 px-2 sm:px-3 flex-shrink-0"
                  >
                    <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4 sm:mr-1.5" />
                    <span className="hidden sm:inline text-sm">
                      Export
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="w-full" style={{ width: '100%', height: '320px', minHeight: '320px', minWidth: 0 }}>
              {mounted && (
              <ResponsiveContainer width="100%" height={320} minWidth={0} minHeight={320} key={`top-deals-${isDark}`}>
                <BarChart 
                  data={[
                    { name: 'Premium Seafood Platter with Garlic Butter Sauce', code: 'DEAL001', sales: 154, redemptions: 142, revenue: 14200 },
                    { name: 'Weekend Brunch Special - Pancakes & Fresh Juice', code: 'DEAL003', sales: 112, redemptions: 108, revenue: 12960 },
                    { name: 'BBQ Feast - Mixed Grill with Sides & Dessert', code: 'DEAL002', sales: 124, redemptions: 115, revenue: 11500 },
                    { name: 'Seafood Grill Combo with Fries & Coleslaw', code: 'DEAL005', sales: 108, redemptions: 98, revenue: 9800 },
                    { name: 'Cooking Class - Italian Cuisine Masterclass', code: 'DEAL004', sales: 105, redemptions: 89, revenue: 8900 }
                  ]}
                  layout="vertical"
                  margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
                  barSize={24}
                >
                  <defs>
                    <linearGradient id="colorTopDeals" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#E35000" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#FF6B35" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#2A2A2A" : "#f0f0f0"} />
                  <XAxis 
                    type="number"
                    stroke={isDark ? "#94a3b8" : "#94a3b8"}
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name"
                    stroke={isDark ? "#94a3b8" : "#94a3b8"}
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    width={140}
                    tickFormatter={(value) => {
                      const maxLength = window.innerWidth < 640 ? 18 : 20;
                      const truncated = value.length > maxLength ? value.substring(0, maxLength) + '...' : value;
                      return truncated;
                    }}
                  />
                  <Tooltip 
                    wrapperStyle={{ outline: 'none' }}
                    cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }}
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div
                            style={{
                              backgroundColor: isDark ? '#0A0A0A' : '#fff',
                              border: isDark ? '1px solid #2A2A2A' : '1px solid #e5e7eb',
                              borderRadius: '8px',
                              padding: '10px',
                              boxShadow: isDark 
                                ? '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)' 
                                : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                              maxWidth: '280px'
                            }}
                          >
                            <div style={{ 
                              color: isDark ? '#E35000' : '#E35000', 
                              fontWeight: 'bold',
                              marginBottom: '6px',
                              fontSize: '12px'
                            }}>
                              {item.code}
                            </div>
                            <div style={{ 
                              color: isDark ? '#e5e7eb' : '#374151',
                              fontSize: '11px',
                              marginBottom: '8px',
                              lineHeight: '1.4'
                            }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: '11px', lineHeight: '1.5', color: isDark ? '#fff' : '#000' }}>
                              <div><strong>Revenue:</strong> LKR {item.revenue.toLocaleString()}</div>
                              <div><strong>Sold:</strong> {item.sales}</div>
                              <div><strong>Redeemed:</strong> {item.redemptions}</div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="url(#colorTopDeals)" 
                    radius={[0, 6, 6, 0]}
                    maxBarSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Deal Creations */}
        <Card className="border-none shadow-sm hover:shadow-lg dark:shadow-2xl transition-all duration-300 bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
          <CardHeader className="pb-3 border-b border-transparent dark:border-[#2A2A2A] transition-colors duration-300">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-[#0E2250] dark:text-white text-base sm:text-lg lg:text-xl transition-colors duration-300">
                    User Engagement
                  </CardTitle>
                  <div className="group/tooltip relative">
                    <Info className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 dark:text-gray-400 cursor-help flex-shrink-0 transition-colors duration-300" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/tooltip:block w-56 z-50 pointer-events-none">
                      <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-[#2A2A2A]">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45"></div>
                        Tracks the number of deal views and sales over time in the selected period.
                      </div>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 lg:h-9 px-2 sm:px-3 flex-shrink-0"
                    >
                      <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4 sm:mr-1.5" />
                      <span className="hidden sm:inline text-sm">
                        Export
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="w-4 h-4 mr-2" />
                      Export as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Deal Selection Dropdown */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 px-3 justify-between min-w-[320px] bg-white dark:bg-[#1C1C1C] border-gray-200 dark:border-[#2A2A2A] hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {selectedEngagementDeals.includes("all")
                          ? "All Deals"
                          : selectedEngagementDeals.length === 1
                          ? selectedEngagementDeals[0]
                          : `${selectedEngagementDeals.length} deals selected`}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[420px] p-0 bg-white dark:bg-[#1C1C1C] border-gray-200 dark:border-[#2A2A2A]" align="start">
                    <div className="p-3 border-b border-gray-200 dark:border-[#2A2A2A]">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search deals..."
                          value={engagementDealSearch}
                          onChange={(e) => setEngagementDealSearch(e.target.value)}
                          className="w-full pl-9 h-9 text-sm bg-white dark:bg-[#0A0A0A] border-gray-300 dark:border-[#2A2A2A] focus:ring-[#E35000] focus:border-[#E35000]"
                        />
                      </div>
                    </div>
                    <div className="p-2 max-h-[280px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:transition-colors hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-500">
                      {(() => {
                        const allDeals = [
                          { id: "all", label: "All Deals" },
                          { id: "Premium Seafood Platter with Garlic Butter Sauce", label: "Premium Seafood Platter with Garlic Butter Sauce" },
                          { id: "Traditional Ayurveda Spa Package with Hot Stone Massage", label: "Traditional Ayurveda Spa Package with Hot Stone Massage" },
                          { id: "Signature Sunset Cocktails & Tropical Mocktails Collection", label: "Signature Sunset Cocktails & Tropical Mocktails Collection" },
                          { id: "Early Morning Beach Yoga Session with Meditation", label: "Early Morning Beach Yoga Session with Meditation" },
                          { id: "Exclusive Wine Tasting Experience with Cheese Platter", label: "Exclusive Wine Tasting Experience with Cheese Platter" },
                        ];
                        
                        const filteredDeals = allDeals.filter((deal) =>
                          deal.label.toLowerCase().includes(engagementDealSearch.toLowerCase())
                        );

                        if (filteredDeals.length === 0) {
                          return (
                            <div className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                              No deals found
                            </div>
                          );
                        }

                        return filteredDeals.map((deal) => {
                          const isAllSelected = selectedEngagementDeals.includes("all");
                          const isChecked = selectedEngagementDeals.includes(deal.id);
                          
                          return (
                            <div
                              key={deal.id}
                              className="flex items-center space-x-2 px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-[#2A2A2A] cursor-pointer transition-colors"
                              onClick={() => {
                                if (deal.id === "all") {
                                  setSelectedEngagementDeals(["all"]);
                                } else {
                                  setSelectedEngagementDeals((prev) => {
                                    const filtered = prev.filter(d => d !== "all");
                                    if (prev.includes(deal.id)) {
                                      const newSelection = filtered.filter(d => d !== deal.id);
                                      return newSelection.length === 0 ? ["all"] : newSelection;
                                    } else {
                                      return [...filtered, deal.id];
                                    }
                                  });
                                }
                              }}
                            >
                              <Checkbox
                                id={deal.id}
                                checked={deal.id === "all" ? isAllSelected : isChecked}
                                onCheckedChange={() => {}}
                                className="border-gray-300 dark:border-gray-600 flex-shrink-0"
                              />
                              <label
                                htmlFor={deal.id}
                                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex-1 truncate"
                              >
                                {deal.label}
                              </label>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Legend */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#6BB6FF]"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Views</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#E35000]"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Coupon Sales</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="w-full h-[200px] sm:h-[240px] lg:h-[280px]" style={{ width: '100%', height: '200px', minHeight: '200px', minWidth: 0 }}>
              {mounted && (
              <ResponsiveContainer width="100%" height={200} minWidth={0} minHeight={200} key={`engagement-${isDark}-${selectedEngagementDeals.join('-')}`}>
                <AreaChart
                  data={(() => {
                    const { start, end } = getActualDateRange();
                    
                    // Generate view data based on selected deals
                    const generateViewData = () => {
                      const baseData = [
                        // September 2024
                        { day: 'Sep 1', date: new Date(2024, 8, 1) },
                        { day: 'Sep 5', date: new Date(2024, 8, 5) },
                        { day: 'Sep 10', date: new Date(2024, 8, 10) },
                        { day: 'Sep 15', date: new Date(2024, 8, 15) },
                        { day: 'Sep 20', date: new Date(2024, 8, 20) },
                        { day: 'Sep 25', date: new Date(2024, 8, 25) },
                        { day: 'Sep 30', date: new Date(2024, 8, 30) },
                        // October 2024
                        { day: 'Oct 1', date: new Date(2024, 9, 1) },
                        { day: 'Oct 5', date: new Date(2024, 9, 5) },
                        { day: 'Oct 10', date: new Date(2024, 9, 10) },
                        { day: 'Oct 15', date: new Date(2024, 9, 15) },
                        { day: 'Oct 20', date: new Date(2024, 9, 20) },
                        { day: 'Oct 25', date: new Date(2024, 9, 25) },
                        { day: 'Oct 31', date: new Date(2024, 9, 31) },
                        // November 2024
                        { day: 'Nov 1', date: new Date(2024, 10, 1) },
                        { day: 'Nov 5', date: new Date(2024, 10, 5) },
                        { day: 'Nov 10', date: new Date(2024, 10, 10) },
                        { day: 'Nov 15', date: new Date(2024, 10, 15) },
                        { day: 'Nov 20', date: new Date(2024, 10, 20) },
                        { day: 'Nov 25', date: new Date(2024, 10, 25) },
                        { day: 'Nov 30', date: new Date(2024, 10, 30) },
                        // December 2024
                        { day: 'Dec 1', date: new Date(2024, 11, 1) },
                        { day: 'Dec 5', date: new Date(2024, 11, 5) },
                        { day: 'Dec 10', date: new Date(2024, 11, 10) },
                        { day: 'Dec 15', date: new Date(2024, 11, 15) },
                        { day: 'Dec 20', date: new Date(2024, 11, 20) },
                        { day: 'Dec 23', date: new Date(2024, 11, 23) },
                        { day: 'Dec 25', date: new Date(2024, 11, 25) },
                        { day: 'Dec 27', date: new Date(2024, 11, 27) },
                        { day: 'Dec 29', date: new Date(2024, 11, 29) },
                      ];

                      // View patterns for different deals
                      const dealViewPatterns = {
                        "all": [180, 220, 250, 320, 380, 420, 450, 520, 580, 640, 720, 800, 850, 920, 1050, 1120, 1200, 1280, 1350, 1420, 1540, 1680, 1820, 1920, 2100, 2280, 2450, 2640, 2850],
                        "Seafood Platter": [45, 52, 58, 72, 85, 95, 105, 118, 132, 148, 165, 182, 195, 210, 240, 255, 275, 292, 310, 325, 352, 385, 415, 440, 480, 520, 560, 605, 650],
                        "Ayurveda Spa": [28, 35, 42, 50, 58, 65, 72, 82, 92, 105, 118, 132, 142, 155, 175, 188, 202, 218, 235, 248, 268, 292, 318, 338, 365, 395, 425, 458, 492],
                        "Sunset Cocktails": [55, 68, 75, 88, 102, 115, 125, 142, 158, 175, 195, 215, 230, 250, 285, 305, 328, 352, 378, 402, 435, 475, 518, 555, 605, 658, 708, 765, 825],
                        "Beach Yoga Session": [22, 28, 32, 38, 45, 52, 58, 66, 74, 84, 95, 106, 115, 126, 143, 154, 166, 178, 192, 205, 222, 242, 264, 282, 308, 335, 362, 392, 423],
                        "Wine Tasting": [30, 37, 43, 52, 62, 72, 82, 95, 108, 122, 138, 155, 168, 184, 208, 224, 242, 260, 280, 298, 323, 352, 384, 410, 447, 486, 525, 568, 612],
                      };

                      // Sales patterns for different deals (roughly 15-25% conversion from views)
                      const dealSalesPatterns = {
                        "all": [32, 42, 48, 62, 75, 85, 92, 108, 122, 136, 155, 175, 188, 205, 238, 255, 275, 295, 315, 335, 365, 402, 438, 465, 510, 558, 602, 650, 705],
                        "Seafood Platter": [8, 10, 11, 14, 17, 19, 21, 24, 27, 30, 34, 38, 41, 45, 52, 56, 61, 65, 69, 73, 80, 88, 96, 102, 112, 122, 132, 143, 155],
                        "Ayurveda Spa": [5, 7, 8, 10, 12, 13, 15, 17, 19, 22, 25, 28, 30, 33, 38, 41, 44, 48, 52, 55, 60, 66, 72, 77, 84, 91, 98, 106, 115],
                        "Sunset Cocktails": [10, 13, 15, 18, 21, 24, 26, 30, 33, 37, 42, 47, 51, 56, 64, 69, 75, 80, 86, 92, 100, 110, 120, 129, 141, 154, 166, 180, 195],
                        "Beach Yoga Session": [4, 5, 6, 7, 9, 10, 12, 14, 15, 18, 20, 23, 25, 27, 31, 34, 37, 40, 43, 46, 51, 56, 61, 66, 72, 79, 85, 92, 100],
                        "Wine Tasting": [5, 7, 8, 10, 12, 14, 16, 19, 22, 25, 29, 33, 36, 40, 46, 50, 54, 59, 64, 68, 74, 81, 89, 95, 104, 114, 123, 134, 145],
                      };

                      // Aggregate data from selected deals
                      let totalViews: number[];
                      let totalSales: number[];

                      if (selectedEngagementDeals.includes("all")) {
                        // Show all deals data
                        totalViews = dealViewPatterns.all;
                        totalSales = dealSalesPatterns.all;
                      } else {
                        // Aggregate selected deals
                        const dataLength = 29; // Number of data points
                        totalViews = Array(dataLength).fill(0);
                        totalSales = Array(dataLength).fill(0);

                        selectedEngagementDeals.forEach((dealName) => {
                          const viewPattern = dealViewPatterns[dealName as keyof typeof dealViewPatterns];
                          const salesPattern = dealSalesPatterns[dealName as keyof typeof dealSalesPatterns];
                          
                          if (viewPattern && salesPattern) {
                            for (let i = 0; i < dataLength; i++) {
                              totalViews[i] += viewPattern[i] || 0;
                              totalSales[i] += salesPattern[i] || 0;
                            }
                          }
                        });
                      }
                      
                      return baseData.map((item, index) => ({
                        ...item,
                        views: totalViews[index] || 0,
                        sales: totalSales[index] || 0
                      }));
                    };

                    const allData = generateViewData();
                    return allData.filter(
                      (item) => item.date >= start && item.date <= end
                    );
                  })()}
                  margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorDealViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6BB6FF" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorDealSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E35000" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FF6B35" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#2A2A2A" : "#f0f0f0"} />
                  <XAxis
                    dataKey="day"
                    stroke={isDark ? "#94a3b8" : "#94a3b8"}
                    fontSize={11}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke={isDark ? "#94a3b8" : "#94a3b8"}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#141414" : "#fff",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      fontSize: "12px"
                    }}
                    labelStyle={{
                      color: isDark ? "#fff" : "#000",
                      fontWeight: "bold"
                    }}
                    itemStyle={{
                      color: isDark ? "#fff" : "#000",
                    }}
                    cursor={{ fill: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)" }}
                    labelFormatter={(label: string) => label}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#6BB6FF"
                    strokeWidth={2}
                    fill="url(#colorDealViews)"
                    dot={{
                      fill: "#6BB6FF",
                      strokeWidth: 2,
                      r: 3,
                    }}
                    activeDot={{
                      r: 5,
                      fill: "#6BB6FF",
                      stroke: isDark ? "#141414" : "#fff",
                      strokeWidth: 2,
                    }}
                    name="Views"
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#E35000"
                    strokeWidth={2}
                    fill="url(#colorDealSales)"
                    dot={{
                      fill: "#E35000",
                      strokeWidth: 2,
                      r: 3,
                    }}
                    activeDot={{
                      r: 5,
                      fill: "#E35000",
                      stroke: isDark ? "#141414" : "#fff",
                      strokeWidth: 2,
                    }}
                    name="Sales"
                  />
                </AreaChart>
              </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm hover:shadow-lg dark:shadow-2xl transition-all duration-300 bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#1C1C1C]">
        <CardHeader className="pb-3 border-b border-transparent dark:border-[#2A2A2A] transition-colors duration-300">
          <div className="flex flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-shrink-0">
              <CardTitle className="text-[#0E2250] dark:text-white text-base sm:text-lg lg:text-xl transition-colors duration-300">
                Deal Performance
              </CardTitle>
              <div className="group/tooltip relative">
                <Info className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 dark:text-gray-400 cursor-help flex-shrink-0 transition-colors duration-300" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/tooltip:block w-56 z-50 pointer-events-none">
                  <div className="bg-gray-900 dark:bg-[#0A0A0A] text-white text-xs rounded-lg p-3 shadow-xl border border-transparent dark:border-[#2A2A2A]">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-[#0A0A0A] rotate-45"></div>
                    Detailed breakdown of each deal's
                    performance metrics including views,
                    sales, redemptions, and earnings over the
                    selected time period.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-1 justify-end">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64 lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={dealSearchQuery}
                  onChange={(e) => setDealSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E35000] focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 lg:h-9 px-2 sm:px-3 flex-shrink-0"
                  >
                    <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4 sm:mr-1.5" />
                    <span className="hidden sm:inline text-sm">
                      Export
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-[#0A0A0A] transition-colors duration-300">
                <tr>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Created Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Deal Name
                  </th>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Views
                  </th>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Sold
                  </th>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Redemptions
                  </th>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span>Conv. Rate</span>
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3 h-3 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>
                              Conversion rate shows the
                              percentage of views that resulted
                              in coupon sales. Higher rates
                              indicate better deal appeal.
                            </p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    Earnings
                  </th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const indexOfLastRow =
                    currentPage * rowsPerPage;
                  const indexOfFirstRow =
                    indexOfLastRow - rowsPerPage;
                  const currentRows = filteredDeals.slice(
                    indexOfFirstRow,
                    indexOfLastRow,
                  );

                  return currentRows.map((row, i) => (
                    <tr
                      key={i}
                      className="bg-white dark:bg-[#1C1C1C] border-b border-gray-200 dark:border-[#2A2A2A] hover:bg-gray-50 dark:hover:!bg-[#2A2A2A] transition-colors"
                    >
                      <td className="px-3 sm:px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap text-xs sm:text-sm transition-colors duration-300">
                        {row.dateStr}
                      </td>
                      <td className="px-3 sm:px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap text-xs sm:text-sm transition-colors duration-300">
                        {row.name}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        {row.views}
                      </td>
                      <td className="px-3 sm:px-6 py-4 font-medium text-[#0E2250] dark:text-[#E35000] text-xs sm:text-sm transition-colors duration-300">
                        {row.sold}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        {row.redemptions}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-emerald-600 dark:text-emerald-400 font-medium text-xs sm:text-sm transition-colors duration-300">
                        {row.conv}
                      </td>
                      <td className="px-3 sm:px-6 py-4 font-medium whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-white transition-colors duration-300">
                        {row.rev}
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {(() => {
              const indexOfLastRow = currentPage * rowsPerPage;
              const indexOfFirstRow =
                indexOfLastRow - rowsPerPage;
              const currentRows = filteredDeals.slice(
                indexOfFirstRow,
                indexOfLastRow,
              );

              return currentRows.map((row, i) => (
                <Card
                  key={i}
                  className="p-4 border border-gray-200 dark:border-[#2A2A2A] shadow-sm dark:bg-[#1C1C1C] transition-colors duration-300"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-[#2A2A2A] transition-colors duration-300">
                      <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                        {row.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        {row.dateStr}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                          Views
                        </span>
                        <span className="text-sm font-medium mt-0.5 text-gray-900 dark:text-white transition-colors duration-300">
                          {row.views}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                          Sold
                        </span>
                        <span className="text-sm font-medium text-[#0E2250] dark:text-[#E35000] mt-0.5 transition-colors duration-300">
                          {row.sold}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                          Redemptions
                        </span>
                        <span className="text-sm font-medium mt-0.5 text-gray-900 dark:text-white transition-colors duration-300">
                          {row.redemptions}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                          Conv. Rate
                        </span>
                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-0.5 transition-colors duration-300">
                          {row.conv}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-[#2A2A2A] transition-colors duration-300">
                      <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        Earnings
                      </span>
                      <p className="text-sm font-medium mt-0.5 text-gray-900 dark:text-white transition-colors duration-300">
                        {row.rev}
                      </p>
                    </div>
                  </div>
                </Card>
              ));
            })()}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-[#2A2A2A] transition-colors duration-300">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
              {Math.min(currentPage * rowsPerPage, filteredDeals.length)} of {filteredDeals.length}
              deals
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.max(1, currentPage - 1))
                }
                disabled={currentPage === 1}
                className="h-8 px-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.ceil(filteredDeals.length / rowsPerPage) },
                  (_, i) => i + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 text-xs rounded transition-colors ${
                      currentPage === page
                        ? "bg-[#E35000] text-white font-medium"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(
                    Math.min(
                      Math.ceil(filteredDeals.length / rowsPerPage),
                      currentPage + 1,
                    ),
                  )
                }
                disabled={
                  currentPage === Math.ceil(filteredDeals.length / rowsPerPage)
                }
                className="h-8 px-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}