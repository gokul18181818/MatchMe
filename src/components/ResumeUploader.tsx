import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';

type ResumeUploaderProps = {
  onFileSelect: (file: File | null) => void;
  onTextChange: (text: string) => void;
};

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onFileSelect, onTextChange }) => {
  const { theme } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setError(null);

    if (!file) {
      setSelectedFile(null);
      onFileSelect(null);
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload PDF or DOCX.');
      setSelectedFile(null);
      onFileSelect(null);
      return;
    }

    if (file.size > MAX_SIZE) {
      setError('File size exceeds 5MB limit.');
      setSelectedFile(null);
      onFileSelect(null);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);

    try {
      let text = '';
      if (file.type === 'application/pdf') {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        const pageTexts = await Promise.all(
          Array.from({ length: pdf.numPages }, async (_, i) => {
            const page = await pdf.getPage(i + 1);
            const content = await page.getTextContent();
            return content.items
              .map((item: any) => ('str' in item ? (item as any).str : ''))
              .join(' ');
          })
        );
        text = pageTexts.join('\n');
      } else {
        const { default: mammoth } = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      }
      setResumeText(text);
      onTextChange(text);
    } catch (err) {
      console.error(err);
      setError('Failed to parse resume file.');
      setSelectedFile(null);
      onFileSelect(null);
    }
  };

  const handleTextChange = (text: string) => {
    setError(null);
    setResumeText(text);
    onTextChange(text); // Update parent component

    if (text.trim()) {
      setSelectedFile(null); // Clear file when text is entered
      onFileSelect(null); // Update parent component
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={cn(
        "p-8 rounded-2xl transition-all duration-300",
        "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
        "border border-gray-200/50 dark:border-gray-700/50",
        "hover:bg-white dark:hover:bg-gray-900",
        "hover:border-gray-300 dark:hover:border-gray-600",
        "hover:shadow-xl dark:hover:shadow-2xl"
      )}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          "bg-gradient-to-r from-blue-600 to-purple-600"
        )}>
          <Upload className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Upload Resume
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload your current resume for analysis
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* File Upload */}
        <div className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300",
          selectedFile
            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800/50"
        )}>
          {selectedFile ? (
            <div className="flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
              <p className="text-green-700 dark:text-green-400 font-medium">
                {selectedFile.name}
              </p>
              <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                File uploaded successfully
              </p>
            </div>
          ) : (
            <>
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Drop your resume here or click to browse
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Supports PDF, DOC, DOCX files
              </p>
            </>
          )}
          
          <input 
            type="file" 
            accept=".pdf,.doc,.docx"
            className="hidden" 
            id="resume-upload"
            onChange={handleFileChange}
          />
          <label
            htmlFor="resume-upload"
            className={cn(
              "inline-block px-6 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300",
              selectedFile
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            {selectedFile ? 'Change File' : 'Choose File'}
          </label>
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
          <span className="px-3 text-sm text-gray-500 dark:text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Text Area */}
        <div>
          <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
            Paste your resume text
          </label>
          <textarea 
            value={resumeText}
            onChange={(e) => handleTextChange(e.target.value)}
            className={cn(
              "w-full h-32 p-4 rounded-xl border transition-all duration-300 resize-none",
              "bg-gray-50 dark:bg-gray-800/50",
              "border-gray-200 dark:border-gray-700",
              "text-gray-900 dark:text-white",
              "placeholder-gray-500 dark:placeholder-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
              "hover:border-gray-300 dark:hover:border-gray-600"
            )}
            placeholder="Paste your resume content here..."
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ResumeUploader; 