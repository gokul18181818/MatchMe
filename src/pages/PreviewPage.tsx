import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, ArrowLeft } from 'lucide-react';
import ResumePreview from '../components/ResumePreview';
import TemplateSelector from '../components/TemplateSelector';
import Button from '../components/Button';

const PreviewPage: React.FC = () => {
  const handleDownload = () => {
    // Mock download functionality
    alert('Resume download functionality will be implemented with backend integration');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/analyze" 
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Analysis
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Resume Preview</h1>
          <Button
            onClick={handleDownload}
            className="flex items-center bg-green-600 hover:bg-green-700"
          >
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Template Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <TemplateSelector />
        </motion.div>

        {/* Resume Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white p-8 rounded-lg shadow-lg"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Your Tailored Resume
            </h2>
            <p className="text-gray-600">
              Optimized for the job description you provided
            </p>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
            <ResumePreview />
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center gap-4 mt-8"
        >
          <Link to="/analyze">
            <Button className="bg-gray-600 hover:bg-gray-700">
              Analyze Another Resume
            </Button>
          </Link>
          <Button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Download as PDF
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default PreviewPage; 