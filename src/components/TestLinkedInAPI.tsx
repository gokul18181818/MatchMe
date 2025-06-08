import React, { useState } from 'react';
import { testLinkedInJobsScraper, testDailyJobGeneration, type LinkedinJobResult } from '../services/linkedinJobsApiTest';
import { testAIJobRecommendations, generateAIJobRecommendations, type AIJobRecommendation } from '../services/aiJobRecommendationService';
import { createResumeFromText, getActiveResume } from '../services/resumeService';
import { useAuth } from '../contexts/AuthContext';

const TestLinkedInAPI: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<LinkedinJobResult[]>([]);
  const [aiResults, setAiResults] = useState<AIJobRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [testType, setTestType] = useState<'basic' | 'daily' | 'ai' | null>(null);

  const handleBasicTest = async () => {
    setIsLoading(true);
    setError(null);
    setTestType('basic');
    setResults([]);
    setAiResults([]);

    try {
      console.log('🚀 Starting basic LinkedIn API test...');
      const jobResults = await testLinkedInJobsScraper();
      setResults(jobResults);
      console.log('✅ Basic test completed successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('❌ Basic test failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDailyTest = async () => {
    setIsLoading(true);
    setError(null);
    setTestType('daily');
    setResults([]);
    setAiResults([]);

    try {
      console.log('🚀 Starting daily job generation test...');
      const jobResults = await testDailyJobGeneration();
      setResults(jobResults);
      console.log('✅ Daily job generation test completed successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('❌ Daily job generation test failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAITest = async () => {
    if (!user) {
      setError('Please sign in to test AI job recommendations');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTestType('ai');
    setResults([]);
    setAiResults([]);

    try {
      console.log('🚀 Starting AI job recommendations test...');
      
      // Check if user has a resume, if not create a sample one
      let activeResume = await getActiveResume(user.id);
      
      // For testing, always create a fresh sample resume to ensure quality AI analysis
      if (!activeResume || activeResume.resume_text.includes('um i im jsut testing')) {
        console.log('📄 Creating/updating sample resume for AI testing...');
        const sampleResume = `
John Doe
Software Engineer
Email: john.doe@email.com
Phone: (555) 123-4567
Location: San Francisco, CA

SUMMARY
Experienced Frontend Developer with 5+ years of experience building modern web applications using React, TypeScript, and Node.js. Passionate about creating user-friendly interfaces and scalable architectures.

EXPERIENCE
Senior Frontend Developer - Tech Corp (2021-Present)
• Led development of React-based dashboard serving 10K+ users
• Implemented TypeScript migration improving code quality by 40%
• Built responsive components using Tailwind CSS and Styled Components
• Collaborated with backend team to integrate REST APIs and GraphQL

Frontend Developer - StartupXYZ (2019-2021)
• Developed e-commerce platform using React, Redux, and Node.js
• Optimized application performance resulting in 30% faster load times
• Implemented automated testing with Jest and Cypress
• Worked in Agile environment with CI/CD pipelines

SKILLS
Languages: JavaScript, TypeScript, Python, HTML, CSS
Frameworks: React, Next.js, Node.js, Express, Django
Tools: Git, Docker, AWS, Webpack, Vite
Databases: PostgreSQL, MongoDB, Redis

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley (2015-2019)

PREFERENCES
Looking for Senior Frontend or Full Stack roles in technology companies, preferably in San Francisco Bay Area or remote. Interested in fintech, healthcare, and AI/ML applications.
        `;

        activeResume = await createResumeFromText(user.id, sampleResume.trim(), 'Sample Resume for Testing');
        console.log('✅ Sample resume created successfully');
      }

      const result = await generateAIJobRecommendations(user.id);
      setAiResults(result.jobs);
      console.log('✅ AI job recommendations test completed successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('❌ AI job recommendations test failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🧪 LinkedIn Jobs API Test
        </h1>
        <p className="text-gray-600 mb-6">
          Test the Apify LinkedIn Jobs Scraper integration and verify the API connection.
        </p>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleBasicTest}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading && testType === 'basic' ? '🔄 Running Basic Test...' : '🧪 Run Basic Test'}
            </button>

            <button
              onClick={handleDailyTest}
              disabled={isLoading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading && testType === 'daily' ? '🔄 Running Daily Test...' : '🗓️ Test Daily Generation'}
            </button>

            <button
              onClick={handleAITest}
              disabled={isLoading || !user}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading && testType === 'ai' ? '🔄 Running AI Test...' : '🤖 Test AI Recommendations'}
            </button>
          </div>

          <div className="text-sm text-gray-500">
            <p><strong>Basic Test:</strong> Searches for 100 Frontend Developer jobs in San Francisco</p>
            <p><strong>Daily Test:</strong> Simulates AI-powered job recommendations with multiple searches</p>
            <p><strong>AI Test:</strong> Analyzes your resume + generates personalized LinkedIn job recommendations</p>
            <p className="text-orange-600 font-medium">⚠️ Note: This actor requires minimum 100 records per search (API limitation)</p>
            <p className="text-purple-600 font-medium">🤖 AI Test requires: OpenAI API key + active resume uploaded</p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <div>
                          <p className="text-blue-700 font-medium">
              {testType === 'basic' ? 'Testing basic API connection...' : 
               testType === 'daily' ? 'Running daily job generation simulation...' :
               'Analyzing resume with AI and generating personalized recommendations...'}
            </p>
              <p className="text-blue-600 text-sm">
                This may take 30-60 seconds. Check the browser console for detailed logs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400 text-xl">❌</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Test Failed</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Results */}
      {(results.length > 0 || aiResults.length > 0) && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-green-400 text-xl">✅</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                {testType === 'ai' ? `AI Recommendations Generated! Found ${aiResults.length} personalized jobs` :
                 `API Test Successful! Found ${results.length} jobs`}
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  {testType === 'ai' ? 
                    `AI-scored jobs with average match: ${Math.round(aiResults.reduce((sum, job) => sum + job.aiScore, 0) / aiResults.length)}%` :
                    `Companies: ${[...new Set(results.map(j => j.companyName))].length} • Locations: ${[...new Set(results.map(j => j.location))].length}`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Job Results */}
      {aiResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🤖 AI-Powered Job Recommendations ({aiResults.length} jobs)
          </h2>
          
          <div className="space-y-6">
            {aiResults.map((job, index) => (
              <div key={job.id || `ai-job-${index}`} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {job.title || 'Job Title Not Available'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        job.aiScore >= 90 ? 'bg-green-100 text-green-800' :
                        job.aiScore >= 80 ? 'bg-blue-100 text-blue-800' :
                        job.aiScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.aiScore}% Match
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center">
                        🏢 {job.companyName || 'Company Not Available'}
                      </span>
                      <span className="flex items-center">
                        📍 {job.location || 'Location Not Available'}
                      </span>
                      {job.postedAt && (
                        <span className="flex items-center">
                          📅 {job.postedAt}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {job.companyLogo && (
                    <img 
                      src={job.companyLogo} 
                      alt={`${job.companyName} logo`}
                      className="w-12 h-12 object-contain rounded"
                    />
                  )}
                </div>

                {/* AI Insights */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-purple-800 mb-2">🧠 AI Insights</h4>
                  <p className="text-purple-700 text-sm mb-3">{job.personalizedInsights}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-purple-800 mb-1">Match Reasons:</h5>
                      <div className="flex flex-wrap gap-1">
                        {job.matchReasons.map((reason: string, idx: number) => (
                          <span key={idx} className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-purple-800 mb-1">Skills Match: {job.skillsMatch.percentage}%</h5>
                      <div className="flex flex-wrap gap-1">
                        {job.skillsMatch.matched.map((skill: string, idx: number) => (
                          <span key={idx} className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                            ✓ {skill}
                          </span>
                        ))}
                        {job.skillsMatch.missing.slice(0, 3).map((skill: string, idx: number) => (
                          <span key={idx} className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">
                            • {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {job.salaryInfo && job.salaryInfo.length > 0 && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 mr-2">💰 Salary:</span>
                      <span className="font-medium text-green-600">
                        {job.salaryInfo.join(' - ')}
                      </span>
                    </div>
                  )}
                  
                  {job.applicantsCount && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 mr-2">👥 Applicants:</span>
                      <span className="font-medium">{job.applicantsCount}</span>
                    </div>
                  )}
                  
                  {job.employmentType && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 mr-2">💼 Type:</span>
                      <span className="font-medium">{job.employmentType}</span>
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <p className="line-clamp-3">
                    {job.descriptionText ? job.descriptionText.slice(0, 300) + '...' : 'No description available'}
                  </p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    ID: {job.id}
                  </div>
                  <a 
                    href={job.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                  >
                    Apply on LinkedIn →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Job Results */}
      {results.length > 0 && testType !== 'ai' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📋 Test Results ({results.length} jobs)
          </h2>
          
                     <div className="space-y-6">
             {results.map((job, index) => (
               <div key={job.id || `job-${index}`} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {job.title || 'Job Title Not Available'}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center">
                        🏢 {job.companyName || 'Company Not Available'}
                      </span>
                      <span className="flex items-center">
                        📍 {job.location || 'Location Not Available'}
                      </span>
                      {job.postedAt && (
                        <span className="flex items-center">
                          📅 {job.postedAt}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {job.companyLogo && (
                    <img 
                      src={job.companyLogo} 
                      alt={`${job.companyName} logo`}
                      className="w-12 h-12 object-contain rounded"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {job.salaryInfo && job.salaryInfo.length > 0 && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 mr-2">💰 Salary:</span>
                      <span className="font-medium text-green-600">
                        {job.salaryInfo.join(' - ')}
                      </span>
                    </div>
                  )}
                  
                  {job.applicantsCount && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 mr-2">👥 Applicants:</span>
                      <span className="font-medium">{job.applicantsCount}</span>
                    </div>
                  )}
                  
                  {job.employmentType && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 mr-2">💼 Type:</span>
                      <span className="font-medium">{job.employmentType}</span>
                    </div>
                  )}
                </div>

                {job.benefits && job.benefits.length > 0 && (
                  <div className="mb-4">
                    <span className="text-gray-500 text-sm mr-2">🎯 Benefits:</span>
                    {job.benefits.map((benefit: string, idx: number) => (
                      <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                        {benefit}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-sm text-gray-600 mb-4">
                  <p className="line-clamp-3">
                    {job.descriptionText ? job.descriptionText.slice(0, 300) + '...' : 'No description available'}
                  </p>
                </div>

                {job.jobPosterName && (
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-3">
                      {job.jobPosterPhoto && (
                        <img 
                          src={job.jobPosterPhoto} 
                          alt={job.jobPosterName}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-800">{job.jobPosterName}</p>
                        {job.jobPosterTitle && (
                          <p className="text-xs text-gray-600">{job.jobPosterTitle}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    ID: {job.id}
                  </div>
                  <a 
                    href={job.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    View on LinkedIn →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Usage Info */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 API Usage Information</h3>
                 <div className="text-sm text-gray-600 space-y-2">
           <p><strong>Cost:</strong> $1.00 per 1,000 results (~$0.10 per test)</p>
           <p><strong>Actor ID:</strong> hKByXkMQaC5Qt9UMN (curious_coder/linkedin-jobs-scraper)</p>
           <p><strong>Minimum:</strong> 100 records per search (actor limitation)</p>
           <p><strong>Production:</strong> Perfect for daily job recommendations (100+ jobs)</p>
         </div>
      </div>
    </div>
  );
};

export default TestLinkedInAPI; 