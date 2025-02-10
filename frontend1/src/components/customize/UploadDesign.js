'use client'
import { useState } from 'react'
import {useCustomizeStore} from './store/useCustomizeStore'

export default function UploadDesign() {
  const { setUploadedDesign } = useCustomizeStore()
  const [preview, setPreview] = useState({
    front: null,
    back: null,
    left: null,
    right: null
  })

  const handleFileUpload = (view, e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(prev => ({
          ...prev,
          [view]: e.target.result
        }))
        setUploadedDesign(view, e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-medium mb-6">Upload Your Designs</h2>
      <div className="grid grid-cols-2 gap-6">
        {['front', 'back', 'left', 'right'].map((view) => (
          <div key={view} className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2 capitalize">{view} View</h3>
            <div className="min-h-[200px] border-2 border-dashed rounded-lg p-4 mb-4">
              {preview[view] ? (
                <img
                  src={preview[view]}
                  alt={`${view} view`}
                  className="w-full h-auto"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No image uploaded</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(view, e)}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  )
}