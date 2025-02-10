// /components/customize/StickerPanel.js
'use client'
import { useState } from 'react'
import { useCustomizeStore } from './store/useCustomizeStore'
import { Upload, Loader2 } from 'lucide-react'

// Mock stickers database
const MOCK_STICKERS = {
  'mountain': '/stickers/mountain.png',
  'star': '/stickers/star.png',
  'heart': '/stickers/heart.png',
  'flower': '/stickers/flower.png',
  'smile': '/stickers/smile.png',
  'sun': '/stickers/sun.png',
};

const StickerPanel = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadPreview, setUploadPreview] = useState(null)
  const { addDesignElement, currentView } = useCustomizeStore()

  // Handle adding a sticker to the design
  const handleAddSticker = (url) => {
    addDesignElement({
      type: 'sticker',
      url: url,
      view: currentView
    })
    setUploadPreview(null)
  }

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Predefined Stickers */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Available Stickers
        </label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(MOCK_STICKERS).map(([name, url]) => (
            <button
              key={name}
              onClick={() => handleAddSticker(url)}
              className="p-2 border rounded-lg hover:border-blue-500 transition-colors"
            >
              <img 
                src={url} 
                alt={name} 
                className="w-full h-auto"
                draggable="false"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Upload Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Upload Sticker
        </label>
        <div className="border-2 border-dashed rounded-lg p-4 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="sticker-upload"
          />
          <label
            htmlFor="sticker-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">
              Click to upload or drag and drop
            </span>
          </label>
        </div>
      </div>

      {/* Upload Preview */}
      {uploadPreview && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Preview
          </label>
          <div className="border rounded-lg p-4">
            <img
              src={uploadPreview}
              alt="Upload preview"
              className="max-w-full h-auto mx-auto"
            />
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => handleAddSticker(uploadPreview)}
                className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add to Design
              </button>
              <button
                onClick={() => setUploadPreview(null)}
                className="flex-1 py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StickerPanel