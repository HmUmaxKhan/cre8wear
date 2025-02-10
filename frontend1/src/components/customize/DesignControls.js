// components/customize/DesignControls.js
'use client';
import React, { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { HexColorPicker } from 'react-colorful';

// Import font families
import '@fontsource/roboto';
import '@fontsource/open-sans';
import '@fontsource/lato';
import '@fontsource/montserrat';
import '@fontsource/playfair-display';
import '@fontsource/source-sans-pro';
import '@fontsource/raleway';
import '@fontsource/poppins';
import '@fontsource/dancing-script';
import '@fontsource/pacifico';

const DesignControls = ({ 
  size, 
  onSizeChange,
  font,
  onFontChange,
  textColor,
  onTextColorChange 
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  
  const fonts = [
    { name: 'Roboto', family: 'Roboto, sans-serif', style: 'Modern Sans-serif' },
    { name: 'Open Sans', family: 'Open Sans, sans-serif', style: 'Clean & Friendly' },
    { name: 'Lato', family: 'Lato, sans-serif', style: 'Modern Elegant' },
    { name: 'Montserrat', family: 'Montserrat, sans-serif', style: 'Contemporary' },
    { name: 'Playfair Display', family: 'Playfair Display, serif', style: 'Classic Serif' },
    { name: 'Source Sans Pro', family: 'Source Sans Pro, sans-serif', style: 'Professional' },
    { name: 'Raleway', family: 'Raleway, sans-serif', style: 'Modern Minimalist' },
    { name: 'Poppins', family: 'Poppins, sans-serif', style: 'Geometric Modern' },
    { name: 'Dancing Script', family: 'Dancing Script, cursive', style: 'Handwritten' },
    { name: 'Pacifico', family: 'Pacifico, cursive', style: 'Fun Script' }
  ];

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Size
        </label>
        <div className="mt-1 grid grid-cols-7 gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => onSizeChange(s)}
              className={`py-2 px-3 text-sm rounded-md border transition-all ${
                size === s 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Font Selection */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Font Style
        </label>
        <Listbox value={font} onChange={onFontChange}>
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
            <span className="block truncate" style={{ fontFamily: fonts.find(f => f.name === font)?.family }}>
              {font || 'Select a font'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
              </svg>
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {fonts.map((font) => (
              <Listbox.Option
                key={font.name}
                value={font.name}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <div className="flex flex-col">
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                        style={{ fontFamily: font.family }}
                      >
                        {font.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {font.style}
                      </span>
                    </div>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Text Color
        </label>
        <div className="relative">
          <div
            className="w-full h-10 rounded-md border border-gray-300 cursor-pointer flex items-center p-2"
            onClick={() => setShowColorPicker(!showColorPicker)}
            style={{ backgroundColor: textColor }}
          >
            <span className="ml-2 text-sm" style={{ 
              color: isLightColor(textColor) ? '#000000' : '#FFFFFF'
            }}>
              {textColor.toUpperCase()}
            </span>
          </div>
          {showColorPicker && (
            <div className="absolute z-10 mt-2">
              <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                <HexColorPicker color={textColor} onChange={onTextColorChange} />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => setShowColorPicker(false)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Font Preview */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preview
        </label>
        <p 
          className="text-2xl text-center p-4"
          style={{ 
            fontFamily: fonts.find(f => f.name === font)?.family,
            color: textColor
          }}
        >
          Sample Text
        </p>
      </div>
    </div>
  );
};

// Helper function to determine if a color is light
const isLightColor = (color) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return brightness > 128;
};

export default DesignControls;