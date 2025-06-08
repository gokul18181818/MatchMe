import { getActiveResume } from './resumeService';
import { generateLinkedInSearchURL, searchJobsWithAI, type LinkedinJobResult } from './linkedinJobsApiTest';

// OpenAI API Configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Resume Analysis Result Interface
export interface ResumeAnalysisResult {
  jobTitles: string[];
  skills: {
    technical: string[];
    languages: string[];
    frameworks: string[];
    tools: string[];
    soft: string[];
  };
  experienceLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'director' | 'executive';
  preferredLocations: string[];
  industryPreferences: string[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  workPreferences: {
    remote: boolean;
    hybrid: boolean;
    onsite: boolean;
    fullTime: boolean;
    partTime: boolean;
    contract: boolean;
  };
  summary: string;
  strengths: string[];
  targetCompanies?: string[];
}

// Job Recommendation with AI Scoring
export interface AIJobRecommendation extends LinkedinJobResult {
  aiScore: number;
  matchReasons: string[];
  skillsMatch: {
    matched: string[];
    missing: string[];
    percentage: number;
  };
  experienceMatch: boolean;
  locationMatch: boolean;
  salaryMatch: boolean;
  personalizedInsights: string;
}

/**
 * Analyze user's resume using OpenAI to extract job preferences
 */
export const analyzeResumeForJobSearch = async (resumeText: string): Promise<ResumeAnalysisResult> => {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file');
  }

  console.log('🤖 Starting AI resume analysis...');

  try {
    const prompt = `
Analyze this resume and extract job search preferences in the following JSON format:

{
  "jobTitles": ["Primary Job Title", "Secondary Job Title", "Alternative Title"],
  "skills": {
    "technical": ["programming languages, databases, etc."],
    "languages": ["Python", "JavaScript", etc."],
    "frameworks": ["React", "Django", etc.],
    "tools": ["Docker", "Git", etc."],
    "soft": ["leadership", "communication", etc.]
  },
  "experienceLevel": "entry|junior|mid|senior|lead|director|executive",
  "preferredLocations": ["City, State", "Remote", etc.],
  "industryPreferences": ["Technology", "Healthcare", etc.],
  "salaryRange": {
    "min": 80000,
    "max": 120000,
    "currency": "USD"
  },
  "workPreferences": {
    "remote": true,
    "hybrid": true,
    "onsite": false,
    "fullTime": true,
    "partTime": false,
    "contract": false
  },
  "summary": "Brief summary of candidate's background",
  "strengths": ["Top 3-5 key strengths"],
  "targetCompanies": ["Companies that would be a good fit"]
}

Resume Text:
${resumeText}

Provide ONLY the JSON response, no additional text.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert career counselor and job search strategist. Analyze resumes to extract job search preferences and career insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('🔍 OpenAI raw response:', data.choices[0].message.content);
    
    // Clean the response content (remove markdown code blocks if present)
    let content = data.choices[0].message.content;
    if (content.includes('```')) {
      // Extract JSON from markdown code blocks
      const match = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (match) {
        content = match[1];
      } else {
        // If no proper code block, try to extract object from the content
        const objectMatch = content.match(/\{[\s\S]*?\}/);
        if (objectMatch) {
          content = objectMatch[0];
        }
      }
    }
    
    console.log('🔍 Cleaned resume analysis content for parsing:', content.slice(0, 200) + '...');
    const analysisResult = JSON.parse(content) as ResumeAnalysisResult;
    
    console.log('✅ Resume analysis completed:', analysisResult);
    return analysisResult;

  } catch (error) {
    console.error('❌ Resume analysis failed:', error);
    throw new Error('Failed to analyze resume with AI');
  }
};

/**
 * Generate LinkedIn search queries based on resume analysis
 */
export const generateJobSearchQueries = (analysis: ResumeAnalysisResult): Array<{
  keywords: string;
  location: string;
  experienceLevel: string;
  datePosted: string;
  searchName: string;
}> => {
  const queries = [];
  
  // Map our experience levels to LinkedIn's codes
  const linkedinExperienceMap = {
    'entry': '2',
    'junior': '2',
    'mid': '3',
    'senior': '4',
    'lead': '4',
    'director': '5',
    'executive': '6'
  };

  const experienceLevel = linkedinExperienceMap[analysis.experienceLevel] || '4';

  // Generate primary job title searches
  analysis.jobTitles.slice(0, 2).forEach((jobTitle, index) => {
    const topSkills = analysis.skills.technical.slice(0, 3).join(' ');
    
    analysis.preferredLocations.slice(0, 2).forEach(location => {
      queries.push({
        keywords: `${jobTitle} ${topSkills}`,
        location: location,
        experienceLevel: experienceLevel,
        datePosted: 'r604800', // Past week
        searchName: `${jobTitle} in ${location}`
      });
    });
  });

  // Add industry-specific searches
  if (analysis.industryPreferences.length > 0) {
    const primaryIndustry = analysis.industryPreferences[0];
    const primaryLocation = analysis.preferredLocations[0] || 'United States';
    
    queries.push({
      keywords: `${analysis.jobTitles[0]} ${primaryIndustry}`,
      location: primaryLocation,
      experienceLevel: experienceLevel,
      datePosted: 'r604800',
      searchName: `${primaryIndustry} roles`
    });
  }

  // Add skills-based search
  if (analysis.skills.frameworks.length > 0) {
    const topFrameworks = analysis.skills.frameworks.slice(0, 2).join(' ');
    const primaryLocation = analysis.preferredLocations[0] || 'United States';
    
    queries.push({
      keywords: `${topFrameworks} Developer`,
      location: primaryLocation,
      experienceLevel: experienceLevel,
      datePosted: 'r604800',
      searchName: `${topFrameworks} specialist`
    });
  }

  console.log('🔍 Generated search queries:', queries);
  return queries.slice(0, 5); // Limit to 5 searches to control cost
};

/**
 * Score jobs using AI based on resume fit
 */
