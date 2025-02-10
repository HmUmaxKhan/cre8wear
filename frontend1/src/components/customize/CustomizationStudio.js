// src/components/customize/CustomizationStudio.js
'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ColorPicker from './ColorPicker';
import TextTools from './TextTools';
import DesignUploader from './DesignUploader';
import Preview3D from './Preview3D';
import AIDesignGenerator from './AIDesignGenerator';
import SavedDesigns from './SavedDesigns';

export default function CustomizationStudio({ product }) {
  // State management
  const [currentView, setCurrentView] = useState('front');
  const [mode, setMode] = useState('2D');
  const [selectedArea, setSelectedArea] = useState('body');
  const [previewMode, setPreviewMode] = useState(false);
  const [customization, setCustomization] = useState({
    colors: {
      body: '#FFFFFF',
      sleeves: '#FFFFFF',
      hood: '#FFFFFF',
      zipper: '#000000'
    },
    designs: {
      front: {
        image: null,
        position: { x: 50, y: 50 },
        scale: 1,
        rotation: 0
      },
      back: {
        image: null,
        position: { x: 50, y: 50 },
        scale: 1,
        rotation: 0
      }
    },
    text: {
      front: {
        content: '',
        position: { x: 50, y: 50 },
        scale: 1,
        rotation: 0,
        font: 'Arial',
        color: '#000000',
        fontSize: 24
      },
      back: {
        content: '',
        position: { x: 50, y: 50 },
        scale: 1,
        rotation: 0,
        font: 'Arial',
        color: '#000000',
        fontSize: 24
      }
    }
  });

  // Handle color changes
  const handleColorChange = (area, color) => {
    setCustomization(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [area]: color
      }
    }));
  };

  // Handle design upload
  const handleDesignUpload = (view, design) => {
    setCustomization(prev => ({
      ...prev,
      designs: {
        ...prev.designs,
        [view]: {
          ...prev.designs[view],
          image: design
        }
      }
    }));
  };

  // Handle text addition
  const handleAddText = (view, textConfig) => {
    setCustomization(prev => ({
      ...prev,
      text: {
        ...prev.text,
        [view]: {
          ...textConfig,
          position: { x: 50, y: 50 },
          scale: 1,
          rotation: 0
        }
      }
    }));
  };

  // Handle element movement (design or text)
  const handleElementMove = (type, view, position) => {
    setCustomization(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [view]: {
          ...prev[type][view],
          position
        }
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toolbar */}
      <div className="sticky top-0 bg-white shadow-md z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* View Controls */}
            <div className="flex space-x-4">
              <button
                onClick={() => setMode(mode === '2D' ? '3D' : '2D')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  mode === '3D' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
              >
                {mode === '2D' ? '3D View' : '2D View'}
              </button>
              {mode === '2D' && (
                <div className="flex space-x-2">
                  {['front', 'back'].map((view) => (
                    <button
                      key={view}
                      onClick={() => setCurrentView(view)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentView === view ? 'bg-blue-600 text-white' : 'bg-gray-100'
                      }`}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg transition-colors hover:bg-green-700"
              >
                {previewMode ? 'Edit Mode' : 'Preview'}
              </button>
              <button
                onClick={() => {
                  // Save design logic
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors hover:bg-blue-700"
              >
                Save Design
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Area */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="relative aspect-square">
              <Image
                src={product.images[currentView]}
                alt={`${currentView} view`}
                fill
                className="object-contain"
                priority
              />
              
              <AnimatePresence>
                {/* Design Overlay */}
                {customization.designs[currentView]?.image && (
                  <motion.div 
                    className="absolute"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{
                      left: `${customization.designs[currentView].position.x}%`,
                      top: `${customization.designs[currentView].position.y}%`,
                      transform: `translate(-50%, -50%) 
                                 scale(${customization.designs[currentView].scale}) 
                                 rotate(${customization.designs[currentView].rotation}deg)`,
                      transformOrigin: 'center center'
                    }}
                    drag={!previewMode}
                    dragConstraints={{
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0
                    }}
                    onDragEnd={(_, info) => {
                      const bounds = info.target.getBoundingClientRect();
                      const container = info.target.parentElement.getBoundingClientRect();
                      const x = ((bounds.x - container.x + bounds.width / 2) / container.width) * 100;
                      const y = ((bounds.y - container.y + bounds.height / 2) / container.height) * 100;
                      handleElementMove('designs', currentView, { x, y });
                    }}
                  >
                    <Image
                      src={customization.designs[currentView].image}
                      alt="Custom design"
                      width={200}
                      height={200}
                      className="pointer-events-none"
                    />
                  </motion.div>
                )}

                {/* Text Overlay */}
                {customization.text[currentView]?.content && (
                  <motion.div 
                    className="absolute"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{
                      left: `${customization.text[currentView].position.x}%`,
                      top: `${customization.text[currentView].position.y}%`,
                      transform: `translate(-50%, -50%) 
                                 scale(${customization.text[currentView].scale}) 
                                 rotate(${customization.text[currentView].rotation}deg)`,
                      transformOrigin: 'center center',
                      fontFamily: customization.text[currentView].font,
                      fontSize: `${customization.text[currentView].fontSize}px`,
                      color: customization.text[currentView].color,
                      whiteSpace: 'nowrap',
                      userSelect: 'none'
                    }}
                    drag={!previewMode}
                    dragConstraints={{
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0
                    }}
                    onDragEnd={(_, info) => {
                      const bounds = info.target.getBoundingClientRect();
                      const container = info.target.parentElement.getBoundingClientRect();
                      const x = ((bounds.x - container.x + bounds.width / 2) / container.width) * 100;
                      const y = ((bounds.y - container.y + bounds.height / 2) / container.height) * 100;
                      handleElementMove('text', currentView, { x, y });
                    }}
                  >
                    {customization.text[currentView].content}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Customization Tools */}
          <div className="space-y-6">
            {/* Color Selection */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-medium mb-4">Colors</h3>
              {Object.entries(customization.colors).map(([area, color]) => (
                <div key={area} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {area.charAt(0).toUpperCase() + area.slice(1)}
                  </label>
                  <ColorPicker
                    color={color}
                    onChange={(newColor) => handleColorChange(area, newColor)}
                  />
                </div>
              ))}
            </div>

            {/* Design Tools */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-medium mb-4">Add Design</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DesignUploader onUpload={(design) => handleDesignUpload(currentView, design)} />
                <AIDesignGenerator onGenerate={(design) => handleDesignUpload(currentView, design)} />
              </div>
            </div>

            {/* Text Tools */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-medium mb-4">Add Text</h3>
              <TextTools onAdd={(textConfig) => handleAddText(currentView, textConfig)} />
            </div>

            {/* Saved Designs */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-medium mb-4">Saved Designs</h3>
              <SavedDesigns onSelect={(design) => setCustomization(design)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}