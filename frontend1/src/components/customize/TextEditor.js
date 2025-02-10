// /components/customize/TextEditor.js
'use client'
import { useState } from 'react'
import { useCustomizeStore } from './store/useCustomizeStore'
import { HexColorPicker } from 'react-colorful'

const FONTS = [
  { name: 'Arial', value: 'Arial' },
  { name: 'Times New Roman', value: 'Times New Roman' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'Dancing Script', value: 'Dancing Script' },
  { name: 'Pacifico', value: 'Pacifico' },
  { name: 'Permanent Marker', value: 'Permanent Marker' },
  { name: 'Comic Sans MS', value: 'Comic Sans MS' },
  { name: 'Impact', value: 'Impact' }
];

const TextEditor = () => {
  const { addDesignElement } = useCustomizeStore();
  const [text, setText] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [textStyle, setTextStyle] = useState({
    fontFamily: 'Arial',
    fontSize: 30,
    fontWeight: '400',
    fill: '#000000'
  });

  const handleAddText = () => {
    if (text.trim()) {
      addDesignElement({
        type: 'text',
        content: text,
        ...textStyle
      });
      setText('');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Add Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Enter your text..."
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Font</label>
        <select
          value={textStyle.fontFamily}
          onChange={(e) => setTextStyle({ ...textStyle, fontFamily: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
          style={{ fontFamily: textStyle.fontFamily }}
        >
          {FONTS.map((font) => (
            <option 
              key={font.value} 
              value={font.value}
              style={{ fontFamily: font.value }}
            >
              {font.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Size</label>
        <select
          value={textStyle.fontSize}
          onChange={(e) => setTextStyle({ ...textStyle, fontSize: Number(e.target.value) })}
          className="w-full px-3 py-2 border rounded-lg"
        >
          {[12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72].map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Color</label>
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="w-full px-3 py-2 border rounded-lg flex items-center space-x-2"
        >
          <div
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: textStyle.fill }}
          />
          <span>{textStyle.fill}</span>
        </button>
        {showColorPicker && (
          <div className="relative z-10">
            <div className="absolute mt-2">
              <HexColorPicker
                color={textStyle.fill}
                onChange={(color) => setTextStyle({ ...textStyle, fill: color })}
              />
            </div>
          </div>
        )}
      </div>

      <div className="pt-4">
        <button
          onClick={handleAddText}
          disabled={!text.trim()}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Text
        </button>
      </div>

      {/* Preview */}
      {text && (
        <div className="p-4 border rounded-lg">
          <p style={{ ...textStyle, margin: 0 }}>
            {text}
          </p>
        </div>
      )}
    </div>
  );
};

export default TextEditor;