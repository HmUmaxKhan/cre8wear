// components/customize/TextTools.js
'use client';
import React, { useState } from 'react';

const TextTools = ({ text, onTextChange }) => {
  const [fontSize, setFontSize] = useState(24);
  const [textAlignment, setTextAlignment] = useState('center');

  const handleTextChange = (value) => {
    onTextChange(value);
  };

  const alignmentOptions = [
    { value: 'left', icon: '⫷' },
    { value: 'center', icon: '☰' },
    { value: 'right', icon: '⫸' }
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Custom Text
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter your text here"
          maxLength={50}
        />
        <p className="mt-1 text-sm text-gray-500">
          {50 - text.length} characters remaining
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Font Size
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="range"
            min="12"
            max="72"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-gray-500 w-12">
            {fontSize}px
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Text Alignment
        </label>
        <div className="mt-1 flex gap-2">
          {alignmentOptions.map(({ value, icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTextAlignment(value)}
              className={`p-2 rounded ${
                textAlignment === value
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextTools;