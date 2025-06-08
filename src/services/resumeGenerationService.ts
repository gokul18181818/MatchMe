import { extractTextFromPDF } from '../utils/pdfUtils';
import jsPDF from 'jspdf';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

interface OptimizedResumeData {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  education: Array<{
    school: string;
    degree: string;
    location: string;
    dates: string;
    details?: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    location: string;
    dates: string;
    achievements: string[];
  }>;
  projects: Array<{
    name: string;
    technologies: string;
    dates: string;
    description: string[];
  }>;
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    other: string[];
  };
}

export const extractResumeTextFromPDF = async (file: File): Promise<string> => {
  try {
    const text = await extractTextFromPDF(file);
    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

export const optimizeResumeWithJobData = async (resumeText: string, jobData: any): Promise<OptimizedResumeData> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const jobRequirements = jobData?.requirements?.join(', ') || '';
  const jobDescription = jobData?.description || '';
  const jobTitle = jobData?.title || 'Software Engineer';
  const company = jobData?.company || 'Target Company';

  const prompt = `You are an expert resume optimizer. Transform this resume for the specific job posting below.

CURRENT RESUME:
${resumeText}

JOB POSTING:
Position: ${jobTitle} at ${company}
Requirements: ${jobRequirements}
Description: ${jobDescription}

OPTIMIZATION TASKS:
1. **Format to Jake's clean, professional style** - Clean sections, proper spacing, ATS-friendly
2. **Add relevant keywords** from job requirements naturally into achievements
3. **Enhance bullet points** to show impact and results
4. **Tailor content** to match job requirements
5. **Improve technical skills** section with job-relevant technologies

IMPORTANT RULES:
- Keep all original experience but enhance descriptions
- Add numbers/metrics where possible (%, $, time saved, etc.)
- Use action verbs (Developed, Implemented, Optimized, etc.)
- Include keywords naturally, don't stuff them
- Professional, clean formatting
- ATS-friendly structure

OUTPUT: JSON format with this EXACT structure:
{
  "name": "Full Name",
  "email": "email@example.com", 
  "phone": "(555) 123-4567",
  "location": "City, State",
  "linkedin": "linkedin.com/in/username",
  "github": "github.com/username",
  "summary": "2-3 sentence professional summary with job-relevant keywords",
  "education": [
    {
      "school": "University Name",
      "degree": "Bachelor of Science in Computer Science",
      "location": "City, State", 
      "dates": "Aug 2018 - May 2021",
      "details": "Relevant coursework or honors if applicable"
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "location": "City, State",
      "dates": "Month Year - Month Year", 
      "achievements": [
        "Enhanced bullet point with metrics and job keywords",
        "Another achievement showing impact and results"
      ]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "technologies": "Tech Stack with job-relevant technologies",
      "dates": "Month Year - Month Year",
      "description": [
        "Project achievement with metrics",
        "Technical implementation details"
      ]
    }
  ],
  "skills": {
    "languages": ["Language1", "Language2"],
    "frameworks": ["Framework1", "Framework2"], 
    "tools": ["Tool1", "Tool2"],
    "other": ["Skill1", "Skill2"]
  }
}

Return ONLY the JSON object, no other text.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume optimizer specializing in ATS-friendly formatting and job-specific keyword optimization. Always return valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Failed to parse optimized resume data');
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to optimize resume');
  }
};

export const generatePDFFromOptimizedData = async (resumeData: OptimizedResumeData, fileName: string = 'optimized-resume.pdf') => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Set up fonts and colors
    pdf.setFont('helvetica', 'normal');
    
    // Helper function to add text with word wrap
    const addText = (text: string, x: number, y: number, options: any = {}) => {
      const fontSize = options.fontSize || 10;
      const fontStyle = options.fontStyle || 'normal';
      const maxWidth = options.maxWidth || contentWidth;
      
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontStyle);
      
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + (lines.length * fontSize * 0.5);
    };

    // Header - Name and Contact Info
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(resumeData.name, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const contactInfo = `${resumeData.phone} | ${resumeData.email} | ${resumeData.linkedin} | ${resumeData.github}`;
    pdf.text(contactInfo, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;

    if (resumeData.location) {
      pdf.text(resumeData.location, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;
    }

    // Professional Summary
    if (resumeData.summary) {
      yPosition = addSectionHeader(pdf, 'PROFESSIONAL SUMMARY', margin, yPosition);
      yPosition = addText(resumeData.summary, margin, yPosition) + 5;
    }

    // Education
    yPosition = addSectionHeader(pdf, 'EDUCATION', margin, yPosition);
    resumeData.education.forEach((edu) => {
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(edu.school, margin, yPosition);
      pdf.text(edu.dates, pageWidth - margin, yPosition, { align: 'right' });
      yPosition += 5;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text(edu.degree, margin, yPosition);
      pdf.text(edu.location, pageWidth - margin, yPosition, { align: 'right' });
      yPosition += 4;

      if (edu.details) {
        pdf.setFont('helvetica', 'normal');
        yPosition = addText(edu.details, margin, yPosition) + 3;
      }
      yPosition += 3;
    });

    // Experience
    yPosition = addSectionHeader(pdf, 'EXPERIENCE', margin, yPosition);
    resumeData.experience.forEach((exp) => {
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(exp.position, margin, yPosition);
      pdf.text(exp.dates, pageWidth - margin, yPosition, { align: 'right' });
      yPosition += 5;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text(exp.company, margin, yPosition);
      pdf.text(exp.location, pageWidth - margin, yPosition, { align: 'right' });
      yPosition += 4;

      pdf.setFont('helvetica', 'normal');
      exp.achievements.forEach((achievement) => {
        pdf.text('•', margin, yPosition);
        yPosition = addText(achievement, margin + 5, yPosition, { maxWidth: contentWidth - 5 }) + 2;
      });
      yPosition += 3;
    });

    // Projects
    if (resumeData.projects.length > 0) {
      yPosition = addSectionHeader(pdf, 'PROJECTS', margin, yPosition);
      resumeData.projects.forEach((project) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${project.name} | ${project.technologies}`, margin, yPosition);
        pdf.text(project.dates, pageWidth - margin, yPosition, { align: 'right' });
        yPosition += 5;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        project.description.forEach((desc) => {
          pdf.text('•', margin, yPosition);
          yPosition = addText(desc, margin + 5, yPosition, { maxWidth: contentWidth - 5 }) + 2;
        });
        yPosition += 3;
      });
    }

    // Technical Skills
    yPosition = addSectionHeader(pdf, 'TECHNICAL SKILLS', margin, yPosition);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    if (resumeData.skills.languages.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Languages: ', margin, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(resumeData.skills.languages.join(', '), margin + 25, yPosition);
      yPosition += 4;
    }

    if (resumeData.skills.frameworks.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Frameworks: ', margin, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(resumeData.skills.frameworks.join(', '), margin + 25, yPosition);
      yPosition += 4;
    }

    if (resumeData.skills.tools.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Tools: ', margin, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(resumeData.skills.tools.join(', '), margin + 25, yPosition);
      yPosition += 4;
    }

    // Save the PDF
    pdf.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

const addSectionHeader = (pdf: jsPDF, title: string, x: number, y: number): number => {
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(title, x, y);
  
  // Add underline
  const textWidth = pdf.getTextWidth(title);
  pdf.setLineWidth(0.5);
  pdf.line(x, y + 1, x + textWidth, y + 1);
  
  return y + 8;
};

export const generateOptimizedResume = async (resumeFile: File, jobData: any): Promise<void> => {
  try {
    // Step 1: Extract text from uploaded PDF
    console.log('📄 Extracting text from resume PDF...');
    const resumeText = await extractResumeTextFromPDF(resumeFile);
    
    if (!resumeText || resumeText.trim().length === 0) {
      throw new Error('No text could be extracted from the PDF');
    }

    // Step 2: Optimize resume with job-specific keywords using OpenAI
    console.log('🤖 Optimizing resume with AI and job keywords...');
    const optimizedData = await optimizeResumeWithJobData(resumeText, jobData);
    
    if (!optimizedData) {
      throw new Error('Failed to optimize resume data');
    }

    // Step 3: Generate professional PDF
    console.log('📄 Generating optimized PDF...');
    const fileName = `${optimizedData.name.replace(/\s+/g, '_')}_Resume_Optimized.pdf`;
    await generatePDFFromOptimizedData(optimizedData, fileName);
    
    console.log('✅ Resume optimization complete!');
    
  } catch (error) {
    console.error('Error in resume optimization:', error);
    throw error;
  }
}; 