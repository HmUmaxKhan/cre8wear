'use client'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Resizable } from 're-resizable'
import { useCustomizeStore } from './store/useCustomizeStore'

const ProductCanvas = () => {
  const [texts, setTexts] = useState([])
  const [stickers, setStickers] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [startPoint, setStartPoint] = useState(null)
  const containerRef = useRef(null)
  
  const { selectedColor, currentView, designElements } = useCustomizeStore()

  // Track design elements changes
  useEffect(() => {
    if (designElements.length > texts.length + stickers.length) {
      const newElement = designElements[designElements.length - 1]
      
      // Set initial position to center of container
      const containerWidth = containerRef.current?.offsetWidth || 600
      const containerHeight = containerRef.current?.offsetHeight || 600
      const initialX = (containerWidth - 100) / 2
      const initialY = (containerHeight - 100) / 2
      
      if (newElement.type === 'text') {
        setTexts(prev => [...prev, {
          id: newElement.id,
          content: newElement.content,
          position: { 
            x: initialX,
            y: initialY
          },
          size: { width: 100, height: 50 },
          style: {
            fontFamily: newElement.fontFamily || 'Arial',
            color: newElement.fill || '#000000',
            fontWeight: newElement.fontWeight || 'normal',
          },
          view: currentView
        }])
      } else if (newElement.type === 'sticker') {
        setStickers(prev => [...prev, {
          id: newElement.id,
          url: newElement.url,
          position: { 
            x: initialX,
            y: initialY
          },
          size: { width: 100, height: 100 },
          view: currentView
        }])
      }
    }
  }, [designElements])

  // Handle element click selection
  const handleElementClick = (e, id) => {
    e.stopPropagation()
    setSelectedElement(id)
  }

  // Handle element movement
  const handleDragStart = (e) => {
    if (!selectedElement) return
    if (e.target.classList.contains('control')) return
  
    e.preventDefault()
    
    const touch = e.touches ? e.touches[0] : e
    const element = e.currentTarget
    const rect = element.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
  
    // Ensure we have valid numbers
    const clientX = touch.clientX || 0
    const clientY = touch.clientY || 0
    const rectLeft = rect.left || 0
    const rectTop = rect.top || 0
    const containerLeft = containerRect.left || 0
    const containerTop = containerRect.top || 0
  
    setStartPoint({
      x: clientX - rectLeft,
      y: clientY - rectTop,
      containerLeft: containerLeft,
      containerTop: containerTop
    })
  }

  const handleDragMove = (e) => {
    if (!selectedElement || !startPoint) return
    e.preventDefault()
    
    const touch = e.touches ? e.touches[0] : e
    
    // Ensure we have valid numbers for position calculation
    const clientX = touch.clientX || 0
    const clientY = touch.clientY || 0
    const containerLeft = startPoint.containerLeft || 0
    const containerTop = startPoint.containerTop || 0
    const startX = startPoint.x || 0
    const startY = startPoint.y || 0
  
    // Calculate new position
    const x = Math.max(0, clientX - containerLeft - startX)
    const y = Math.max(0, clientY - containerTop - startY)
    
    const containerWidth = containerRef.current?.offsetWidth || 600
    const containerHeight = containerRef.current?.offsetHeight || 600
  
    // Add bounds checking
    const boundedX = Math.min(x, containerWidth - 100)
    const boundedY = Math.min(y, containerHeight - 100)
  
    // Update positions only if we have valid numbers
    if (!isNaN(boundedX) && !isNaN(boundedY)) {
      setTexts(prev => prev.map(text => 
        text.id === selectedElement 
          ? { ...text, position: { x: boundedX, y: boundedY } } 
          : text
      ))
      setStickers(prev => prev.map(sticker =>
        sticker.id === selectedElement 
          ? { ...sticker, position: { x: boundedX, y: boundedY } } 
          : sticker
      ))
    }
  }

  const handleDragEnd = () => {
    setStartPoint(null)
  }

  // Handle element resizing
  const handleTextResize = (id, { width, height }) => {
    setTexts(prev => prev.map(text => 
      text.id === id 
        ? { 
            ...text, 
            size: { width, height } 
          } 
        : text
    ))
  }

  const handleStickerResize = (id, { width, height }) => {
    setStickers(prev => prev.map(sticker => 
      sticker.id === id 
        ? { 
            ...sticker, 
            size: { width, height } 
          } 
        : sticker
    ))
  }

  // Handle element deletion
  const handleDelete = (id) => {
    setTexts(prev => prev.filter(text => text.id !== id))
    setStickers(prev => prev.filter(sticker => sticker.id !== id))
    setSelectedElement(null)
  }

  return (
    <div className="relative w-[600px] h-[600px] mx-auto">
      <div 
        ref={containerRef}
        className="absolute inset-0 border rounded-lg overflow-hidden bg-white shadow-lg"
        onClick={() => setSelectedElement(null)}
        onMouseMove={handleDragMove}
        onTouchMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchEnd={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {/* T-shirt images */}
        <img 
          src={`/templates/tshirt-${currentView}.png`}
          alt="T-shirt base"
          className="absolute top-0 left-0 w-full h-full object-contain"
          style={{ filter: `opacity(0.9) brightness(0.9)` }}
        />

        {/* Color Layer */}
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundColor: selectedColor,
            mixBlendMode: 'multiply',
            opacity: 0.9,
            maskImage: `url(/templates/tshirt-${currentView}.png)`,
            WebkitMaskImage: `url(/templates/tshirt-${currentView}.png)`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
          }}
        />

        {/* Text Elements */}
        {texts
          .filter(text => text.view === currentView)
          .map((text) => (
            <Resizable
              key={text.id}
              size={{ 
                width: text.size.width, 
                height: text.size.height 
              }}
              onResizeStop={(e, direction, ref, d) => {
                handleTextResize(text.id, {
                  width: text.size.width + d.width,
                  height: text.size.height + d.height
                })
              }}
              lockAspectRatio={false}
              minWidth={20}
              minHeight={20}
              maxWidth={400}
              maxHeight={400}
              className={`absolute ${selectedElement === text.id ? 'z-50' : 'z-10'}`}
              style={{
                left: text.position.x,
                top: text.position.y,
              }}
            >
              <div
                onClick={(e) => handleElementClick(e, text.id)}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                className={`w-full h-full touch-none select-none cursor-move ${
                  selectedElement === text.id ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{
                  ...text.style,
                  fontSize: `${Math.min(text.size.height, text.size.width) / 2}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px'
                }}
              >
                {text.content}
                {selectedElement === text.id && (
                  <button
                    className="control absolute -top-8 -right-8 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(text.id)
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            </Resizable>
          ))}

        {/* Sticker Elements */}
        {stickers
          .filter(sticker => sticker.view === currentView)
          .map((sticker) => (
            <Resizable
              key={sticker.id}
              size={{ 
                width: sticker.size.width, 
                height: sticker.size.height 
              }}
              onResizeStop={(e, direction, ref, d) => {
                handleStickerResize(sticker.id, {
                  width: sticker.size.width + d.width,
                  height: sticker.size.height + d.height
                })
              }}
              lockAspectRatio={true}
              minWidth={20}
              minHeight={20}
              maxWidth={400}
              maxHeight={400}
              className={`absolute ${selectedElement === sticker.id ? 'z-50' : 'z-10'}`}
              style={{
                left: sticker.position.x,
                top: sticker.position.y,
              }}
            >
              <div
                onClick={(e) => handleElementClick(e, sticker.id)}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                className={`w-full h-full touch-none select-none cursor-move ${
                  selectedElement === sticker.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <img 
                  src={sticker.url} 
                  alt="Sticker"
                  className="w-full h-full object-contain"
                  draggable={false}
                />
                {selectedElement === sticker.id && (
                  <button
                    className="control absolute -top-8 -right-8 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(sticker.id)
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            </Resizable>
          ))}
      </div>
    </div>
  )
}

export default ProductCanvas