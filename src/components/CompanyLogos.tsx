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
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
    <path fill="#4285f4" d="M386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
    <path fill="#fbbc02" d="M90 341a208 200 0 010-171l63 49q-12 37 0 73" />
    <path fill="#ea4335" d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
  </svg>
);

const AppleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill="#A2AAAD" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.224-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);
const AmazonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill="#FF9900" d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.493.124.12.187.09.33-.09.43-.586.33-1.725.93-3.414 1.8-1.357.7-2.706 1.197-4.046 1.493-1.307.29-2.555.438-3.744.438-2.99 0-5.76-.515-8.31-1.543-2.64-1.064-4.657-2.22-6.052-3.465-.204-.183-.148-.4.07-.56zm7.696-4.19c-1.007.033-1.845.138-2.514.315-.668.177-1.173.43-1.515.756-.342.327-.513.735-.513 1.226 0 .654.2 1.17.6 1.546.4.377.936.565 1.608.565.708 0 1.31-.244 1.804-.73.495-.487.742-1.14.742-1.96v-1.718zm2.174 5.36c-.138.134-.336.2-.593.2-.257 0-.46-.066-.61-.2-.15-.133-.254-.318-.31-.554l-.18-.764c-.632.516-1.31.893-2.034 1.133-.725.24-1.477.36-2.258.36-1.073 0-1.933-.296-2.58-.888-.647-.593-.97-1.39-.97-2.39 0-.827.198-1.54.594-2.14.395-.6.965-1.052 1.708-1.355.744-.304 1.665-.456 2.764-.456h1.908v-.627c0-.627-.132-1.073-.395-1.34-.264-.266-.695-.4-1.293-.4-.598 0-1.06.1-1.383.3-.324.2-.485.508-.485.924 0 .133-.044.245-.133.334-.089.09-.2.134-.334.134l-1.496-.2c-.133-.022-.245-.078-.334-.167-.089-.089-.133-.2-.133-.334 0-.49.178-.94.534-1.35.356-.41.867-.74 1.534-1 .667-.26 1.445-.39 2.334-.39 1.2 0 2.117.267 2.75.8.634.534.95 1.334.95 2.4v4.267c0 .31.067.534.2.67.133.136.334.203.6.203.267 0 .534-.067.8-.2.133-.067.2.022.2.267 0 .244-.089.444-.267.6z"/>
    <path fill="#FF9900" d="M18.32 11.23c-.41-.02-.82-.03-1.23-.03s-.82.01-1.23.03c-.41.02-.67.18-.78.48-.11.3-.16.65-.16 1.05 0 .4.05.75.16 1.05.11.3.37.46.78.48.41.02.82.03 1.23.03s.82-.01 1.23-.03c.41-.02.67-.18.78-.48.11-.3.16-.65.16-1.05 0-.4-.05-.75-.16-1.05-.11-.3-.37-.46-.78-.48zm2.87-2.73c.2-.2.3-.5.3-.9s-.1-.7-.3-.9c-.2-.2-.5-.3-.9-.3h-3.34c-.4 0-.7.1-.9.3-.2.2-.3.5-.3.9s.1.7.3.9c.2.2.5.3.9.3h3.34c.4 0 .7-.1.9-.3z"/>
  </svg>
);

const NetflixIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill="#E50914" d="m5.398 0 8.348 23.602c2.346.059 4.856.398 4.856.398L10.113 0H5.398zm8.489 0v9.172l4.715 13.33V0h-4.715zM5.398 1.5V24c1.873-.225 2.81-.312 4.715-.398V14.83L5.398 1.5z" />
  </svg>
);
const MetaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill="#0467DF" d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z" />
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

export { MicrosoftIcon, GoogleIcon, AppleIcon, AmazonIcon, NetflixIcon, MetaIcon };
export default CompanyLogos;
