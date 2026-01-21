import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";
import {
  Calendar as CalendarIcon,
  Tag,
  MoreHorizontal,
  Smartphone,
  RotateCcw,
  Calendar,
  Search,
  Eye,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
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
import { Checkbox } from "./ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { useTheme } from "next-themes@0.4.6";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { toast } from "sonner@2.0.3";
import { DealDetails } from "./DealDetails";
import { DealsOfTheDay } from "./DealsOfTheDay";

// Mock Data
const MOCK_DEALS = [
  {
    id: "D-001",
    title: "50% Off Sunset Cocktails",
    subtitle: "Happy Hour Special - Limited Time Only",
    description:
      "Enjoy a relaxing evening with our exclusive sunset cocktail selection. Buy any two cocktails and get 50% off.",
    image:
      "https://images.unsplash.com/photo-1683371266972-bcc9500bd5dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGJhciUyMHN1bnNldCUyMGRyaW5rc3xlbnwxfHx8fDE3NjQ2NTE2NjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1683371266972-bcc9500bd5dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGJhciUyMHN1bnNldCUyMGRyaW5rc3xlbnwxfHx8fDE3NjQ2NTE2NjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1683544599381-be284dbd9abf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGJhciUyMGRyaW5rc3xlbnwxfHx8fDE3NjYwNDM2NzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1578554224526-91d308d3948b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBkaW5pbmd8ZW58MXx8fHwxNzY2MDMxNjc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    sold: 124,
    revenue: 620000,
    status: "Active",
    category: "bar",
    promoType: "discount",
    createdDate: "2023-10-01",
    expiry: "2024-12-31",
    validityTimeStart: "5:00 PM",
    validityTimeEnd: "8:00 PM",
    originalPrice: 2500,
    deductionType: "percentage" as "percentage" | "amount",
    deductionValue: 50,
    dealCode: "SUNSET50",
    dealOfTheDayDate: null as string | null,
    totalCoupons: 150,
    redeemedCoupons: 1,
    availableCoupons: 26,
    dealViews: 1245,
    coupons: [
      {
        code: "BAR-8829",
        status: "Redeemed",
        customer: "John Doe",
        date: "2023-10-24",
      },
      {
        code: "BAR-9921",
        status: "Pending",
        customer: "Jane Smith",
        date: "2023-10-25",
      },
      {
        code: "BAR-7732",
        status: "Pending",
        customer: "Mike Ross",
        date: "2023-10-26",
      },
    ],
  },
  {
    id: "D-002",
    title: "Seafood Platter for Two",
    subtitle: "Chef's Special Recommendation",
    description:
      "Enjoy a fresh catch of the day with our signature seafood platter. Perfect for a romantic dinner or a special celebration.",
    image:
      "https://images.unsplash.com/photo-1758448786233-2051ecd150c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwcGxhdHRlciUyMGRpbmluZyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzY0NjUxNjY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1758448786233-2051ecd150c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwcGxhdHRlciUyMGRpbmluZyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzY0NjUxNjY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1765332773114-fb997941dfbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwcGxhdHRlciUyMGRpbmluZ3xlbnwxfHx8fDE3NjYwNDQ1MjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc2NjAxMDAxOHww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    sold: 85,
    revenue: 382500,
    status: "Active",
    category: "dining",
    promoType: "bundle",
    createdDate: "2023-10-05",
    expiry: "2024-11-15",
    validityTimeStart: "12:00 PM",
    validityTimeEnd: "10:00 PM",
    originalPrice: 8500,
    deductionType: "amount" as "percentage" | "amount",
    deductionValue: 2000,
    dealCode: "SEAFOOD2024",
    dealOfTheDayDate: "2023-11-01",
    totalCoupons: 100,
    redeemedCoupons: 1,
    availableCoupons: 15,
    dealViews: 892,
    coupons: [
      {
        code: "SEA-1122",
        status: "Redeemed",
        customer: "Sarah Connor",
        date: "2023-10-20",
      },
    ],
  },
  {
    id: "D-003",
    title: "Afternoon High Tea",
    subtitle: "Traditional English Experience",
    description:
      "Indulge in our classic high tea experience with a selection of fine teas, scones, and pastries.",
    image:
      "https://images.unsplash.com/photo-1707126186318-a3dde00d600e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnRlcm5vb24lMjBoaWdoJTIwdGVhJTIwcGFzdHJpZXMlMjBjYWZlfGVufDF8fHx8MTc2NDY1MTY2NHww&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1707126186318-a3dde00d600e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnRlcm5vb24lMjBoaWdoJTIwdGVhJTIwcGFzdHJpZXMlMjBjYWZlfGVufDF8fHx8MTc2NDY1MTY2NHww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1759530539989-79b011a7c7a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnRlcm5vb24lMjB0ZWElMjBwYXN0cmllc3xlbnwxfHx8fDE3NjYwNDQ1MjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1604552584409-44de624c9f57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlJTIwYmFyfGVufDF8fHx8MTc2NjAzNzI4N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    sold: 42,
    revenue: 105000,
    status: "Draft",
    category: "cafe",
    promoType: "discount",
    createdDate: "2023-10-10",
    expiry: "2024-12-01",
    validityTimeStart: "2:00 PM",
    validityTimeEnd: "5:00 PM",
    originalPrice: 3500,
    deductionType: "percentage" as "percentage" | "amount",
    deductionValue: 25,
    dealCode: "HIGHTEA25",
    dealOfTheDayDate: null,
    totalCoupons: 75,
    redeemedCoupons: 0,
    availableCoupons: 33,
    dealViews: 456,
    coupons: [],
  },
  {
    id: "D-004",
    title: "Buy 1 Get 1 Free Pizza",
    subtitle: "Weekend Special Offer",
    description:
      "Double the fun with our BOGO pizza offer. Buy any large pizza and get another one absolutely free!",
    image:
      "https://images.unsplash.com/photo-1759538919964-153c9861d804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnQlMjBkaW5pbmd8ZW58MXx8fHwxNzY0NjUxNjY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1759538919964-153c9861d804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnQlMjBkaW5pbmd8ZW58MXx8fHwxNzY0NjUxNjY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1578554224526-91d308d3948b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBkaW5pbmd8ZW58MXx8fHwxNzY2MDMxNjc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc2NjAxMDAxOHww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    sold: 200,
    revenue: 400000,
    status: "Active",
    category: "dining",
    promoType: "bogo",
    createdDate: "2023-10-12",
    expiry: "2024-01-01",
    dealOfTheDayDate: null,
    coupons: [],
  },
  {
    id: "D-005",
    title: "Exclusive Wine Tasting",
    description:
      "Sample fine wines from around the world with our expert sommelier.",
    image:
      "https://images.unsplash.com/photo-1632854269219-4ec2553b913c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwdGFzdGluZyUyMGdsYXNzJTIwdmluZXlhcmR8ZW58MXx8fHwxNzY0NjUxNjY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1632854269219-4ec2553b913c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwdGFzdGluZyUyMGdsYXNzJTIwdmluZXlhcmR8ZW58MXx8fHwxNzY0NjUxNjY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1683544599381-be284dbd9abf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGJhciUyMGRyaW5rc3xlbnwxfHx8fDE3NjYwNDM2NzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1604552584409-44de624c9f57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlJTIwYmFyfGVufDF8fHx8MTc2NjAzNzI4N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    sold: 15,
    revenue: 1500000,
    status: "Expired",
    category: "bar",
    promoType: "flash",
    createdDate: "2023-09-15",
    expiry: "2023-09-30",
    dealOfTheDayDate: null,
    coupons: [],
  },
  {
    id: "D-006",
    title: "Premium Coffee Blends",
    description:
      "Try our new single-origin coffee blends. Buy 2 packs and get a free mug.",
    image:
      "https://images.unsplash.com/photo-1649015005325-ea8d33599d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMGN1cCUyMGNhZmV8ZW58MXx8fHwxNzY0NjUxNjY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1649015005325-ea8d33599d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMGN1cCUyMGNhZmV8ZW58MXx8fHwxNzY0NjUxNjY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1604552584409-44de624c9f57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlJTIwYmFyfGVufDF8fHx8MTc2NjAzNzI4N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1759530539989-79b011a7c7a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnRlcm5vb24lMjB0ZWElMjBwYXN0cmllc3xlbnwxfHx8fDE3NjYwNDQ1MjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    sold: 5,
    revenue: 250000,
    status: "Draft",
    category: "cafe",
    promoType: "discount",
    createdDate: "2023-11-01",
    expiry: "2024-03-31",
    dealOfTheDayDate: null,
    coupons: [],
  },
];

// Mock Requested Deals Data
const REQUESTED_DEALS = [
  {
    id: 1,
    date: "2025-12-28",
    username: "John Doe",
    email: "john@example.com",
    contact: "+94-77-1234567",
    category: "Bar",
    notes: "Urgent delivery needed",
  },
  {
    id: 2,
    date: "2025-12-27",
    username: "Sarah Silva",
    email: "sarah.silva@gmail.com",
    contact: "+94-71-9876543",
    category: "Dining",
    notes: "Looking for vegetarian options",
  },
  {
    id: 3,
    date: "2025-12-27",
    username: "Kamal Perera",
    email: "kamal.p@outlook.com",
    contact: "+94-77-5554321",
    category: "Cafe",
    notes: "Need breakfast deals",
  },
  {
    id: 4,
    date: "2025-12-26",
    username: "Emily Watson",
    email: "emily.w@yahoo.com",
    contact: "+94-76-3334567",
    category: "Bar",
    notes: "Corporate event inquiry",
  },
  {
    id: 5,
    date: "2025-12-26",
    username: "Nimal Fernando",
    email: "nimal.fernando@gmail.com",
    contact: "+94-70-2223456",
    category: "Dining",
    notes: "Anniversary special request",
  },
  {
    id: 6,
    date: "2025-12-25",
    username: "Lisa Anderson",
    email: "lisa.anderson@hotmail.com",
    contact: "+94-77-8889999",
    category: "Cafe",
    notes: "Coffee subscription plan",
  },
  {
    id: 7,
    date: "2025-12-25",
    username: "Rajitha Kumar",
    email: "rajitha.k@example.com",
    contact: "+94-71-4445678",
    category: "Bar",
    notes: "Weekend happy hour deals",
  },
  {
    id: 8,
    date: "2025-12-24",
    username: "Michael Brown",
    email: "mbrown@gmail.com",
    contact: "+94-76-7778888",
    category: "Dining",
    notes: "Seafood platter availability",
  },
  {
    id: 9,
    date: "2025-12-24",
    username: "Priya Jayawardena",
    email: "priya.j@outlook.com",
    contact: "+94-77-2223344",
    category: "Cafe",
    notes: "Group booking for 15 people",
  },
  {
    id: 10,
    date: "2025-12-23",
    username: "David Miller",
    email: "david.miller@yahoo.com",
    contact: "+94-70-9990000",
    category: "Bar",
    notes: "Cocktail masterclass inquiry",
  },
  {
    id: 11,
    date: "2025-12-23",
    username: "Saman Wickramasinghe",
    email: "saman.w@gmail.com",
    contact: "+94-71-1112233",
    category: "Dining",
    notes: "Birthday party package",
  },
  {
    id: 12,
    date: "2025-12-22",
    username: "Jessica Taylor",
    email: "jessica.t@example.com",
    contact: "+94-76-5556677",
    category: "Cafe",
    notes: "Lactose-free menu options",
  },
  {
    id: 13,
    date: "2025-12-22",
    username: "Chaminda Perera",
    email: "chaminda.p@outlook.com",
    contact: "+94-77-3334455",
    category: "Bar",
    notes: "Wine tasting session request",
  },
  {
    id: 14,
    date: "2025-12-21",
    username: "Amanda White",
    email: "amanda.white@gmail.com",
    contact: "+94-70-6667788",
    category: "Dining",
    notes: "Gluten-free meal options",
  },
  {
    id: 15,
    date: "2025-12-21",
    username: "Nuwan Silva",
    email: "nuwan.silva@yahoo.com",
    contact: "+94-71-8889900",
    category: "Cafe",
    notes: "Early bird breakfast deals",
  },
  {
    id: 16,
    date: "2025-12-20",
    username: "Sophie Clark",
    email: "sophie.clark@hotmail.com",
    contact: "+94-76-1112222",
    category: "Bar",
    notes: "Private bar reservation",
  },
  {
    id: 17,
    date: "2025-12-20",
    username: "Tharindu Rathnayake",
    email: "tharindu.r@gmail.com",
    contact: "+94-77-9998877",
    category: "Dining",
    notes: "Family dinner package",
  },
  {
    id: 18,
    date: "2025-12-19",
    username: "Olivia Harris",
    email: "olivia.h@example.com",
    contact: "+94-70-4445566",
    category: "Cafe",
    notes: "Vegan pastry selection",
  },
  {
    id: 19,
    date: "2025-12-19",
    username: "Lahiru Bandara",
    email: "lahiru.b@outlook.com",
    contact: "+94-71-7778899",
    category: "Bar",
    notes: "Sports viewing package",
  },
  {
    id: 20,
    date: "2025-12-18",
    username: "Emma Robinson",
    email: "emma.robinson@yahoo.com",
    contact: "+94-76-2223344",
    category: "Dining",
    notes: "Romantic dinner setup",
  },
  {
    id: 21,
    date: "2025-12-18",
    username: "Roshan De Silva",
    email: "roshan.ds@gmail.com",
    contact: "+94-77-5556688",
    category: "Cafe",
    notes: "Outdoor seating preference",
  },
  {
    id: 22,
    date: "2025-12-17",
    username: "Charlotte King",
    email: "charlotte.k@hotmail.com",
    contact: "+94-70-8889911",
    category: "Bar",
    notes: "Craft beer selection inquiry",
  },
  {
    id: 23,
    date: "2025-12-17",
    username: "Kasun Jayasuriya",
    email: "kasun.j@example.com",
    contact: "+94-71-3334466",
    category: "Dining",
    notes: "Buffet pricing details",
  },
  {
    id: 24,
    date: "2025-12-16",
    username: "Mia Walker",
    email: "mia.walker@gmail.com",
    contact: "+94-76-6667799",
    category: "Cafe",
    notes: "Student discount availability",
  },
  {
    id: 25,
    date: "2025-12-16",
    username: "Dinesh Amarasinghe",
    email: "dinesh.a@outlook.com",
    contact: "+94-77-1112244",
    category: "Bar",
    notes: "Live music night dates",
  },
  {
    id: 26,
    date: "2025-12-15",
    username: "Ava Scott",
    email: "ava.scott@yahoo.com",
    contact: "+94-70-2223355",
    category: "Dining",
    notes: "Sunday brunch availability",
  },
  {
    id: 27,
    date: "2025-12-15",
    username: "Ruwan Senanayake",
    email: "ruwan.s@gmail.com",
    contact: "+94-71-5556699",
    category: "Cafe",
    notes: "WiFi speed inquiry",
  },
  {
    id: 28,
    date: "2025-12-14",
    username: "Isabella Young",
    email: "isabella.y@hotmail.com",
    contact: "+94-76-8889922",
    category: "Bar",
    notes: "Signature cocktail list",
  },
  {
    id: 29,
    date: "2025-12-14",
    username: "Ashan Gunasekara",
    email: "ashan.g@example.com",
    contact: "+94-77-3334477",
    category: "Dining",
    notes: "Halal certification query",
  },
  {
    id: 30,
    date: "2025-12-13",
    username: "Grace Martinez",
    email: "grace.m@gmail.com",
    contact: "+94-70-6667700",
    category: "Cafe",
    notes: "Loyalty program details",
  },
  {
    id: 31,
    date: "2025-12-13",
    username: "Hasitha Rajapakse",
    email: "hasitha.r@outlook.com",
    contact: "+94-71-9990011",
    category: "Bar",
    notes: "Karaoke night availability",
  },
  {
    id: 32,
    date: "2025-12-12",
    username: "Lily Thompson",
    email: "lily.t@yahoo.com",
    contact: "+94-76-4445577",
    category: "Dining",
    notes: "Kids menu options",
  },
  {
    id: 33,
    date: "2025-12-12",
    username: "Gayan Wijesinghe",
    email: "gayan.w@gmail.com",
    contact: "+94-77-7778800",
    category: "Cafe",
    notes: "Pet-friendly seating",
  },
  {
    id: 34,
    date: "2025-12-11",
    username: "Zoe Davis",
    email: "zoe.davis@hotmail.com",
    contact: "+94-70-1112266",
    category: "Bar",
    notes: "Mocktail menu request",
  },
  {
    id: 35,
    date: "2025-12-11",
    username: "Sandun Gamage",
    email: "sandun.g@example.com",
    contact: "+94-71-2223388",
    category: "Dining",
    notes: "Organic food options",
  },
  {
    id: 36,
    date: "2025-12-10",
    username: "Chloe Wilson",
    email: "chloe.w@gmail.com",
    contact: "+94-76-5556600",
    category: "Cafe",
    notes: "Work-friendly environment",
  },
  {
    id: 37,
    date: "2025-12-10",
    username: "Mahesh Dissanayake",
    email: "mahesh.d@outlook.com",
    contact: "+94-77-8889933",
    category: "Bar",
    notes: "Whiskey collection inquiry",
  },
  {
    id: 38,
    date: "2025-12-09",
    username: "Ella Moore",
    email: "ella.moore@yahoo.com",
    contact: "+94-70-3334411",
    category: "Dining",
    notes: "Allergen information needed",
  },
  {
    id: 39,
    date: "2025-12-09",
    username: "Buddhika Samaraweera",
    email: "buddhika.s@gmail.com",
    contact: "+94-71-6667722",
    category: "Cafe",
    notes: "Meeting room availability",
  },
  {
    id: 40,
    date: "2025-12-08",
    username: "Scarlett Lee",
    email: "scarlett.l@hotmail.com",
    contact: "+94-76-9990044",
    category: "Bar",
    notes: "DJ night schedule",
  },
  {
    id: 41,
    date: "2025-12-08",
    username: "Chathura Herath",
    email: "chathura.h@example.com",
    contact: "+94-77-4445599",
    category: "Dining",
    notes: "Takeaway packaging options",
  },
  {
    id: 42,
    date: "2025-12-07",
    username: "Victoria Hall",
    email: "victoria.h@gmail.com",
    contact: "+94-70-7778833",
    category: "Cafe",
    notes: "Seasonal menu inquiry",
  },
  {
    id: 43,
    date: "2025-12-07",
    username: "Janaka Perera",
    email: "janaka.p@outlook.com",
    contact: "+94-71-1112255",
    category: "Bar",
    notes: "Pool table reservation",
  },
  {
    id: 44,
    date: "2025-12-06",
    username: "Hannah Wright",
    email: "hannah.w@yahoo.com",
    contact: "+94-76-2223366",
    category: "Dining",
    notes: "Pre-theater menu timing",
  },
  {
    id: 45,
    date: "2025-12-06",
    username: "Thilina Ranasinghe",
    email: "thilina.r@gmail.com",
    contact: "+94-77-5556611",
    category: "Cafe",
    notes: "Book club event space",
  },
  {
    id: 46,
    date: "2025-12-05",
    username: "Aria Green",
    email: "aria.green@hotmail.com",
    contact: "+94-70-8889944",
    category: "Bar",
    notes: "Ladies night specials",
  },
  {
    id: 47,
    date: "2025-12-05",
    username: "Ravindu Jayasinghe",
    email: "ravindu.j@example.com",
    contact: "+94-71-3334400",
    category: "Dining",
    notes: "Reservation cancellation policy",
  },
  {
    id: 48,
    date: "2025-12-04",
    username: "Madison Baker",
    email: "madison.b@gmail.com",
    contact: "+94-76-6667755",
    category: "Cafe",
    notes: "Birthday cake customization",
  },
  {
    id: 49,
    date: "2025-12-04",
    username: "Prabath Silva",
    email: "prabath.s@outlook.com",
    contact: "+94-77-9998866",
    category: "Bar",
    notes: "Trivia night participation",
  },
  {
    id: 50,
    date: "2025-12-03",
    username: "Layla Adams",
    email: "layla.adams@yahoo.com",
    contact: "+94-70-4445522",
    category: "Dining",
    notes: "Chef recommendation needed",
  },
];

export function MyDeals() {
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === "dark" || resolvedTheme === "dark";
  const [deals, setDeals] = useState(MOCK_DEALS);
  const [selectedDeal, setSelectedDeal] = useState<
    (typeof MOCK_DEALS)[0] | null
  >(null);
  const [viewCouponsOpen, setViewCouponsOpen] = useState(false);
  const [assignDateOpen, setAssignDateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [viewingDealDetails, setViewingDealDetails] =
    useState(false);

  // Bulk Deal of the Day State
  const [bulkDealDayOpen, setBulkDealDayOpen] = useState(false);
  const [bulkDate, setBulkDate] = useState("");
  const [selectedBulkDeals, setSelectedBulkDeals] = useState<
    string[]
  >([]);
  const [bulkDealsSearchQuery, setBulkDealsSearchQuery] =
    useState("");

  // Filters State
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [promoFilter, setPromoFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDealOfTheDayOnly, setShowDealOfTheDayOnly] = useState(false);
  const [viewDealsOfTheDayPage, setViewDealsOfTheDayPage] = useState(false);

  // Date Range Picker State (from Overview)
  const [dateRange, setDateRange] = useState("last7days");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    new Date().getMonth(),
  );
  const [currentYear, setCurrentYear] = useState(
    new Date().getFullYear(),
  );
  const [selectedStartDate, setSelectedStartDate] =
    useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] =
    useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [dropdownAlign, setDropdownAlign] = useState<
    "left" | "right"
  >("left");
  const datePickerButtonRef = useRef<HTMLButtonElement>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Changed to 6 for even grid

  // Coupon Table Filters and Pagination
  const [couponStatusFilter, setCouponStatusFilter] =
    useState("all");
  const [couponCustomerSearch, setCouponCustomerSearch] =
    useState("");
  const [couponDateFilter, setCouponDateFilter] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [couponCurrentPage, setCouponCurrentPage] = useState(1);
  const couponItemsPerPage = 5;

  // Coupon Date Picker State
  const [showCouponDatePicker, setShowCouponDatePicker] =
    useState(false);
  const [couponPickerMonth, setCouponPickerMonth] = useState(
    new Date().getMonth(),
  );
  const [couponPickerYear, setCouponPickerYear] = useState(
    new Date().getFullYear(),
  );
  const [couponHoverDate, setCouponHoverDate] =
    useState<Date | null>(null);

  // Requested Deals Dialog State
  const [requestedDealsOpen, setRequestedDealsOpen] =
    useState(false);
  const [requestedDealsPage, setRequestedDealsPage] =
    useState(1);
  const [requestedDealsPerPage, setRequestedDealsPerPage] =
    useState(10);

  // Requested Deals Filters
  const [
    requestedDealsCategoryFilter,
    setRequestedDealsCategoryFilter,
  ] = useState("all");
  const [requestedDealsDateRange, setRequestedDealsDateRange] =
    useState("last7days");
  const [
    requestedDealsSearchQuery,
    setRequestedDealsSearchQuery,
  ] = useState("");

  // Format date range display (from Overview)
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

  // Calendar helper functions (from Overview)
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
            <p className="text-[10px] text-gray-600 dark:text-gray-400 transition-colors duration-300">
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

  // Coupon Date Picker handlers
  const handleCouponDateClick = (day: number) => {
    const selectedDate = new Date(
      couponPickerYear,
      couponPickerMonth,
      day,
    );

    if (
      !couponDateFilter.start ||
      (couponDateFilter.start && couponDateFilter.end)
    ) {
      setCouponDateFilter({ start: selectedDate, end: null });
    } else {
      if (selectedDate < couponDateFilter.start) {
        setCouponDateFilter({
          start: selectedDate,
          end: couponDateFilter.start,
        });
      } else {
        setCouponDateFilter({
          start: couponDateFilter.start,
          end: selectedDate,
        });
      }
      setCouponCurrentPage(1);
    }
  };

  const isCouponInRange = (date: Date) => {
    if (!couponDateFilter.start) return false;
    const endDate =
      couponHoverDate && !couponDateFilter.end
        ? couponHoverDate
        : couponDateFilter.end;
    if (!endDate) return false;

    const start =
      couponDateFilter.start < endDate
        ? couponDateFilter.start
        : endDate;
    const end =
      couponDateFilter.start < endDate
        ? endDate
        : couponDateFilter.start;

    return date >= start && date <= end;
  };

  const isCouponRangeStart = (date: Date) => {
    if (!couponDateFilter.start || !couponDateFilter.end)
      return isSameDay(date, couponDateFilter.start);
    return (
      isSameDay(date, couponDateFilter.start) ||
      isSameDay(date, couponDateFilter.end)
    );
  };

  const renderCouponCalendar = () => {
    const daysInMonth = getDaysInMonth(
      couponPickerMonth,
      couponPickerYear,
    );
    const firstDay = getFirstDayOfMonth(
      couponPickerMonth,
      couponPickerYear,
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
      const date = new Date(
        couponPickerYear,
        couponPickerMonth,
        day,
      );
      const isSelected = isCouponRangeStart(date);
      const isInRangeDate = isCouponInRange(date);
      const isToday = isSameDay(date, new Date());

      days.push(
        <button
          key={day}
          onClick={() => handleCouponDateClick(day)}
          onMouseEnter={() => setCouponHoverDate(date)}
          onMouseLeave={() => setCouponHoverDate(null)}
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
              if (couponPickerMonth === 0) {
                setCouponPickerMonth(11);
                setCouponPickerYear(couponPickerYear - 1);
              } else {
                setCouponPickerMonth(couponPickerMonth - 1);
              }
            }}
            className="p-0.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-200" />
          </button>

          <div className="flex items-center gap-2">
            <select
              value={couponPickerMonth}
              onChange={(e) => {
                e.stopPropagation();
                setCouponPickerMonth(Number(e.target.value));
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
              value={couponPickerYear}
              onChange={(e) => {
                e.stopPropagation();
                setCouponPickerYear(Number(e.target.value));
              }}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-medium text-gray-700 dark:text-white bg-transparent border-none focus:outline-none cursor-pointer transition-colors duration-300"
            >
              {Array.from(
                { length: 10 },
                (_, i) => couponPickerYear - 5 + i,
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (couponPickerMonth === 11) {
                setCouponPickerMonth(0);
                setCouponPickerYear(couponPickerYear + 1);
              } else {
                setCouponPickerMonth(couponPickerMonth + 1);
              }
            }}
            className="p-0.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-200" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map((name, idx) => (
            <div
              key={idx}
              className="h-6 flex items-center justify-center text-[10px] font-medium text-gray-500 dark:text-gray-400"
            >
              {name}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">{days}</div>

        {couponDateFilter.start && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-[#2A2A2A] transition-colors duration-300">
            <p className="text-[10px] text-gray-600 dark:text-gray-400 transition-colors duration-300">
              <span className="font-medium">Selected: </span>
              {couponDateFilter.start.toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              )}
              {couponDateFilter.end &&
                ` - ${couponDateFilter.end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setCouponDateFilter({ start: null, end: null });
                setCouponCurrentPage(1);
              }}
              className="w-full mt-2 h-7 text-xs bg-white dark:bg-[#0E2250] border-gray-300 dark:border-[#1A2F5A] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#1A2F5A]/60"
            >
              Clear Dates
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Filter and paginate coupons
  const getFilteredAndPaginatedCoupons = () => {
    if (!selectedDeal)
      return { coupons: [], totalPages: 0, totalCoupons: 0 };

    let allCoupons = generateCoupons(selectedDeal);

    // Apply status filter
    if (couponStatusFilter !== "all") {
      allCoupons = allCoupons.filter(
        (c) =>
          c.status.toLowerCase() ===
          couponStatusFilter.toLowerCase(),
      );
    }

    // Apply customer search
    if (couponCustomerSearch) {
      allCoupons = allCoupons.filter((c) =>
        c.customer
          .toLowerCase()
          .includes(couponCustomerSearch.toLowerCase()),
      );
    }

    // Apply date filter
    if (couponDateFilter.start && couponDateFilter.end) {
      allCoupons = allCoupons.filter((c) => {
        const purchaseDate = new Date(c.purchaseDate);
        return (
          purchaseDate >= couponDateFilter.start! &&
          purchaseDate <= couponDateFilter.end!
        );
      });
    }

    const totalCoupons = allCoupons.length;
    const totalPages = Math.ceil(
      totalCoupons / couponItemsPerPage,
    );
    const paginatedCoupons = allCoupons.slice(
      (couponCurrentPage - 1) * couponItemsPerPage,
      couponCurrentPage * couponItemsPerPage,
    );

    return {
      coupons: paginatedCoupons,
      totalPages,
      totalCoupons,
    };
  };

  // Reset coupon filters when dialog opens
  const handleViewCouponsOpen = (
    deal: (typeof MOCK_DEALS)[0],
  ) => {
    setSelectedDeal(deal);
    setCouponStatusFilter("all");
    setCouponCustomerSearch("");
    setCouponDateFilter({ start: null, end: null });
    setCouponCurrentPage(1);
    setViewCouponsOpen(true);
  };

  // Generate full list of coupons for the selected deal
  const generateCoupons = (deal: (typeof MOCK_DEALS)[0]) => {
    const customerNames = [
      "John Doe",
      "Jane Smith",
      "Mike Ross",
      "Sarah Connor",
      "David Lee",
      "Emily Brown",
      "Chris Johnson",
      "Rachel Green",
      "Tom Wilson",
      "Lisa Anderson",
      "Mark Davis",
      "Anna Martinez",
      "Paul Garcia",
      "Maria Rodriguez",
      "James Taylor",
      "Jennifer White",
      "Robert Harris",
      "Linda Clark",
      "William Lewis",
      "Barbara Walker",
    ];

    const statuses = ["Redeemed", "Pending"];
    const categoryPrefix = deal.category
      .substring(0, 3)
      .toUpperCase();

    const coupons = [];
    for (let i = 0; i < deal.sold; i++) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const randomCustomer =
        customerNames[
          Math.floor(Math.random() * customerNames.length)
        ];
      const randomStatus =
        Math.random() > 0.7 ? "Pending" : "Redeemed"; // 70% redeemed, 30% pending

      // Generate random purchase date within last 60 days
      const daysAgo = Math.floor(Math.random() * 60);
      const purchaseDate = new Date();
      purchaseDate.setDate(purchaseDate.getDate() - daysAgo);
      const formattedPurchaseDate = purchaseDate
        .toISOString()
        .split("T")[0];

      // Generate redeem date (only for redeemed coupons)
      // Redeem date should be after purchase date, within 1-30 days of purchase
      let redeemDate = null;
      if (randomStatus === "Redeemed") {
        const daysAfterPurchase =
          Math.floor(Math.random() * 30) + 1;
        const redeem = new Date(purchaseDate);
        redeem.setDate(redeem.getDate() + daysAfterPurchase);
        redeemDate = redeem.toISOString().split("T")[0];
      }

      coupons.push({
        code: `${categoryPrefix}-${randomNum}`,
        status: randomStatus,
        customer: randomCustomer,
        date: formattedPurchaseDate,
        redeemDate: redeemDate,
      });
    }

    // Sort by date descending (most recent first)
    return coupons.sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  };

  const handleAssignDate = () => {
    if (!selectedDate || selectedBulkDeals.length === 0) return;

    setDeals(
      deals.map((d) =>
        selectedBulkDeals.includes(d.id)
          ? { ...d, dealOfTheDayDate: selectedDate }
          : d,
      ),
    );

    toast.success("Deal of the Day Scheduled", {
      description: `${selectedBulkDeals.length} deal${selectedBulkDeals.length > 1 ? 's' : ''} scheduled for ${selectedDate}`,
    });
    setAssignDateOpen(false);
    setSelectedDate("");
    setSelectedBulkDeals([]);
  };

  const handleBulkAssign = () => {
    if (!bulkDate || selectedBulkDeals.length === 0) return;

    setDeals(
      deals.map((d) =>
        selectedBulkDeals.includes(d.id)
          ? { ...d, dealOfTheDayDate: bulkDate }
          : d,
      ),
    );

    toast.success("Deals Updated", {
      description: `${selectedBulkDeals.length} deals scheduled for ${bulkDate}`,
    });

    setBulkDealDayOpen(false);
    setBulkDate("");
    setSelectedBulkDeals([]);
  };

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      // Deal of the Day Checkbox Filter
      if (showDealOfTheDayOnly && !deal.dealOfTheDayDate) {
        return false;
      }

      // Status Filter
      if (statusFilter === "dealoftheday") {
        // Show only deals that have dealOfTheDayDate set
        if (!deal.dealOfTheDayDate) return false;
      } else if (
        statusFilter !== "all" &&
        deal.status.toLowerCase() !== statusFilter
      ) {
        return false;
      }

      // Category Filter
      if (
        categoryFilter !== "all" &&
        deal.category !== categoryFilter
      )
        return false;

      // Promo Type Filter
      if (
        promoFilter !== "all" &&
        deal.promoType !== promoFilter
      )
        return false;

      // Search Query Filter - search in title, category, and promo type
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = deal.title
          .toLowerCase()
          .includes(query);
        const matchesCategory = deal.category
          .toLowerCase()
          .includes(query);
        const matchesPromoType = deal.promoType
          .toLowerCase()
          .includes(query);

        if (
          !matchesTitle &&
          !matchesCategory &&
          !matchesPromoType
        )
          return false;
      }

      return true;
    });
  }, [
    deals,
    statusFilter,
    categoryFilter,
    promoFilter,
    searchQuery,
    showDealOfTheDayOnly,
  ]);

  const totalPages = Math.ceil(
    filteredDeals.length / itemsPerPage,
  );
  const paginatedDeals = filteredDeals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const clearFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setPromoFilter("all");
    setSearchQuery("");
    setShowDealOfTheDayOnly(false);
    setCurrentPage(1);
  };

  // Filter Requested Deals
  const filteredRequestedDeals = useMemo(() => {
    return REQUESTED_DEALS.filter((request) => {
      // Category Filter
      if (
        requestedDealsCategoryFilter !== "all" &&
        request.category !== requestedDealsCategoryFilter
      ) {
        return false;
      }

      // Date Range Filter
      const requestDate = new Date(request.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (requestedDealsDateRange !== "all") {
        let startDate = new Date(today);

        switch (requestedDealsDateRange) {
          case "last7days":
            startDate.setDate(today.getDate() - 7);
            break;
          case "last30days":
            startDate.setDate(today.getDate() - 30);
            break;
          case "last3months":
            startDate.setMonth(today.getMonth() - 3);
            break;
          case "thisyear":
            startDate = new Date(today.getFullYear(), 0, 1);
            break;
        }

        if (requestDate < startDate) {
          return false;
        }
      }

      // Search Query Filter - search in username, email, contact, category, and notes
      if (requestedDealsSearchQuery) {
        const query = requestedDealsSearchQuery.toLowerCase();
        const matchesUsername = request.username
          .toLowerCase()
          .includes(query);
        const matchesEmail = request.email
          .toLowerCase()
          .includes(query);
        const matchesContact = request.contact
          .toLowerCase()
          .includes(query);
        const matchesCategory = request.category
          .toLowerCase()
          .includes(query);
        const matchesNotes = request.notes
          .toLowerCase()
          .includes(query);

        if (
          !matchesUsername &&
          !matchesEmail &&
          !matchesContact &&
          !matchesCategory &&
          !matchesNotes
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    requestedDealsCategoryFilter,
    requestedDealsDateRange,
    requestedDealsSearchQuery,
  ]);

  const clearRequestedDealsFilters = () => {
    setRequestedDealsCategoryFilter("all");
    setRequestedDealsDateRange("last7days");
    setRequestedDealsSearchQuery("");
    setRequestedDealsPage(1);
  };

  // If viewing deal details, show the details page
  if (viewingDealDetails && selectedDeal) {
    return (
      <DealDetails
        deal={selectedDeal}
        onBack={() => {
          setViewingDealDetails(false);
          setSelectedDeal(null);
        }}
      />
    );
  }

  // If viewing Deals of the Day page, show that page
  if (viewDealsOfTheDayPage) {
    return (
      <DealsOfTheDay
        deals={deals}
        onBack={() => setViewDealsOfTheDayPage(false)}
      />
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">
            Published Deals
          </h2>
          <p className="text-gray-500 dark:text-blue-200/70 transition-colors duration-300">
            Manage your active offers and track performance.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            className="border-[#E35000] text-[#E35000] hover:bg-orange-50 w-full sm:w-auto text-sm px-[0px] py-[8px]"
            onClick={() => setViewDealsOfTheDayPage(true)}
          >
            <Calendar className="w-4 h-4 mr-2" /> View Deals of
            the Day
          </Button>
          <Button
            className="bg-[#0E2250] hover:bg-[#0E2250]/90 text-white w-full sm:w-auto text-sm"
            onClick={() => setRequestedDealsOpen(true)}
          >
            <Eye className="w-4 h-4 mr-2" /> View Requested
            Deals
          </Button>
        </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full">
            <div className="space-y-2">
              <Label className="text-xs">Status</Label>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Status
                  </SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="expired">
                    Expired
                  </SelectItem>
                  <SelectItem value="deactivated">
                    Deactivated
                  </SelectItem>
                  <SelectItem value="dealoftheday">
                    Deal of the Day
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                            label: "Yesterday",
                            value: "yesterday",
                          },
                          {
                            label: "This Week",
                            value: "thisweek",
                          },
                          {
                            label: "Last 7 Days",
                            value: "last7days",
                          },
                          {
                            label: "This Month",
                            value: "thismonth",
                          },
                          {
                            label: "Last 3 Months",
                            value: "last3months",
                          },
                          {
                            label: "This Year",
                            value: "thisyear",
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

      {/* Deals Grid - Changed to 2 columns on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        {paginatedDeals.length === 0 ? (
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
          paginatedDeals.map((deal) => (
            <Card
              key={deal.id}
              className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow dark:bg-[#1A2F5A]/20 dark:transition-colors dark:duration-300"
            >
              <div className="flex flex-row h-40">
                <div
                  className="w-32 sm:w-40 h-full relative flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    setSelectedDeal(deal);
                    setViewingDealDetails(true);
                  }}
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
                  onClick={() => {
                    setSelectedDeal(deal);
                    setViewingDealDetails(true);
                  }}
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
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDeal(deal);
                            setViewingDealDetails(true);
                          }}
                        >
                          More details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCouponsOpen(deal);
                          }}
                        >
                          View Coupons
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDeal(deal);
                            setSelectedBulkDeals([deal.id]);
                            setAssignDateOpen(true);
                          }}
                        >
                          Set as Deal of the Day
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => e.stopPropagation()}
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
                          handleViewCouponsOpen(deal);
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
                          setSelectedDeal(deal);
                          setSelectedBulkDeals([deal.id]);
                          setAssignDateOpen(true);
                        }}
                      >
                        Promote
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredDeals.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1)
                    setCurrentPage((p) => p - 1);
                }}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>

            {Array.from(
              { length: totalPages },
              (_, i) => i + 1,
            ).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages)
                    setCurrentPage((p) => p + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Coupons Dialog */}
      <Dialog
        open={viewCouponsOpen}
        onOpenChange={setViewCouponsOpen}
      >
        <DialogContent className="!w-[85vw] !max-w-[85vw] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-[#0E2250] border-gray-200 dark:border-[#1A2F5A] transition-colors duration-300">
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0 bg-white dark:bg-[#0E2250] border-b border-gray-200 dark:border-[#1A2F5A] transition-colors duration-300">
            <DialogTitle className="text-gray-900 dark:text-white transition-colors duration-300">
              Coupon Details
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Viewing coupons for{" "}
              <span className="font-semibold text-[#0E2250] dark:text-[#E35000] transition-colors duration-300">
                {selectedDeal?.title}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 pb-2 bg-white dark:bg-[#0E2250] transition-colors duration-300">
            {/* Minimal Coupon Statistics */}
            {selectedDeal && (
              <div className="flex gap-3 mb-4">
                <div className="flex-1 rounded-lg p-3 border bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/30 transition-colors duration-300">
                  <div className="text-lg font-bold text-blue-700 dark:text-blue-400 transition-colors duration-300">
                    {selectedDeal.sold + 50}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-300 transition-colors duration-300">
                    Total coupons
                  </div>
                </div>
                <div className="flex-1 rounded-lg p-3 border bg-orange-50 dark:bg-[#E35000]/10 border-orange-100 dark:border-[#E35000]/30 transition-colors duration-300">
                  <div className="text-lg font-bold text-[#E35000] dark:text-[#FF6B35] transition-colors duration-300">
                    {selectedDeal.sold}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-300 transition-colors duration-300">
                    Sold
                  </div>
                </div>
                <div className="flex-1 rounded-lg p-3 border bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/30 transition-colors duration-300">
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-300">
                    50
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-300 transition-colors duration-300">
                    Available
                  </div>
                </div>
              </div>
            )}

            {/* Coupon Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1">
                <Label className="text-xs mb-1 block text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Search Customer
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                  <Input
                    type="text"
                    placeholder="Search by customer name..."
                    value={couponCustomerSearch}
                    onChange={(e) => {
                      setCouponCustomerSearch(e.target.value);
                      setCouponCurrentPage(1);
                    }}
                    className="pl-9 h-9 bg-white dark:bg-[#0E2250] border-gray-300 dark:border-[#1A2F5A] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors duration-300"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Label className="text-xs mb-1 block text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Purchase Date
                </Label>
                <Popover
                  open={showCouponDatePicker}
                  onOpenChange={setShowCouponDatePicker}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 w-full justify-start text-left font-normal bg-white dark:bg-[#0E2250] border-gray-300 dark:border-[#1A2F5A] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#1A2F5A]/60 transition-colors duration-300"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      {couponDateFilter.start &&
                      couponDateFilter.end ? (
                        <span className="text-xs">
                          {couponDateFilter.start.toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          )}{" "}
                          -{" "}
                          {couponDateFilter.end.toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          )}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Select date range
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white dark:bg-[#0E2250] border-gray-300 dark:border-[#1A2F5A] transition-colors duration-300"
                    align="start"
                  >
                    {renderCouponCalendar()}
                  </PopoverContent>
                </Popover>
              </div>
              <div className="sm:w-48">
                <Label className="text-xs mb-1 block text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Filter by Status
                </Label>
                <Select
                  value={couponStatusFilter}
                  onValueChange={(value) => {
                    setCouponStatusFilter(value);
                    setCouponCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-9 bg-white dark:bg-[#0E2250] border-gray-300 dark:border-[#1A2F5A] text-gray-900 dark:text-white transition-colors duration-300">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All Status
                    </SelectItem>
                    <SelectItem value="redeemed">
                      Redeemed
                    </SelectItem>
                    <SelectItem value="pending">
                      Pending
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border bg-white dark:bg-[#0E2250] border-gray-200 dark:border-[#1A2F5A] transition-colors duration-300">
              <Table className="w-full">
                <TableHeader className="bg-gray-50 dark:bg-[#1A2F5A]/40 transition-colors duration-300">
                  <TableRow className="border-gray-200 dark:border-[#1A2F5A] hover:bg-gray-100 dark:hover:bg-[#1A2F5A]/60 transition-colors duration-300">
                    <TableHead className="w-[22%] text-gray-700 dark:text-gray-200 transition-colors duration-300">
                      Coupon Code
                    </TableHead>
                    <TableHead className="w-[28%] text-gray-700 dark:text-gray-200 transition-colors duration-300">
                      Customer
                    </TableHead>
                    <TableHead className="w-[18%] text-gray-700 dark:text-gray-200 transition-colors duration-300">
                      Purchase Date
                    </TableHead>
                    <TableHead className="w-[18%] text-gray-700 dark:text-gray-200 transition-colors duration-300">
                      Redeem Date
                    </TableHead>
                    <TableHead className="w-[14%] text-gray-700 dark:text-gray-200 transition-colors duration-300">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!selectedDeal || selectedDeal.sold === 0 ? (
                    <TableRow className="border-gray-200 dark:border-[#1A2F5A] hover:bg-gray-50 dark:hover:bg-[#1A2F5A]/30 transition-colors duration-300">
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-500 dark:text-gray-300 transition-colors duration-300"
                      >
                        No coupons sold yet.
                      </TableCell>
                    </TableRow>
                  ) : getFilteredAndPaginatedCoupons()
                      .totalCoupons === 0 ? (
                    <TableRow className="border-gray-200 dark:border-[#1A2F5A] hover:bg-gray-50 dark:hover:bg-[#1A2F5A]/30 transition-colors duration-300">
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-500 dark:text-gray-300 transition-colors duration-300"
                      >
                        No coupons found matching your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    getFilteredAndPaginatedCoupons().coupons.map(
                      (coupon, i) => (
                        <TableRow
                          key={i}
                          className="border-gray-200 dark:border-[#1A2F5A] hover:bg-gray-50 dark:hover:bg-[#1A2F5A]/30 transition-colors duration-300"
                        >
                          <TableCell className="font-mono font-medium w-[22%] text-gray-900 dark:text-gray-100 transition-colors duration-300">
                            {coupon.code}
                          </TableCell>
                          <TableCell className="w-[28%] text-gray-900 dark:text-gray-100 transition-colors duration-300">
                            {coupon.customer}
                          </TableCell>
                          <TableCell className="w-[18%] text-gray-900 dark:text-gray-100 transition-colors duration-300">
                            {coupon.date}
                          </TableCell>
                          <TableCell className="w-[18%]">
                            {coupon.redeemDate ? (
                              <span className="text-emerald-600 dark:text-emerald-400 transition-colors duration-300">
                                {coupon.redeemDate}
                              </span>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-400 transition-colors duration-300">
                                -
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="w-[14%]">
                            <Badge
                              variant={
                                coupon.status === "Redeemed"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                coupon.status === "Redeemed"
                                  ? "bg-emerald-500 dark:bg-emerald-600 text-white transition-colors duration-300"
                                  : "bg-yellow-500 dark:bg-yellow-600 text-white transition-colors duration-300"
                              }
                            >
                              {coupon.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ),
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Minimal Pagination Footer */}
          {selectedDeal &&
            getFilteredAndPaginatedCoupons().totalCoupons >
              couponItemsPerPage && (
              <div className="flex items-center justify-between px-6 py-4 border-t shrink-0 bg-gray-50 dark:bg-[#0E2250] border-gray-200 dark:border-[#1A2F5A] transition-colors duration-300">
                <div className="text-sm text-gray-600 dark:text-gray-200 transition-colors duration-300">
                  Showing{" "}
                  {(couponCurrentPage - 1) *
                    couponItemsPerPage +
                    1}{" "}
                  to{" "}
                  {Math.min(
                    couponCurrentPage * couponItemsPerPage,
                    getFilteredAndPaginatedCoupons()
                      .totalCoupons,
                  )}{" "}
                  of{" "}
                  {
                    getFilteredAndPaginatedCoupons()
                      .totalCoupons
                  }{" "}
                  coupons
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCouponCurrentPage((p) => p - 1)
                    }
                    disabled={couponCurrentPage === 1}
                    className="h-8 w-8 p-0 border-gray-300 dark:border-[#1A2F5A] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1A2F5A]/60 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                  >
                    ‹
                  </Button>
                  <span className="text-sm px-2 text-gray-600 dark:text-gray-200 transition-colors duration-300">
                    {couponCurrentPage} /{" "}
                    {
                      getFilteredAndPaginatedCoupons()
                        .totalPages
                    }
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCouponCurrentPage((p) => p + 1)
                    }
                    disabled={
                      couponCurrentPage ===
                      getFilteredAndPaginatedCoupons()
                        .totalPages
                    }
                    className="h-8 w-8 p-0 border-gray-300 dark:border-[#1A2F5A] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1A2F5A]/60 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                  >
                    ›
                  </Button>
                </div>
              </div>
            )}
        </DialogContent>
      </Dialog>

      {/* Single Deal of the Day Dialog */}
      <Dialog
        open={assignDateOpen}
        onOpenChange={setAssignDateOpen}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Schedule Deal of the Day</DialogTitle>
            <DialogDescription>
              Select a date and deals to feature them in the "Deal of the Day" section of the mobile app.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6 flex-1 overflow-hidden flex flex-col">
            <div className="space-y-2">
              <Label htmlFor="date">Select Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="date"
                  type="date"
                  className="pl-9 border-gray-300 dark:border-[#2A2A2A] text-gray-900 dark:text-white bg-white dark:bg-[#0A0A0A] focus:ring-2 focus:ring-[#E35000] focus:border-[#E35000] dark:focus:border-[#E35000] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:invert [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 transition-all duration-200"
                  value={selectedDate}
                  onChange={(e) =>
                    setSelectedDate(e.target.value)
                  }
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="single-search">Search Deals</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  id="single-search"
                  type="text"
                  placeholder="Search by deal name or sold count..."
                  className="pl-9 border-gray-300 dark:border-[#2A2A2A] text-gray-900 dark:text-white bg-white dark:bg-[#0A0A0A] placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#E35000] focus:border-[#E35000] dark:focus:border-[#E35000] transition-all duration-200"
                  value={bulkDealsSearchQuery}
                  onChange={(e) =>
                    setBulkDealsSearchQuery(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto border rounded-md p-2">
              <Label className="mb-2 block px-2 text-gray-500 text-xs uppercase">
                Select Deals to Feature
              </Label>
              <div className="space-y-2">
                {deals
                  .filter((d) => {
                    // Filter by status
                    if (d.status !== "Active") return false;

                    // Filter by search query
                    if (bulkDealsSearchQuery.trim()) {
                      const searchLower =
                        bulkDealsSearchQuery.toLowerCase();
                      const matchesTitle = d.title
                        .toLowerCase()
                        .includes(searchLower);
                      const matchesSold = d.sold
                        .toString()
                        .includes(searchLower);
                      if (!matchesTitle && !matchesSold)
                        return false;
                    }

                    return true;
                  })
                  .map((deal) => (
                    <div
                      key={deal.id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-[#0E2250]/50 rounded-md border border-transparent hover:border-gray-200 dark:hover:border-[#1A2F5A] transition-colors"
                    >
                      <Checkbox
                        id={`single-${deal.id}`}
                        checked={selectedBulkDeals.includes(
                          deal.id,
                        )}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedBulkDeals([
                              ...selectedBulkDeals,
                              deal.id,
                            ]);
                          } else {
                            setSelectedBulkDeals(
                              selectedBulkDeals.filter(
                                (id) => id !== deal.id,
                              ),
                            );
                          }
                        }}
                      />
                      <div className="flex-1 flex items-center gap-3">
                        <img
                          src={deal.image}
                          alt={deal.title}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900 dark:text-white">
                            {deal.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Sold: {deal.sold}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAssignDateOpen(false);
                setSelectedBulkDeals([]);
                setBulkDealsSearchQuery("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignDate}
              className="bg-[#E35000] hover:bg-[#c44500] text-white"
              disabled={!selectedDate || selectedBulkDeals.length === 0}
            >
              Schedule {selectedBulkDeals.length > 0 ? `${selectedBulkDeals.length} ` : ''}Deal{selectedBulkDeals.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Deal of the Day Dialog */}
      <Dialog
        open={bulkDealDayOpen}
        onOpenChange={setBulkDealDayOpen}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Set Deals of the Day</DialogTitle>
            <DialogDescription>
              Select a date and multiple deals to feature them
              on the mobile app.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6 flex-1 overflow-hidden flex flex-col">
            <div className="space-y-2">
              <Label htmlFor="bulk-date">Select Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="bulk-date"
                  type="date"
                  className="pl-9 border-gray-300 dark:border-[#2A2A2A] text-gray-900 dark:text-white bg-white dark:bg-[#0A0A0A] focus:ring-2 focus:ring-[#E35000] focus:border-[#E35000] dark:focus:border-[#E35000] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:invert [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 transition-all duration-200"
                  value={bulkDate}
                  onChange={(e) => setBulkDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bulk-search">Search Deals</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  id="bulk-search"
                  type="text"
                  placeholder="Search by deal name or sold count..."
                  className="pl-9 border-gray-300 dark:border-[#2A2A2A] text-gray-900 dark:text-white bg-white dark:bg-[#0A0A0A] placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#E35000] focus:border-[#E35000] dark:focus:border-[#E35000] transition-all duration-200"
                  value={bulkDealsSearchQuery}
                  onChange={(e) =>
                    setBulkDealsSearchQuery(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto border rounded-md p-2">
              <Label className="mb-2 block px-2 text-gray-500 text-xs uppercase">
                Select Deals to Feature
              </Label>
              <div className="space-y-2">
                {deals
                  .filter((d) => {
                    // Filter by status
                    if (d.status !== "Active") return false;

                    // Filter by search query
                    if (bulkDealsSearchQuery.trim()) {
                      const searchLower =
                        bulkDealsSearchQuery.toLowerCase();
                      const matchesTitle = d.title
                        .toLowerCase()
                        .includes(searchLower);
                      const matchesSold = d.sold
                        .toString()
                        .includes(searchLower);
                      if (!matchesTitle && !matchesSold)
                        return false;
                    }

                    return true;
                  })
                  .map((deal) => (
                    <div
                      key={deal.id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-[#0E2250]/50 rounded-md border border-transparent hover:border-gray-200 dark:hover:border-[#1A2F5A] transition-colors"
                    >
                      <Checkbox
                        id={`bulk-${deal.id}`}
                        checked={selectedBulkDeals.includes(
                          deal.id,
                        )}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedBulkDeals([
                              ...selectedBulkDeals,
                              deal.id,
                            ]);
                          } else {
                            setSelectedBulkDeals(
                              selectedBulkDeals.filter(
                                (id) => id !== deal.id,
                              ),
                            );
                          }
                        }}
                      />
                      <div className="flex-1 flex items-center gap-3">
                        <img
                          src={deal.image}
                          alt=""
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`bulk-${deal.id}`}
                            className="text-sm font-medium cursor-pointer block"
                          >
                            {deal.title}
                          </label>
                          <div className="text-xs text-gray-500 flex gap-2">
                            <span>{deal.sold} Sold</span>
                            {deal.dealOfTheDayDate && (
                              <span className="text-orange-600 font-medium">
                                Already set for{" "}
                                {deal.dealOfTheDayDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBulkDealDayOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkAssign}
              className="bg-[#E35000] hover:bg-[#c44500] text-white"
              disabled={
                !bulkDate || selectedBulkDeals.length === 0
              }
            >
              Set Deals ({selectedBulkDeals.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Requested Deals Dialog */}
      <Dialog
        open={requestedDealsOpen}
        onOpenChange={setRequestedDealsOpen}
      >
        <DialogContent className="max-w-[95vw] sm:max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-xl">
              Requested Deals
            </DialogTitle>
            <DialogDescription>
              Customer deal requests and inquiries from your
              business
            </DialogDescription>
          </DialogHeader>

          {/* Filters */}
          <div className="shrink-0 pb-[0px] border-b p-[0px] pt-[0px] pr-[0px] pl-[24px]">
            <div className="flex flex-col md:flex-row gap-3 md:items-end">
              {/* Search Bar */}
              <div className="flex-1 md:max-w-xs space-y-1.5 md:space-y-0">
                <Label className="text-xs md:hidden">
                  Search
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search requests..."
                    value={requestedDealsSearchQuery}
                    onChange={(e) => {
                      setRequestedDealsSearchQuery(
                        e.target.value,
                      );
                      setRequestedDealsPage(1);
                    }}
                    className="pl-9 h-9"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-1.5 md:space-y-0 md:w-44">
                <Label className="text-xs md:hidden">
                  Category
                </Label>
                <Select
                  value={requestedDealsCategoryFilter}
                  onValueChange={(value) => {
                    setRequestedDealsCategoryFilter(value);
                    setRequestedDealsPage(1);
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All Categories
                    </SelectItem>
                    <SelectItem value="Bar">Bar</SelectItem>
                    <SelectItem value="Dining">
                      Dining
                    </SelectItem>
                    <SelectItem value="Cafe">Cafe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-1.5 md:space-y-0 md:w-44">
                <Label className="text-xs md:hidden">
                  Date Range
                </Label>
                <Select
                  value={requestedDealsDateRange}
                  onValueChange={(value) => {
                    setRequestedDealsDateRange(value);
                    setRequestedDealsPage(1);
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="last7days">
                      Last 7 Days
                    </SelectItem>
                    <SelectItem value="last30days">
                      Last 30 Days
                    </SelectItem>
                    <SelectItem value="last3months">
                      Last 3 Months
                    </SelectItem>
                    <SelectItem value="thisyear">
                      This Year
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Button */}
              {(requestedDealsCategoryFilter !== "all" ||
                requestedDealsDateRange !== "last7days" ||
                requestedDealsSearchQuery) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearRequestedDealsFilters}
                  className="h-9 whitespace-nowrap w-full md:w-auto"
                >
                  <RotateCcw className="w-3 h-3 mr-1.5" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Table Container with Scroll */}
          <div className="flex-1 overflow-auto -mx-6 scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400">
            {/* Desktop Table */}
            <div className="hidden md:block px-6 py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm font-semibold">
                      Date
                    </TableHead>
                    <TableHead className="text-sm font-semibold">
                      Username
                    </TableHead>
                    <TableHead className="text-sm font-semibold">
                      Email
                    </TableHead>
                    <TableHead className="text-sm font-semibold">
                      Contact Number
                    </TableHead>
                    <TableHead className="text-sm font-semibold">
                      Category
                    </TableHead>
                    <TableHead className="text-sm font-semibold">
                      Notes
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequestedDeals
                    .slice(
                      (requestedDealsPage - 1) *
                        requestedDealsPerPage,
                      requestedDealsPage *
                        requestedDealsPerPage,
                    )
                    .map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="text-sm font-medium">
                          {request.date}
                        </TableCell>
                        <TableCell className="text-sm">
                          {request.username}
                        </TableCell>
                        <TableCell className="text-sm">
                          {request.email}
                        </TableCell>
                        <TableCell className="text-sm font-mono">
                          {request.contact}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="capitalize text-xs"
                          >
                            {request.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                          {request.notes}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden px-6 py-4 space-y-3">
              {filteredRequestedDeals
                .slice(
                  (requestedDealsPage - 1) *
                    requestedDealsPerPage,
                  requestedDealsPage * requestedDealsPerPage,
                )
                .map((request) => (
                  <Card
                    key={request.id}
                    className="p-4 border border-gray-200"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Date
                        </span>
                        <span className="text-sm font-medium">
                          {request.date}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Username
                        </span>
                        <span className="text-sm font-medium">
                          {request.username}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Email
                        </span>
                        <span className="text-sm truncate ml-2">
                          {request.email}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Contact
                        </span>
                        <span className="text-sm font-mono">
                          {request.contact}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Category
                        </span>
                        <Badge
                          variant="outline"
                          className="capitalize text-xs"
                        >
                          {request.category}
                        </Badge>
                      </div>
                      <div className="pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500 block mb-1">
                          Notes
                        </span>
                        <p className="text-sm text-gray-700">
                          {request.notes}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>

          {/* Pagination Footer */}
          <div className="shrink-0 border-t pt-4 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 order-2 sm:order-1">
              Showing{" "}
              {(requestedDealsPage - 1) *
                requestedDealsPerPage +
                1}{" "}
              to{" "}
              {Math.min(
                requestedDealsPage * requestedDealsPerPage,
                filteredRequestedDeals.length,
              )}{" "}
              of {filteredRequestedDeals.length} requests
            </div>

            <div className="flex items-center gap-4 order-1 sm:order-2">
              {/* Rows Per Page Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden sm:inline whitespace-nowrap">
                  Rows per page:
                </span>
                <Select
                  value={requestedDealsPerPage.toString()}
                  onValueChange={(value) => {
                    setRequestedDealsPerPage(Number(value));
                    setRequestedDealsPage(1);
                  }}
                >
                  <SelectTrigger className="h-9 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Page Navigation */}
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setRequestedDealsPage((p) =>
                          Math.max(1, p - 1),
                        )
                      }
                      className={
                        requestedDealsPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {/* Page Numbers */}
                  {Array.from({
                    length: Math.ceil(
                      filteredRequestedDeals.length /
                        requestedDealsPerPage,
                    ),
                  })
                    .map((_, i) => i + 1)
                    .filter((page) => {
                      const totalPages = Math.ceil(
                        filteredRequestedDeals.length /
                          requestedDealsPerPage,
                      );
                      // Show first, last, current, and adjacent pages
                      return (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - requestedDealsPage) <= 1
                      );
                    })
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {/* Show ellipsis if gap */}
                        {index > 0 &&
                          array[index - 1] !== page - 1 && (
                            <PaginationItem>
                              <span className="px-2 text-gray-400">
                                ...
                              </span>
                            </PaginationItem>
                          )}
                        <PaginationItem>
                          <PaginationLink
                            onClick={() =>
                              setRequestedDealsPage(page)
                            }
                            isActive={
                              requestedDealsPage === page
                            }
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      </React.Fragment>
                    ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setRequestedDealsPage((p) =>
                          Math.min(
                            Math.ceil(
                              filteredRequestedDeals.length /
                                requestedDealsPerPage,
                            ),
                            p + 1,
                          ),
                        )
                      }
                      className={
                        requestedDealsPage ===
                        Math.ceil(
                          filteredRequestedDeals.length /
                            requestedDealsPerPage,
                        )
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}