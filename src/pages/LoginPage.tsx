import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';

const LoginPage: React.FC = () => {
  const { theme } = useTheme();
  const { signIn, signInWithGoogle, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, location]);

  // Clear error when user starts typing
  useEffect(() => {
    if (error && (email || password)) {
      setError(null);
    }
  }, [email, password, error]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any existing error
    setError(null);
    
    // Validate inputs
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn(email.trim().toLowerCase(), password);
      
      if (error) {
        // Handle specific Supabase auth errors
        let errorMessage = error.message;
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please wait a moment and try again.';
        } else if (error.message.includes('signup disabled')) {
          errorMessage = 'Account creation is currently disabled. Please contact support.';
        }
        
        setError(errorMessage);
        setLoading(false);
      } else {
        // Success! Clear form and navigate
        setEmail('');
        setPassword('');
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please check your internet connection and try again.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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

  return (
    <div className={cn(
      "min-h-screen flex relative overflow-hidden transition-colors duration-300",
      theme === "dark" ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"
    )}>
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className={cn(
          "absolute top-[-20rem] right-[-20rem] z-0 blur-[6rem]",
          theme === "dark" ? "opacity-20" : "opacity-10"
        )}
        style={{
          backgroundImage: "radial-gradient(circle at center, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.2) 40%, transparent 70%)",
          width: "60rem",
          height: "60rem",
        }} />
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 flex-col justify-center items-center p-12 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-md"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold">FitCheck AI</h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-4">Welcome back!</h2>
          <p className="text-xl text-white/80 mb-8">
            Continue optimizing your resumes and landing your dream job with AI-powered insights.
          </p>
          
          <div className="space-y-4 text-white/70">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </div>
              <span>AI-powered resume analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </div>
              <span>Instant job match scoring</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </div>
              <span>Tailored resume generation</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
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
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              theme === "dark" ? "bg-blue-600" : "bg-blue-500"
            )}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">FitCheck AI</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Sign in to your account</h2>
            <p className={cn(
              "text-sm",
              theme === "dark" ? "text-zinc-400" : "text-zinc-600"
            )}>
              Welcome back! Please enter your details.
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

          <form onSubmit={handleEmailLogin} className="space-y-4">
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
                  placeholder="Enter your password"
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
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
                <span className={cn("ml-2", theme === "dark" ? "text-zinc-300" : "text-zinc-700")}>
                  Remember me
                </span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </Link>
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
                  Sign in
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
              onClick={handleGoogleLogin}
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
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage; 