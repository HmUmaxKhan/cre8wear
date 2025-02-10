// /components/customize/CustomDesign.js
'use client'
import { useCustomizeStore } from './store/useCustomizeStore'
import CategorySelector from './CategorySelector'
import ProductCanvas from './ProductCanvas'
import ToolsPanel from './ToolsPanel'
import ViewSelector from './ViewSelector'

const CustomDesign = () => {
  const { selectedCategory } = useCustomizeStore();
  
  if (!selectedCategory) {
    return <CategorySelector />;
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <ViewSelector />
        <div className="flex-1 p-4 bg-gray-50">
          <ProductCanvas />
        </div>
      </div>
      <ToolsPanel />
    </div>
  );
};

export default CustomDesign;