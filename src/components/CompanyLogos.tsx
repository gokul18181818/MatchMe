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
  <svg viewBox="0 0 256 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" className={className}>
    <path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/>
    <path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/>
    <path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/>
    <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/>
  </svg>
);

const AppleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 256 315" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" className={className}>
    <path d="M213.803 167.03c.442 47.58 41.74 63.413 42.197 63.615-.35 1.116-6.599 22.563-21.757 44.716-13.104 19.153-26.705 38.235-48.13 38.63-21.05.388-27.82-12.483-51.888-12.483-24.061 0-31.582 12.088-51.51 12.871-20.68.783-36.428-20.71-49.64-39.793-27-39.033-47.633-110.3-19.928-158.406 13.763-23.89 38.36-39.017 65.056-39.405 20.307-.387 39.475 13.662 51.889 13.662 12.406 0 35.699-16.895 60.186-14.414 10.25.427 39.026 4.14 57.503 31.186-1.49.923-34.335 20.044-33.978 59.822M174.24 50.199c10.98-13.29 18.369-31.79 16.353-50.199-15.826.636-34.962 10.546-46.314 23.828-10.145 11.665-19.026 30.391-16.66 48.21 17.614 1.365 35.718-8.964 46.621-21.839" fill="#000"/>
  </svg>
);

const AmazonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 256 153" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" className={className}>
    <path d="M72.188 58.067c0 19.88-2.652 35.863-7.956 47.948-5.304 12.085-13.259 18.127-23.866 18.127-4.646 0-8.614-1.988-11.903-5.964V153L0 148.355V24.137h21.805l2.652 12.743h.658c3.289-4.317 6.908-7.627 10.856-9.931 3.948-2.304 8.285-3.456 13.01-3.456 10.279 0 18.069 6.042 23.372 18.127 5.303 12.085 7.956 28.068 7.956 47.948l-7.121.499zm-28.512-40.642c-3.62 0-6.578 1.159-8.873 3.456-2.296 2.297-3.95 5.636-4.975 10.019v54.591c1.025 4.383 2.679 7.722 4.975 10.019 2.295 2.297 5.253 3.456 8.873 3.456 5.633 0 9.91-2.469 12.832-7.393 2.921-4.924 4.382-12.743 4.382-23.456V48.048c0-10.713-1.46-18.532-4.382-23.456-2.922-4.924-7.199-7.393-12.832-7.393v.226z" fill="#FF9900"/>
    <path d="M108.495 124.002c-10.608 0-18.891-2.966-24.849-8.9-5.958-5.934-8.937-14.002-8.937-24.204 0-10.713 3.124-19.19 9.372-25.432 6.248-6.242 14.695-9.363 25.341-9.363 10.317 0 18.398 2.968 24.245 8.902 5.847 5.934 8.77 13.838 8.77 23.712v9.033h-39.28c.33 5.272 2.131 9.361 5.405 12.267 3.274 2.906 7.884 4.359 13.832 4.359 3.619 0 7.073-.331 10.361-1.003 3.289-.663 6.742-1.66 10.361-2.981v16.394c-3.289 1.659-6.742 2.82-10.361 3.456-3.619.636-7.721.926-12.306.926l.046-.167zm-2.323-61.668c-4.646 0-8.285 1.328-10.855 3.984-2.571 2.656-4.055 6.44-4.447 11.352h29.83c0-4.912-1.312-8.696-3.948-11.352-2.636-2.656-6.11-3.984-10.443-3.984h-.137z" fill="#FF9900"/>
    <path d="M194.817 56.074c1.353 0 2.541.083 3.564.249l-1.681 20.874c-1.353-.332-2.871-.498-4.553-.498-6.578 0-11.737 2.055-15.477 6.158-3.74 4.103-5.61 9.693-5.61 16.77v24.871h-28.513V58.899h23.044l3.289 11.74h.988c2.296-4.383 5.421-7.807 9.372-10.271 3.95-2.464 8.12-3.456 12.505-3.456l2.072.162z" fill="#FF9900"/>
    <path d="M242.105 123.337c-12.176 0-21.64-3.621-28.392-10.854-6.753-7.233-10.129-17.283-10.129-30.15 0-13.198 3.541-23.58 10.624-31.154 7.083-7.574 16.712-11.361 28.886-11.361 4.975 0 9.455.663 13.439 1.988 3.984 1.325 7.64 3.126 10.969 5.422l-9.537 16.729c-2.541-1.659-5.247-2.98-8.12-3.984-2.872-1.004-5.745-1.496-8.617-1.496-5.963 0-10.608 2.138-13.933 6.406-3.326 4.268-4.988 10.187-4.988 17.757 0 7.57 1.662 13.489 4.988 17.757 3.325 4.268 7.97 6.406 13.933 6.406 3.2 0 6.237-.58 9.108-1.742 2.872-1.162 5.578-2.731 8.12-4.71l9.536 16.729c-3.329 2.628-7.152 4.595-11.468 5.9-4.317 1.305-8.963 1.958-13.939 1.958l.52-.167z" fill="#FF9900"/>
    <path d="M255.267 7.075c.663 7.075-1.826 12.908-7.468 17.5-5.641 4.593-12.722 6.889-21.243 6.889-8.52 0-15.518-2.296-20.993-6.889-5.476-4.592-7.883-10.425-7.22-17.5-.663-6.909 1.744-12.576 7.22-17.003C211.039-2.451 217.954-4.748 226.556-4.748c8.603 0 15.602 2.297 20.995 6.89 5.394 4.593 7.883 10.26 7.716 17.168v-17.235zm-12.887 98.258c-1.023 1.327-2.624 2.656-4.811 3.983-2.188 1.327-4.729 2.656-7.634 3.983-2.905 1.327-6.257 2.49-10.056 3.489-3.799.999-7.88 1.498-12.245 1.498-9.537 0-17.16-2.324-22.869-6.972-5.71-4.648-8.564-11.205-8.564-19.67 0-5.307 1.353-9.858 4.058-13.653 2.706-3.795 6.257-6.972 10.654-9.531 4.397-2.559 9.372-4.482 14.925-5.769 5.553-1.287 11.269-1.931 17.149-1.931h6.413v-2.325c0-4.648-1.188-8.111-3.565-10.388-2.376-2.277-5.875-3.416-10.495-3.416-3.95 0-7.718.58-11.305 1.741-3.587 1.162-7.174 2.572-10.761 4.232l-7.221-15.726c4.564-2.159 9.537-3.983 14.919-5.471 5.382-1.488 11.022-2.232 16.92-2.232 11.996 0 21.121 2.656 27.375 7.969 6.254 5.313 9.381 13.448 9.381 24.405v56.018c0 3.794.83 6.615 2.488 8.443v.166c-1.33.581-2.707 1.08-4.13 1.497-1.424.415-3.014.747-4.77.996-1.756.249-3.678.415-5.766.499-2.088.083-4.176 0-6.264 0-4.234 0-7.47-.996-9.709-2.989l.062-.124z" fill="#FF9900"/>
    <path d="M17.873 152.33c18.106 13.735 44.507 21.005 67.17 21.005 31.828 0 60.5-11.766 82.305-31.32 1.956-1.76-.205-4.149-2.161-2.779-24.343 17.506-54.4 28.052-85.471 28.052-20.819 0-43.565-4.325-59.71-16.896-2.16-1.682-3.96.871-2.133 2.196v-.258z" fill="#FF9900"/>
    <path d="M11.262 142.316c2.365-3.038 15.518-2.284 21.365-1.819 5.847.465 14.038 1.453 15.438-.581.465-1.16-.993-7.057-5.136-9.923-4.143-2.865-19.414-1.317-21.696 2.865-1.163 2.866 2.864 8.061 2.864 8.061s-2.3-.581-2.3-2.168c0-1.588-1.628-2.169-1.628-2.169s-11.046 3.619-8.907 5.734z" fill="#FF9900"/>
  </svg>
);

const NetflixIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 256 347" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" className={className}>
    <path d="M256 143.46c-10.096 35.28-29.056 70.32-39.568 103.056-6.32 19.6-12.176 38.912-17.84 58.128-6.32 20.576-20.032 41.296-26.704 62.576-2.608 8.352-7.92 15.936-10.096 24.752-1.36 5.568-1.456 11.904-.576 17.328 1.52 9.296 5.328 19.488 1.584 28.768-2.128 5.296-7.44 6.608-12.832 6.992-9.072.656-17.968-5.936-23.424-13.456-9.648-13.296-13.68-29.712-17.04-45.536-3.68-17.264-6.88-34.656-10.288-51.984L74.8 176.256c-4.736 22.272-9.52 44.528-14.256 66.8-5.04 23.712-9.952 47.424-15.024 71.12-4.288 20.048-9.712 40.192-18.768 58.72-3.968 8.112-9.2 16.176-16.352 21.936C1.072 402.176-8.88 401.152 5.552 390.24c7.536-5.712 12.48-14.096 16.08-22.944 7.936-19.536 12.8-40.512 17.328-61.312 5.04-23.152 9.984-46.32 14.912-69.488 5.072-23.856 10.128-47.712 15.2-71.568L102.336 1.296c1.168-5.568 2.32-11.28 4.624-16.464C109.408-21.744 118.736-26.656 126.56-19.088c3.984 3.84 6.416 9.264 7.68 14.864 1.744 7.712 2.096 15.696 2.944 23.52l32.624 155.856c4.464-21.328 8.912-42.672 13.376-64 4.688-22.432 9.376-44.864 14.064-67.296 2.336-11.184 4.688-22.368 7.008-33.552 1.392-6.752 2.8-13.616 5.36-19.952 2.816-6.976 7.952-13.168 14.336-16.768 6.272-3.536 14.336-3.888 19.968 1.184 4.864 4.384 7.584 11.216 8.512 17.84.848 6.048.32 12.256-.624 18.272L228.72 146.544c8.544-1.04 17.168-1.84 25.808-1.376 1.472.096 1.472 2.304 1.472 2.304V143.46z" fill="#E50914"/>
  </svg>
);

const MetaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" className={className}>
    <path d="M256 128c0-70.692-57.308-128-128-128S0 57.308 0 128c0 63.928 46.875 116.917 108 126.055V164h-32.5v-36H108V108c0-32.5 19.375-50.5 49-50.5 14.21 0 29.086 2.536 29.086 2.536V91h-16.387C153.359 91 148 100.297 148 109.794V128h36l-5.75 36H148v90.055C209.125 244.917 256 191.928 256 128Z" fill="#1877F2"/>
    <path d="M178.25 164 184 128h-36V109.794C148 100.297 153.359 91 169.709 91H186V59.536S171.21 57 157 57c-29.625 0-49 18-49 50.5V128H75.5v36H108v90.055c6.988 1.083 14.085 1.595 21.25 1.528 7.166.067 14.262-.445 21.25-1.528V164h27.75Z" fill="#fff"/>
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