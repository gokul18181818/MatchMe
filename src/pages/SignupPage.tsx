import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';

const SignupPage: React.FC = () => {
  const { theme } = useTheme();
  const { signUp, signInWithGoogle, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/choose-action', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return null;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      // Note: User will need to verify email before they can sign in
    }
    
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError(null);
    
    const { error } = await signInWithGoogle();
    
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // Don't set loading to false here as Google auth will redirect
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (success) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center p-8",
        theme === "dark" ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"
      )}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Check your email!</h2>
          <p className={cn(
            "mb-6",
            theme === "dark" ? "text-zinc-400" : "text-zinc-600"
          )}>
            We've sent a verification link to <strong>{email}</strong>. 
            Please check your email and click the link to verify your account.
          </p>
          <div className="space-y-3">
            <Link to="/welcome">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Continue to Welcome
              </Button>
            </Link>
            <Link to="/login">
              <Button className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-0">
                Back to Login
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen flex relative overflow-hidden transition-colors duration-300",
      theme === "dark" ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"
    )}>
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className={cn(
          "absolute top-[-20rem] left-[-20rem] z-0 blur-[6rem]",
          theme === "dark" ? "opacity-20" : "opacity-10"
        )}
        style={{
          backgroundImage: "radial-gradient(circle at center, rgba(34, 197, 94, 0.4) 0%, rgba(59, 130, 246, 0.2) 40%, transparent 70%)",
          width: "60rem",
          height: "60rem",
        }} />
      </div>

      {/* Left Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative z-10">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              theme === "dark" ? "bg-blue-600" : "bg-blue-500"
            )}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">FitCheck AI</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Create your account</h2>
            <p className={cn(
              "text-sm",
              theme === "dark" ? "text-zinc-400" : "text-zinc-600"
            )}>
              Start optimizing your resumes with AI today.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className={cn(
                "block text-sm font-medium mb-2",
                theme === "dark" ? "text-zinc-300" : "text-zinc-700"
              )}>
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200",
                    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    theme === "dark" 
                      ? "bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500" 
                      : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-500"
                  )}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className={cn(
                "block text-sm font-medium mb-2",
                theme === "dark" ? "text-zinc-300" : "text-zinc-700"
              )}>
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200",
                    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    theme === "dark" 
                      ? "bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500" 
                      : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-500"
                  )}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className={cn(
                "block text-sm font-medium mb-2",
                theme === "dark" ? "text-zinc-300" : "text-zinc-700"
              )}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-200",
                    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    theme === "dark" 
                      ? "bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500" 
                      : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-500"
                  )}
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Must be 8+ characters with uppercase, lowercase, and number
              </p>
            </div>

            <div>
              <label className={cn(
                "block text-sm font-medium mb-2",
                theme === "dark" ? "text-zinc-300" : "text-zinc-700"
              )}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-200",
                    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    theme === "dark" 
                      ? "bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500" 
                      : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-500"
                  )}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <input 
                type="checkbox" 
                required
                className="mt-1 rounded border-zinc-300 text-blue-600 focus:ring-blue-500" 
              />
              <span className={cn(theme === "dark" ? "text-zinc-300" : "text-zinc-700")}>
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                  Privacy Policy
                </Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={cn(
                  "w-full border-t",
                  theme === "dark" ? "border-zinc-700" : "border-zinc-300"
                )} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={cn(
                  "px-4",
                  theme === "dark" ? "bg-zinc-950 text-zinc-400" : "bg-white text-zinc-600"
                )}>
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              onClick={handleGoogleSignup}
              disabled={loading}
              className={cn(
                "w-full mt-4 py-3 rounded-lg border font-semibold transition-all duration-200",
                theme === "dark" 
                  ? "bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800" 
                  : "bg-white border-zinc-300 text-zinc-900 hover:bg-zinc-50"
              )}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
          </div>

          <p className={cn(
            "text-center text-sm mt-8",
            theme === "dark" ? "text-zinc-400" : "text-zinc-600"
          )}>
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 flex-col justify-center items-center p-12 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-md"
        >
          <h2 className="text-4xl font-bold mb-4">Join thousands of professionals</h2>
          <p className="text-xl text-white/80 mb-8">
            Transform your career with AI-powered resume optimization that gets results.
          </p>
          
          <div className="space-y-6 text-white/80">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                ✓
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white mb-1">Instant Analysis</h3>
                <p className="text-sm">Get detailed feedback on your resume in seconds</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                ✓
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white mb-1">Smart Optimization</h3>
                <p className="text-sm">AI tailors your resume for specific job descriptions</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                ✓
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white mb-1">Track Success</h3>
                <p className="text-sm">Monitor applications and interview success rates</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage; 