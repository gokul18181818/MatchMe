import React from 'react';
import { Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '../contexts/LoadingContext';

const LoadingOverlay: React.FC = () => {
  const { loading } = useLoading();

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <Loader className="w-8 h-8 text-white animate-spin" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
