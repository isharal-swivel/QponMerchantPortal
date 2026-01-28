import React, { useState } from 'react';
import { ArrowLeft, Calendar, Tag, Users, TrendingUp, Share2, ChevronLeft, ChevronRight, Clock, DollarSign, Percent, Hash, Edit, Eye, XCircle, FileText, AlertTriangle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

interface DealDetailsProps {
  deal: {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    image: string;
    images?: string[];
    sold: number;
    revenue: number;
    status: string;
    category: string;
    promoType: string;
    createdDate: string;
    expiry: string;
    validityTimeStart?: string;
    validityTimeEnd?: string;
    originalPrice?: number;
    deductionType?: 'percentage' | 'amount';
    deductionValue?: number;
    dealCode?: string;
    dealOfTheDayDate: string | null;
    coupons: any[];
    totalCoupons?: number;
    redeemedCoupons?: number;
    availableCoupons?: number;
    dealViews?: number;
  };
  onBack: () => void;
}

export function DealDetails({ deal, onBack }: DealDetailsProps) {
  const dealImages = deal.images || [deal.image];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [couponSearchQuery, setCouponSearchQuery] = useState("");
  const [couponStatusFilter, setCouponStatusFilter] = useState("all");

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % dealImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + dealImages.length) % dealImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleViewCouponsOpen = () => {
    setCouponDialogOpen(true);
  };

  // Filter coupons based on search and status
  const filteredCoupons = React.useMemo(() => {
    let filtered = [...deal.coupons];

    // Search filter
    if (couponSearchQuery) {
      filtered = filtered.filter(
        (coupon) =>
          coupon.code.toLowerCase().includes(couponSearchQuery.toLowerCase()) ||
          coupon.customer.toLowerCase().includes(couponSearchQuery.toLowerCase())
      );
    }

    // Status filter
    if (couponStatusFilter !== "all") {
      filtered = filtered.filter((coupon) => coupon.status.toLowerCase() === couponStatusFilter.toLowerCase());
    }

    return filtered;
  }, [deal.coupons, couponSearchQuery, couponStatusFilter]);

  // Auto-play carousel
  React.useEffect(() => {
    if (dealImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % dealImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [dealImages.length]);

  return (
    <div className="space-y-5 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-[#1C1C1C] transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white transition-colors duration-300" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">Deal Details</h2>
          <p className="text-sm text-gray-500 dark:text-blue-200/70 transition-colors duration-300">View and manage your deal</p>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Main Content (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Carousel */}
          <div className="relative rounded-xl overflow-hidden shadow-md">
            <div className="aspect-[21/9] bg-gray-100">
              <img
                src={dealImages[currentImageIndex]}
                alt={`${deal.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className={`text-xs px-3 py-1 font-medium ${
                deal.status === 'Active' ? 'bg-emerald-500' : 
                deal.status === 'Expired' ? 'bg-red-500' : 
                deal.status === 'Deactivated' ? 'bg-gray-600 dark:bg-gray-500' : 
                'bg-gray-500'
              }`}>
                {deal.status}
              </Badge>
              {deal.dealOfTheDayDate && (
                <Badge className="bg-[#E35000] text-xs px-3 py-1 font-medium">
                  Deal of the Day - {deal.dealOfTheDayDate}
                </Badge>
              )}
            </div>
            {dealImages.length > 1 && (
              <>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex justify-center gap-2">
                  {dealImages.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 rounded-full transition-all ${currentImageIndex === index ? 'bg-white w-6' : 'bg-white/60 hover:bg-white/90 w-2'}`}
                      onClick={() => goToImage(index)}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
                <button 
                  className="absolute top-1/2 left-3 -translate-y-1/2 z-10 bg-white/95 hover:bg-white text-[#0E2250] rounded-full p-2 shadow-lg transition-all" 
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  className="absolute top-1/2 right-3 -translate-y-1/2 z-10 bg-white/95 hover:bg-white text-[#0E2250] rounded-full p-2 shadow-lg transition-all" 
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Deal Information */}
          <div className="bg-white dark:bg-[#141414] rounded-xl shadow-sm border border-gray-100 dark:border-[#2A2A2A] p-6 transition-colors duration-300">
            <div className="pb-5 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-2xl font-bold text-[#0E2250] dark:text-white mb-2 transition-colors duration-300">{deal.title}</h3>
              {deal.subtitle && (
                <p className="text-base text-gray-600 dark:text-gray-300 mb-3 transition-colors duration-300">{deal.subtitle}</p>
              )}
              <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed transition-colors duration-300">{deal.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 dark:bg-[#1C1C1C] rounded-lg flex-shrink-0 transition-colors duration-300">
                  <Tag className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-colors duration-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300">Category</p>
                  <p className="text-base font-semibold text-[#0E2250] dark:text-white capitalize transition-colors duration-300">{deal.category}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 dark:bg-[#1C1C1C] rounded-lg flex-shrink-0 transition-colors duration-300">
                  <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-colors duration-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300">Promo Type</p>
                  <p className="text-base font-semibold text-[#0E2250] dark:text-white capitalize transition-colors duration-300">{deal.promoType}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 dark:bg-[#1C1C1C] rounded-lg flex-shrink-0 transition-colors duration-300">
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-colors duration-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300">Validity Period</p>
                  <p className="text-base font-semibold text-[#0E2250] dark:text-white break-words transition-colors duration-300">{deal.createdDate} - {deal.expiry}</p>
                </div>
              </div>

              {deal.validityTimeStart && deal.validityTimeEnd && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 dark:bg-[#1C1C1C] rounded-lg flex-shrink-0 transition-colors duration-300">
                    <Clock className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-colors duration-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300">Time Period</p>
                    <p className="text-base font-semibold text-[#0E2250] dark:text-white transition-colors duration-300">{deal.validityTimeStart} - {deal.validityTimeEnd}</p>
                  </div>
                </div>
              )}

              {deal.originalPrice && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 dark:bg-[#1C1C1C] rounded-lg flex-shrink-0 transition-colors duration-300">
                    <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-colors duration-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300">Original Price</p>
                    <p className="text-base font-semibold text-[#0E2250] dark:text-white transition-colors duration-300">LKR {deal.originalPrice.toLocaleString()}</p>
                  </div>
                </div>
              )}

              {deal.deductionValue && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 dark:bg-[#1C1C1C] rounded-lg flex-shrink-0 transition-colors duration-300">
                    <Percent className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-colors duration-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300">Discount</p>
                    <p className="text-base font-semibold text-[#0E2250] dark:text-white transition-colors duration-300">
                      {deal.deductionType === 'percentage' 
                        ? `${deal.deductionValue}%` 
                        : `LKR ${deal.deductionValue.toLocaleString()}`
                      }
                    </p>
                  </div>
                </div>
              )}

              {deal.dealCode && (
                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="p-2 bg-gray-50 dark:bg-[#1C1C1C] rounded-lg flex-shrink-0 transition-colors duration-300">
                    <Hash className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-colors duration-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300">Deal Code</p>
                    <p className="text-base font-semibold text-[#0E2250] dark:text-white font-mono bg-gray-100 dark:bg-[#1C1C1C] px-3 py-1.5 rounded-lg inline-block break-all transition-colors duration-300">{deal.dealCode}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="pt-5 mt-5 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <button
                onClick={() => {
                  const termsEl = document.getElementById(`terms-${deal.id}`);
                  const chevron = document.getElementById(`chevron-${deal.id}`);
                  if (termsEl && chevron) {
                    termsEl.classList.toggle('hidden');
                    chevron.classList.toggle('rotate-90');
                  }
                }}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-[#E35000] dark:hover:text-[#E35000] transition-colors duration-300"
              >
                <FileText className="w-4 h-4" />
                Terms & Conditions
                <ChevronRight id={`chevron-${deal.id}`} className="w-4 h-4 transition-transform" />
              </button>
              <div id={`terms-${deal.id}`} className="hidden mt-4 text-sm text-gray-700 dark:text-gray-200 space-y-2 pl-6 border-l-2 border-gray-200 dark:border-gray-600 transition-colors duration-300">
                <p>• Valid for one-time use per customer</p>
                <p>• Cannot be combined with other offers</p>
                <p>• Non-refundable and non-transferable</p>
                <p>• Subject to availability</p>
                <p>• Merchant reserves the right to modify terms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Actions & Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-[#141414] rounded-xl shadow-sm border border-gray-100 dark:border-[#2A2A2A] p-5 transition-colors duration-300">
            <h3 className="text-base font-bold text-[#0E2250] dark:text-white mb-4 transition-colors duration-300">Quick Actions</h3>
            <div className="space-y-2.5">
              {deal.status === 'Draft' && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-11 text-sm font-medium border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#1C1C1C] hover:border-gray-300 dark:hover:border-gray-500 text-gray-900 dark:text-gray-200 transition-colors duration-300"
                >
                  <Edit className="w-4 h-4 mr-3 text-gray-600 dark:text-gray-300 transition-colors duration-300" /> Edit Deal
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="w-full justify-start h-11 text-sm font-medium border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#1C1C1C] hover:border-gray-300 dark:hover:border-gray-500 text-gray-900 dark:text-gray-200 transition-colors duration-300"
              >
                <Calendar className="w-4 h-4 mr-3 text-gray-600 dark:text-gray-300 transition-colors duration-300" /> Set as Deal of the Day
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start h-11 text-sm font-medium border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#1C1C1C] hover:border-gray-300 dark:hover:border-gray-500 text-gray-900 dark:text-gray-200 transition-colors duration-300" 
                onClick={handleViewCouponsOpen}
              >
                <Eye className="w-4 h-4 mr-3 text-gray-600 dark:text-gray-300 transition-colors duration-300" /> View Coupons
              </Button>
              
              <div className="border-t border-gray-200 dark:border-gray-600 my-3 transition-colors duration-300"></div>
              
              {deal.status !== 'Deactivated' && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-11 text-sm font-medium text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/30 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-300 dark:hover:border-red-700/50 transition-colors duration-300"
                  onClick={() => setDeactivateDialogOpen(true)}
                >
                  <XCircle className="w-4 h-4 mr-3" /> Deactivate Deal
                </Button>
              )}
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-white dark:bg-[#141414] rounded-xl shadow-sm border border-gray-100 dark:border-[#2A2A2A] p-5 transition-colors duration-300">
            <h3 className="text-base font-bold text-[#0E2250] dark:text-white mb-4 transition-colors duration-300">Performance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Total Earning</span>
                <span className="text-base font-bold text-[#0E2250] dark:text-white transition-colors duration-300">LKR {(deal.revenue / 1000).toFixed(1)}k</span>
              </div>

              <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Total Coupons</span>
                <span className="text-base font-bold text-[#0E2250] dark:text-white transition-colors duration-300">{deal.totalCoupons || 0}</span>
              </div>

              <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Sold Coupons</span>
                <span className="text-base font-bold text-[#0E2250] dark:text-white transition-colors duration-300">{deal.sold}</span>
              </div>

              <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Redeemed Coupons</span>
                <span className="text-base font-bold text-[#0E2250] dark:text-white transition-colors duration-300">{deal.redeemedCoupons || 0}</span>
              </div>

              <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Available Coupons</span>
                <span className="text-base font-bold text-[#0E2250] dark:text-white transition-colors duration-300">{deal.availableCoupons || 0}</span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Deal Views</span>
                <span className="text-base font-bold text-[#0E2250] dark:text-white transition-colors duration-300">{deal.dealViews || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Dialog */}
      <Dialog open={couponDialogOpen} onOpenChange={setCouponDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2A2A2A] transition-colors duration-300">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-900 dark:text-white transition-colors duration-300">Coupon Details</DialogTitle>
            <DialogDescription className="text-base text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Viewing coupons for <span className="font-semibold text-[#0E2250] dark:text-[#E35000] transition-colors duration-300">{deal.title}</span>
            </DialogDescription>
          </DialogHeader>
          
          {/* Coupon Statistics */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-50 dark:bg-[#1C1C1C] rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">{deal.totalCoupons || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">Total coupons</div>
            </div>
            <div className="bg-orange-50 dark:bg-[#1C1C1C] rounded-xl p-4 border border-orange-200 dark:border-orange-800/30 transition-colors duration-300">
              <div className="text-2xl font-bold text-[#E35000] dark:text-[#FF6B35] transition-colors duration-300">{deal.sold}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">Purchased</div>
            </div>
            <div className="bg-emerald-50 dark:bg-[#1C1C1C] rounded-xl p-4 border border-emerald-200 dark:border-emerald-800/30 transition-colors duration-300">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-300">{deal.availableCoupons || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">Available</div>
            </div>
          </div>

          {/* Search and Filter Row */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {/* Search Input */}
            <div className="space-y-2">
              <Label htmlFor="coupon-search" className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Search Coupons
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="coupon-search"
                  type="text"
                  placeholder="Search by code or customer..."
                  value={couponSearchQuery}
                  onChange={(e) => setCouponSearchQuery(e.target.value)}
                  className="pl-9 dark:bg-[#1C1C1C] dark:border-[#2A2A2A] dark:text-white transition-colors duration-300"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Filter by Status
              </Label>
              <Select
                value={couponStatusFilter}
                onValueChange={setCouponStatusFilter}
              >
                <SelectTrigger className="dark:bg-[#1C1C1C] dark:border-[#2A2A2A] dark:text-white transition-colors duration-300">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All
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
          
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 mt-4 bg-white dark:bg-[#0A0A0A] transition-colors duration-300">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-[#1C1C1C] transition-colors duration-300">
                <TableRow className="border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <TableHead className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">Coupon Code</TableHead>
                  <TableHead className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">Customer</TableHead>
                  <TableHead className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">Purchase Date</TableHead>
                  <TableHead className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.length === 0 ? (
                  <TableRow className="border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      No coupons sold yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCoupons.map((coupon, i) => (
                    <TableRow key={i} className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#1C1C1C]/50 transition-colors duration-300">
                      <TableCell className="font-mono font-medium text-sm text-gray-900 dark:text-gray-200 transition-colors duration-300">{coupon.code}</TableCell>
                      <TableCell className="text-sm text-gray-900 dark:text-gray-200 transition-colors duration-300">{coupon.customer}</TableCell>
                      <TableCell className="text-sm text-gray-900 dark:text-gray-200 transition-colors duration-300">{coupon.date}</TableCell>
                      <TableCell>
                        <Badge variant={coupon.status === 'Redeemed' ? 'default' : 'secondary'} 
                          className={coupon.status === 'Redeemed' ? 'bg-emerald-500 dark:bg-emerald-600 text-white transition-colors duration-300' : 'bg-yellow-500 dark:bg-yellow-600 text-white transition-colors duration-300'}
                        >
                          {coupon.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deactivate Dialog */}
      <Dialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2A2A2A] transition-colors duration-300">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <DialogTitle className="text-xl text-gray-900 dark:text-white transition-colors duration-300">Deactivate Deal</DialogTitle>
            </div>
            <DialogDescription className="text-base text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Are you sure you want to deactivate <span className="font-semibold text-[#0E2250] dark:text-[#E35000] transition-colors duration-300">"{deal.title}"</span>?
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-lg p-4 my-4">
            <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-2">
              ⚠️ This action is permanent
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              This deal will no longer be visible to customers and cannot be purchased. Once deactivated, this deal cannot be reactivated.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button 
              variant="outline" 
              className="h-11 text-sm font-medium border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#1C1C1C] hover:border-gray-300 dark:hover:border-gray-500 text-gray-900 dark:text-gray-200 transition-colors duration-300"
              onClick={() => setDeactivateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="h-11 text-sm font-medium bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white transition-colors duration-300"
              onClick={() => {
                // Handle deactivation logic here
                console.log('Deal deactivated:', deal.id);
                setDeactivateDialogOpen(false);
              }}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Deactivate Deal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}