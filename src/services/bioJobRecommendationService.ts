import { getUserProfile } from './userService';
import { searchJobsWithAI, type LinkedinJobResult } from './linkedinJobsApiTest';

// Types for bio analysis
export interface BioAnalysisResult {
  jobTitles: string[];
  skills: string[];
  locations: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  workPreferences: {
    remote: boolean;
    hybrid: boolean;
    onsite: boolean;
    fullTime: boolean;
    partTime: boolean;
    contract: boolean;
  };
  industries: string[];
  summary: string;
}

export interface SearchQuery {
  keywords: string[];
  location: string;
  seniority: string;
}

export interface AIJobRecommendation extends LinkedinJobResult {
  aiScore: number;
  matchReasons: string[];
  personalizedInsights: string;
  skillsGap: string[];
}

// Analyze user's bio text to extract job preferences
export const analyzeBio = async (bioText: string): Promise<BioAnalysisResult> => {
  console.log('🤖 Starting bio analysis...');
  
  if (!bioText || bioText.trim().length < 10) {
    console.log('❌ Bio text too short, using fallback analysis');
    return {
      jobTitles: ['Software Engineer'],
      skills: ['JavaScript', 'React'],
      locations: ['Remote'],
      experienceLevel: 'mid',
      workPreferences: {
        remote: true,
        hybrid: false,
        onsite: false,
        fullTime: true,
        partTime: false,
        contract: false,
      },
      industries: ['Technology'],
      summary: 'No bio provided - using default preferences'
    };
  }

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not found');
  }

  const prompt = `Analyze this user's bio/career description and extract job search preferences:

Bio: "${bioText}"

Return a JSON object with:
- jobTitles: array of 2-4 relevant job titles they might want
- skills: array of technical/professional skills mentioned or implied  
- locations: array of preferred work locations (include "Remote" if mentioned/implied)
- experienceLevel: "entry", "mid", "senior", or "executive" based on bio
- workPreferences: object with boolean flags for remote, hybrid, onsite, fullTime, partTime, contract
- industries: array of industries they seem interested in
- summary: brief summary of what kind of job they're looking for

Be practical and infer reasonable preferences even if not explicitly stated.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert career counselor and recruiter. Analyze bio text and extract job search preferences in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('🔍 OpenAI bio analysis response:', data.choices[0].message.content);

    // Clean the response content (remove markdown code blocks if present)
    let content = data.choices[0].message.content;
    if (content.includes('```')) {
      const match = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (match) {
        content = match[1];
      } else {
        const objectMatch = content.match(/\{[\s\S]*?\}/);
        if (objectMatch) {
          content = objectMatch[0];
        }
      }
    }

    console.log('🔍 Cleaned bio analysis content:', content.slice(0, 200) + '...');
    const analysisResult = JSON.parse(content) as BioAnalysisResult;
    
    console.log('✅ Bio analysis completed:', analysisResult);
    return analysisResult;

  } catch (error) {
    console.error('❌ Error analyzing bio:', error);
    
    // Fallback analysis if API fails
    return {
      jobTitles: bioText.toLowerCase().includes('frontend') || bioText.toLowerCase().includes('react') ? ['Frontend Developer'] :
                 bioText.toLowerCase().includes('backend') || bioText.toLowerCase().includes('server') ? ['Backend Developer'] :
                 bioText.toLowerCase().includes('fullstack') || bioText.toLowerCase().includes('full stack') ? ['Full Stack Developer'] :
                 ['Software Engineer'],
      skills: extractSkillsFromText(bioText),
      locations: bioText.toLowerCase().includes('remote') ? ['Remote'] : ['San Francisco, CA'],
      experienceLevel: bioText.toLowerCase().includes('senior') ? 'senior' :
                      bioText.toLowerCase().includes('junior') ? 'entry' : 'mid',
      workPreferences: {
        remote: bioText.toLowerCase().includes('remote'),
        hybrid: bioText.toLowerCase().includes('hybrid'),
        onsite: !bioText.toLowerCase().includes('remote'),
        fullTime: true,
        partTime: false,
        contract: bioText.toLowerCase().includes('contract') || bioText.toLowerCase().includes('freelance'),
      },
      industries: ['Technology'],
      summary: 'Analyzed from bio text (fallback)'
    };
  }
};

// Helper function to extract skills from text
const extractSkillsFromText = (text: string): string[] => {
  const commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'Go',
    'HTML', 'CSS', 'Angular', 'Vue', 'Next.js', 'Express', 'Django', 'Flask',
    'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'GCP',
    'Git', 'Linux', 'API', 'REST', 'GraphQL', 'Microservices', 'DevOps', 'CI/CD'
  ];
  
  const lowerText = text.toLowerCase();
  return commonSkills.filter(skill => 
    lowerText.includes(skill.toLowerCase()) ||
    lowerText.includes(skill.toLowerCase().replace('.', '')) ||
    lowerText.includes(skill.toLowerCase().replace('js', 'javascript'))
  );
};

