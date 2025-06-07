import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';

// Logo Components
const MicrosoftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="a" x1="-1032.17" x2="-1059.21" y1="145.31" y2="65.43" gradientTransform="matrix(1 0 0 -1 1075 158)" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#114a8b"/>
        <stop offset="1" stopColor="#0669bc"/>
      </linearGradient>
      <linearGradient id="c" x1="-1027.16" x2="-997.48" y1="147.64" y2="68.56" gradientTransform="matrix(1 0 0 -1 1075 158)" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#f1511b"/>
        <stop offset="1" stopColor="#80cc28"/>
      </linearGradient>
      <linearGradient id="d" x1="-1023.725" x2="-1029.98" y1="147.49" y2="76.52" gradientTransform="matrix(1 0 0 -1 1075 158)" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fbbc04"/>
        <stop offset="1" stopColor="#80cc28"/>
      </linearGradient>
      <linearGradient id="e" x1="-1005.02" x2="-1037.67" y1="142.6" y2="81.43" gradientTransform="matrix(1 0 0 -1 1075 158)" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#f1511b"/>
        <stop offset="1" stopColor="#80cc28"/>
      </linearGradient>
    </defs>
    <path fill="url(#a)" d="M44 8h40v40H44z"/>
    <path fill="#0078d4" d="M8 8h32v32H8z"/>
    <path fill="url(#c)" d="M44 48h40v40H44z"/>
    <path fill="url(#d)" d="M8 48h32v32H8z"/>
  </svg>
);

const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
  </svg>
);

const AppleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.224-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);
const AmazonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill="#f90" d="M0 0h512v512H0z" />
    <path fill="#fff" d="M283 187c-62 2-121 19-121 81 0 43 26 64 61 64 31 0 51-12 68-30 8 11 10 16 24 27q5 3 10-1l31-27q4-4 0-10c-7-11-15-19-15-39v-64c0-27 2-52-18-70-17-16-38-20-62-21-53-1-88 28-93 62q-1 8 7 9l37 5c6 1 9-4 10-8 6-22 29-28 43-23 20 6 18 29 18 45m-36 105c-15 0-25-13-25-30 1-36 29-42 61-42v18c0 32-17 54-36 54m168 106c13-11 26-38 25-57 0-7-1-8-8-10-13-4-46-5-62 10-3 3-2 5 15 11-2 45-6 50 2 4 7-8 35-12 47-2 5 2 6 6 3M58 342c96 91 247 94 345 25 7-4 0-12-6-9A376 376 0 0162 337c-4-3-8 2-4 5"/>
  </svg>
);

const NetflixIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="m5.398 0 8.348 23.602c2.346.059 4.856.398 4.856.398L10.113 0H5.398zm8.489 0v9.172l4.715 13.33V0h-4.715zM5.398 1.5V24c1.873-.225 2.81-.312 4.715-.398V14.83L5.398 1.5z" />
  </svg>
);
const MetaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z" />
  </svg>
);

const companyLogos = [
  { component: MicrosoftIcon, name: 'Microsoft' },
  { component: GoogleIcon, name: 'Google' },
  { component: AppleIcon, name: 'Apple' },
  { component: AmazonIcon, name: 'Amazon' },
  { component: NetflixIcon, name: 'Netflix' },
  { component: MetaIcon, name: 'Meta' },
  // Duplicate some companies for variety and longer carousel
  { component: GoogleIcon, name: 'Google' },
  { component: MicrosoftIcon, name: 'Microsoft' },
  { component: AppleIcon, name: 'Apple' },
  { component: AmazonIcon, name: 'Amazon' },
];

const CompanyLogos: React.FC = () => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="py-16 overflow-hidden"
    >
      <div className="text-center mb-12">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Tailored for Top Tech Companies
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          Get your resume optimized for positions at the world's leading technology companies
        </motion.p>
      </div>

      {/* Sliding logos container */}
      <div className="relative h-24 overflow-hidden">
        {/* Gradient overlays for smooth edges */}
        <div className={cn(
          "absolute left-0 top-0 h-full w-32 z-10 pointer-events-none",
          theme === "dark" 
            ? "bg-gradient-to-r from-gray-900 to-transparent"
            : "bg-gradient-to-r from-gray-50 to-transparent"
        )} />
        <div className={cn(
          "absolute right-0 top-0 h-full w-32 z-10 pointer-events-none",
          theme === "dark" 
            ? "bg-gradient-to-l from-gray-900 to-transparent"
            : "bg-gradient-to-l from-gray-50 to-transparent"
        )} />
        
        {/* Continuous sliding logos */}
        <motion.div
          className="flex items-center space-x-12 absolute whitespace-nowrap"
          animate={{
            x: [0, -120 * companyLogos.length - 48 * (companyLogos.length - 1)]
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 15, // Faster - 15 seconds instead of 30
              ease: "linear",
            },
          }}
        >
          {/* First set */}
          {companyLogos.map((logo, index) => (
            <div
              key={`logo-${index}`}
              className={cn(
                "flex-shrink-0 w-20 h-16 p-3 rounded-xl transition-all duration-300",
                "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                "border border-gray-200/50 dark:border-gray-700/50",
                "hover:bg-white dark:hover:bg-gray-800",
                "hover:border-gray-300 dark:hover:border-gray-600",
                "hover:shadow-lg dark:hover:shadow-2xl",
                "group cursor-pointer"
              )}
            >
              <logo.component className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110" />
            </div>
          ))}
          
          {/* Second set for seamless loop */}
          {companyLogos.map((logo, index) => (
            <div
              key={`logo-dup-${index}`}
              className={cn(
                "flex-shrink-0 w-20 h-16 p-3 rounded-xl transition-all duration-300",
                "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                "border border-gray-200/50 dark:border-gray-700/50",
                "hover:bg-white dark:hover:bg-gray-800",
                "hover:border-gray-300 dark:hover:border-gray-600",
                "hover:shadow-lg dark:hover:shadow-2xl",
                "group cursor-pointer"
              )}
            >
              <logo.component className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110" />
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CompanyLogos; 
