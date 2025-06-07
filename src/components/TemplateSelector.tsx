import React, { useState } from 'react';

type Template = 'jake' | 'classic' | 'modern';

const TemplateSelector: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>('jake');

  const templates = [
    { id: 'jake' as Template, name: 'Jake', description: 'Clean, minimal format' },
    { id: 'classic' as Template, name: 'Classic', description: 'Traditional resume style' },
    { id: 'modern' as Template, name: 'Modern', description: 'Contemporary design' },
  ];

  const handleTemplateChange = (template: Template) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Resume Template</h2>
      <div className="grid grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => handleTemplateChange(template.id)}
          >
            <h3 className="font-semibold">{template.name}</h3>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector; 