// Generate search queries based on bio analysis
export const generateSearchQueries = (analysis: BioAnalysisResult): SearchQuery[] => {
  console.log('🔍 Generating search queries from bio analysis...');
  
  const queries: SearchQuery[] = [];
  
  // Create queries for each job title + location combination
  analysis.jobTitles.forEach(jobTitle => {
    analysis.locations.forEach(location => {
      queries.push({
        keywords: [jobTitle, ...analysis.skills.slice(0, 3)], // Job title + top 3 skills
        location: location,
        seniority: analysis.experienceLevel
      });
    });
  });

  // Add some broader queries for more results
  if (analysis.skills.length > 0) {
    analysis.locations.forEach(location => {
      queries.push({
        keywords: analysis.skills.slice(0, 4), // Top 4 skills
        location: location,
        seniority: analysis.experienceLevel
      });
    });
  }

  console.log(`🎯 Generated ${queries.length} search queries:`, queries);
  return queries.slice(0, 6); // Limit to 6 queries to control cost
};

// Score jobs with AI based on bio analysis
export const scoreJobsWithAI = async (jobs: LinkedinJobResult[], analysis: BioAnalysisResult): Promise<AIJobRecommendation[]> => {
  console.log(`🎯 Starting AI job scoring for ${jobs.length} jobs...`);
  
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not found');
  }

  // Process jobs in batches of 5 for better API performance
  const batchSize = 5;
  const batches = [];
  
  for (let i = 0; i < jobs.length; i += batchSize) {
    batches.push(jobs.slice(i, i + batchSize));
  }

  const scoredJobs: AIJobRecommendation[] = [];

  for (const batch of batches) {
    const prompt = `Score these job opportunities for a candidate based on their preferences:

CANDIDATE PROFILE:
- Preferred job titles: ${analysis.jobTitles.join(', ')}
- Skills: ${analysis.skills.join(', ')}
- Experience level: ${analysis.experienceLevel}
- Preferred locations: ${analysis.locations.join(', ')}
- Work preferences: ${JSON.stringify(analysis.workPreferences)}
- Target industries: ${analysis.industries.join(', ')}
- Career summary: ${analysis.summary}

JOBS TO SCORE:
${batch.map((job, idx) => `
${idx + 1}. ${job.title} at ${job.companyName}
   Location: ${job.location}
   Description: ${job.descriptionText?.slice(0, 200)}...
   Employment Type: ${job.employmentType || 'Not specified'}
   Salary: ${job.salaryInfo?.join(' - ') || 'Not specified'}
`).join('\n')}

For each job, return a JSON array with objects containing:
- jobIndex: number (1-${batch.length})
- score: number (0-100, how well this job matches their preferences)
- matchReasons: array of 2-4 specific reasons why this job is a good match
- personalizedInsights: string (1-2 sentences of personalized advice about this opportunity)
- skillsGap: array of skills they might need to develop for this role

Be practical and consider all factors: job title match, skills alignment, location fit, experience level, etc.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert career counselor and technical recruiter. Score job opportunities based on candidate fit and provide detailed insights.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      
      console.log(`🔍 RAW OpenAI response for batch:`, data.choices[0].message.content.slice(0, 300) + '...');
      
      // Clean the response content (remove markdown code blocks if present)
      let content = data.choices[0].message.content;
      if (content.includes('```')) {
        const match = content.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
        if (match) {
          content = match[1];
        } else {
          const arrayMatch = content.match(/\[[\s\S]*?\]/);
          if (arrayMatch) {
            content = arrayMatch[0];
          }
        }
      }
      
      console.log('🔍 Cleaned content for parsing:', content.slice(0, 200) + '...');
      const batchScores = JSON.parse(content);
      
      // Map scores back to jobs
      batchScores.forEach((jobScore: any) => {
        const jobIndex = jobScore.jobIndex - 1; // Convert to 0-based index
        if (jobIndex >= 0 && jobIndex < batch.length) {
          const job = batch[jobIndex];
          scoredJobs.push({
            ...job,
            aiScore: jobScore.score,
            matchReasons: jobScore.matchReasons || [],
            personalizedInsights: jobScore.personalizedInsights || 'Good opportunity to consider',
            skillsGap: jobScore.skillsGap || []
          });
        }
      });

    } catch (error) {
      console.error('❌ Error scoring job batch:', error);
      
      // Fallback scoring for this batch
      batch.forEach((job, idx) => {
        const fallbackScore = calculateFallbackScore(job, analysis);
        scoredJobs.push({
          ...job,
          aiScore: fallbackScore,
          matchReasons: ['Title match', 'Skills alignment'],
          personalizedInsights: 'This role could be a good fit based on your background.',
          skillsGap: []
        });
      });
    }
  }

  console.log(`✅ Scored ${scoredJobs.length} jobs with AI`);
  return scoredJobs.sort((a, b) => b.aiScore - a.aiScore); // Sort by score descending
};

