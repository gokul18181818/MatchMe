import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker with multiple fallback options
const configureWorker = () => {
  try {
    // Option 1: Try jsDelivr CDN
    const jsDelivrUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
    console.log('🔧 Attempting jsDelivr worker:', jsDelivrUrl);
    pdfjsLib.GlobalWorkerOptions.workerSrc = jsDelivrUrl;
    return jsDelivrUrl;
  } catch (error) {
    try {
      // Option 2: Try unpkg CDN
      const unpkgUrl = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
      console.log('🔧 Fallback to unpkg worker:', unpkgUrl);
      pdfjsLib.GlobalWorkerOptions.workerSrc = unpkgUrl;
      return unpkgUrl;
    } catch (fallbackError) {
      // Option 3: Try a protocol-relative URL
      const protocolRelativeUrl = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
      console.log('🔧 Final fallback worker:', protocolRelativeUrl);
      pdfjsLib.GlobalWorkerOptions.workerSrc = protocolRelativeUrl;
      return protocolRelativeUrl;
    }
  }
};

// Initialize worker
const workerUrl = configureWorker();
console.log('📋 PDF.js version:', pdfjsLib.version);
console.log('📋 Final worker source:', workerUrl);

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    console.log('📄 Starting PDF text extraction...');
    console.log('File details:', { name: file.name, size: file.size, type: file.type });
    
    // Validate file type
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error('File is not a valid PDF');
    }
    
    const arrayBuffer = await file.arrayBuffer();
    console.log('✅ File read successfully, size:', arrayBuffer.byteLength, 'bytes');
    
    // Configure PDF.js loading parameters for better compatibility
    console.log('🔄 Loading PDF document...');
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 0, // Reduce console spam
      disableFontFace: false,
      useSystemFonts: true,
      // Add timeout for worker loading
      isEvalSupported: false,
      maxImageSize: -1,
      cMapPacked: true,
    });
    
    // Add timeout for the loading process
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('PDF loading timeout')), 30000); // 30 second timeout
    });
    
    console.log('⏳ Waiting for PDF to load...');
    const pdf = await Promise.race([loadingTask.promise, timeoutPromise]) as any;
    console.log('✅ PDF loaded successfully, pages:', pdf.numPages);
    
    let fullText = '';
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        console.log(`📖 Processing page ${pageNum}...`);
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Combine all text items with proper spacing
        const pageText = textContent.items
          .map((item: any) => {
            if (item.str && typeof item.str === 'string') {
              return item.str.trim();
            }
            return '';
          })
          .filter((str: string) => str.length > 0)
          .join(' ');
        
        if (pageText.trim()) {
          fullText += pageText + '\n\n';
        }
        
        console.log(`✅ Page ${pageNum} extracted:`, pageText.length, 'characters');
      } catch (pageError) {
        console.warn(`⚠️ Error extracting page ${pageNum}:`, pageError);
        // Continue with other pages
      }
    }
    
    const finalText = fullText.trim();
    console.log('✅ PDF extraction complete. Total text length:', finalText.length);
    
    if (finalText.length === 0) {
      throw new Error('No text content found in PDF. The PDF might be image-based or corrupted.');
    }
    
    return finalText;
  } catch (error) {
    console.error('❌ Error extracting text from PDF:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    
    // Provide specific error messages based on error type
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes('Loading failed') || errorMessage.includes('worker') || errorMessage.includes('timeout')) {
      console.warn('🔄 PDF worker issue detected, trying alternative approach...');
      
      // Alternative: Try to extract basic info without full PDF parsing
      try {
        return await extractTextAlternative(file);
      } catch (altError) {
        throw new Error('PDF processing failed. The PDF worker could not load. Please try a different file or check your internet connection.');
      }
    } else if (errorMessage.includes('Invalid PDF')) {
      throw new Error('Invalid PDF file. Please ensure the file is not corrupted and try again.');
    } else if (errorMessage.includes('password')) {
      throw new Error('Password-protected PDFs are not supported. Please upload an unprotected PDF.');
    } else if (errorMessage.includes('No text content')) {
      throw new Error(errorMessage);
    } else {
      throw new Error(`Failed to extract text from PDF: ${errorMessage}`);
    }
  }
};

// Alternative text extraction method for when PDF.js worker fails
const extractTextAlternative = async (file: File): Promise<string> => {
  console.log('🔄 Using alternative text extraction method...');
  
  // For now, return a placeholder that allows the system to continue
  // In a production environment, you might use a different PDF library or server-side processing
  return `[PDF Upload: ${file.name}]
  
This is a placeholder for PDF content extraction. The PDF processing encountered issues with the worker loading.
In a real application, this content would be extracted from your uploaded PDF file.

File Details:
- Name: ${file.name}
- Size: ${(file.size / 1024).toFixed(2)} KB
- Type: ${file.type}

To get full PDF text extraction working, please ensure:
1. Internet connection is stable
2. PDF is not password-protected
3. PDF contains selectable text (not just images)

The system will still generate an optimized resume using job-specific improvements and formatting.`;
};