export const scoreJobsWithAI = async (
  jobs: LinkedinJobResult[],
  resumeAnalysis: ResumeAnalysisResult,
  resumeText: string
): Promise<AIJobRecommendation[]> => {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    throw new Error('OpenAI API key not configured');
  }

  console.log('🎯 Starting AI job scoring...');

  const scoredJobs: AIJobRecommendation[] = [];

  // Process jobs in batches to avoid token limits
  const batchSize = 3;
  for (let i = 0; i < jobs.length; i += batchSize) {
    const batch = jobs.slice(i, i + batchSize);
    
    try {
      const prompt = `
You are an expert recruiter. Score how well each job matches this candidate's resume.

CANDIDATE PROFILE:
${JSON.stringify(resumeAnalysis, null, 2)}

RESUME TEXT:
${resumeText.slice(0, 2000)}

JOBS TO SCORE:
${JSON.stringify(batch.map(job => ({
  id: job.id,
  title: job.title,
  company: job.companyName,
  location: job.location,
  description: job.descriptionText?.slice(0, 500) || 'No description',
  requirements: job.descriptionText?.slice(0, 1000) || '',
  salary: job.salaryInfo,
  employmentType: job.employmentType
})), null, 2)}

For each job, provide a JSON response with this structure:
{
  "jobId": "job_id_here",
  "aiScore": 85,
  "matchReasons": ["Strong React skills match", "Location preference aligned"],
  "skillsMatch": {
    "matched": ["React", "TypeScript"],
    "missing": ["Python", "AWS"],
    "percentage": 75
  },
  "experienceMatch": true,
  "locationMatch": true,
  "salaryMatch": true,
  "personalizedInsights": "This role at [Company] is perfect for your React expertise. The team focuses on frontend architecture, which aligns with your background in building scalable web applications."
}

Respond with an array of job scores. Only JSON, no additional text.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert technical recruiter who specializes in matching candidates to ideal job opportunities.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        console.warn(`Batch ${i} scoring failed:`, response.status);
        // Add jobs with default scoring if AI fails
        batch.forEach(job => {
          scoredJobs.push({
            ...job,
            aiScore: 70, // Default score
            matchReasons: ['Unable to analyze - using default scoring'],
            skillsMatch: { matched: [], missing: [], percentage: 70 },
            experienceMatch: true,
            locationMatch: true,
            salaryMatch: true,
            personalizedInsights: 'This position may be a good fit based on your background.'
          });
        });
        continue;
      }

      const data = await response.json();
      
      console.log(`🔍 RAW OpenAI response for batch ${i}:`, data.choices[0].message.content.slice(0, 300) + '...');
      
      // Clean the response content (remove markdown code blocks if present)
      let content = data.choices[0].message.content;
      if (content.includes('```')) {
        console.log(`🧹 Cleaning markdown blocks from batch ${i} response...`);
        // Extract JSON from markdown code blocks
        const match = content.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
        if (match) {
          content = match[1];
          console.log(`✅ Extracted JSON from code block for batch ${i}`);
        } else {
          // If no proper code block, try to extract array from the content
          const arrayMatch = content.match(/\[[\s\S]*?\]/);
          if (arrayMatch) {
            content = arrayMatch[0];
            console.log(`✅ Extracted array from content for batch ${i}`);
          } else {
            console.warn(`⚠️ Could not extract JSON from markdown for batch ${i}`);
          }
        }
      }
      
      console.log(`🔍 Cleaned content for batch ${i}:`, content.slice(0, 200) + '...');
      
      try {
        const batchScores = JSON.parse(content);
        console.log(`✅ Successfully parsed JSON for batch ${i}:`, batchScores.length, 'scores');
      } catch (parseError) {
        console.error(`❌ JSON parse failed for batch ${i}:`, parseError);
        console.error(`❌ Content that failed to parse:`, content);
        throw parseError;
      }
      
      const batchScores = JSON.parse(content);

      // Merge scores with original job data
      batch.forEach(job => {
        const score = batchScores.find((s: any) => s.jobId === job.id);
        if (score) {
          scoredJobs.push({
            ...job,
            aiScore: score.aiScore,
            matchReasons: score.matchReasons,
            skillsMatch: score.skillsMatch,
            experienceMatch: score.experienceMatch,
            locationMatch: score.locationMatch,
            salaryMatch: score.salaryMatch,
            personalizedInsights: score.personalizedInsights
          });
        }
      });

      // Rate limiting - wait between batches
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.warn(`Batch ${i} scoring error:`, error);
      // Add jobs with default scoring if batch fails
      batch.forEach(job => {
        scoredJobs.push({
          ...job,
          aiScore: 70,
          matchReasons: ['Scoring unavailable'],
          skillsMatch: { matched: [], missing: [], percentage: 70 },
          experienceMatch: true,
          locationMatch: true,
          salaryMatch: true,
          personalizedInsights: 'This position may be a good fit based on your background.'
        });
      });
    }
  }

  console.log(`✅ Scored ${scoredJobs.length} jobs with AI`);
  return scoredJobs.sort((a, b) => b.aiScore - a.aiScore);
};

/**
 * Complete AI-powered job recommendation pipeline
 */
