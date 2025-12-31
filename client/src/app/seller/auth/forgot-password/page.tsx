"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Sun, 
  Moon, 
  Mail, 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';

type Step = 'email' | 'otp' | 'password' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [darkMode, setDarkMode] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState('Verify Email');

  useEffect(() => {
    // Theme management
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  const validateEmail = () => {
    if (!email) {
      setError('Please enter your email address');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validateOTP = () => {
    if (!otp) {
      setError('Please enter the OTP');
      return false;
    }
    if (otp.length !== 6 || isNaN(Number(otp))) {
      setError('OTP must be 6 digits');
      return false;
    }
    return true;
  };

  const validatePasswords = () => {
    if (!newPassword) {
      setError('Please enter a new password');
      return false;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!confirmPassword) {
      setError('Please confirm your password');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  // Step 1: Verify Email
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const verifyResponse = await fetch('/api/auth/verify-seller-email', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyData.success || !verifyData.exists) {
        const errorMessage = verifyData.message || 'No account found with this email address';
        setError(errorMessage);
        toast.error(errorMessage, { duration: 5000 });
        return;
      }

      // Send OTP to email
      const otpResponse = await fetch('/api/auth/send-password-reset-otp', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const otpData = await otpResponse.json();

      if (!otpData.success) {
        const errorMessage = otpData.message || 'Failed to send OTP';
        setError(errorMessage);
        toast.error(errorMessage, { duration: 5000 });
        return;
      }

      setSuccess(`Email verified! OTP sent to ${email}`);
      toast.success('OTP sent successfully!', {
        description: `Check your email at ${email} for the code`,
        duration: 5000,
      });
      
      setCurrentStep('otp');
      setButtonText('Verify OTP');
      
    } catch {
      const errorMessage = 'Connection error. Please check your internet connection and try again.';
      setError(errorMessage);
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOTP()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/verify-password-reset-otp', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: otp }),
      });

      const data = await response.json();

      if (!data.success) {
        const errorMessage = data.message || 'Invalid OTP. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage, { duration: 5000 });
        return;
      }

      setSuccess('OTP verified successfully!');
      toast.success('OTP Verified!', {
        description: 'Now set your new password',
        duration: 5000,
      });
      
      setCurrentStep('password');
      setButtonText('Change Password');
      
    } catch {
      const errorMessage = 'Connection error. Please check your internet connection and try again.';
      setError(errorMessage);
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          newPassword, 
          confirmPassword 
        }),
      });

      const data = await response.json();

      if (!data.success) {
        const errorMessage = data.message || 'Failed to reset password';
        setError(errorMessage);
        toast.error(errorMessage, { duration: 5000 });
        return;
      }

      setSuccess('Password reset successfully!');
      toast.success('Password Changed!', {
        description: 'Redirecting to login page...',
        duration: 3000,
      });
      
      setCurrentStep('success');

      setTimeout(() => {
        router.push('/seller/auth/login');
      }, 3000);
      
    } catch {
      const errorMessage = 'Connection error. Please check your internet connection and try again.';
      setError(errorMessage);
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (currentStep === 'email') {
      handleVerifyEmail(e);
    } else if (currentStep === 'otp') {
      handleVerifyOTP(e);
    } else if (currentStep === 'password') {
      handleResetPassword(e);
    }
  };

  const handleGoBack = () => {
    if (currentStep === 'otp') {
      setCurrentStep('email');
      setOtp('');
      setError('');
      setSuccess('');
      setButtonText('Verify Email');
    } else if (currentStep === 'password') {
      setCurrentStep('otp');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess('');
      setButtonText('Verify OTP');
    } else {
      router.push('/seller/auth/login');
    }
  };

  const getProgressPercentage = () => {
    if (currentStep === 'email') return 25;
    if (currentStep === 'otp') return 50;
    if (currentStep === 'password') return 75;
    return 100;
  };

  const getProgressLabel = () => {
    if (currentStep === 'email') return 'Step 1 of 3';
    if (currentStep === 'otp') return 'Step 2 of 3';
    if (currentStep === 'password') return 'Step 3 of 3';
    return 'Complete';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      
      {/* Header with Theme Toggle and Back Button */}
      <div className="w-full max-w-md flex justify-between items-center mb-8">
        <button
          onClick={handleGoBack}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">{currentStep === 'email' ? 'Back to Login' : 'Back'}</span>
        </button>
        
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-card border border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 cursor-pointer"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-foreground" />
          ) : (
            <Moon className="w-5 h-5 text-foreground" />
          )}
        </button>
      </div>

      {/* Password Reset Card */}
      <div className="w-full max-w-md bg-card rounded-3xl shadow-xl border border-border p-8 backdrop-blur-sm">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-card-foreground">{getProgressLabel()}</span>
            <span className="text-sm text-muted-foreground">{getProgressPercentage()}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            {currentStep === 'email' && <Mail className="w-8 h-8 text-primary" />}
            {currentStep === 'otp' && <Shield className="w-8 h-8 text-primary" />}
            {currentStep === 'password' && <Lock className="w-8 h-8 text-primary" />}
            {currentStep === 'success' && <CheckCircle className="w-8 h-8 text-primary" />}
          </div>
          <h1 className="text-3xl font-bold text-card-foreground mb-2">
            {currentStep === 'email' && 'Forgot Password'}
            {currentStep === 'otp' && 'Enter OTP'}
            {currentStep === 'password' && 'New Password'}
            {currentStep === 'success' && 'Password Reset!'}
          </h1>
          <p className="text-muted-foreground">
            {currentStep === 'email' && 'Enter your email to verify your account'}
            {currentStep === 'otp' && `OTP sent to ${email}`}
            {currentStep === 'password' && 'Create a strong new password'}
            {currentStep === 'success' && 'Your password has been reset successfully'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Step */}
          {currentStep === 'email' && (
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-card-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                    if (success) setSuccess('');
                  }}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-black border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 ${
                    error ? 'border-destructive focus:ring-destructive focus:border-destructive' : 'border-border'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
            </div>
          )}

          {/* OTP Step */}
          {currentStep === 'otp' && (
            <div className="space-y-2">
              <label htmlFor="otp" className="block text-sm font-medium text-card-foreground">
                Enter OTP Code
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                    if (error) setError('');
                    if (success) setSuccess('');
                  }}
                  disabled={isLoading}
                  maxLength={6}
                  className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-black border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 text-center text-2xl tracking-widest ${
                    error ? 'border-destructive focus:ring-destructive focus:border-destructive' : 'border-border'
                  }`}
                  placeholder="000000"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Check your email for the 6-digit code
              </p>
            </div>
          )}

          {/* Password Step */}
          {currentStep === 'password' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-card-foreground">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (error) setError('');
                      if (success) setSuccess('');
                    }}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-12 py-3 bg-white dark:bg-black border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 ${
                      error ? 'border-destructive focus:ring-destructive focus:border-destructive' : 'border-border'
                    }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-card-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError('');
                      if (success) setSuccess('');
                    }}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-12 py-3 bg-white dark:bg-black border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 ${
                      error ? 'border-destructive focus:ring-destructive focus:border-destructive' : 'border-border'
                    }`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && currentStep !== 'success' && (
            <div className="bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 text-primary dark:text-primary px-4 py-3 rounded-xl text-sm flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Success State */}
          {currentStep === 'success' && (
            <div className="bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 text-primary dark:text-primary px-4 py-3 rounded-xl text-sm flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Password changed successfully! Redirecting to login...</span>
            </div>
          )}

          {/* Submit Button */}
          {currentStep !== 'success' && (
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-xl font-semibold text-lg focus:outline-none transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {currentStep === 'email' && <Mail className="w-5 h-5" />}
                  {currentStep === 'otp' && <Shield className="w-5 h-5" />}
                  {currentStep === 'password' && <Lock className="w-5 h-5" />}
                  <span>{buttonText}</span>
                </>
              )}
            </button>
          )}
        </form>

        {/* Footer */}
        {currentStep === 'email' && (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm">
              Remember your password?{' '}
              <button
                onClick={() => router.push('/seller/auth/login')}
                disabled={isLoading}
                className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 disabled:opacity-50 cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Info Section */}
      {currentStep === 'email' && (
        <div className="w-full max-w-md mt-6 bg-card/50 rounded-2xl border border-border p-6 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-card-foreground mb-2">
            Password Reset Process
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-0.5">1</span>
              <span>Verify your email address</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-0.5">2</span>
              <span>Enter the OTP code from your email</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-0.5">3</span>
              <span>Create a new password</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
