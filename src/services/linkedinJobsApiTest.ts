// Test service for Apify LinkedIn Jobs Scraper API
// Actor ID: hKByXkMQaC5Qt9UMN (curious_coder/linkedin-jobs-scraper)

export interface LinkedinJobResult {
  id: string;
  link: string;
  title: string;
  companyName: string;
  companyLinkedinUrl?: string;
  companyLogo?: string;
  location: string;
  salaryInfo?: string[];
  postedAt?: string;
  benefits?: string[];
  descriptionHtml: string;
  descriptionText: string;
  applicantsCount?: string;
  applyUrl?: string;
  jobPosterName?: string;
  jobPosterTitle?: string;
  jobPosterPhoto?: string;
  jobPosterProfileUrl?: string;
  seniorityLevel?: string;
  employmentType?: string;
  jobFunction?: string;
  industries?: string;
  companyDescription?: string;
  companyWebsite?: string;
  companyEmployeesCount?: number;
}

interface ApifyJobScraperInput {
  urls: string[];
  scrapeCompany: boolean;
  count: number;
}

interface ApifyRunResponse {
  data: {
    id: string;
    defaultDatasetId: string;
    status: string;
  };
}

interface ApifyDatasetResponse {
  data: LinkedinJobResult[];
}

const APIFY_API_TOKEN = import.meta.env.VITE_APIFY_API_TOKEN;
const LINKEDIN_JOBS_ACTOR_ID = 'hKByXkMQaC5Qt9UMN'; // curious_coder/linkedin-jobs-scraper

/**
 * Test the Apify LinkedIn Jobs Scraper API
 */
export const testLinkedInJobsScraper = async (): Promise<LinkedinJobResult[]> => {
  if (!APIFY_API_TOKEN || APIFY_API_TOKEN === 'your_token_here') {
    throw new Error('Apify API token not configured. Please add VITE_APIFY_API_TOKEN to your .env file');
  }

  console.log('🧪 Testing Apify LinkedIn Jobs Scraper...');
  console.log('🔑 API Token configured:', APIFY_API_TOKEN ? 'Yes' : 'No');

  // Test with a simple frontend developer search
  const testInput: ApifyJobScraperInput = {
    urls: [
      'https://www.linkedin.com/jobs/search/?keywords=Frontend%20Developer&location=San%20Francisco%2C%20CA&geoId=90000084&f_TPR=r86400&position=1&pageNum=0'
    ],
    scrapeCompany: true,
    count: 100 // Minimum required by this actor
  };

  try {
    console.log('📤 Sending request to Apify...');
    console.log('🔍 Search URL:', testInput.urls[0]);
    
    // Start the Actor run
    const runResponse = await fetch(
      `https://api.apify.com/v2/acts/${LINKEDIN_JOBS_ACTOR_ID}/run-sync-get-dataset-items`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${APIFY_API_TOKEN}`
        },
        body: JSON.stringify(testInput)
      }
    );

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      console.error('❌ Apify API error:', runResponse.status, errorText);
      throw new Error(`Apify API failed: ${runResponse.status} - ${errorText}`);
    }

    const results: LinkedinJobResult[] = await runResponse.json();
    
    // Check if the response contains an error
    if (results.length > 0 && results[0].hasOwnProperty('error')) {
      const errorObj = results[0] as any;
      console.error('❌ Actor returned error:', errorObj.error);
      throw new Error(`LinkedIn Jobs Scraper error: ${errorObj.error}`);
    }
    
    console.log('✅ Apify API successful!');
    console.log('📊 Jobs found:', results.length);
    
    // Debug: Log the raw API response structure
    console.log('🔍 Raw API Response (first 2 jobs):', results.slice(0, 2));
    if (results.length > 0) {
      console.log('🔍 First job object keys:', Object.keys(results[0]));
      console.log('🔍 First job object:', results[0]);
    }
    
    // Log sample results
    results.slice(0, 2).forEach((job, index) => {
      console.log(`\n🔍 Job ${index + 1}:`);
      console.log(`   Title: ${job.title}`);
      console.log(`   Company: ${job.companyName}`);
      console.log(`   Location: ${job.location}`);
      console.log(`   Salary: ${job.salaryInfo?.join(' - ') || 'Not specified'}`);
      console.log(`   Applicants: ${job.applicantsCount || 'Unknown'}`);
      console.log(`   Posted: ${job.postedAt || 'Unknown'}`);
    });

    return results;

  } catch (error) {
    console.error('❌ LinkedIn Jobs Scraper test failed:', error);
    throw error;
  }
};

/**
 * Generate LinkedIn search URL for specific job criteria
 */
export const generateLinkedInSearchURL = (params: {
  keywords: string;
  location?: string;
  experienceLevel?: string;
  datePosted?: string;
}) => {
  const baseUrl = 'https://www.linkedin.com/jobs/search/';
  const urlParams = new URLSearchParams();

  urlParams.append('keywords', params.keywords);
  
  if (params.location) {
    urlParams.append('location', params.location);
  }
  
  if (params.experienceLevel) {
    // LinkedIn experience levels: 1=Internship, 2=Entry, 3=Associate, 4=Mid-Senior, 5=Director, 6=Executive
    urlParams.append('f_E', params.experienceLevel);
  }
  
  if (params.datePosted) {
    // LinkedIn date filters: r86400=Past 24 hours, r604800=Past week, r2592000=Past month
    urlParams.append('f_TPR', params.datePosted);
  }

  urlParams.append('position', '1');
  urlParams.append('pageNum', '0');

  return `${baseUrl}?${urlParams.toString()}`;
};

/**
 * Search for jobs using AI-generated parameters
 */
export const searchJobsWithAI = async (resumeAnalysis: {
  jobTitles: string[];
  skills: string[];
  locations: string[];
  seniority: string;
}) => {
  console.log('🤖 AI-powered job search starting...');
  console.log('📋 Search criteria:', resumeAnalysis);

  const searchPromises = resumeAnalysis.jobTitles.map(async (jobTitle) => {
    const searchUrl = generateLinkedInSearchURL({
      keywords: `${jobTitle} ${resumeAnalysis.skills.slice(0, 3).join(' ')}`,
      location: resumeAnalysis.locations[0] || 'United States',
      experienceLevel: mapSeniorityToLinkedIn(resumeAnalysis.seniority),
      datePosted: 'r604800' // Past week
    });

    console.log(`🔍 Searching for: ${jobTitle}`);
    console.log(`🔗 URL: ${searchUrl}`);

    const input: ApifyJobScraperInput = {
      urls: [searchUrl],
      scrapeCompany: true,
      count: 100 // Minimum required by this actor
    };

    const runResponse = await fetch(
      `https://api.apify.com/v2/acts/${LINKEDIN_JOBS_ACTOR_ID}/run-sync-get-dataset-items`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${APIFY_API_TOKEN}`
        },
        body: JSON.stringify(input)
      }
    );

    if (!runResponse.ok) {
      console.warn(`⚠️ Search failed for ${jobTitle}:`, runResponse.status);
      return [];
    }

    const results: LinkedinJobResult[] = await runResponse.json();
    console.log(`✅ Found ${results.length} jobs for ${jobTitle}`);
    return results;
  });

  const allResults = await Promise.all(searchPromises);
  const flatResults = allResults.flat();
  
  // Remove duplicates by job ID
  const uniqueJobs = flatResults.filter((job, index, self) => 
    index === self.findIndex(j => j.id === job.id)
  );

  console.log(`🎯 Total unique jobs found: ${uniqueJobs.length}`);
  return uniqueJobs;
};