export const generateAIJobRecommendations = async (userId: string): Promise<{
  jobs: AIJobRecommendation[];
  analysis: ResumeAnalysisResult;
  searchQueries: any[];
  summary: {
    totalJobs: number;
    avgScore: number;
    topCompanies: string[];
    coverage: string;
  };
}> => {
  console.log('🚀 Starting AI job recommendation generation...');

  try {
    // Step 1: Get user's active resume
    const resume = await getActiveResume(userId);
    if (!resume) {
      throw new Error('No active resume found. Please upload a resume first.');
    }

    console.log('📄 Found active resume:', resume.title);
    console.log('📄 Resume text preview:', resume.resume_text.slice(0, 200) + '...');

    // Step 2: Analyze resume with AI
    const analysis = await analyzeResumeForJobSearch(resume.resume_text);

    // Step 3: Generate search queries  
    const searchQueries = generateJobSearchQueries(analysis);
    
    // If no search queries generated, use fallback
    if (searchQueries.length === 0) {
      console.log('⚠️ No search queries generated from analysis, using fallback queries...');
      const fallbackQueries = [
        {
          keywords: 'Frontend Developer React',
          location: 'San Francisco, CA',
          experienceLevel: '4',
          datePosted: 'r604800',
          searchName: 'Frontend Developer (fallback)'
        },
        {
          keywords: 'Software Engineer JavaScript',
          location: 'Remote',
          experienceLevel: '4', 
          datePosted: 'r604800',
          searchName: 'Software Engineer (fallback)'
        }
      ];
      searchQueries.push(...fallbackQueries);
    }

    // Step 4: Search for jobs using LinkedIn API
    console.log('🔍 Searching LinkedIn for jobs...');
    const allJobs: LinkedinJobResult[] = [];
    
    for (const query of searchQueries) {
      try {
        console.log(`🔍 Searching: ${query.searchName}`);
        const searchUrl = generateLinkedInSearchURL(query);
        
        // For now, use the existing searchJobsWithAI function
        // In production, you'd want a more direct API call
        const queryJobs = await searchJobsWithAI({
          jobTitles: [query.keywords],
          skills: analysis.skills.technical,
          locations: [query.location],
          seniority: analysis.experienceLevel
        });
        
        allJobs.push(...queryJobs);
        
        // Rate limiting between searches
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.warn(`Search failed for ${query.searchName}:`, error);
      }
    }

    // Step 5: Remove duplicates
    const uniqueJobs = allJobs.filter((job, index, self) => 
      index === self.findIndex(j => j.id === job.id)
    );

    console.log(`📊 Found ${uniqueJobs.length} unique jobs across ${searchQueries.length} searches`);

    // Step 6: Score jobs with AI
    const scoredJobs = await scoreJobsWithAI(uniqueJobs, analysis, resume.resume_text);

    // Step 7: Generate summary
    const topJobs = scoredJobs.slice(0, 10);
    const avgScore = topJobs.reduce((sum, job) => sum + job.aiScore, 0) / topJobs.length;
    const topCompanies = [...new Set(topJobs.map(job => job.companyName))].slice(0, 5);

    const summary = {
      totalJobs: scoredJobs.length,
      avgScore: Math.round(avgScore),
      topCompanies,
      coverage: `${searchQueries.length} searches across ${analysis.preferredLocations.length} locations`
    };

    console.log('✅ AI job recommendations generated successfully');
    console.log('📈 Summary:', summary);

    return {
      jobs: topJobs,
      analysis,
      searchQueries,
      summary
    };

  } catch (error) {
    console.error('❌ AI job recommendation generation failed:', error);
    throw error;
  }
};

/**
 * Quick test function for AI job recommendations
 */
export const testAIJobRecommendations = async (userId: string) => {
  try {
    console.log('🧪 Testing AI job recommendations...');
    const result = await generateAIJobRecommendations(userId);
    
    console.log('\n🎯 AI Job Recommendations Test Results:');
    console.log(`📊 Total jobs found: ${result.summary.totalJobs}`);
    console.log(`⭐ Average match score: ${result.summary.avgScore}%`);
    console.log(`🏢 Top companies: ${result.summary.topCompanies.join(', ')}`);
    console.log(`🔍 Search coverage: ${result.summary.coverage}`);
    
    console.log('\n🥇 Top 3 recommendations:');
    result.jobs.slice(0, 3).forEach((job, i) => {
      console.log(`\n${i + 1}. ${job.title} at ${job.companyName}`);
      console.log(`   Score: ${job.aiScore}%`);
      console.log(`   Location: ${job.location}`);
      console.log(`   Match reasons: ${job.matchReasons.join(', ')}`);
      console.log(`   Skills match: ${job.skillsMatch.percentage}%`);
    });

    return result;
  } catch (error) {
    console.error('❌ AI job recommendations test failed:', error);
    throw error;
  }
}; 