// Fallback scoring function
const calculateFallbackScore = (job: LinkedinJobResult, analysis: BioAnalysisResult): number => {
  let score = 50; // Base score
  
  // Job title match
  const jobTitle = job.title?.toLowerCase() || '';
  const hasMatching = analysis.jobTitles.some(title => 
    jobTitle.includes(title.toLowerCase()) || title.toLowerCase().includes(jobTitle)
  );
  if (hasMatching) score += 20;
  
  // Skills match
  const description = job.descriptionText?.toLowerCase() || '';
  const skillMatches = analysis.skills.filter(skill => 
    description.includes(skill.toLowerCase())
  ).length;
  score += Math.min(skillMatches * 5, 20);
  
  // Location match
  const jobLocation = job.location?.toLowerCase() || '';
  const locationMatch = analysis.locations.some(loc => 
    loc.toLowerCase() === 'remote' || jobLocation.includes(loc.toLowerCase())
  );
  if (locationMatch) score += 10;
  
  return Math.min(Math.max(score, 30), 95); // Keep between 30-95
};

// Main function to generate bio-based job recommendations
export const generateBioJobRecommendations = async (userId: string): Promise<AIJobRecommendation[]> => {
  console.log('🚀 Starting bio-based job recommendation generation...');
  
  try {
    // 1. Get user profile with bio
    console.log('📄 Fetching user profile...');
    let userProfile = await getUserProfile(userId);
    
    console.log('🔍 BIO DEBUG: Retrieved profile:', userProfile);
    console.log('🔍 BIO DEBUG: Bio field value:', userProfile?.bio);
    console.log('🔍 BIO DEBUG: Bio field type:', typeof userProfile?.bio);
    
    // Auto-create profile if it doesn't exist
    if (!userProfile) {
      console.log('📝 User profile not found, creating default profile...');
      try {
        const { ensureUserProfile } = await import('./userService');
        userProfile = await ensureUserProfile(userId);
        console.log('✅ Default user profile created');
      } catch (createError) {
        console.error('❌ Failed to create user profile:', createError);
        throw new Error('Failed to create user profile. Please try again or contact support.');
      }
    }
    
    if (!userProfile || !userProfile.bio || userProfile.bio.trim().length < 10) {
      console.log('❌ Bio not found or too short:', userProfile?.bio);
      throw new Error('Please add your bio in Edit Profile first. Describe what kind of job you\'re looking for (e.g., "I am looking for frontend developer roles").');
    }
    
    console.log('📄 User bio preview:', userProfile.bio.slice(0, 100) + '...');
    
    // 2. Analyze bio with AI
    console.log('🤖 Analyzing bio with AI...');
    const bioAnalysis = await analyzeBio(userProfile.bio);
    
    // 3. Generate search queries
    console.log('🔍 Generating LinkedIn search queries...');
    const searchQueries = generateSearchQueries(bioAnalysis);
    
    // 4. Search LinkedIn for jobs
    console.log('🔍 Searching LinkedIn for jobs...');
    const allJobs: LinkedinJobResult[] = [];
    
    for (const query of searchQueries) {
      try {
        console.log(`🔍 Searching: ${query.keywords.join(' ')} in ${query.location}`);
        const jobs = await searchJobsWithAI({
          jobTitles: query.keywords,
          skills: [],
          locations: [query.location],
          seniority: query.seniority
        });
        allJobs.push(...jobs);
      } catch (error) {
        console.error(`❌ Error searching for query:`, query, error);
      }
    }
    
    // 5. Remove duplicates
    const uniqueJobs = Array.from(
      new Map(allJobs.map(job => [job.id, job])).values()
    );
    
    console.log(`📊 Found ${uniqueJobs.length} unique jobs across ${searchQueries.length} searches`);
    
    // 6. Score jobs with AI
    console.log('🎯 Scoring jobs with AI...');
    const scoredJobs = await scoreJobsWithAI(uniqueJobs, bioAnalysis);
    
    // 7. Return top recommendations
    const topRecommendations = scoredJobs.slice(0, 15); // Top 15 recommendations
    
    console.log(`🎉 Generated ${topRecommendations.length} bio-based job recommendations!`);
    return topRecommendations;
    
  } catch (error) {
    console.error('❌ Error generating bio-based job recommendations:', error);
    throw error;
  }
}; 