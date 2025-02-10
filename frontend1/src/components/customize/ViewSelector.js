// /components/customize/ViewSelector.js
'use client'
import { useCustomizeStore } from './store/useCustomizeStore'

const ViewSelector = () => {
  const { currentView, setCurrentView } = useCustomizeStore()

  return (
    <div className="flex space-x-4 p-4">
      <button
        onClick={() => setCurrentView('front')}
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          currentView === 'front'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
      >
        Front
      </button>
      <button
        onClick={() => setCurrentView('back')}
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          currentView === 'back'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
      >
        Back
      </button>
    </div>
  )
}

export default ViewSelector