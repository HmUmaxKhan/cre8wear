// /components/customize/DraggableCanvas.js
'use client'
import { useState, useEffect } from 'react'
import Draggable from 'react-draggable'
import useCustomizeStore from './store/useCustomizeStore'

const DraggableCanvas = () => {
  const [texts, setTexts] = useState([]);
  const { selectedColor, designElements } = useCustomizeStore();

  useEffect(() => {
    if (designElements.length > texts.length) {
      const newElement = designElements[designElements.length - 1];
      if (newElement.type === 'text') {
        setTexts([...texts, {
          id: Date.now(),
          content: newElement.content,
          style: {
            fontSize: `${newElement.fontSize}px` || '30px',
            fontFamily: newElement.fontFamily || 'Arial',
            color: newElement.fill || '#000000',
            fontWeight: newElement.fontWeight || 'normal'
          }
        }]);
      }
    }
  }, [designElements]);

  return (
    <div 
      className="relative border rounded-lg shadow-lg overflow-hidden"
      style={{ 
        width: '600px', 
        height: '600px',
        background: selectedColor 
      }}
    >
      <img 
        src="/templates/tshirt-front.png" 
        alt="T-shirt" 
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      
      {texts.map((text) => (
        <Draggable
          key={text.id}
          defaultPosition={{x: 250, y: 250}}
          bounds="parent"
        >
          <div
            style={{
              position: 'absolute',
              cursor: 'move',
              ...text.style
            }}
          >
            {text.content}
          </div>
        </Draggable>
      ))}
    </div>
  );
};

export default DraggableCanvas;