/**
 * Map seniority level to LinkedIn experience level codes
 */
const mapSeniorityToLinkedIn = (seniority: string): string => {
  const mapping: Record<string, string> = {
    'entry': '2',
    'junior': '2', 
    'associate': '3',
    'mid': '4',
    'senior': '4',
    'lead': '4',
    'director': '5',
    'executive': '6'
  };
  
  const key = seniority.toLowerCase();
  return mapping[key] || '4'; // Default to mid-senior
};

/**
 * Test with multiple job searches (simulate daily job generation)
 */
export const testDailyJobGeneration = async () => {
  console.log('🗓️ Testing daily job generation simulation...');
  
  // Simulate AI analysis results for a frontend developer
  const mockResumeAnalysis = {
    jobTitles: ['Frontend Developer', 'React Developer'],
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS'],
    locations: ['San Francisco, CA', 'Remote'],
    seniority: 'mid-senior'
  };

  try {
    const jobs = await searchJobsWithAI(mockResumeAnalysis);
    
    console.log('\n📊 Daily Job Generation Results:');
    console.log(`   Total jobs found: ${jobs.length}`);
    console.log(`   Companies: ${[...new Set(jobs.map(j => j.companyName))].length}`);
    console.log(`   Locations: ${[...new Set(jobs.map(j => j.location))].length}`);
    
    // Sample output
    console.log('\n🎯 Sample jobs:');
    jobs.slice(0, 3).forEach((job, i) => {
      console.log(`\n   ${i + 1}. ${job.title} at ${job.companyName}`);
      console.log(`      📍 ${job.location}`);
      console.log(`      💰 ${job.salaryInfo?.join(' - ') || 'Salary not specified'}`);
      console.log(`      👥 ${job.applicantsCount || 'Unknown'} applicants`);
    });

    return jobs;
  } catch (error) {
    console.error('❌ Daily job generation test failed:', error);
    throw error;
  }
}; 