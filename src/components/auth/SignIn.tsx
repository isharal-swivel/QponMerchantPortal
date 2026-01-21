import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Loader2, Smartphone, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AuthLayout } from './AuthLayout';
import { toast } from 'sonner@2.0.3';

interface SignInProps {
  onSignIn: () => void;
  onNavigateToSignUp: () => void;
  onNavigateToForgotPassword?: () => void;
}

export function SignIn({ onSignIn, onNavigateToSignUp, onNavigateToForgotPassword }: SignInProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (formData.identifier && formData.password) {
        toast.success("Welcome back!");
        onSignIn();
      } else {
        toast.error("Please enter your credentials");
      }
    }, 1500);
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to manage your deals and view analytics"
    >
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="identifier" className="dark:text-gray-200 transition-colors duration-300">Mobile Number</Label>
            <div className="relative">
              <div className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 transition-colors duration-300">
                 {formData.identifier.includes('@') ? <Mail size={18} /> : <Smartphone size={18} />}
              </div>
              <Input
                id="identifier"
                type="tel"
                placeholder="077 123 4567"
                className="pl-10 h-11 bg-gray-50 dark:bg-[#1C1C1C] border-gray-200 dark:border-[#2A2A2A] focus:bg-white dark:focus:bg-[#141414] dark:text-white dark:placeholder-gray-500 transition-colors duration-300"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="dark:text-gray-200 transition-colors duration-300">Password</Label>
              <button 
                type="button" 
                onClick={onNavigateToForgotPassword}
                className="text-xs font-medium text-[#E35000] hover:text-[#c44500] transition-colors duration-300"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-10 h-11 bg-gray-50 dark:bg-[#1C1C1C] border-gray-200 dark:border-[#2A2A2A] focus:bg-white dark:focus:bg-[#141414] dark:text-white dark:placeholder-gray-500 transition-colors duration-300"
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

          <Button 
            type="button" 
            className="w-full h-12 bg-[#0E2250] hover:bg-[#0E2250]/90 dark:bg-[#E35000] dark:hover:bg-[#c44500] text-white font-medium text-base transition-colors duration-300"
            disabled={isLoading}
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                toast.success("Welcome back!");
                onSignIn();
              }, 1500);
            }}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
            New to QPON Merchant?{' '}
            <button 
              type="button"
              onClick={onNavigateToSignUp}
              className="font-semibold text-[#E35000] hover:text-[#c44500] transition-colors"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}