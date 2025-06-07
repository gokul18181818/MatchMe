import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Check, 
  X, 
  Zap, 
  Star, 
  TrendingUp, 
  FileText, 
  Bot, 
  Shield, 
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  originalPrice?: number;
  features: string[];
  limitations: string[];
  popular?: boolean;
  cta: string;
  color: string;
  icon: React.ReactNode;
}

const getPricingPlans = (billingCycle: 'monthly' | 'yearly'): PricingPlan[] => [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    period: 'forever',
    features: [
      '3 resume analyses per month',
      'Basic ATS optimization',
      'Standard templates',
      'Email support'
    ],
    limitations: [
      'Limited job descriptions',
      'No priority support',
      'Basic analytics only'
    ],
    cta: 'Get Started Free',
    color: 'from-gray-500 to-gray-600',
    icon: <FileText className="w-6 h-6" />
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Best for job seekers',
    price: billingCycle === 'yearly' ? 156 : 19, // $156/year ($13/month) vs $19/month
    period: billingCycle === 'yearly' ? 'year' : 'month',
    originalPrice: billingCycle === 'yearly' ? 228 : 29, // $228/year vs $29/month
    features: [
      'Unlimited resume analyses',
      'Advanced ATS optimization',
      'Premium templates library',
      'LinkedIn integration',
      'Real-time collaboration',
      'Priority email support',
      'Detailed analytics dashboard',
      'Custom branding options',
      ...(billingCycle === 'yearly' ? ['2 months free!'] : [])
    ],
    limitations: [],
    popular: true,
    cta: billingCycle === 'yearly' ? 'Get Annual Plan' : 'Start Pro Trial',
    color: 'from-blue-500 to-purple-600',
    icon: <Crown className="w-6 h-6" />
  }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
    content: 'FitCheck AI helped me land my dream job at Google! The ATS optimization was game-changing.',
    rating: 5
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Manager at Microsoft',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
    content: 'Increased my interview rate by 300%. The keyword optimization is incredibly accurate.',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'UX Designer at Apple',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
    content: 'The premium templates are beautiful and professional. Worth every penny!',
    rating: 5
  }
];

const features = [
  {
    icon: <Bot className="w-8 h-8" />,
    title: 'AI-Powered Analysis',
    description: 'Advanced algorithms analyze your resume against job requirements with 98% accuracy.'
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: 'ATS Optimization',
    description: 'Ensure your resume passes through Applicant Tracking Systems effortlessly.'
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Instant Results',
    description: 'Get detailed feedback and improvements in under 30 seconds.'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Data Security',
    description: 'Enterprise-grade security keeps your personal information completely safe.'
  }
];

const PricingCard = ({ plan }: { plan: PricingPlan }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl",
        "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
        plan.popular ? "border-purple-300 dark:border-purple-600 shadow-lg shadow-purple-500/20" : "border-gray-200 dark:border-gray-700",
        plan.popular && "scale-105 lg:scale-110"
      )}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Most Popular
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <div className={cn("w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r", plan.color)}>
          <div className="text-white">
            {plan.icon}
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
        
        <div className="flex items-center justify-center gap-2 mb-2">
          {plan.originalPrice && (
            <span className="text-lg text-gray-400 line-through">${plan.originalPrice}</span>
          )}
          <span className="text-4xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
          <span className="text-gray-600 dark:text-gray-400">/{plan.period}</span>
        </div>
        
        {plan.period === 'year' && plan.price > 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Just ${Math.round(plan.price / 12)}/month billed annually
          </div>
        )}
        
        {plan.originalPrice && (
          <div className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-sm">
            <TrendingUp className="w-3 h-3" />
            Save {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}%
          </div>
        )}
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What's included:</h4>
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {plan.limitations.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-500 dark:text-gray-400 mb-3">Limitations:</h4>
            <ul className="space-y-3">
              {plan.limitations.map((limitation, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Button 
        className={cn(
          "w-full py-3 font-semibold transition-all duration-300",
          plan.popular 
            ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl" 
            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-0"
        )}
      >
        {plan.cta}
        {plan.popular && <ArrowRight className="w-4 h-4 ml-2" />}
      </Button>
    </motion.div>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "p-6 rounded-xl border",
        "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
        "border-gray-200 dark:border-gray-700"
      )}
    >
      <div className="flex items-center gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{testimonial.content}"</p>
      <div className="flex items-center gap-3">
        <img 
          src={testimonial.image} 
          alt={testimonial.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
        </div>
      </div>
    </motion.div>
  );
};

const Subscription: React.FC = () => {
  const { theme } = useTheme();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <PageLayout showBackButton backTo="/dashboard" backLabel="Back">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Unlock Your Career Potential
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Join thousands of professionals who've transformed their careers with FitCheck AI. 
            Get the premium tools you need to land your dream job.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={cn("font-medium", billingCycle === 'monthly' ? "text-gray-900 dark:text-white" : "text-gray-500")}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={cn(
                "relative w-14 h-7 rounded-full transition-all duration-300",
                billingCycle === 'yearly' ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"
              )}
            >
              <div className={cn(
                "absolute w-5 h-5 bg-white rounded-full top-1 transition-all duration-300",
                billingCycle === 'yearly' ? "left-8" : "left-1"
              )} />
            </button>
            <span className={cn("font-medium", billingCycle === 'yearly' ? "text-gray-900 dark:text-white" : "text-gray-500")}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-sm font-medium">
                Save 32%
              </span>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto">
          {getPricingPlans(billingCycle).map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <PricingCard plan={plan} />
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose FitCheck AI?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our cutting-edge technology gives you the competitive edge you need in today's job market.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className={cn(
                  "text-center p-6 rounded-xl border",
                  "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
                  "border-gray-200 dark:border-gray-700",
                  "hover:shadow-lg transition-all duration-300"
                )}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>


      </div>
    </PageLayout>
  );
};

export default Subscription; 