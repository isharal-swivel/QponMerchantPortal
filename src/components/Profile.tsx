import React, { useState, useRef } from 'react';
import { 
  User, Mail, Phone, Building, FileText, 
  MapPin, Edit2, Save, XCircle, Crown, CreditCard, 
  Facebook, Instagram, Youtube, Twitter, Upload, Globe, Store, Calendar, Lock,
  Plus, Trash2, FileUp, Image as ImageIcon, Crop, Check, ChevronsUpDown, X, Info, Search, Clock
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "./ui/input-otp";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";
import { toast } from 'sonner@2.0.3';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';
import { useTheme } from "next-themes@0.4.6";

// Available business categories
const BUSINESS_CATEGORIES = ['Bar', 'Dining', 'Cafe'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function Profile() {
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === "dark" || resolvedTheme === "dark";
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const foodMenuUploadRef = useRef<HTMLInputElement>(null);

  // Cover images cropping states
  const [coverImages, setCoverImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1578554224526-91d308d3948b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBkaW5pbmd8ZW58MXx8fHwxNzY2MDMxNjc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc2NjAxMDAxOHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1604552584409-44de624c9f57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlJTIwYmFyfGVufDF8fHx8MTc2NjAzNzI4N3ww&ixlib=rb-4.1.0&q=80&w=1080"
  ]);
  const [tempCoverImage, setTempCoverImage] = useState<string | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [currentCropIndex, setCurrentCropIndex] = useState<number | null>(null);

  // Profile logo cropping states
  const [tempProfileImage, setTempProfileImage] = useState<string | null>(null);
  const [profileCropDialogOpen, setProfileCropDialogOpen] = useState(false);
  const [profileCrop, setProfileCrop] = useState<Point>({ x: 0, y: 0 });
  const [profileZoom, setProfileZoom] = useState(1);
  const [profileCroppedAreaPixels, setProfileCroppedAreaPixels] = useState<Area | null>(null);

  // Food menu cropping states
  const [tempFoodMenuImage, setTempFoodMenuImage] = useState<string | null>(null);
  const [foodMenuCropDialogOpen, setFoodMenuCropDialogOpen] = useState(false);
  const [foodMenuCrop, setFoodMenuCrop] = useState<Point>({ x: 0, y: 0 });
  const [foodMenuZoom, setFoodMenuZoom] = useState(1);
  const [foodMenuCroppedAreaPixels, setFoodMenuCroppedAreaPixels] = useState<Area | null>(null);

  // Food menu upload state
  const [foodMenuFile, setFoodMenuFile] = useState<string | null>(null);

  // Change Username/Contact Dialog State
  const [isChangeUsernameOpen, setIsChangeUsernameOpen] = useState(false);
  const [newMobile, setNewMobile] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isUsernameOtpStep, setIsUsernameOtpStep] = useState(false);
  const [usernameOtp, setUsernameOtp] = useState('');
  const [activeVerificationField, setActiveVerificationField] = useState<'mobile' | 'email' | null>(null);
  const [isNewMobileVerified, setIsNewMobileVerified] = useState(false);
  const [isNewEmailVerified, setIsNewEmailVerified] = useState(false);


  // Add Branch Dialog State
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [editingBranchIndex, setEditingBranchIndex] = useState<number | null>(null);

  // Verification State
  const [verifiedMobile, setVerifiedMobile] = useState(true);
  const [verifiedEmail, setVerifiedEmail] = useState(true);
  
  // OTP Dialog State
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpTarget, setOtpTarget] = useState<'mobile' | 'email' | null>(null);
  const [otpValue, setOtpValue] = useState('');
  const [newBranch, setNewBranch] = useState({
    name: '',
    address: '',
    contact: '',
    proofOfAddress: null as string | null
  });
  const [branchProofFile, setBranchProofFile] = useState<File | null>(null);

  const [profile, setProfile] = useState({
    status: 'Active',
    email: 'reservations@cinnamongrand.com',
    mobile: '+94 77 123 4567',
    joinedDate: '2023-08-15',
    businessName: 'Cinnamon Grand Colombo',
    username: '+94771234567',
    regNo: 'PV 12345',
    category: ['Dining', 'Bar'] as string[], // Changed to array for multiple categories
    description: 'Five-star luxury hotel located in the heart of Colombo, offering premium dining, accommodation, and wellness experiences.',
    address: '77 Galle Rd, Colombo 00300, Sri Lanka',
    openingHours: [
      { day: 'Monday', open: '09:00', close: '22:00', isClosed: false },
      { day: 'Tuesday', open: '09:00', close: '22:00', isClosed: false },
      { day: 'Wednesday', open: '09:00', close: '22:00', isClosed: false },
      { day: 'Thursday', open: '09:00', close: '22:00', isClosed: false },
      { day: 'Friday', open: '09:00', close: '22:00', isClosed: false },
      { day: 'Saturday', open: '10:00', close: '23:00', isClosed: false },
      { day: 'Sunday', open: '10:00', close: '23:00', isClosed: false }
    ],
    website: 'https://www.cinnamonhotels.com',
    facebook: 'cinnamongrand',
    instagram: 'cinnamongrandcolombo',
    youtube: 'cinnamongrand',
    twitter: 'cinnamongrand',
    contactPerson: 'Sarah Johnson',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYW55JTIwbG9nb3xlbnwxfHx8fDE3NjQ2NDc4MDN8MA&ixlib=rb-4.1.0&q=80&w=200',
    menu: null as string | null,
    branches: [
       { name: 'Main Branch', address: '77 Galle Rd, Colombo 00300', contact: '+94 11 243 7437', verified: true },
       { name: 'Kandy Branch', address: '123 Peradeniya Rd, Kandy', contact: '+94 81 222 3333', verified: false }
    ]
  });

  const handleSave = () => {
    // Basic validation
    if (!profile.businessName || !profile.regNo || !profile.description || !profile.address || !profile.mobile || !profile.email || !profile.contactPerson || profile.category.length === 0 || !profile.openingHours) {
      toast.error("Please fill in all mandatory fields marked with *");
      return;
    }
    
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string | string[]) => {
    setProfile(prev => ({ ...prev, [field]: value }));

    // Reset verification status if key fields are changed
    if (field === 'mobile') {
      setVerifiedMobile(false);
    } else if (field === 'email') {
      setVerifiedEmail(false);
    }
  };

  const handleVerifyClick = (field: 'mobile' | 'email') => {
    setOtpTarget(field);
    setOtpValue('');
    setIsOtpOpen(true);
  };

  const handleOtpSubmit = () => {
    // Mock OTP verification
    if (otpValue.length === 6) {
      if (otpTarget === 'mobile') {
        setVerifiedMobile(true);
        toast.success("Phone number verified successfully");
      } else if (otpTarget === 'email') {
        setVerifiedEmail(true);
        toast.success("Email verified successfully");
      }
      setIsOtpOpen(false);
    } else {
      toast.error("Please enter a valid 6-digit code");
    }
  };

  const handleOpenChangeUsername = () => {
    setNewMobile(profile.username);
    setNewEmail(profile.email);
    setIsUsernameOtpStep(false);
    setUsernameOtp('');
    setIsChangeUsernameOpen(true);
    // Reset verification states when opening
    setIsNewMobileVerified(false);
    setIsNewEmailVerified(false);
  };

  const handleVerifyField = (field: 'mobile' | 'email') => {
    if (field === 'mobile') {
      if (!newMobile || newMobile.trim() === '') {
        toast.error("Please enter a valid mobile number");
        return;
      }
    } else {
      if (!newEmail || newEmail.trim() === '') {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    setActiveVerificationField(field);
    setUsernameOtp('');
    setIsUsernameOtpStep(true);
    toast.success(`OTP sent to ${field === 'mobile' ? newMobile : newEmail}`);
  };

  const handleChangeUsernameConfirm = () => {
    if (usernameOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }
    
    // Verify OTP
    if (activeVerificationField === 'mobile') {
      setIsNewMobileVerified(true);
      toast.success("Mobile number verified");
    } else if (activeVerificationField === 'email') {
      setIsNewEmailVerified(true);
      toast.success("Email verified");
    }

    // Go back to input step
    setIsUsernameOtpStep(false);
    setActiveVerificationField(null);
  };

  const handleSaveContactChanges = () => {
    if (!isNewMobileVerified) {
       // Since mobile is mandatory, we might want to enforce verification if it changed?
       // For now, let's assume if it's not verified, we can't save changes to it if it was modified?
       // Or the user can save unverified changes but they will be marked unverified? 
       // The prompt says "Both should be verfiefd with OTP", implying we can't save without verification.
       // However, typical flow might be verify then save.
    }

    // Assuming we only save verified fields or if they haven't changed.
    const mobileChanged = newMobile !== profile.username;
    const emailChanged = newEmail !== profile.email;

    if (mobileChanged && !isNewMobileVerified) {
      toast.error("Please verify the new mobile number before saving.");
      return;
    }
    if (emailChanged && !isNewEmailVerified) {
      toast.error("Please verify the new email address before saving.");
      return;
    }

    setProfile(prev => ({ 
      ...prev, 
      username: newMobile,
      email: newEmail,
      mobile: newMobile,
      // Update verification status in main profile if needed
      // For now we just update the values
    }));
    
    // Also update the verification status in the main profile state if we track it there
    setVerifiedMobile(true); 
    setVerifiedEmail(true);

    setIsChangeUsernameOpen(false);
    toast.success("Contact details updated successfully");
  };
  
  // Handler for multi-category selection
  const handleCategoryToggle = (category: string) => {
    setProfile(prev => {
      const currentCategories = prev.category;
      if (currentCategories.includes(category)) {
        // Remove category if already selected
        return { ...prev, category: currentCategories.filter(c => c !== category) };
      } else {
        // Add category if not selected
        return { ...prev, category: [...currentCategories, category] };
      }
    });
  };

  const handleBranchChange = (index: number, field: string, value: string) => {
    const newBranches = [...profile.branches];
    newBranches[index] = { ...newBranches[index], [field]: value };
    setProfile(prev => ({ ...prev, branches: newBranches }));
  };

  const handleAddBranch = () => {
    setNewBranch({ name: '', address: '', contact: '', proofOfAddress: null });
    setBranchProofFile(null);
    setEditingBranchIndex(null);
    setIsAddBranchOpen(true);
  };

  const handleEditBranch = (index: number) => {
    const branch = profile.branches[index];
    setNewBranch({
      name: branch.name,
      address: branch.address,
      contact: branch.contact,
      proofOfAddress: null // In a real app we might load this
    });
    setBranchProofFile(null);
    setEditingBranchIndex(index);
    setIsAddBranchOpen(true);
  };

  const handleSaveBranch = () => {
    if (!newBranch.name || !newBranch.address) {
      toast.error("Please fill in Branch Name and Address");
      return;
    }

    if (editingBranchIndex !== null) {
      // Update existing branch
      const updatedBranches = [...profile.branches];
      updatedBranches[editingBranchIndex] = { 
        ...newBranch,
        verified: updatedBranches[editingBranchIndex].verified 
      };
      setProfile(prev => ({
        ...prev,
        branches: updatedBranches
      }));
      toast.success("Branch updated successfully");
    } else {
      // Add new branch
      setProfile(prev => ({
        ...prev,
        branches: [...prev.branches, { ...newBranch, verified: false }]
      }));
      toast.success("Branch added successfully");
    }
    setIsAddBranchOpen(false);
  };

  const handleBranchProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBranchProofFile(file);
      setNewBranch(prev => ({ ...prev, proofOfAddress: file.name }));
    }
  };

  const handleRemoveBranch = (index: number) => {
     const newBranches = profile.branches.filter((_, i) => i !== index);
     setProfile(prev => ({ ...prev, branches: newBranches }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfileImage(reader.result as string);
        setProfileCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMenuUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempFoodMenuImage(reader.result as string);
        setFoodMenuCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (!passwordForm.current || !passwordForm.new) {
      toast.error("Please fill in all fields");
      return;
    }
    
    toast.success("Password updated successfully");
    setIsChangePasswordOpen(false);
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  // Cover Image Upload Handler
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      toast.error("Invalid file type. Only PNG and JPEG are allowed.");
      return;
    }

    // Validate file size (2MB = 2097152 bytes)
    if (file.size > 2097152) {
      toast.error("File size exceeds 2MB limit.");
      return;
    }

    // Check if already 3 images
    if (coverImages.length >= 3) {
      toast.error("Maximum 3 cover images allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setTempCoverImage(reader.result as string);
      setCurrentCropIndex(null); // New image
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // Food Menu Upload Handler
  const handleFoodMenuUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      toast.error("Invalid file type. Only PNG and JPEG are allowed.");
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2097152) {
      toast.error("File size exceeds 2MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setTempFoodMenuImage(reader.result as string);
      setFoodMenuCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // Crop Complete Handler
  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Profile Logo Crop Complete Handler
  const onProfileCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setProfileCroppedAreaPixels(croppedAreaPixels);
  };

  // Food Menu Crop Complete Handler
  const onFoodMenuCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setFoodMenuCroppedAreaPixels(croppedAreaPixels);
  };

  // Create Cropped Image
  const createCroppedImage = async () => {
    if (!tempCoverImage || !croppedAreaPixels) return;

    const image = new Image();
    image.src = tempCoverImage;
    
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(
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

    return canvas.toDataURL('image/jpeg');
  };

  // Save Cropped Image
  const saveCroppedImage = async () => {
    const croppedImageUrl = await createCroppedImage();
    if (!croppedImageUrl) return;

    if (currentCropIndex !== null) {
      // Edit existing image
      const newImages = [...coverImages];
      newImages[currentCropIndex] = croppedImageUrl;
      setCoverImages(newImages);
      toast.success("Cover image updated successfully");
    } else {
      // Add new image
      setCoverImages([...coverImages, croppedImageUrl]);
      toast.success("Cover image added successfully");
    }

    setCropDialogOpen(false);
    setTempCoverImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCurrentCropIndex(null);
  };

  // Delete Cover Image
  const deleteCoverImage = (index: number) => {
    setCoverImages(coverImages.filter((_, i) => i !== index));
    toast.success("Cover image removed");
  };

  // Edit Cover Image
  const editCoverImage = (index: number) => {
    setTempCoverImage(coverImages[index]);
    setCurrentCropIndex(index);
    setCropDialogOpen(true);
  };

  // Create Cropped Profile Image
  const createCroppedProfileImage = async () => {
    if (!tempProfileImage || !profileCroppedAreaPixels) return;

    const image = new Image();
    image.src = tempProfileImage;
    
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    canvas.width = profileCroppedAreaPixels.width;
    canvas.height = profileCroppedAreaPixels.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(
      image,
      profileCroppedAreaPixels.x,
      profileCroppedAreaPixels.y,
      profileCroppedAreaPixels.width,
      profileCroppedAreaPixels.height,
      0,
      0,
      profileCroppedAreaPixels.width,
      profileCroppedAreaPixels.height
    );

    return canvas.toDataURL('image/jpeg');
  };

  // Save Cropped Profile Image
  const saveCroppedProfileImage = async () => {
    const croppedImageUrl = await createCroppedProfileImage();
    if (!croppedImageUrl) return;

    setProfile(prev => ({ ...prev, logo: croppedImageUrl }));
    toast.success("Profile image updated successfully");

    setProfileCropDialogOpen(false);
    setTempProfileImage(null);
    setProfileCrop({ x: 0, y: 0 });
    setProfileZoom(1);
  };

  // Create Cropped Food Menu Image
  const createCroppedFoodMenuImage = async () => {
    if (!tempFoodMenuImage || !foodMenuCroppedAreaPixels) return;

    const image = new Image();
    image.src = tempFoodMenuImage;
    
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    canvas.width = foodMenuCroppedAreaPixels.width;
    canvas.height = foodMenuCroppedAreaPixels.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(
      image,
      foodMenuCroppedAreaPixels.x,
      foodMenuCroppedAreaPixels.y,
      foodMenuCroppedAreaPixels.width,
      foodMenuCroppedAreaPixels.height,
      0,
      0,
      foodMenuCroppedAreaPixels.width,
      foodMenuCroppedAreaPixels.height
    );

    return canvas.toDataURL('image/jpeg');
  };

  // Save Cropped Food Menu Image
  const saveCroppedFoodMenuImage = async () => {
    const croppedImageUrl = await createCroppedFoodMenuImage();
    if (!croppedImageUrl) return;

    setFoodMenuFile(croppedImageUrl);
    toast.success("Food menu uploaded successfully");

    setFoodMenuCropDialogOpen(false);
    setTempFoodMenuImage(null);
    setFoodMenuCrop({ x: 0, y: 0 });
    setFoodMenuZoom(1);
  };

  const handleOpeningHoursChange = (index: number, field: 'open' | 'close' | 'isClosed', value: any) => {
    const newHours = [...profile.openingHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setProfile(prev => ({ ...prev, openingHours: newHours }));
  };

  const formatOpeningHours = () => {
    const groups = [];
    if (profile.openingHours.length === 0) return null;

    let currentGroup = { start: 0, end: 0, hours: profile.openingHours[0] };

    for (let i = 1; i < profile.openingHours.length; i++) {
        const day = profile.openingHours[i];
        const prev = currentGroup.hours;
        const sameHours = day.isClosed === prev.isClosed && 
                          (day.isClosed || (day.open === prev.open && day.close === prev.close));
        
        if (sameHours) {
            currentGroup.end = i;
        } else {
            groups.push(currentGroup);
            currentGroup = { start: i, end: i, hours: day };
        }
    }
    groups.push(currentGroup);

    return (
        <div className="flex flex-col gap-1">
            {groups.map((g, i) => {
                const startDay = profile.openingHours[g.start].day.substring(0, 3);
                const endDay = profile.openingHours[g.end].day.substring(0, 3);
                const dayLabel = g.start === g.end ? startDay : `${startDay} - ${endDay}`;
                const timeLabel = g.hours.isClosed ? 'Closed' : `${g.hours.open} - ${g.hours.close}`;
                return (
                    <div key={i} className="flex gap-4 text-sm">
                        <span className="font-medium text-gray-500 dark:text-gray-400 w-20">{dayLabel}</span>
                        <span className="text-gray-900 dark:text-white">{timeLabel}</span>
                    </div>
                );
            })}
        </div>
    );
  };

  const InfoItem = ({ icon: Icon, label, value, field, multiline = false, type = "text", isSelect = false, required = false, verified, onVerify }: any) => (
    <div className="flex items-start space-x-4 py-2">
      <div className="mt-1 bg-blue-50 dark:bg-[#E35000]/10 p-2 rounded-lg text-[#231F20] dark:text-[#E35000] flex-shrink-0 transition-colors duration-300">
        <Icon size={16} />
      </div>
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-1">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">{label}</p>
          {required && <span className="text-red-500 dark:text-red-400 text-xs">*</span>}
        </div>
        {isEditing ? (
          <div className="flex gap-2 items-start">
             <div className="flex-1">
              {isSelect ? (
                <Select value={value} onValueChange={(val) => handleChange(field, val)}>
                  <SelectTrigger className={`h-8 text-sm w-full ${required && !value ? 'border-red-300 bg-red-50' : ''}`}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bar">Bar</SelectItem>
                    <SelectItem value="Dining">Dining</SelectItem>
                    <SelectItem value="Cafe">Cafe</SelectItem>
                  </SelectContent>
                </Select>
              ) : multiline ? (
                <Textarea 
                  value={value} 
                  onChange={(e) => handleChange(field, e.target.value)}
                  className={`min-h-[60px] text-sm resize-none ${required && !value ? 'border-red-300 bg-red-50' : ''}`}
                />
              ) : (
                <Input 
                  type={type}
                  value={value} 
                  onChange={(e) => handleChange(field, e.target.value)}
                  className={`h-8 text-sm ${required && !value ? 'border-red-300 bg-red-50' : ''}`}
                />
              )}
            </div>
            {verified === false && onVerify && (
               <Button size="sm" onClick={onVerify} className="bg-[#E35000] hover:bg-[#c44500] text-white text-xs h-8 px-3 shrink-0">
                 Verify
               </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white break-words leading-relaxed truncate transition-colors duration-300">
              {value || '-'}
            </p>
            {verified !== undefined && (
                verified ? (
                  <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 text-[10px] h-5 px-1.5 rounded border border-emerald-200 dark:border-emerald-800">
                    <Check size={10} className="mr-1" /> Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 text-[10px] h-5 px-1.5 rounded border border-yellow-200 dark:border-yellow-800">
                    Not Verified
                  </Badge>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20 lg:pb-0 space-y-6">
      {/* Header Card */}
      <Card className="border-none shadow-sm bg-white dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:to-[#141414] transition-colors duration-300">
         <CardContent className="p-4 sm:p-6">
           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="relative group flex-shrink-0">
                   <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 border-gray-100 dark:border-[#2A2A2A] bg-gray-50 dark:bg-[#1C1C1C]/50 shadow-sm transition-colors duration-300">
                      <img src={profile.logo} alt="Business Logo" className="w-full h-full object-cover" />
                   </div>
                   {isEditing && (
                     <div 
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => fileInputRef.current?.click()}
                     >
                       <Upload className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                       <input 
                         type="file" 
                         ref={fileInputRef} 
                         className="hidden" 
                         accept="image/*"
                         onChange={handleLogoUpload}
                       />
                     </div>
                   )}
                </div>
                <div className="space-y-2 flex-1 min-w-0">
                   <div className="flex items-center gap-2 flex-wrap">
                     <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#231F20] dark:text-white truncate transition-colors duration-300">{profile.businessName}</h2>
                      <Badge className={`${profile.status === 'Active' ? 'bg-emerald-500' : 'bg-yellow-500'} hover:bg-emerald-600 text-xs`}>
                        {profile.status}
                      </Badge>
                   </div>
                   <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-wrap transition-colors duration-300">
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="sm:w-3.5 sm:h-3.5"/> Joined {profile.joinedDate}</span>
                      <span className="hidden sm:flex items-center gap-1.5"><Mail size={14} className="sm:w-3.5 sm:h-3.5"/> {profile.email}</span>
                      <span className="hidden sm:flex items-center gap-1.5">
                        <User size={14} className="sm:w-3.5 sm:h-3.5"/> 
                        {profile.username}
                        {isEditing && (
                            <button onClick={handleOpenChangeUsername} className="ml-1 text-gray-400 hover:text-[#E35000] transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                                <Edit2 size={12} />
                            </button>
                        )}
                      </span>
                   </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:ml-auto">
                {!isEditing && (
                  <Button variant="outline" onClick={() => setIsChangePasswordOpen(true)} className="w-full sm:w-auto text-xs sm:text-sm text-gray-600 dark:text-gray-200 border-gray-300 dark:border-[#2A2A2A] hover:bg-gray-50 dark:hover:bg-white/10 h-9 sm:h-10 shadow-sm transition-colors duration-300">
                    <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                    Change Password
                  </Button>
                )}
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none text-xs sm:text-sm text-gray-600 dark:text-gray-200 border-gray-300 dark:border-[#2A2A2A] hover:bg-gray-50 dark:hover:bg-white/10 h-9 sm:h-10 shadow-sm transition-colors duration-300">
                      <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="flex-1 sm:flex-none text-xs sm:text-sm bg-[#E35000] hover:bg-[#c44500] text-white h-9 sm:h-10 shadow-sm">
                      <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                      Save
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto text-xs sm:text-sm bg-[#0A0A0A] hover:bg-black dark:bg-[#E35000] dark:hover:bg-[#c44500] text-white h-9 sm:h-10 shadow-sm transition-colors duration-300">
                    <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
           </div>
         </CardContent>
      </Card>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
        {/* Subscription Card - Order 1 on mobile, right column on desktop */}
        <div className="order-1 lg:order-2 space-y-6">
          {/* Subscription Card */}
          <Card className="border-none shadow-lg bg-gradient-to-br from-[#0E2250] to-[#1e3a8a] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E35000] rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-gray-300 text-xs font-medium mb-1 uppercase tracking-wide">Current Plan</p>
                  <h3 className="text-2xl font-bold flex items-center gap-2 text-[20px]">
                    Onboarding Free Trial <Crown size={20} className="text-[#E35000] fill-[#E35000]" />
                  </h3>
                </div>
                <span className="bg-[#E35000] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">ACTIVE</span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-300 border-b border-[#2A2A2A] pb-2">
                  <span>Billing Cycle</span>
                  <span className="font-medium text-white">3 Months Free</span>
                </div>
                <div className="flex justify-between text-sm text-gray-300 border-b border-[#2A2A2A] pb-2">
                  <span>Trial Ends</span>
                  <span className="font-medium text-white">Mar 29, 2025</span>
                </div>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Amount</span>
                  <span className="font-medium text-white">LKR 0</span>
                </div>
              </div>

              <Button className="w-full bg-white dark:bg-[#E35000] text-[#0A0A0A] dark:text-white hover:bg-gray-50 dark:hover:bg-[#c44500] font-bold transition-colors group">
                <CreditCard size={16} className="mr-2 group-hover:text-[#E35000] dark:group-hover:text-white transition-colors" />
                Manage Subscription
              </Button>
            </CardContent>
          </Card>

          {/* Branches - Compact Grid */}
          <Card className="border-none shadow-sm bg-white dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:to-[#141414] transition-colors duration-300">
              <CardHeader className="border-b border-gray-100 dark:border-[#2A2A2A] pb-4 flex flex-row items-center justify-between transition-colors duration-300">
                  <CardTitle className="text-lg font-semibold text-[#0A0A0A] dark:text-white transition-colors duration-300">Branches Details</CardTitle>
                  {isEditing && (
                    <Button variant="outline" size="sm" onClick={handleAddBranch} className="h-7 text-xs border-dashed border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                      <Plus size={14} className="mr-1" /> Add Branch
                    </Button>
                  )}
              </CardHeader>
              <CardContent className="pt-6">
                  <div className="grid grid-cols-1 gap-4">
                    {profile.branches.map((branch, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-[#1C1C1C] p-3 rounded-lg border border-gray-100 dark:border-[#2A2A2A] hover:border-gray-200 dark:hover:border-[#E35000]/50 transition-colors relative group">
                            {isEditing && (
                              <div className="absolute top-1 right-1 flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-gray-400 dark:text-gray-400 hover:text-[#E35000] dark:hover:text-[#E35000] hover:bg-orange-50 dark:hover:bg-[#E35000]/20 transition-colors duration-300"
                                  onClick={() => handleEditBranch(index)}
                                >
                                  <Edit2 size={12} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-gray-400 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors duration-300"
                                  onClick={() => handleRemoveBranch(index)}
                                >
                                  <Trash2 size={12} />
                                </Button>
                              </div>
                            )}
                            <div className="flex items-center gap-2 mb-2 pr-14">
                                <Store size={14} className="text-[#E35000]" />
                                <h4 className="text-sm font-semibold text-[#0A0A0A] dark:text-white transition-colors duration-300">{branch.name}</h4>
                                {branch.verified ? (
                                  <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 text-[10px] h-5 px-1.5 rounded border border-emerald-200 dark:border-emerald-800">
                                    <Check size={10} className="mr-1" /> Verified
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 text-[10px] h-5 px-1.5 rounded border border-yellow-200 dark:border-yellow-800">
                                    Not Verified
                                  </Badge>
                                )}
                            </div>
                            <div className="space-y-1.5 pl-5">
                                <div className="flex gap-2 items-start text-xs">
                                    <MapPin size={12} className="mt-0.5 text-gray-400 dark:text-gray-400 flex-shrink-0 transition-colors duration-300" />
                                    <span className="text-gray-600 dark:text-gray-400 line-clamp-1 transition-colors duration-300" title={branch.address}>{branch.address}</span>
                                </div>
                                <div className="flex gap-2 items-center text-xs">
                                    <Phone size={12} className="text-gray-400 dark:text-gray-400 flex-shrink-0 transition-colors duration-300" />
                                    <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{branch.contact}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {profile.branches.length === 0 && (
                      <div className="col-span-1 py-8 text-center text-gray-400 dark:text-gray-400 text-sm border-2 border-dashed border-gray-100 dark:border-[#2A2A2A] rounded-lg transition-colors duration-300">
                        No branches added yet.
                      </div>
                    )}
                  </div>
              </CardContent>
          </Card>

          {/* Food Menu Section */}
          <Card className="border-none shadow-sm bg-white dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:to-[#141414] transition-colors duration-300">
            <CardHeader className="border-b border-gray-100 dark:border-[#2A2A2A] pb-4 transition-colors duration-300">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-semibold text-[#0A0A0A] dark:text-white transition-colors duration-300">Food Menu</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="text-gray-400 dark:text-gray-400 hover:text-[#E35000] dark:hover:text-[#E35000] cursor-help transition-colors duration-300" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-[#0A0A0A] text-white max-w-[250px]">
                    <p>This image will display on Merchant profile on mobile app</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-[14px] text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">PNG, JPEG | Max 2MB</p>
            </CardHeader>
            <CardContent className="pt-6">
              {foodMenuFile ? (
                <div className="space-y-2">
                  <div className="relative group aspect-[4/3] rounded-lg overflow-hidden border-2 border-gray-200 dark:border-[#2A2A2A] hover:border-[#E35000] transition-colors">
                    <img src={foodMenuFile} alt="Food Menu" className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7 bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => {
                          setFoodMenuFile(null);
                          toast.success("Food menu removed");
                        }}
                      >
                        <XCircle size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 dark:border-[#2A2A2A] hover:border-[#E35000] dark:hover:border-[#E35000] transition-colors flex flex-col items-center justify-center cursor-pointer bg-gray-50 dark:bg-[#1C1C1C] hover:bg-orange-50 dark:hover:bg-[#E35000]/10"
                  onClick={() => foodMenuUploadRef.current?.click()}
                >
                  <Upload className="w-6 h-6 text-gray-400 dark:text-gray-400 mb-1 transition-colors duration-300" />
                  <p className="text-xs text-gray-600 dark:text-gray-200 font-medium text-center px-2 transition-colors duration-300">Add Image</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-400 transition-colors duration-300">Max 2MB</p>
                  <input
                    type="file"
                    ref={foodMenuUploadRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFoodMenuUpload}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Business Information - Order 2 on mobile, left column on desktop */}
        <div className="order-2 lg:order-1 lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm bg-white dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:to-[#141414] transition-colors duration-300">
              <CardHeader className="border-b border-gray-100 dark:border-[#2A2A2A] pb-4 transition-colors duration-300">
                <CardTitle className="text-lg font-semibold text-[#0A0A0A] dark:text-white transition-colors duration-300">Business Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  <div className="col-span-1 md:col-span-2">
                    <InfoItem 
                      icon={Building} 
                      label="Business Name" 
                      value={profile.businessName} 
                      field="businessName" 
                      required={true}
                    />
                  </div>
                   {/* Compact Row for Reg No and Category */}
                   <div className="col-span-1">
                    <InfoItem 
                      icon={FileText} 
                      label="Registration Number" 
                      value={profile.regNo} 
                      field="regNo" 
                      required={true}
                    />
                  </div>
                   <div className="col-span-1">
                    {/* Multi-Category Selection */}
                    <div className="flex items-start space-x-4 py-2">
                      <div className="mt-1 bg-blue-50 dark:bg-[#E35000]/10 p-2 rounded-lg text-[#0A0A0A] dark:text-[#E35000] flex-shrink-0 transition-colors duration-300">
                        <Store size={16} />
                      </div>
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">Business Category</p>
                          <span className="text-red-500 dark:text-red-400 text-xs">*</span>
                        </div>
                        {isEditing ? (
                          <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={categoryPopoverOpen}
                                className={`w-full h-auto min-h-[32px] justify-between text-sm ${profile.category.length === 0 ? 'border-red-300 bg-red-50' : ''}`}
                              >
                                <div className="flex flex-wrap gap-1 flex-1">
                                  {profile.category.length > 0 ? (
                                    profile.category.map((cat) => (
                                      <Badge key={cat} variant="secondary" className="text-xs bg-[#0A0A0A] text-white border-[#0A0A0A]">
                                        {cat}
                                        <X
                                          size={12}
                                          className="ml-1 cursor-pointer hover:text-red-300"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCategoryToggle(cat);
                                          }}
                                        />
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-gray-400">Select categories...</span>
                                  )}
                                </div>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="start">
                              <Command>
                                <CommandInput placeholder="Search categories..." className="h-9" />
                                <CommandEmpty>No category found.</CommandEmpty>
                                <CommandGroup>
                                  {BUSINESS_CATEGORIES.map((cat) => (
                                    <CommandItem
                                      key={cat}
                                      value={cat}
                                      onSelect={() => {
                                        handleCategoryToggle(cat);
                                      }}
                                      className="cursor-pointer"
                                    >
                                      <div className={`mr-2 flex h-4 w-4 items-center justify-center rounded border ${profile.category.includes(cat) ? 'bg-[#E35000] border-[#E35000]' : 'border-gray-300'}`}>
                                        {profile.category.includes(cat) && <Check className="h-3 w-3 text-white" />}
                                      </div>
                                      {cat}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {profile.category.length > 0 ? (
                              profile.category.map((cat) => (
                                <Badge key={cat} variant="outline" className="text-xs bg-[#0A0A0A] text-white border-[#0A0A0A]">
                                  {cat}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm font-medium text-gray-400">-</span>
                            )}
                          </div>
                        )}
                        {isEditing && profile.category.length === 0 && (
                          <p className="text-xs text-red-600 mt-1">Select at least one category</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <InfoItem 
                      icon={FileText} 
                      label="Short Description" 
                      value={profile.description} 
                      field="description" 
                      multiline={true}
                      required={true}
                    />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <InfoItem 
                      icon={MapPin} 
                      label="Address" 
                      value={profile.address} 
                      field="address" 
                      multiline={true}
                      required={true}
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-start space-x-4 py-2">
                      <div className="mt-1 bg-blue-50 dark:bg-[#E35000]/10 p-2 rounded-lg text-[#231F20] dark:text-[#E35000] flex-shrink-0 transition-colors duration-300">
                        <Clock size={16} />
                      </div>
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">Opening Hours <span className="text-red-500 ml-1">*</span></p>
                        </div>
                        
                        {isEditing ? (
                            <div className="space-y-2 bg-gray-50 dark:bg-[#1C1C1C] p-4 rounded-lg border border-gray-100 dark:border-[#2A2A2A]">
                                {profile.openingHours.map((item, index) => (
                                    <div key={item.day} className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 pb-2 border-b border-gray-100 dark:border-[#2A2A2A] last:border-0 last:pb-0">
                                        <div className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {item.day}
                                        </div>
                                        
                                        {!item.isClosed ? (
                                            <div className="flex items-center gap-2 flex-1">
                                                <Input 
                                                    type="time" 
                                                    value={item.open} 
                                                    onChange={(e) => handleOpeningHoursChange(index, 'open', e.target.value)}
                                                    className="h-8 w-[90px] text-xs sm:text-sm bg-white dark:bg-[#0A0A0A] dark:border-[#2A2A2A]"
                                                />
                                                <span className="text-gray-400">-</span>
                                                <Input 
                                                    type="time" 
                                                    value={item.close} 
                                                    onChange={(e) => handleOpeningHoursChange(index, 'close', e.target.value)}
                                                    className="h-8 w-[90px] text-xs sm:text-sm bg-white dark:bg-[#0A0A0A] dark:border-[#2A2A2A]"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex-1 text-sm text-gray-400 italic py-1.5 ml-1">
                                                Closed
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 min-w-[80px] justify-end">
                                            <Checkbox 
                                                id={`closed-${index}`} 
                                                checked={item.isClosed}
                                                onCheckedChange={(checked) => handleOpeningHoursChange(index, 'isClosed', checked)}
                                                className="data-[state=checked]:bg-[#E35000] data-[state=checked]:border-[#E35000]"
                                            />
                                            <Label htmlFor={`closed-${index}`} className="text-xs sm:text-sm cursor-pointer text-gray-600 dark:text-gray-400">Closed</Label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                           formatOpeningHours()
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Details Card */}
            <Card className="border-none shadow-sm bg-white dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:to-[#141414] transition-colors duration-300">
              <CardHeader className="border-b border-gray-100 dark:border-[#2A2A2A] pb-4 transition-colors duration-300">
                <CardTitle className="text-lg font-semibold text-[#0A0A0A] dark:text-white transition-colors duration-300">Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  <InfoItem 
                    icon={Phone} 
                    label="Contact Number" 
                    value={profile.mobile} 
                    field="mobile" 
                    required={true}
                    verified={verifiedMobile}
                    onVerify={() => handleVerifyClick('mobile')}
                  />
                  <InfoItem 
                    icon={Mail} 
                    label="Email Address" 
                    value={profile.email} 
                    field="email" 
                    required={true}
                    verified={verifiedEmail}
                    onVerify={() => handleVerifyClick('email')}
                  />
                  <InfoItem 
                    icon={Globe} 
                    label="Web Address" 
                    value={profile.website} 
                    field="website" 
                    required={false}
                  />
                  <InfoItem 
                    icon={User} 
                    label="Contact Person" 
                    value={profile.contactPerson} 
                    field="contactPerson" 
                    required={true}
                  />
                </div>
                
                {/* Social Media Row */}
                <div className="pt-4 border-t border-gray-100 dark:border-[#2A2A2A] transition-colors duration-300">
                    <h4 className="text-sm font-semibold text-[#0A0A0A] dark:text-white mb-4 transition-colors duration-300">Social Media</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                             <Facebook size={14} /> Facebook
                           </div>
                           {isEditing ? (
                             <Input value={profile.facebook} onChange={(e) => handleChange('facebook', e.target.value)} className="h-8 text-xs" placeholder="Username" />
                           ) : (
                             <p className="text-sm font-medium text-[#0A0A0A] dark:text-white truncate transition-colors duration-300">{profile.facebook || '-'}</p>
                           )}
                        </div>
                        <div className="space-y-1">
                           <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                             <Instagram size={14} /> Instagram
                           </div>
                           {isEditing ? (
                             <Input value={profile.instagram} onChange={(e) => handleChange('instagram', e.target.value)} className="h-8 text-xs" placeholder="Username" />
                           ) : (
                             <p className="text-sm font-medium text-[#0A0A0A] dark:text-white truncate transition-colors duration-300">{profile.instagram || '-'}</p>
                           )}
                        </div>
                        <div className="space-y-1">
                           <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                             <Youtube size={14} /> YouTube
                           </div>
                           {isEditing ? (
                             <Input value={profile.youtube} onChange={(e) => handleChange('youtube', e.target.value)} className="h-8 text-xs" placeholder="Channel" />
                           ) : (
                             <p className="text-sm font-medium text-[#0A0A0A] dark:text-white truncate transition-colors duration-300">{profile.youtube || '-'}</p>
                           )}
                        </div>
                        <div className="space-y-1">
                           <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                             <Twitter size={14} /> Twitter (X)
                           </div>
                           {isEditing ? (
                             <Input value={profile.twitter} onChange={(e) => handleChange('twitter', e.target.value)} className="h-8 text-xs" placeholder="Handle" />
                           ) : (
                             <p className="text-sm font-medium text-[#0A0A0A] dark:text-white truncate transition-colors duration-300">{profile.twitter || '-'}</p>
                           )}
                        </div>
                    </div>
                </div>
              </CardContent>
            </Card>

            {/* Cover Images Card */}
            <Card className="border-none shadow-sm bg-white dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:to-[#141414] transition-colors duration-300">
              <CardHeader className="border-b border-gray-100 dark:border-[#2A2A2A] pb-4 transition-colors duration-300">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-semibold text-[#0A0A0A] dark:text-white transition-colors duration-300">
                    Cover Images <span className="text-red-500 dark:text-red-400">*</span>
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={16} className="text-gray-400 dark:text-gray-400 hover:text-[#E35000] dark:hover:text-[#E35000] cursor-help transition-colors duration-300" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-[#0A0A0A] text-white max-w-[250px]">
                      <p>These images will display on Merchant profile on mobile app</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-[14px] text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">PNG, JPEG | Max 2MB | 1200x600px | Max 3</p>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {coverImages.map((img, index) => (
                    <div key={index} className="relative group aspect-[4/3] rounded-lg overflow-hidden border-2 border-gray-200 dark:border-[#2A2A2A] hover:border-[#E35000] transition-colors">
                      <img src={img} alt={`Cover ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-7 w-7 bg-[#E35000] hover:bg-[#c44500] text-white"
                          onClick={() => editCoverImage(index)}
                        >
                          <Crop size={14} />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-7 w-7 bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => deleteCoverImage(index)}
                        >
                          <XCircle size={14} />
                        </Button>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-[#E35000] text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        1200 x 600
                      </div>
                    </div>
                  ))}
                  
                  {/* Upload New Cover Image */}
                  {coverImages.length < 3 && (
                    <div 
                      className="aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 dark:border-[#2A2A2A] hover:border-[#E35000] dark:hover:border-[#E35000] transition-colors flex flex-col items-center justify-center cursor-pointer bg-gray-50 dark:bg-[#1C1C1C] hover:bg-orange-50 dark:hover:bg-[#E35000]/10"
                      onClick={() => coverImageInputRef.current?.click()}
                    >
                      <Upload className="w-6 h-6 text-gray-400 dark:text-gray-400 mb-1 transition-colors duration-300" />
                      <p className="text-xs text-gray-600 dark:text-gray-200 font-medium text-center px-2 transition-colors duration-300">Add Image</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-400 transition-colors duration-300">{coverImages.length}/3</p>
                      <input
                        type="file"
                        ref={coverImageInputRef}
                        className="hidden"
                        accept="image/png,image/jpeg"
                        onChange={handleCoverImageUpload}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:to-[#141414] border-gray-200 dark:border-[#2A2A2A] transition-colors duration-300">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white transition-colors duration-300">Change Password</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
              Make sure your new password is strong and secure.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current" className="text-gray-700 dark:text-gray-200 transition-colors duration-300">Current Password</Label>
              <Input 
                id="current" 
                type="password" 
                value={passwordForm.current}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new" className="text-gray-700 dark:text-gray-200 transition-colors duration-300">New Password</Label>
              <Input 
                id="new" 
                type="password" 
                value={passwordForm.new}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirm" className="text-gray-700 dark:text-gray-200 transition-colors duration-300">Confirm New Password</Label>
              <Input 
                id="confirm" 
                type="password" 
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)} className="border-gray-300 dark:border-[#2A2A2A] dark:text-gray-200 dark:hover:bg-white/10 transition-colors duration-300">Cancel</Button>
            <Button onClick={handleChangePassword} className="bg-[#0A0A0A] hover:bg-black dark:bg-[#E35000] dark:hover:bg-[#c44500] text-white transition-colors duration-300">
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Crop Image Dialog */}
      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2A2A2A] transition-colors duration-300">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white transition-colors duration-300">Crop Cover Image</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
              Adjust your image to fit the recommended 1200x600px size (2:1 ratio)
            </DialogDescription>
          </DialogHeader>
          <div className="relative w-full h-[400px] bg-gray-900 dark:bg-black rounded-lg overflow-hidden transition-colors duration-300">
            {tempCoverImage && (
              <Cropper
                image={tempCoverImage}
                crop={crop}
                zoom={zoom}
                aspect={2 / 1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <div className="py-4">
            <div className="flex justify-between text-sm mb-2">
              <Label className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Zoom Level</Label>
              <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-[#2A2A2A] rounded-lg appearance-none cursor-pointer accent-[#E35000] transition-colors duration-300"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCropDialogOpen(false)} className="border-gray-300 dark:border-[#2A2A2A] dark:text-white dark:hover:bg-[#2A2A2A] transition-colors duration-300">Cancel</Button>
            <Button onClick={saveCroppedImage} className="bg-[#E35000] hover:bg-[#c44500] text-white">
              <Check className="w-4 h-4 mr-2" /> Save Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Logo Crop Dialog */}
      <Dialog open={profileCropDialogOpen} onOpenChange={setProfileCropDialogOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2A2A2A] transition-colors duration-300">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white transition-colors duration-300">Crop Profile Logo</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
              Adjust your image to create a square profile logo (1:1 ratio)
            </DialogDescription>
          </DialogHeader>
          <div className="relative w-full h-[400px] bg-gray-900 dark:bg-black rounded-lg overflow-hidden transition-colors duration-300">
            {tempProfileImage && (
              <Cropper
                image={tempProfileImage}
                crop={profileCrop}
                zoom={profileZoom}
                aspect={1}
                cropShape="round"
                onCropChange={setProfileCrop}
                onZoomChange={setProfileZoom}
                onCropComplete={onProfileCropComplete}
              />
            )}
          </div>
          <div className="py-4">
            <div className="flex justify-between text-sm mb-2">
              <Label className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Zoom Level</Label>
              <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">{Math.round(profileZoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={profileZoom}
              onChange={(e) => setProfileZoom(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-[#2A2A2A] rounded-lg appearance-none cursor-pointer accent-[#E35000] transition-colors duration-300"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProfileCropDialogOpen(false)} className="border-gray-300 dark:border-[#2A2A2A] dark:text-white dark:hover:bg-[#2A2A2A] transition-colors duration-300">Cancel</Button>
            <Button onClick={saveCroppedProfileImage} className="bg-[#E35000] hover:bg-[#c44500] text-white">
              <Check className="w-4 h-4 mr-2" /> Save Logo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Food Menu Crop Dialog */}
      <Dialog open={foodMenuCropDialogOpen} onOpenChange={setFoodMenuCropDialogOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2A2A2A] transition-colors duration-300">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white transition-colors duration-300">Crop Food Menu Image</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
              Adjust your image for the food menu display (4:3 ratio)
            </DialogDescription>
          </DialogHeader>
          <div className="relative w-full h-[400px] bg-gray-900 dark:bg-black rounded-lg overflow-hidden transition-colors duration-300">
            {tempFoodMenuImage && (
              <Cropper
                image={tempFoodMenuImage}
                crop={foodMenuCrop}
                zoom={foodMenuZoom}
                aspect={4 / 3}
                onCropChange={setFoodMenuCrop}
                onZoomChange={setFoodMenuZoom}
                onCropComplete={onFoodMenuCropComplete}
              />
            )}
          </div>
          <div className="py-4">
            <div className="flex justify-between text-sm mb-2">
              <Label className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Zoom Level</Label>
              <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">{Math.round(foodMenuZoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={foodMenuZoom}
              onChange={(e) => setFoodMenuZoom(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-[#2A2A2A] rounded-lg appearance-none cursor-pointer accent-[#E35000] transition-colors duration-300"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFoodMenuCropDialogOpen(false)} className="border-gray-300 dark:border-[#2A2A2A] dark:text-white dark:hover:bg-[#2A2A2A] transition-colors duration-300">Cancel</Button>
            <Button onClick={saveCroppedFoodMenuImage} className="bg-[#E35000] hover:bg-[#c44500] text-white">
              <Check className="w-4 h-4 mr-2" /> Save Menu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Add Branch Dialog */}
      <Dialog open={isAddBranchOpen} onOpenChange={setIsAddBranchOpen}>
        <DialogContent className="sm:max-w-[800px] bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2A2A2A] transition-colors duration-300">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white transition-colors duration-300">
              {editingBranchIndex !== null ? 'Edit Branch' : 'Add New Branch'}
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
              {editingBranchIndex !== null ? 'Update branch details and location.' : 'Enter branch details and location.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Left Column: Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-200">Branch Name <span className="text-red-500">*</span></Label>
                <Input 
                  value={newBranch.name}
                  onChange={(e) => setNewBranch({...newBranch, name: e.target.value})}
                  placeholder="e.g. Kandy Branch"
                  className="bg-white dark:bg-[#0A0A0A] border-gray-300 dark:border-[#2A2A2A]"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-200">Address <span className="text-red-500">*</span></Label>
                <Textarea 
                  value={newBranch.address}
                  onChange={(e) => setNewBranch({...newBranch, address: e.target.value})}
                  placeholder="Full address"
                  className="bg-white dark:bg-[#0A0A0A] border-gray-300 dark:border-[#2A2A2A] resize-none h-20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-200">Contact Number</Label>
                <Input 
                  value={newBranch.contact}
                  onChange={(e) => setNewBranch({...newBranch, contact: e.target.value})}
                  placeholder="+94 77 ..."
                  className="bg-white dark:bg-[#0A0A0A] border-gray-300 dark:border-[#2A2A2A]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-200">Proof of Address</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-[#2A2A2A] rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#1C1C1C] hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={handleBranchProofUpload}
                    accept=".pdf,image/*"
                  />
                  <FileUp className="h-6 w-6 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {branchProofFile ? branchProofFile.name : "Upload Utility Bill / Lease Agreement"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Map with Search */}
            <div className="flex flex-col gap-2 h-full min-h-[300px]">
                <div className="relative z-10">
                   <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                   <Input 
                     placeholder="Search for a location..." 
                     className="pl-9 bg-white dark:bg-[#0A0A0A] border-gray-300 dark:border-[#2A2A2A]"
                   />
                </div>
                <div className="flex-1 bg-gray-100 dark:bg-[#1C1C1C] rounded-lg overflow-hidden relative border border-gray-300 dark:border-[#2A2A2A]">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                        <MapPin className="h-8 w-8 mb-2 opacity-50" />
                        <span className="text-sm">Map View</span>
                    </div>
                    {/* Simulated Map Controls */}
                    <div className="absolute bottom-4 right-4 flex flex-col gap-1">
                        <div className="w-8 h-8 bg-white dark:bg-[#2A2A2A] rounded shadow flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold border border-gray-200 dark:border-[#3A3A3A]">+</div>
                        <div className="w-8 h-8 bg-white dark:bg-[#2A2A2A] rounded shadow flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold border border-gray-200 dark:border-[#3A3A3A]">-</div>
                    </div>
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddBranchOpen(false)} className="border-gray-300 dark:border-[#2A2A2A] dark:text-white">Cancel</Button>
            <Button onClick={handleSaveBranch} className="bg-[#E35000] hover:bg-[#c44500] text-white">Add Branch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OTP Verification Dialog */}
      <Dialog open={isOtpOpen} onOpenChange={setIsOtpOpen}>
        <DialogContent className="sm:max-w-md border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#141414]">
          <DialogHeader>
            <DialogTitle className="text-[#0A0A0A] dark:text-white">Verify {otpTarget === 'mobile' ? 'Phone Number' : 'Email Address'}</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Enter the 6-digit code sent to your {otpTarget === 'mobile' ? 'phone' : 'email'} to verify your account details.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={(value) => setOtpValue(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="border-gray-300 dark:border-[#2A2A2A] dark:text-white h-10 w-10 sm:h-12 sm:w-12 text-lg" />
                <InputOTPSlot index={1} className="border-gray-300 dark:border-[#2A2A2A] dark:text-white h-10 w-10 sm:h-12 sm:w-12 text-lg" />
                <InputOTPSlot index={2} className="border-gray-300 dark:border-[#2A2A2A] dark:text-white h-10 w-10 sm:h-12 sm:w-12 text-lg" />
              </InputOTPGroup>
              <div className="w-2" />
              <InputOTPGroup>
                <InputOTPSlot index={3} className="border-gray-300 dark:border-[#2A2A2A] dark:text-white h-10 w-10 sm:h-12 sm:w-12 text-lg" />
                <InputOTPSlot index={4} className="border-gray-300 dark:border-[#2A2A2A] dark:text-white h-10 w-10 sm:h-12 sm:w-12 text-lg" />
                <InputOTPSlot index={5} className="border-gray-300 dark:border-[#2A2A2A] dark:text-white h-10 w-10 sm:h-12 sm:w-12 text-lg" />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOtpOpen(false)}
              className="border-gray-300 dark:border-[#2A2A2A] dark:text-white hover:bg-gray-100 dark:hover:bg-[#2A2A2A]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleOtpSubmit}
              disabled={otpValue.length !== 6}
              className="bg-[#E35000] hover:bg-[#c44500] text-white"
            >
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Change Username/Contact Dialog */}
      <Dialog open={isChangeUsernameOpen} onOpenChange={setIsChangeUsernameOpen}>
        <DialogContent className="sm:max-w-md border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#141414]">
          <DialogHeader>
            <DialogTitle className="text-[#0A0A0A] dark:text-white">Update Username</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              {isUsernameOtpStep 
                ? "Enter the 6-digit verification code sent to your contact." 
                : "Update your mobile number and email. Verification will be required."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {!isUsernameOtpStep ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-mobile" className="text-gray-700 dark:text-gray-200">
                    Mobile Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-mobile"
                      value={newMobile}
                      onChange={(e) => {
                        setNewMobile(e.target.value);
                        setIsNewMobileVerified(false);
                      }}
                      placeholder="Enter mobile number"
                      className="bg-white dark:bg-[#0A0A0A] border-gray-300 dark:border-[#2A2A2A]"
                    />
                     {newMobile !== profile.username && !isNewMobileVerified && (
                      <Button 
                        size="sm" 
                        onClick={() => handleVerifyField('mobile')}
                        className="bg-[#E35000] hover:bg-[#c44500] text-white shrink-0"
                      >
                        Verify
                      </Button>
                    )}
                    {isNewMobileVerified && (
                       <div className="flex items-center justify-center px-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-md">
                         <Check size={16} />
                       </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-email" className="text-gray-700 dark:text-gray-200">Email Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-email"
                      value={newEmail}
                      onChange={(e) => {
                        setNewEmail(e.target.value);
                        setIsNewEmailVerified(false);
                      }}
                      placeholder="Enter email address"
                      className="bg-white dark:bg-[#0A0A0A] border-gray-300 dark:border-[#2A2A2A]"
                    />
                    {newEmail !== profile.email && !isNewEmailVerified && (
                      <Button 
                        size="sm" 
                        onClick={() => handleVerifyField('email')}
                        className="bg-[#E35000] hover:bg-[#c44500] text-white shrink-0"
                      >
                        Verify
                      </Button>
                    )}
                     {isNewEmailVerified && (
                       <div className="flex items-center justify-center px-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-md">
                         <Check size={16} />
                       </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 space-y-4">
                <p className="text-sm text-center text-gray-500">
                  Enter the code sent to your {activeVerificationField === 'mobile' ? 'phone' : 'email'}
                </p>
                <InputOTP
                  maxLength={6}
                  value={usernameOtp}
                  onChange={(value) => setUsernameOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="border-gray-300 dark:border-[#2A2A2A] dark:text-white h-10 w-10 sm:h-12 sm:w-12 text-lg" />
                    <InputOTPSlot index={1} className="border-gray-300 dark:border-[#2A2A2A] dark:text-white h-10 w-10 sm:h-12 sm:w-12 text-lg" />
                    <InputOTPSlot index={2} className="border-gray-300 dark:border-[#2A2A2A] dark:text-white h-10 w-10 sm:h-12 sm:w-12 text-lg" />
                  </InputOTPGroup>
                  <div className="w-2" />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} className="border-gray-300 dark:border-[#2A2A2A] dark:text-white h-10 w-10 sm:h-12 sm:w-12 text-lg" />
                    <InputOTPSlot index={4} className="border-gray-300 dark:border-[#2A2A2A] dark:text-white h-10 w-10 sm:h-12 sm:w-12 text-lg" />
                    <InputOTPSlot index={5} className="border-gray-300 dark:border-[#2A2A2A] dark:text-white h-10 w-10 sm:h-12 sm:w-12 text-lg" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-end gap-2">
            {!isUsernameOtpStep ? (
               <>
                <Button
                  variant="outline"
                  onClick={() => setIsChangeUsernameOpen(false)}
                  className="border-gray-300 dark:border-[#2A2A2A] dark:text-white hover:bg-gray-100 dark:hover:bg-[#2A2A2A]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveContactChanges}
                  className="bg-[#E35000] hover:bg-[#c44500] text-white"
                  disabled={
                    (newMobile !== profile.username && !isNewMobileVerified) ||
                    (newEmail !== profile.email && !isNewEmailVerified)
                  }
                >
                  Save Changes
                </Button>
              </>
            ) : (
               <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsUsernameOtpStep(false);
                    setActiveVerificationField(null);
                  }}
                  className="border-gray-300 dark:border-[#2A2A2A] dark:text-white hover:bg-gray-100 dark:hover:bg-[#2A2A2A]"
                >
                  Back
                </Button>
                <Button
                  onClick={handleChangeUsernameConfirm}
                  disabled={usernameOtp.length !== 6}
                  className="bg-[#E35000] hover:bg-[#c44500] text-white"
                >
                  Verify
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}