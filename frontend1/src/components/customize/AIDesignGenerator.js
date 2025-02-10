// components/customize/AIDesignGenerator.js
'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AIDesignGenerator = ({ onDesignGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedDesigns, setGeneratedDesigns] = useState([]);

  const generateDesign = async () => {
    if (!prompt.trim()) {
      setError('Please enter a design description');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/design/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('Failed to generate design');
      }

      const data = await response.json();
      setGeneratedDesigns(prev => [data.designUrl, ...prev].slice(0, 4));
      onDesignGenerated(data.designUrl);
    } catch (err) {
      setError('Failed to generate design. Please try again.');
      console.error('Design generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const suggestedPrompts = [
    "Minimalist geometric pattern",
    "Vintage floral design",
    "Abstract watercolor splash",
    "Modern typography art",
    "Nature-inspired mandala",
    "Urban street art style",
    "Japanese wave pattern",
    "Celtic knot design"
  ];

  const handleSuggestedPrompt = (prompt) => {
    setPrompt(prompt);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          AI Design Generator
        </label>
        <div className="mt-1">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Describe the design you want to generate..."
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>

      {/* Suggested Prompts */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Suggested Prompts
        </label>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((suggestedPrompt) => (
            <button
              key={suggestedPrompt}
              onClick={() => handleSuggestedPrompt(suggestedPrompt)}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
            >
              {suggestedPrompt}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateDesign}
        disabled={generating || !prompt.trim()}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {generating ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating Design...
          </>
        ) : (
          'Generate Design'
        )}
      </button>

      {/* Recently Generated Designs */}
      {generatedDesigns.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recently Generated Designs
          </label>
          <div className="grid grid-cols-2 gap-4">
            {generatedDesigns.map((design, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                onClick={() => onDesignGenerated(design)}
              >
                <img
                  src={design}
                  alt={`Generated design ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Tips for better results:</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Be specific about style, colors, and elements</li>
                <li>Include details about composition and layout</li>
                <li>Mention artistic influences or references</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDesignGenerator;