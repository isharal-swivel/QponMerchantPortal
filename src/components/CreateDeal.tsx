import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Upload, DollarSign, Calendar as CalendarIcon, Check, ChevronLeft, Signal, Wifi, Battery, MapPin, Clock, Share2, Heart, Star, Save, X, Crop, Plus, Trash } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from './ui/utils';
import { toast } from 'sonner@2.0.3';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';

export function CreateDeal() {
  const [step, setStep] = useState(1);
  
  // Time picker popover states
  const [timePickerOpen, setTimePickerOpen] = useState<{[key: string]: boolean}>({});
  
  const presetImages = [
    "https://images.unsplash.com/photo-1737352777897-e22953991a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "https://images.unsplash.com/photo-1632898657999-ae6920976661?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "https://images.unsplash.com/photo-1731336478850-6bce7235e320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
  ];
  
  // Image cropping states - Updated for multiple images with default preset images
  const [uploadedImages, setUploadedImages] = useState<string[]>(presetImages);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingCover, setEditingCover] = useState(false);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '50% Off Couples Spa Treatment',
    subtitle: 'Luxury Spa Experience for Two',
    category: 'dining',
    promoType: 'discount',
    description: 'Enjoy a relaxing 60-minute full body massage for two at our luxury spa. Includes access to steam room and sauna.',
    termsAndConditions: 'Valid for one-time use per customer. Cannot be combined with other offers. Non-refundable and non-transferable. Subject to availability. Merchant reserves the right to modify terms.',
    originalPrice: '10000',
    discountedPrice: '5000',
    quantity: '',
    validFrom: '',
    expiryDate: '',
    startTime: '',
    endTime: '',
    validityPeriods: [
      {
        id: Date.now(),
        validFrom: '',
        expiryDate: '',
        validTimeFrom: '',
        validTimeTo: ''
      }
    ],
    image: 'https://images.unsplash.com/photo-1737352777897-e22953991a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  });

  const steps = [
    { number: 1, title: "Deal Details" },
    { number: 2, title: "Media" },
    { number: 3, title: "Pricing & Rules" },
    { number: 4, title: "Mobile Preview" }
  ];

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handlePublish = () => {
    toast.success("Deal submitted for review!", {
      description: "We will notify you once it is live."
    });
  };

  const handleSaveDraft = () => {
    toast.success("Deal saved as draft", {
      description: "You can edit and publish it later."
    });
  };

  const calculateDiscount = () => {
    const original = parseFloat(formData.originalPrice) || 0;
    const discounted = parseFloat(formData.discountedPrice) || 0;
    if (original <= 0 || discounted <= 0) return 0;
    if (discounted >= original) return 0;
    return Math.round(((original - discounted) / original) * 100);
  };

  const discountPercentage = calculateDiscount();

  // Validation logic for each step
  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return !!(
          formData.title.trim() &&
          formData.category &&
          formData.description.trim() &&
          formData.termsAndConditions.trim()
        );
      case 2:
        return uploadedImages.length > 0;
      case 3:
        const hasValidPrices = 
          formData.originalPrice && 
          parseFloat(formData.originalPrice) > 0 &&
          formData.discountedPrice && 
          parseFloat(formData.discountedPrice) > 0 &&
          parseFloat(formData.discountedPrice) < parseFloat(formData.originalPrice);
        
        const hasValidPeriod = formData.validityPeriods.some(period => 
          period.validFrom && 
          period.validTimeFrom && 
          period.validTimeTo
        );
        
        return hasValidPrices && hasValidPeriod;
      default:
        return true;
    }
  };

  const isNextDisabled = !validateStep(step);

  // Image upload and cropping functions
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploadedImages.length >= 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
        setEditingIndex(null); // This is a new upload, not editing
        setEditingCover(false);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
        setEditingIndex(null);
        setEditingCover(true);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = () => {
    if (tempImage && croppedAreaPixels) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = new Image();
      image.src = tempImage;
      image.onload = () => {
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        ctx?.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            if (editingCover) {
              // Handle cover image
              setCoverImage(url);
            } else if (editingIndex !== null) {
              // Handle editing existing deal image
              const newImages = [...uploadedImages];
              newImages[editingIndex] = url;
              setUploadedImages(newImages);
            } else {
              // Handle adding new deal image
              setUploadedImages([...uploadedImages, url]);
            }
            setShowCropper(false);
            setEditingCover(false);
          }
        }, 'image/jpeg');
      };
    }
  };

  // Edit crop and remove image functions
  const handleEditCrop = (index: number) => {
    setEditingIndex(index);
    setTempImage(uploadedImages[index]);
    setShowCropper(true);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
    setEditingIndex(null);
  };

  // Validity period functions
  const addValidityPeriod = () => {
    const newPeriod = {
      id: Date.now(),
      validFrom: '',
      expiryDate: '',
      validTimeFrom: '',
      validTimeTo: ''
    };
    updateForm('validityPeriods', [...formData.validityPeriods, newPeriod]);
  };

  const removeValidityPeriod = (id: number) => {
    if (formData.validityPeriods.length === 1) {
      toast.error("At least one validity period is required");
      return;
    }
    updateForm('validityPeriods', formData.validityPeriods.filter(period => period.id !== id));
  };

  const updateValidityPeriod = (id: number, field: string, value: string) => {
    const updated = formData.validityPeriods.map(period => 
      period.id === id ? { ...period, [field]: value } : period
    );
    updateForm('validityPeriods', updated);
  };

  const updateValidityPeriodDateRange = (id: number, from: string, to: string) => {
    const updated = formData.validityPeriods.map(period => 
      period.id === id ? { ...period, validFrom: from, expiryDate: to } : period
    );
    updateForm('validityPeriods', updated);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 lg:pb-0">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">Create New Deal</h2>
        <p className="text-gray-500 dark:text-blue-200/70 transition-colors duration-300">Follow the steps to publish a new offer.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 relative max-w-3xl mx-auto overflow-x-auto pb-2 px-2 md:px-0">
        <div className="absolute left-0 top-4 md:top-5 w-full border-t-2 border-dotted border-gray-300 dark:border-[#1A2F5A] -z-10 transition-colors duration-300"></div>
        <div className="flex items-center justify-between min-w-full md:min-w-0 w-full gap-2 md:gap-0 mx-[0px] my-[12px]">
          {steps.map((s) => (
            <div key={s.number} className="flex flex-col items-center bg-[#F4F7F9] dark:bg-transparent px-2 md:px-4 flex-shrink-0 transition-colors duration-300">
              <div 
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-300 cursor-pointer ${
                  step >= s.number ? 'bg-[#0E2250] dark:bg-[#E35000] text-white shadow-md scale-110' : 'bg-white dark:bg-[#1A2F5A] border-2 border-gray-300 dark:border-[#1A2F5A] text-gray-400 dark:text-blue-300'
                }`}
                onClick={() => setStep(s.number)}
              >
                {step > s.number ? <Check size={16} className="md:w-[18px] md:h-[18px]" /> : s.number}
              </div>
              <span className={`text-[10px] md:text-xs font-medium mt-1 md:mt-2 whitespace-nowrap transition-colors duration-300 ${step >= s.number ? 'text-[#0E2250] dark:text-[#E35000]' : 'text-gray-400 dark:text-blue-300/70'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <Card className="border-none shadow-lg overflow-hidden">
          <CardContent className="p-8">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="space-y-2">
                    <Label htmlFor="title">Deal Title <span className="text-red-500">*</span></Label>
                    <Input 
                      id="title" 
                      value={formData.title}
                      onChange={(e) => updateForm('title', e.target.value)}
                      placeholder="e.g., 50% Off Couples Spa Treatment" 
                      className="text-lg text-[16px]" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                    <Input 
                      id="subtitle" 
                      value={formData.subtitle}
                      onChange={(e) => updateForm('subtitle', e.target.value)}
                      placeholder="e.g., Luxury Spa Experience for Two" 
                      className="text-[16px]" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                      <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                      <Select value={formData.category} onValueChange={(val) => updateForm('category', val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bar">Bar</SelectItem>
                          <SelectItem value="dining">Dining</SelectItem>
                          <SelectItem value="cafe">Cafe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="promoType">Promo Type</Label>
                      <Select value={formData.promoType} onValueChange={(val) => updateForm('promoType', val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select promo type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="discount">Flat Discount</SelectItem>
                          <SelectItem value="bogo">Buy 1 Get 1 Free</SelectItem>
                          <SelectItem value="bundle">Bundle Offer</SelectItem>
                          <SelectItem value="flash">Flash Sale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                    <Textarea 
                      id="description" 
                      value={formData.description}
                      onChange={(e) => updateForm('description', e.target.value)}
                      placeholder="Describe what's included..." 
                      className="h-32" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="termsAndConditions">Terms & Conditions <span className="text-red-500">*</span></Label>
                    <Textarea 
                      id="termsAndConditions" 
                      value={formData.termsAndConditions}
                      onChange={(e) => updateForm('termsAndConditions', e.target.value)}
                      placeholder="Enter terms and conditions for this deal..." 
                      className="h-32" 
                    />
                  </div>

                  {/* Validity Date and Time Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Valid From <span className="text-red-500">*</span></Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal text-[16px] h-10 bg-input-background dark:bg-[#1C1C1C]",
                              !formData.validFrom && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.validFrom ? format(new Date(formData.validFrom), "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.validFrom ? new Date(formData.validFrom) : undefined}
                            onSelect={(date) => updateForm('validFrom', date ? format(date, 'yyyy-MM-dd') : '')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Expired On <span className="text-red-500">*</span></Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal text-[16px] h-10 bg-input-background dark:bg-[#1C1C1C]",
                              !formData.expiryDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.expiryDate ? format(new Date(formData.expiryDate), "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.expiryDate ? new Date(formData.expiryDate) : undefined}
                            onSelect={(date) => updateForm('expiryDate', date ? format(date, 'yyyy-MM-dd') : '')}
                            initialFocus
                            disabled={(date) => formData.validFrom ? date < new Date(formData.validFrom) : false}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Start Time <span className="text-red-500">*</span></Label>
                      <Popover
                        open={timePickerOpen['startTime']}
                        onOpenChange={(open) => setTimePickerOpen(prev => ({...prev, 'startTime': open}))}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal text-[16px] h-10 bg-input-background dark:bg-[#1C1C1C]",
                              !formData.startTime && "text-muted-foreground"
                            )}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            {formData.startTime || "Select time"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2" align="start">
                          <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto pr-2">
                            {Array.from({ length: 24 }, (_, h) => 
                              ['00', '30'].map(m => {
                                const hour24 = h.toString().padStart(2, '0');
                                const time24 = `${hour24}:${m}`;
                                const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
                                const ampm = h >= 12 ? 'PM' : 'AM';
                                const time12 = `${hour12.toString().padStart(2, '0')}:${m} ${ampm}`;
                                return (
                                  <Button
                                    key={time24}
                                    variant="ghost"
                                    size="sm"
                                    className="justify-start hover:bg-[#0E2250] hover:text-white text-sm"
                                    onClick={() => {
                                      updateForm('startTime', time12);
                                      setTimePickerOpen(prev => ({...prev, 'startTime': false}));
                                    }}
                                  >
                                    {time12}
                                  </Button>
                                );
                              })
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>End Time <span className="text-red-500">*</span></Label>
                      <Popover
                        open={timePickerOpen['endTime']}
                        onOpenChange={(open) => setTimePickerOpen(prev => ({...prev, 'endTime': open}))}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal text-[16px] h-10 bg-input-background dark:bg-[#1C1C1C]",
                              !formData.endTime && "text-muted-foreground"
                            )}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            {formData.endTime || "Select time"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2" align="start">
                          <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto pr-2">
                            {Array.from({ length: 24 }, (_, h) => 
                              ['00', '30'].map(m => {
                                const hour24 = h.toString().padStart(2, '0');
                                const time24 = `${hour24}:${m}`;
                                const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
                                const ampm = h >= 12 ? 'PM' : 'AM';
                                const time12 = `${hour12.toString().padStart(2, '0')}:${m} ${ampm}`;
                                return (
                                  <Button
                                    key={time24}
                                    variant="ghost"
                                    size="sm"
                                    className="justify-start hover:bg-[#0E2250] hover:text-white text-sm"
                                    onClick={() => {
                                      updateForm('endTime', time12);
                                      setTimePickerOpen(prev => ({...prev, 'endTime': false}));
                                    }}
                                  >
                                    {time12}
                                  </Button>
                                );
                              })
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 max-w-2xl mx-auto">
                   {/* Cover Image Section */}
                   <div className="space-y-3">
                     <Label>Upload Cover Image <span className="text-red-500">*</span></Label>
                     <p className="text-xs text-gray-500 dark:text-gray-400">800 x 400 px recommended.</p>
                     
                     {!coverImage && (
                       <>
                         <input 
                           type="file" 
                           id="coverImageUpload" 
                           accept="image/*" 
                           onChange={handleCoverImageUpload} 
                           className="hidden"
                         />
                         <label 
                           htmlFor="coverImageUpload"
                           className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors block border-gray-300 dark:border-[#1A2F5A] hover:bg-gray-50 dark:hover:bg-[#1A2F5A]/30 cursor-pointer bg-gray-50/50 dark:bg-[#1A2F5A]/20"
                         >
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-blue-50 dark:bg-[#E35000]/20 text-blue-600 dark:text-[#E35000]">
                              <Upload size={24} />
                            </div>
                            <h3 className="font-medium text-sm text-gray-900 dark:text-white">
                              Click or drag to upload cover image
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-blue-200/70 mt-1">
                              PNG or JPG (max. 2MB)
                            </p>
                         </label>
                       </>
                     )}
                     
                     {coverImage && (
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                         <div className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200 relative group hover:border-[#E35000] transition-all">
                           <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                           <div className="absolute top-2 right-2 flex gap-1.5">
                             <button
                               onClick={() => {
                                 setEditingCover(true);
                                 setTempImage(coverImage);
                                 setShowCropper(true);
                               }}
                               className="w-7 h-7 bg-[#E35000] hover:bg-[#c44500] rounded-full shadow-md flex items-center justify-center transition-colors"
                               title="Crop"
                             >
                               <Crop className="w-4 h-4 text-white" />
                             </button>
                             <button
                               onClick={() => setCoverImage(null)}
                               className="w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full shadow-md flex items-center justify-center transition-colors"
                               title="Delete"
                             >
                               <X className="w-4 h-4 text-white" />
                             </button>
                           </div>
                         </div>
                       </div>
                     )}
                   </div>

                   {/* Deal Images Section */}
                   <div className="space-y-3">
                     <Label>Upload Deal Images <span className="text-red-500">*</span></Label>
                     <p className="text-xs text-gray-500 dark:text-gray-400">Use up to 3 images. 800 x 400 px recommended.</p>
                     
                     {uploadedImages.length < 3 && (
                       <>
                         <input 
                           type="file" 
                           id="imageUpload" 
                           accept="image/*" 
                           onChange={handleImageUpload} 
                           className="hidden"
                         />
                         <label 
                           htmlFor="imageUpload"
                           className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors block border-gray-300 dark:border-[#1A2F5A] hover:bg-gray-50 dark:hover:bg-[#1A2F5A]/30 cursor-pointer bg-gray-50/50 dark:bg-[#1A2F5A]/20"
                         >
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-blue-50 dark:bg-[#E35000]/20 text-blue-600 dark:text-[#E35000]">
                              <Upload size={24} />
                            </div>
                            <h3 className="font-medium text-sm text-gray-900 dark:text-white">
                              Click or drag to upload deal images
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-blue-200/70 mt-1">
                              {uploadedImages.length}/3 images • PNG or JPG (max. 2MB)
                            </p>
                         </label>
                       </>
                     )}
                     
                     {uploadedImages.length > 0 && (
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                         {uploadedImages.map((img, idx) => (
                           <div 
                             key={idx}
                             className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200 relative group hover:border-[#E35000] transition-all"
                           >
                             <img src={img} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-cover" />
                             <div className="absolute top-2 right-2 flex gap-1.5">
                               <button
                                 onClick={() => handleEditCrop(idx)}
                                 className="w-7 h-7 bg-[#E35000] hover:bg-[#c44500] rounded-full shadow-md flex items-center justify-center transition-colors"
                                 title="Crop"
                               >
                                 <Crop className="w-4 h-4 text-white" />
                               </button>
                               <button
                                 onClick={() => handleRemoveImage(idx)}
                                 className="w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full shadow-md flex items-center justify-center transition-colors"
                                 title="Delete"
                               >
                                 <X className="w-4 h-4 text-white" />
                               </button>
                             </div>
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label>Original Price (LKR) <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">LKR</span>
                        <Input 
                          type="number" 
                          className="pl-14 text-[16px]" 
                          value={formData.originalPrice}
                          onChange={(e) => updateForm('originalPrice', e.target.value)}
                          placeholder="10000" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Discounted Price (LKR) <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 text-sm font-medium">LKR</span>
                        <Input 
                          type="number" 
                          className="pl-14 border-emerald-200 focus:border-emerald-500 text-emerald-700 font-bold text-[16px]" 
                          value={formData.discountedPrice}
                          onChange={(e) => updateForm('discountedPrice', e.target.value)}
                          placeholder="5000" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                     <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                       <Label>Discount Percentage</Label>
                       <span className="text-sm font-bold text-[#E35000]">{discountPercentage}% OFF</span>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(discountPercentage, 100)}%` }}
                        className="bg-[#E35000] h-2.5 rounded-full"
                       />
                     </div>
                  </div>

                  {/* Validity Periods Section */}
                  <div className="space-y-4 border-t border-gray-200 pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-base">Validity Periods <span className="text-red-500">*</span></Label>
                        <p className="text-xs text-gray-500 mt-1">Add multiple date ranges with different time periods</p>
                      </div>
                      <Button
                        type="button"
                        onClick={addValidityPeriod}
                        variant="outline"
                        size="sm"
                        className="text-[#0E2250] border-[#0E2250] hover:bg-[#0E2250] hover:text-white dark:text-white dark:border-[#1A2F5A] dark:hover:bg-[#1A2F5A] dark:hover:text-white transition-colors duration-300"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Period
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {formData.validityPeriods.map((period, index) => (
                        <div key={period.id} className="p-4 bg-gray-50 dark:bg-[#1A2F5A]/30 rounded-lg border border-gray-200 dark:border-[#1A2F5A] space-y-4 transition-colors duration-300">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-semibold text-[#0E2250] dark:text-white transition-colors duration-300">Period {index + 1}</h4>
                            {formData.validityPeriods.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeValidityPeriod(period.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-2">
                              <Label className="text-sm">Select Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal text-sm",
                                      !period.validFrom && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">
                                    {period.validFrom ? (
                                      format(new Date(period.validFrom), "LLL dd, y")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    </span>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    initialFocus
                                    mode="single"
                                    selected={period.validFrom ? new Date(period.validFrom) : undefined}
                                    onSelect={(date) => {
                                      updateValidityPeriodDateRange(
                                        period.id,
                                        date ? format(date, 'yyyy-MM-dd') : '',
                                        ''
                                      );
                                    }}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm">Time Period</Label>
                              <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                                  <Popover
                                    open={timePickerOpen[period.id + 'from']}
                                    onOpenChange={(open) => setTimePickerOpen(prev => ({...prev, [period.id + 'from']: open}))}
                                  >
                                    <PopoverTrigger asChild>
                                      <Input 
                                        type="text" 
                                        className="pl-9 h-10 text-[16px] cursor-pointer" 
                                        value={period.validTimeFrom}
                                        onChange={(e) => updateValidityPeriod(period.id, 'validTimeFrom', e.target.value)}
                                        placeholder="HH:MM"
                                        style={{
                                          WebkitAppearance: 'none',
                                          MozAppearance: 'textfield'
                                        }}
                                      />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-2" align="start">
                                      <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto pr-2" style={{
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: '#E35000 #f3f4f6'
                                      }}>
                                        {Array.from({ length: 24 }, (_, h) => 
                                          ['00', '30'].map(m => {
                                            const time = `${h.toString().padStart(2, '0')}:${m}`;
                                            return (
                                              <Button
                                                key={time}
                                                variant="ghost"
                                                size="sm"
                                                className="justify-start hover:bg-[#0E2250] hover:text-white text-sm"
                                                onClick={() => updateValidityPeriod(period.id, 'validTimeFrom', time)}
                                              >
                                                {time}
                                              </Button>
                                            );
                                          })
                                        )}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                                <span className="text-gray-400 font-medium text-sm">-</span>
                                <div className="relative flex-1">
                                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                                  <Popover
                                    open={timePickerOpen[period.id + 'to']}
                                    onOpenChange={(open) => setTimePickerOpen(prev => ({...prev, [period.id + 'to']: open}))}
                                  >
                                    <PopoverTrigger asChild>
                                      <Input 
                                        type="text" 
                                        className="pl-9 h-10 text-[16px] cursor-pointer" 
                                        value={period.validTimeTo}
                                        onChange={(e) => updateValidityPeriod(period.id, 'validTimeTo', e.target.value)}
                                        placeholder="HH:MM"
                                        style={{
                                          WebkitAppearance: 'none',
                                          MozAppearance: 'textfield'
                                        }}
                                      />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-2" align="start">
                                      <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto pr-2" style={{
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: '#E35000 #f3f4f6'
                                      }}>
                                        {Array.from({ length: 24 }, (_, h) => 
                                          ['00', '30'].map(m => {
                                            const time = `${h.toString().padStart(2, '0')}:${m}`;
                                            return (
                                              <Button
                                                key={time}
                                                variant="ghost"
                                                size="sm"
                                                className="justify-start hover:bg-[#0E2250] hover:text-white text-sm"
                                                onClick={() => updateValidityPeriod(period.id, 'validTimeTo', time)}
                                              >
                                                {time}
                                              </Button>
                                            );
                                          })
                                        )}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm">Coupon Count</Label>
                              <Input 
                                type="number" 
                                placeholder="20" 
                                value={formData.quantity}
                                onChange={(e) => updateForm('quantity', e.target.value)}
                                className="text-[16px] h-10"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center items-start">
                  <div className="flex-1 max-w-md space-y-4 sm:space-y-6 w-full">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">Preview & Publish</h3>
                      <p className="text-gray-500 dark:text-blue-200/70 mt-1 sm:mt-2 text-sm sm:text-base transition-colors duration-300">Review how your deal looks on the mobile app before publishing.</p>
                    </div>

                    <div className="bg-blue-50 dark:bg-[#E35000]/10 p-4 sm:p-6 rounded-xl space-y-3 sm:space-y-4 transition-colors duration-300">
                      <div className="flex items-start gap-2 sm:gap-3">
                         <div className="bg-blue-100 dark:bg-[#E35000]/20 p-1.5 sm:p-2 rounded-full text-blue-600 dark:text-[#E35000] flex-shrink-0 transition-colors duration-300">
                           <Star size={18} className="sm:w-5 sm:h-5" />
                         </div>
                         <div className="min-w-0">
                           <h4 className="font-semibold text-blue-900 dark:text-white text-sm sm:text-base transition-colors duration-300">Deal Highlights</h4>
                           <ul className="text-xs sm:text-sm text-blue-800/80 dark:text-blue-200/80 mt-2 space-y-1 list-disc pl-4 transition-colors duration-300">
                             <li>{discountPercentage}% discount applied</li>
                             <li>Category: {formData.category || 'General'}</li>
                             <li className="break-words">Valid: {formData.validityPeriods[0].validFrom || 'Now'} - {formData.validityPeriods[0].expiryDate || 'further notice'}</li>
                             {formData.validityPeriods[0].validTimeFrom && formData.validityPeriods[0].validTimeTo && (
                               <li>Daily: {formData.validityPeriods[0].validTimeFrom} - {formData.validityPeriods[0].validTimeTo}</li>
                             )}
                           </ul>
                         </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-[#1A2F5A]/20 p-4 sm:p-6 rounded-xl space-y-2 sm:space-y-3 transition-colors duration-300">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-500 dark:text-blue-200/70 transition-colors duration-300">Listing Fee</span>
                          <span className="font-medium dark:text-white transition-colors duration-300">LKR 0.00</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-500 dark:text-blue-200/70 transition-colors duration-300">Commission</span>
                          <span className="font-medium dark:text-white transition-colors duration-300">0%</span>
                        </div>
                        <div className="h-px bg-gray-200 dark:bg-[#1A2F5A] my-2 transition-colors duration-300"></div>
                        <div className="flex justify-between font-bold text-[#0E2250] dark:text-white text-sm sm:text-base transition-colors duration-300">
                          <span>Estimated Earnings</span>
                          <span className="text-right">LKR {(parseFloat(formData.discountedPrice) * 0.9).toLocaleString()} / sale</span>
                        </div>
                    </div>
                  </div>

                  {/* Mobile Phone Preview */}
                  <div className="relative mx-auto border-gray-800 bg-gray-800 border-[10px] sm:border-[14px] rounded-[2rem] sm:rounded-[2.5rem] h-[500px] sm:h-[600px] w-[250px] sm:w-[300px] shadow-xl flex-shrink-0">
                    <div className="w-[120px] sm:w-[148px] h-[16px] sm:h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20"></div>
                    <div className="h-[28px] sm:h-[32px] w-[3px] bg-gray-800 absolute -left-[13px] sm:-left-[17px] top-[60px] sm:top-[72px] rounded-l-lg"></div>
                    <div className="h-[40px] sm:h-[46px] w-[3px] bg-gray-800 absolute -left-[13px] sm:-left-[17px] top-[104px] sm:top-[124px] rounded-l-lg"></div>
                    <div className="h-[40px] sm:h-[46px] w-[3px] bg-gray-800 absolute -left-[13px] sm:-left-[17px] top-[150px] sm:top-[178px] rounded-l-lg"></div>
                    <div className="h-[56px] sm:h-[64px] w-[3px] bg-gray-800 absolute -right-[13px] sm:-right-[17px] top-[120px] sm:top-[142px] rounded-r-lg"></div>
                    
                    <div className="rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden w-full h-full bg-white relative flex flex-col">
                      {/* Status Bar */}
                      <div className="h-7 sm:h-8 bg-white w-full flex items-center justify-between px-4 sm:px-6 pt-1.5 sm:pt-2 z-10 text-[9px] sm:text-[10px] font-medium text-black">
                         <span>9:41</span>
                         <div className="flex gap-1">
                           <Signal size={10} className="sm:w-3 sm:h-3 fill-black" />
                           <Wifi size={10} className="sm:w-3 sm:h-3" />
                           <Battery size={10} className="sm:w-3 sm:h-3 fill-black" />
                         </div>
                      </div>

                      {/* App Header */}
                      <div className="px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between bg-white z-10 shadow-sm relative">
                         <ChevronLeft size={20} className="sm:w-6 sm:h-6 text-gray-600" />
                         <div className="flex gap-2 sm:gap-3 text-gray-600">
                           <Heart size={18} className="sm:w-5 sm:h-5" />
                           <Share2 size={18} className="sm:w-5 sm:h-5" />
                         </div>
                      </div>

                      {/* App Content - Scrollable */}
                      <div className="flex-1 overflow-y-auto pb-16 sm:pb-20 scrollbar-hide">
                         <div className="relative h-44 sm:h-56 w-full bg-gray-200">
                           <img src={formData.image} alt="Deal" className="w-full h-full object-cover" />
                           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 sm:p-4 pt-10 sm:pt-12">
                              <span className="bg-[#E35000] text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block">
                                {discountPercentage}% OFF
                              </span>
                           </div>
                         </div>

                         <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                           <div>
                             <h3 className="font-bold text-base sm:text-lg leading-tight text-gray-900">{formData.title || "Deal Title"}</h3>
                             <div className="flex items-center text-gray-500 text-[10px] sm:text-xs mt-1.5 sm:mt-2">
                               <MapPin size={10} className="sm:w-3 sm:h-3 mr-1" />
                               Colombo 03
                             </div>
                           </div>

                           <div className="flex items-end gap-1.5 sm:gap-2">
                             <span className="text-xl sm:text-2xl font-bold text-[#E35000]">LKR {parseFloat(formData.discountedPrice || '0').toLocaleString()}</span>
                             <span className="text-xs sm:text-sm text-gray-400 line-through mb-0.5 sm:mb-1">LKR {parseFloat(formData.originalPrice || '0').toLocaleString()}</span>
                           </div>

                           <div className="flex gap-3 sm:gap-4 py-1.5 sm:py-2 border-y border-gray-100">
                             <div className="flex-1 text-center border-r border-gray-100">
                               <div className="text-[10px] sm:text-xs text-gray-500">Ratings</div>
                               <div className="font-bold flex items-center justify-center gap-0.5 sm:gap-1 text-xs sm:text-sm">4.8 <Star size={9} className="sm:w-2.5 sm:h-2.5 fill-yellow-400 text-yellow-400"/></div>
                             </div>
                             <div className="flex-1 text-center">
                               <div className="text-[10px] sm:text-xs text-gray-500">Sold</div>
                               <div className="font-bold text-xs sm:text-sm">120+</div>
                             </div>
                           </div>

                           <div>
                             <h4 className="font-semibold text-xs sm:text-sm mb-1.5 sm:mb-2">About this deal</h4>
                             <p className="text-gray-600 text-[10px] sm:text-xs leading-relaxed">
                               {formData.description || "Description of the deal goes here..."}
                             </p>
                           </div>
                         </div>
                      </div>

                      {/* App Footer Button */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <div className="w-full bg-[#E35000] text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm text-center shadow-lg shadow-orange-200">
                          Buy Now
                        </div>
                        <div className="w-24 sm:w-32 h-1 bg-black/20 rounded-full mx-auto mt-2 sm:mt-3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-8 pt-6 border-t border-gray-100 max-w-4xl mx-auto">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={step === 1}
                className="w-full sm:w-24 order-2 sm:order-1"
              >
                Back
              </Button>
              {step < 4 ? (
                <Button 
                  onClick={nextStep}
                  className="bg-[#E35000] hover:bg-[#FF6B35] text-white w-full sm:w-24 order-1 sm:order-2"
                  disabled={isNextDisabled}
                >
                  Next
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto order-1 sm:order-2">
                  <Button 
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="text-gray-600 border-gray-300 hover:bg-gray-100 w-full sm:w-auto"
                  >
                    <Save className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline ml-2">Save as Draft</span>
                    <span className="sm:hidden ml-2">Draft</span>
                  </Button>
                  <Button 
                    onClick={handlePublish}
                    className="bg-[#E35000] hover:bg-[#c44500] text-white w-full sm:w-auto px-8"
                  >
                    Publish Deal
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#141414] rounded-xl shadow-2xl w-full max-w-3xl transition-colors duration-300">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-[#2A2A2A] transition-colors duration-300">
              <div>
                <h3 className="text-xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">Crop Your Image</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Adjust to fit 800x400px (2:1 ratio)</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowCropper(false)}
                className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors duration-300"
              >
                <X size={24} />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="relative w-full h-96 bg-gray-900 dark:bg-black rounded-lg overflow-hidden">
                <Cropper
                  image={tempImage || ''}
                  crop={crop}
                  zoom={zoom}
                  aspect={2}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <Label className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Zoom Level</Label>
                    <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">{Math.round(zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-[#2A2A2A] rounded-lg appearance-none cursor-pointer accent-[#E35000] transition-colors duration-300"
                  />
                </div>
                
                <div className="bg-blue-50 dark:bg-[#E35000]/10 p-4 rounded-lg transition-colors duration-300">
                  <div className="flex items-start gap-2">
                    <Crop size={18} className="text-blue-600 dark:text-[#E35000] mt-0.5 transition-colors duration-300" />
                    <div className="text-sm text-blue-800 dark:text-gray-300 transition-colors duration-300">
                      <p className="font-medium">Cropping to 2:1 aspect ratio</p>
                      <p className="text-xs text-blue-600 dark:text-gray-400 mt-1 transition-colors duration-300">Final image will be 800x400 pixels for optimal display</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-[#2A2A2A] bg-gray-50 dark:bg-[#1C1C1C] transition-colors duration-300">
              <Button
                variant="outline"
                onClick={() => setShowCropper(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCrop}
                className="bg-[#E35000] hover:bg-[#c44500] text-white px-8"
              >
                Apply Crop
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}