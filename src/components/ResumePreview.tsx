import React from 'react';

const ResumePreview: React.FC = () => {
  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center border-b pb-4">
          <h1 className="text-2xl font-bold">John Doe</h1>
          <p className="text-gray-600">Software Engineer</p>
          <p className="text-sm text-gray-500">
            john.doe@email.com | (555) 123-4567 | LinkedIn: linkedin.com/in/johndoe
          </p>
        </div>

        {/* Education */}
        <div>
          <h2 className="text-lg font-bold border-b border-gray-300 mb-2">EDUCATION</h2>
          <div>
            <p className="font-semibold">Bachelor of Science in Computer Science</p>
            <p className="text-gray-600">University of Technology | May 2023</p>
            <p className="text-sm">GPA: 3.8/4.0</p>
          </div>
        </div>

        {/* Experience */}
        <div>
          <h2 className="text-lg font-bold border-b border-gray-300 mb-2">EXPERIENCE</h2>
          <div className="space-y-3">
            <div>
              <p className="font-semibold">Software Engineering Intern</p>
              <p className="text-gray-600">Tech Company Inc. | June 2022 - August 2022</p>
              <ul className="list-disc list-inside text-sm space-y-1 mt-1">
                <li>Developed web applications using React and Node.js</li>
                <li>Collaborated with cross-functional teams to deliver features</li>
                <li>Implemented RESTful APIs and database integrations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-lg font-bold border-b border-gray-300 mb-2">SKILLS</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Programming Languages:</p>
              <p>JavaScript, Python, Java, C++</p>
            </div>
            <div>
              <p className="font-semibold">Technologies:</p>
              <p>React, Node.js, Docker, AWS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview; 