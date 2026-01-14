import React, { useState } from 'react';
import { ScanLine, Keyboard, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

import { toast } from 'sonner@2.0.3';

export function Scanner() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');

  const handleSimulateScan = () => {
    setStatus('scanning');
    setTimeout(() => {
      setStatus('success');
      toast.success("Coupon Redeemed Successfully", {
        description: "Seafood Platter for Two - #883-291"
      });
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto pb-20 lg:pb-0 min-h-[80vh] flex flex-col justify-center">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#0E2250] dark:text-white transition-colors duration-300">Redeem Coupon</h2>
        <p className="text-gray-500 dark:text-blue-200/70 transition-colors duration-300">Scan customer's QR code or enter ID manually.</p>
      </div>

      <Tabs defaultValue="scan" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="scan">Scan QR</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-4">
          <Card className="overflow-hidden border-none shadow-lg relative aspect-[3/4] bg-black">
             {status === 'success' ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-500 text-white p-6 text-center">
                 <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-emerald-500 mb-4">
                   <CheckCircle2 size={48} />
                 </div>
                 <h3 className="text-2xl font-bold">Redeemed!</h3>
                 <p className="mt-2">Coupon #883-291 verified.</p>
                 <p className="text-sm opacity-80 mt-1">"Seafood Platter for Two"</p>
                 <Button 
                   className="mt-8 bg-white text-emerald-600 hover:bg-emerald-50 w-full"
                   onClick={() => setStatus('idle')}
                 >
                   Scan Next
                 </Button>
               </div>
             ) : (
               <>
                {/* Camera Simulation */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center z-20">
                   <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#E35000] -mt-1 -ml-1 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#E35000] -mt-1 -mr-1 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#E35000] -mb-1 -ml-1 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#E35000] -mb-1 -mr-1 rounded-br-lg"></div>
                      
                      {/* Scanning Line Animation */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-[#E35000]/50 shadow-[0_0_20px_#E35000] animate-[scan_2s_ease-in-out_infinite]"></div>
                   </div>
                </div>
                
                <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center">
                  <Button 
                    className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30"
                    onClick={handleSimulateScan}
                  >
                    <ScanLine className="mr-2 w-4 h-4" /> Simulate Camera
                  </Button>
                </div>
                
                <img 
                  src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                  alt="Camera View"
                />
               </>
             )}
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <Card className="border-none shadow-lg">
            <CardContent className="p-8 space-y-6">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700 dark:text-white transition-colors duration-300">Enter Coupon Code</label>
                 <div className="flex gap-2">
                   <Input 
                    placeholder="e.g. QPN-8829-X" 
                    className="text-lg uppercase tracking-widest font-mono dark:bg-[#1A2F5A] dark:text-white dark:border-[#1A2F5A] dark:placeholder:text-blue-300/50 transition-colors duration-300"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                   />
                 </div>
               </div>
               <div className="bg-blue-50 dark:bg-[#1A2F5A]/50 text-blue-700 dark:text-blue-200 p-4 rounded-lg text-sm flex items-start gap-3 border border-transparent dark:border-[#1A2F5A] transition-colors duration-300">
                 <Info className="w-5 h-5 shrink-0 mt-0.5" />
                 <p>Please verify the customer's ID if the coupon value exceeds LKR 10,000.</p>
               </div>
               <Button className="w-full bg-[#0E2250] hover:bg-[#081636] dark:bg-[#E35000] dark:hover:bg-[#C44400] text-white h-12 text-lg transition-colors duration-300">
                 Verify & Redeem
               </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function Info({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
    )
}