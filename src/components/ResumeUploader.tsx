import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';

type ResumeUploaderProps = {
  onFileSelect: (file: File | null, extractedText?: string) => void;
  acceptedTypes?: string[];
};

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ 
  onFileSelect, 
  acceptedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
}) => {
  const { theme } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');

  // Optimized text extraction function
  const extractTextFromFile = useCallback(async (file: File): Promise<string> => {
    try {
      console.log('Starting text extraction from file:', file.name, 'Type:', file.type);
      
      if (file.type === 'application/pdf') {
        try {
          // Try PDF.js first, but fall back immediately if worker issues occur
          const pdfjs = await import('pdfjs-dist');
          
          // Try to use a simple worker configuration
          pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
          
          console.log('Attempting PDF.js extraction...');

          const arrayBuffer = await file.arrayBuffer();
          console.log('PDF file size:', arrayBuffer.byteLength, 'bytes');
          
          const pdf = await pdfjs.getDocument({ 
            data: arrayBuffer,
            useSystemFonts: true,
            isEvalSupported: false,
            verbosity: 0
          }).promise;

          console.log('PDF loaded successfully. Pages:', pdf.numPages);

          // Extract text from first few pages only to avoid timeouts
          const maxPages = Math.min(pdf.numPages, 5);
          const pageTexts: string[] = [];
          
          for (let i = 1; i <= maxPages; i++) {
            try {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent({
                includeMarkedContent: false
              });
              
              const pageText = textContent.items
                .filter((item): item is any => 'str' in item)
                .map((item: any) => item.str)
                .join(' ')
                .trim();
                
              if (pageText.length > 0) {
                pageTexts.push(pageText);
              }
            } catch (pageError) {
              console.warn(`Could not extract text from page ${i}:`, pageError);
            }
          }

          const fullText = pageTexts.join('\n').trim();
          
          if (fullText.length > 0) {
            console.log('PDF.js extraction successful. Total characters:', fullText.length);
            return fullText;
          } else {
            throw new Error('No text extracted via PDF.js');
          }
        } catch (pdfJsError) {
          console.log('PDF.js failed, trying fallback extraction:', pdfJsError);
          // Fall back to simple text extraction
          return await extractTextFallback(file);
        }
      } 
      else if (file.type.includes('word')) {
        console.log('Processing Word document');
        // Dynamic import for Word documents
        const { default: mammoth } = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        
        console.log('Word document extraction complete. Characters:', result.value.length);
        
        if (result.value.trim().length === 0) {
          throw new Error('No text content found in Word document.');
        }
        
        return result.value.trim();
      }
      else {
        throw new Error(`Unsupported file type: ${file.type}`);
      }
    } catch (error) {
      console.error('Text extraction error:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('No text content found')) {
          throw error; // Re-throw our custom errors
        } else if (error.message.includes('Invalid PDF')) {
          throw new Error('Invalid PDF file. Please ensure the file is not corrupted.');
        } else if (error.message.includes('network')) {
          throw new Error('Network error while processing file. Please check your connection and try again.');
        }
      }
      
      throw new Error(`Failed to extract text from document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);

  // Fallback PDF extraction without worker
  const extractTextFallback = useCallback(async (file: File): Promise<string> => {
    try {
      console.log('Using fallback PDF extraction method...');
      
      // Simple text extraction fallback
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Convert to string and look for text patterns
      let text = '';
      let decoded = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
      
      // Extract readable text using regex patterns
      const textMatches = decoded.match(/[A-Za-z0-9\s\.\,\;\:\!\?\-\(\)]+/g);
      if (textMatches) {
        text = textMatches
          .filter(match => match.trim().length > 2) // Filter out short matches
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
      }
      
      if (text.length < 50) {
        throw new Error('Unable to extract readable text from this PDF. The document might be image-based or encrypted.');
      }
      
      console.log('Fallback extraction complete. Characters:', text.length);
      return text;
      
    } catch (error) {
      console.error('Fallback extraction failed:', error);
      throw new Error('PDF text extraction failed. Please try a different PDF file or convert it to a text-based format.');
    }
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    // File type validation
    if (!acceptedTypes.includes(file.type)) {
      return `Unsupported file type. Please upload ${acceptedTypes.includes('application/pdf') ? 'PDF' : ''}${acceptedTypes.length > 1 ? ' or Word' : ''} documents only.`;
    }

    // File name validation
    if (file.name.length > 255) {
      return 'File name is too long. Please rename your file.';
    }

    return null;
  }, [acceptedTypes]);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setError(null);
    setIsProcessing(false);

    if (!file) {
      setSelectedFile(null);
      setExtractedText('');
      onFileSelect(null);
      return;
    }

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      onFileSelect(null);
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);

    try {
      // Extract text in the background
      const text = await extractTextFromFile(file);
      setExtractedText(text);
      onFileSelect(file, text);
    } catch (err) {
      console.error('File processing error:', err);
      setError('Failed to process file. Please try again or use a different file.');
      onFileSelect(file); // Still pass the file even if text extraction fails
    } finally {
      setIsProcessing(false);
    }
  }, [validateFile, extractTextFromFile, onFileSelect]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      // Create a synthetic event to reuse existing logic
      const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
      if (fileInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        
        const syntheticEvent = new Event('change', { bubbles: true });
        Object.defineProperty(syntheticEvent, 'target', {
          writable: false,
          value: fileInput
        });
        
        handleFileChange(syntheticEvent as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    }
  }, [handleFileChange]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const getFileIcon = () => {
    if (isProcessing) return <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />;
    if (selectedFile) return <CheckCircle className="w-12 h-12 text-green-500" />;
    return <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500" />;
  };

  const getFileTypeDisplay = () => {
    const types = [];
    if (acceptedTypes.includes('application/pdf')) types.push('PDF');
    if (acceptedTypes.some(type => type.includes('word'))) types.push('Word');
    return types.join(', ');
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
      {/* Header */}
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
            Upload your resume for AI-powered analysis
          </p>
        </div>
      </div>
      
      {/* File Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer",
          selectedFile && !error
            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
            : error
            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/10"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('resume-upload')?.click()}
      >
        <div className="flex flex-col items-center">
          {getFileIcon()}
          
          {selectedFile && !error ? (
            <div className="mt-4">
              <p className="text-green-700 dark:text-green-400 font-semibold text-lg">
                {selectedFile.name}
              </p>
              <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                {isProcessing ? 'Processing document...' : 'File uploaded successfully'}
              </p>
              {extractedText && (
                <p className="text-xs text-green-600 dark:text-green-500 mt-2">
                  Extracted {extractedText.length.toLocaleString()} characters
                </p>
              )}
            </div>
          ) : error ? (
            <div className="mt-4">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-700 dark:text-red-400 font-medium">
                Upload Failed
              </p>
              <p className="text-sm text-red-600 dark:text-red-500 mt-1 max-w-sm">
                {error}
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-gray-600 dark:text-gray-300 mb-2 text-lg font-medium">
                Drop your resume here or click to browse
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Supports {getFileTypeDisplay()} files
              </p>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Files are processed locally and uploaded securely
              </div>
            </div>
          )}
        </div>
        
        <input 
          type="file" 
          accept={acceptedTypes.join(',')}
          className="hidden" 
          id="resume-upload"
          onChange={handleFileChange}
          disabled={isProcessing}
        />
      </div>

      {/* Action Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => document.getElementById('resume-upload')?.click()}
          disabled={isProcessing}
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300",
            selectedFile && !error
              ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          )}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : selectedFile ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Change File
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Choose File
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ResumeUploader; 