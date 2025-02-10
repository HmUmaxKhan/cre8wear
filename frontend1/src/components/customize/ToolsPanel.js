'use client'
import { useState } from 'react'
import ColorPicker from './ColorPicker'
import TextEditor from './TextEditor'
import StickerPanel from './StickerPanel'
import useCustomizeStore from '../../components/customize/store/useCustomizeStore'

export default function ToolsPanel() {
  const [activeTab, setActiveTab] = useState('color')
  
  return (
    <div className="w-80 border-l h-full bg-white">
      <div className="flex border-b">
        {['color', 'text', 'stickers'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 p-4 text-sm font-medium ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="p-4">
        {activeTab === 'color' && <ColorPicker />}
        {activeTab === 'text' && <TextEditor />}
        {activeTab === 'stickers' && <StickerPanel />}
      </div>
    </div>
  )
}