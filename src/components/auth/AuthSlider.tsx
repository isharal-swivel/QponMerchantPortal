import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1715635846028-f162249377c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXRhaWwlMjBzaG9wJTIwb3duZXIlMjBoYXBweSUyMHRhYmxldHxlbnwxfHx8fDE3NjQ1OTIxNzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Grow Your Business",
    description: "Connect with thousands of customers looking for great deals in your area."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1764175760467-7dfb1a8ffb36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGFuYWx5dGljcyUyMGdyb3d0aCUyMGNoYXJ0JTIwZGlnaXRhbHxlbnwxfHx8fDE3NjQ1OTIxODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Real-time Analytics",
    description: "Track views, redemptions, and revenue instantly from your merchant dashboard."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1750056393356-d1de9d222a29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBwYXltZW50JTIwc3VjY2VzcyUyMG1lcmNoYW50fGVufDF8fHx8MTc2NDU5MjE3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Seamless Redemptions",
    description: "Quickly scan and verify vouchers using our built-in QR code scanner."
  }
];

export function AuthSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0E2250]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E2250] via-transparent to-transparent z-10" />
          <img 
            src={SLIDES[currentSlide].image} 
            alt={SLIDES[currentSlide].title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Content Content */}
      <div className="absolute bottom-0 left-0 right-0 p-12 z-20">
        <div className="max-w-lg">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">{SLIDES[currentSlide].title}</h2>
                    <p className="text-lg text-blue-100 leading-relaxed opacity-90">
                        {SLIDES[currentSlide].description}
                    </p>
                </motion.div>
            </AnimatePresence>
            
            {/* Indicators */}
            <div className="flex gap-2 mt-8">
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === currentSlide ? 'w-8 bg-[#E35000]' : 'w-2 bg-white/30 hover:bg-white/50'
                        }`}
                    />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
