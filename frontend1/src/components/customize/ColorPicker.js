// /components/customize/ColorPicker.js
'use client'
import { HexColorPicker } from 'react-colorful'
import { useCustomizeStore } from './store/useCustomizeStore'

const ColorPicker = () => {
  const { selectedColor, setSelectedColor } = useCustomizeStore()

  const predefinedColors = [
    '#ffffff', // White
    '#000000', // Black
    '#ff0000', // Red
    '#00ff00', // Green
    '#0000ff', // Blue
    '#ffff00'  // Yellow
  ]

  return (
    <div className="p-4">
      {/* Color Picker */}
      <div className="mb-4">
        <HexColorPicker 
          color={selectedColor} 
          onChange={setSelectedColor}
          className="w-full"
        />
      </div>

      {/* Predefined Colors */}
      <div className="grid grid-cols-6 gap-2">
        {predefinedColors.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className="w-8 h-8 rounded-full border hover:scale-110 transition-transform"
            style={{ 
              backgroundColor: color,
              boxShadow: selectedColor === color ? '0 0 0 2px #3B82F6' : 'none'
            }}
            title={color}
          />
        ))}
      </div>

      {/* Selected Color Display */}
      <div className="mt-4 p-2 border rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div 
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="text-sm font-medium">{selectedColor.toUpperCase()}</span>
        </div>
      </div>
    </div>
  )
}

export default ColorPicker