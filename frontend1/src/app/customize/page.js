'use client'
import MainDialog from '@/components/customize/MainDialog'
import { useCustomizeStore } from '@/components/customize/store/useCustomizeStore'

export default function CustomizePage() {
  const { setIsOpen } = useCustomizeStore()

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Product Customization</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Start Customizing
        </button>
        <MainDialog />
      </div>
    </div>
  )
}