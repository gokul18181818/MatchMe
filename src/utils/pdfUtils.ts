import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source for PDF.js - Updated for better compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 0, // Reduce console spam
      cMapUrl: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/standard_fonts/`,
    });
    
    const pdf = await loadingTask.promise;
    console.log('✅ PDF loaded successfully, pages:', pdf.numPages);
    
    let fullText = '';
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
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
          .filter(str => str.length > 0)
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
    
    // Provide specific error messages based on error type
    if (error.message && error.message.includes('Invalid PDF')) {
      throw new Error('Invalid PDF file. Please ensure the file is not corrupted and try again.');
    } else if (error.message && error.message.includes('password')) {
      throw new Error('Password-protected PDFs are not supported. Please upload an unprotected PDF.');
    } else if (error.message && error.message.includes('No text content')) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to extract text from PDF. Please try a different file or contact support.');
    }
  }
};