// /components/customize/store/useCustomizeStore.js
'use client'
import { create } from 'zustand'

export const useCustomizeStore = create((set) => ({
  // Dialog state
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),

  // View mode
  mode: null, // 'upload' or 'custom'
  setMode: (mode) => set({ mode }),

  // Product view state
  currentView: 'front',
  setCurrentView: (view) => set({ currentView: view }),

  // Color state
  selectedColor: '#ffffff',
  setSelectedColor: (color) => set({ selectedColor: color }),

  // Category state
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  // Design elements (texts and stickers)
  designElements: [],
  addDesignElement: (element) => set(state => ({
    designElements: [...state.designElements, {
      ...element,
      id: Date.now().toString(),
      position: { x: 250, y: 250 },
      rotation: 0,
      scale: 1,
      view: state.currentView
    }]
  })),

  removeDesignElement: (elementId) => set(state => ({
    designElements: state.designElements.filter(el => el.id !== elementId)
  })),

  // Selected element
  selectedElement: null,
  setSelectedElement: (elementId) => set({ selectedElement: elementId }),

  // Reset store
  resetStore: () => set({
    mode: null,
    selectedColor: '#ffffff',
    currentView: 'front',
    selectedCategory: null,
    designElements: [],
    selectedElement: null
  })
}))