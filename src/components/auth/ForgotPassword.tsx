import React, { useState, useEffect } from 'react';
import { ArrowLeft, Smartphone, Loader2, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AuthLayout } from './AuthLayout';
import { toast } from 'sonner@2.0.3';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../ui/input-otp";

interface ForgotPasswordProps {
  onNavigateToSignIn: () => void;
}

type Step = 'phone' | 'otp' | 'newPassword' | 'success';

export function ForgotPassword({ onNavigateToSignIn }: ForgotPasswordProps) {
  const [step, setStep] = useState<Step>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      toast.error("Please enter your mobile number");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("OTP sent to your mobile number");
      setStep('otp');
      setCountdown(60); // 60 seconds countdown
    }, 1500);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In real app, verify OTP here
      if (otp === '123456') {
        toast.success("OTP verified successfully");
        setStep('newPassword');
      } else {
        // For demo, accept any 6-digit code
        toast.success("OTP verified successfully");
        setStep('newPassword');
      }
    }, 1500);
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("OTP resent successfully");
      setCountdown(60);
    }, 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Password reset successfully!");
      setStep('success');
    }, 1500);
  };

  const renderStep = () => {
    switch (step) {
      case 'phone':
        return (
          <>
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="dark:text-gray-200 transition-colors duration-300">
                  Mobile Number
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 transition-colors duration-300">
                    <Smartphone size={18} />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="077 123 4567"
                    className="pl-10 h-11 bg-gray-50 dark:bg-[#1C1C1C] border-gray-200 dark:border-[#2A2A2A] focus:bg-white dark:focus:bg-[#141414] dark:text-white dark:placeholder-gray-500 transition-colors duration-300"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  We'll send a verification code to this number
                </p>
              </div>

              <Button 
                type="submit"
                className="w-full h-12 bg-[#0E2250] hover:bg-[#0E2250]/90 dark:bg-[#E35000] dark:hover:bg-[#c44500] text-white font-medium text-base transition-colors duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send OTP <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </Button>
            </form>
          </>
        );

      case 'otp':
        return (
          <>
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We've sent a 6-digit code to
                  </p>
                  <p className="text-base font-semibold text-[#0E2250] dark:text-white">
                    {phoneNumber}
                  </p>
                </div>

                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot 
                        index={0} 
                        className="w-12 h-12 text-lg border-gray-200 dark:border-[#2A2A2A] dark:bg-[#1C1C1C] dark:text-white" 
                      />
                      <InputOTPSlot 
                        index={1} 
                        className="w-12 h-12 text-lg border-gray-200 dark:border-[#2A2A2A] dark:bg-[#1C1C1C] dark:text-white" 
                      />
                      <InputOTPSlot 
                        index={2} 
                        className="w-12 h-12 text-lg border-gray-200 dark:border-[#2A2A2A] dark:bg-[#1C1C1C] dark:text-white" 
                      />
                      <InputOTPSlot 
                        index={3} 
                        className="w-12 h-12 text-lg border-gray-200 dark:border-[#2A2A2A] dark:bg-[#1C1C1C] dark:text-white" 
                      />
                      <InputOTPSlot 
                        index={4} 
                        className="w-12 h-12 text-lg border-gray-200 dark:border-[#2A2A2A] dark:bg-[#1C1C1C] dark:text-white" 
                      />
                      <InputOTPSlot 
                        index={5} 
                        className="w-12 h-12 text-lg border-gray-200 dark:border-[#2A2A2A] dark:bg-[#1C1C1C] dark:text-white" 
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Resend code in <span className="font-semibold text-[#E35000]">{countdown}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="text-sm font-medium text-[#E35000] hover:text-[#c44500] transition-colors"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full h-12 bg-[#0E2250] hover:bg-[#0E2250]/90 dark:bg-[#E35000] dark:hover:bg-[#c44500] text-white font-medium text-base transition-colors duration-300"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Verify OTP <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </Button>
            </form>
          </>
        );

      case 'newPassword':
        return (
          <>
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="dark:text-gray-200 transition-colors duration-300">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  className="h-11 bg-gray-50 dark:bg-[#1C1C1C] border-gray-200 dark:border-[#2A2A2A] focus:bg-white dark:focus:bg-[#141414] dark:text-white dark:placeholder-gray-500 transition-colors duration-300"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="dark:text-gray-200 transition-colors duration-300">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="h-11 bg-gray-50 dark:bg-[#1C1C1C] border-gray-200 dark:border-[#2A2A2A] focus:bg-white dark:focus:bg-[#141414] dark:text-white dark:placeholder-gray-500 transition-colors duration-300"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit"
                className="w-full h-12 bg-[#0E2250] hover:bg-[#0E2250]/90 dark:bg-[#E35000] dark:hover:bg-[#c44500] text-white font-medium text-base transition-colors duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Reset Password <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </Button>
            </form>
          </>
        );

      case 'success':
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-500" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-[#0E2250] dark:text-white">
                Password Reset Successful!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
            </div>

            <Button 
              onClick={onNavigateToSignIn}
              className="w-full h-12 bg-[#0E2250] hover:bg-[#0E2250]/90 dark:bg-[#E35000] dark:hover:bg-[#c44500] text-white font-medium text-base transition-colors duration-300"
            >
              Back to Sign In <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (step) {
      case 'phone':
        return 'Forgot Password?';
      case 'otp':
        return 'Verify OTP';
      case 'newPassword':
        return 'Reset Password';
      case 'success':
        return 'All Set!';
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case 'phone':
        return 'Enter your mobile number to receive a verification code';
      case 'otp':
        return 'Enter the verification code we sent to your mobile';
      case 'newPassword':
        return 'Create a new password for your account';
      case 'success':
        return 'You can now access your merchant dashboard';
    }
  };

  return (
    <AuthLayout 
      title={getTitle()} 
      subtitle={getSubtitle()}
      backButton={
        step !== 'success' ? (
          <button
            onClick={step === 'otp' ? () => setStep('phone') : onNavigateToSignIn}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#E35000] dark:text-gray-400 dark:hover:text-[#E35000] transition-colors duration-300"
          >
            <ArrowLeft size={16} className="mr-1" />
            {step === 'otp' ? 'Change number' : 'Back to Sign In'}
          </button>
        ) : undefined
      }
    >
      <div className="space-y-6">
        {renderStep()}

        {step === 'phone' && (
          <div className="text-center pt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              Remember your password?{' '}
              <button 
                type="button"
                onClick={onNavigateToSignIn}
                className="font-semibold text-[#E35000] hover:text-[#c44500] transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}