import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Store, FileText, Tag, QrCode, PlayCircle } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWatchVideo: () => void;
}

export function WelcomeModal({ isOpen, onClose, onWatchVideo }: WelcomeModalProps) {
  const steps = [
    {
      icon: Store,
      title: "Complete Your Profile",
      description: "Add your business details, logo, and cover images to attract customers."
    },
    {
      icon: FileText,
      title: "Upload Your Menu",
      description: "Share your offerings with potential customers in PDF or image format."
    },
    {
      icon: Tag,
      title: "Create Deals",
      description: "Set up exclusive offers to drive more foot traffic to your store."
    },
    {
      icon: QrCode,
      title: "Start Scanning",
      description: "Use the built-in scanner to redeem coupons effortlessly."
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2A2A2A] p-0 overflow-hidden gap-0">
        
        {/* Header with decorative background */}
        <div className="bg-gradient-to-r from-[#0E2250] to-[#1e3a8a] p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E35000] rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-2xl font-bold text-white">Welcome to QPON Dashboard</DialogTitle>
            <DialogDescription className="text-blue-100 mt-1">
              You're all set! Here's a quick guide to help you get started with your merchant account.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid gap-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 dark:bg-[#E35000]/10 flex items-center justify-center text-[#0E2250] dark:text-[#E35000]">
                  <step.icon size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{step.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-[#0A0A0A] border-t border-gray-100 dark:border-[#2A2A2A] flex flex-col sm:flex-row gap-3 justify-end">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            Skip for now
          </Button>
          <Button 
            onClick={onWatchVideo}
            className="bg-[#E35000] hover:bg-[#c44500] text-white gap-2"
          >
            <PlayCircle size={18} />
            Watch Tutorial Video
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
