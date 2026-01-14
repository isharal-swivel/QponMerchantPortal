import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, PlayCircle, Store, MapPin, Tag, Play } from 'lucide-react';
import { Button } from './ui/button';

interface OnboardingGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onWatchVideo: () => void;
}

export function OnboardingGuide({ isOpen, onClose, onWatchVideo }: OnboardingGuideProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-[#141414] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Welcome Header */}
          <div className="bg-[#0E2250] p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E35000] rounded-full blur-3xl opacity-30 -mr-10 -mt-10"></div>
            <div className="relative z-10">
            
              <h2 className="text-2xl font-bold mb-2">Welcome to QPON Dashboard</h2>
              <p className="text-blue-200 text-sm mx-auto">Complete your profile and start growing your business.</p>
            </div>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Checklist content */}
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <GuideStep 
                icon={Store} 
                title="Complete Profile" 
                description="Add business details & logo" 
                color="text-emerald-500"
                bgColor="bg-emerald-50 dark:bg-emerald-500/10"
              />
              <GuideStep 
                icon={MapPin} 
                title="Create Location / Branches" 
                description="Add your branches" 
                color="text-blue-500"
                bgColor="bg-blue-50 dark:bg-blue-500/10"
              />
              <GuideStep 
                icon={Tag} 
                title="Create Deals" 
                description="Launch your first offer" 
                color="text-[#E35000]"
                bgColor="bg-orange-50 dark:bg-[#E35000]/10"
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-200 dark:border-[#2A2A2A] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2A2A2A]"
              >
                Skip
              </Button>
              <Button 
                onClick={() => {
                  onClose();
                  onWatchVideo();
                }}
                className="flex-[2] bg-[#E35000] hover:bg-[#c44500] text-white shadow-lg shadow-orange-200 dark:shadow-none group"
              >
                <Play size={16} className="mr-2 fill-current" /> Watch Tutorial
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function GuideStep({ icon: Icon, title, description, color, bgColor }: any) {
  return (
    <div className="flex gap-4 items-center">
      <div className={`shrink-0 p-2 rounded-full ${bgColor} ${color}`}>
        <Icon size={18} />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}
