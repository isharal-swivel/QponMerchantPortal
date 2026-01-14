import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowRight, Loader2, Smartphone, Lock, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AuthLayout } from './AuthLayout';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { toast } from 'sonner@2.0.3';

interface SignUpProps {
  onSignUp: () => void;
  onNavigateToSignIn: () => void;
}

export function SignUp({ onSignUp, onNavigateToSignIn }: SignUpProps) {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otpValue.length === 6 && !isLoading) {
      handleOtpSubmit();
    }
  }, [otpValue]);

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setResendTimer(60); // 60 seconds countdown
      toast.success("OTP code sent to your mobile");
    }, 1500);
  };

  const handleOtpSubmit = async () => {
    if (otpValue.length < 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    // Simulate verification
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Account created successfully!");
      onSignUp();
    }, 1500);
  };

  const handleResendOTP = () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResendTimer(60);
      setOtpValue("");
      toast.success("New OTP code sent");
    }, 1000);
  };

  if (step === 'otp') {
    return (
      <AuthLayout 
        title="Verify Mobile" 
        subtitle={`Enter the 6-digit code sent to ${formData.phone}`}
      >
        <div className="space-y-6">
          {/* Security Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-full transition-colors duration-300">
              <ShieldCheck size={16} className="text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300 transition-colors duration-300">Secure Verification</span>
            </div>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center py-2">
            <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
              <InputOTPGroup className="gap-2">
                <InputOTPSlot 
                  index={0} 
                  className="w-11 h-13 border-2 border-gray-300 dark:border-[#2A2A2A] dark:bg-[#1C1C1C] rounded-lg text-xl font-bold text-[#0E2250] dark:text-white focus:border-[#E35000] transition-colors duration-300" 
                />
                <InputOTPSlot 
                  index={1} 
                  className="w-11 h-13 border-2 border-gray-300 dark:border-[#2A2A2A] dark:bg-[#1C1C1C] rounded-lg text-xl font-bold text-[#0E2250] dark:text-white focus:border-[#E35000] transition-colors duration-300" 
                />
                <InputOTPSlot 
                  index={2} 
                  className="w-11 h-13 border-2 border-gray-300 dark:border-[#2A2A2A] dark:bg-[#1C1C1C] rounded-lg text-xl font-bold text-[#0E2250] dark:text-white focus:border-[#E35000] transition-colors duration-300" 
                />
                <InputOTPSlot 
                  index={3} 
                  className="w-11 h-13 border-2 border-gray-300 dark:border-[#2A2A2A] dark:bg-[#1C1C1C] rounded-lg text-xl font-bold text-[#0E2250] dark:text-white focus:border-[#E35000] transition-colors duration-300" 
                />
                <InputOTPSlot 
                  index={4} 
                  className="w-11 h-13 border-2 border-gray-300 dark:border-[#2A2A2A] dark:bg-[#1C1C1C] rounded-lg text-xl font-bold text-[#0E2250] dark:text-white focus:border-[#E35000] transition-colors duration-300" 
                />
                <InputOTPSlot 
                  index={5} 
                  className="w-11 h-13 border-2 border-gray-300 dark:border-[#2A2A2A] dark:bg-[#1C1C1C] rounded-lg text-xl font-bold text-[#0E2250] dark:text-white focus:border-[#E35000] transition-colors duration-300" 
                />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Timer/Status */}
          {resendTimer > 0 && (
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                Resend code in <span className="font-semibold text-[#0E2250] dark:text-white transition-colors duration-300">{resendTimer}s</span>
              </p>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Button 
              onClick={handleOtpSubmit}
              className="w-full h-12 bg-[#E35000] hover:bg-[#c44500] text-white font-medium text-base transition-colors duration-300"
              disabled={isLoading || otpValue.length < 6}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Create Account"}
            </Button>

            <div className="flex justify-between items-center pt-1">
              <button 
                type="button"
                onClick={() => {
                  setStep('details');
                  setOtpValue("");
                  setResendTimer(0);
                }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center transition-colors duration-300"
              >
                <ArrowLeft size={14} className="mr-1" /> Change number
              </button>
              <button 
                type="button"
                onClick={handleResendOTP}
                disabled={resendTimer > 0}
                className={`text-sm font-medium transition-colors duration-300 ${
                  resendTimer > 0 
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                    : 'text-[#E35000] hover:text-[#c44500]'
                }`}
              >
                Resend Code
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-3 mt-4 transition-colors duration-300">
            <p className="text-xs text-blue-800 dark:text-blue-300 text-center transition-colors duration-300">
              Didn't receive the code? Check your SMS or try resending after the timer expires.
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join the QPON merchant network today"
    >
      <div className="space-y-6">
        <form onSubmit={handleDetailsSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="phone" className="dark:text-gray-200 transition-colors duration-300">Mobile Number</Label>
            <div className="relative">
              <div className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 transition-colors duration-300">
                 <Smartphone size={18} />
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="077 123 4567"
                className="pl-10 h-11 bg-gray-50 dark:bg-[#1C1C1C] border-gray-200 dark:border-[#2A2A2A] focus:bg-white dark:focus:bg-[#141414] dark:text-white dark:placeholder-gray-500 transition-colors duration-300"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="dark:text-gray-200 transition-colors duration-300">Password</Label>
            <div className="relative">
              <div className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 transition-colors duration-300">
                 <Lock size={18} />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="pl-10 pr-10 h-11 bg-gray-50 dark:bg-[#1C1C1C] border-gray-200 dark:border-[#2A2A2A] focus:bg-white dark:focus:bg-[#141414] dark:text-white dark:placeholder-gray-500 transition-colors duration-300"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="dark:text-gray-200 transition-colors duration-300">Confirm Password</Label>
            <div className="relative">
              <div className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 transition-colors duration-300">
                 <ShieldCheck size={18} />
              </div>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="pl-10 h-11 bg-gray-50 dark:bg-[#1C1C1C] border-gray-200 dark:border-[#2A2A2A] focus:bg-white dark:focus:bg-[#141414] dark:text-white dark:placeholder-gray-500 transition-colors duration-300"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-[#0E2250] hover:bg-[#0E2250]/90 dark:bg-[#E35000] dark:hover:bg-[#c44500] text-white font-medium text-base mt-2 transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Continue <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
            Already have an account?{' '}
            <button 
              type="button"
              onClick={onNavigateToSignIn}
              className="font-semibold text-[#E35000] hover:text-[#c44500] transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}