// /components/customize/MainDialog.js
'use client'
import { Dialog } from '@headlessui/react'
import { useCustomizeStore } from './store/useCustomizeStore'
import UploadDesign from './UploadDesign'
import CustomDesign from './CustomDesign'

export default function MainDialog() {
  const { isOpen, mode, setIsOpen, setMode, resetStore } = useCustomizeStore()

  const handleClose = () => {
    setIsOpen(false)
    setMode(null)
    resetStore()
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-5xl w-full rounded-lg bg-white">
          <div className="p-6">
            <Dialog.Title className="text-2xl font-semibold mb-4">
              Customize Your Product
            </Dialog.Title>

            {!mode ? (
              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => setMode('upload')}
                  className="p-8 border-2 rounded-lg hover:border-blue-500 transition-colors"
                >
                  <h3 className="text-xl font-medium mb-2">Upload Design</h3>
                  <p className="text-gray-600">Upload your own design files</p>
                </button>
                <button
                  onClick={() => setMode('custom')}
                  className="p-8 border-2 rounded-lg hover:border-blue-500 transition-colors"
                >
                  <h3 className="text-xl font-medium mb-2">Create Design</h3>
                  <p className="text-gray-600">Create your own custom design</p>
                </button>
              </div>
            ) : (
              <div className="h-[80vh] overflow-hidden">
                {mode === 'upload' ? <UploadDesign /> : <CustomDesign />}
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}