import React from 'react';
import { Html } from '@react-three/drei';

export const DimensionLabels = ({ width, height, depth }) => {
  return (
    <>
      {/* Width Label */}
      <Html position={[width / 2, 0, 0]}>
        <div className="bg-white/80 px-2 py-1 rounded text-sm">
          Width: {width}cm
        </div>
      </Html>
      
      {/* Height Label */}
      <Html position={[0, height, 0]}>
        <div className="bg-white/80 px-2 py-1 rounded text-sm">
          Height: {height}cm
        </div>
      </Html>
      
      {/* Depth Label */}
      <Html position={[0, 0, depth / 2]}>
        <div className="bg-white/80 px-2 py-1 rounded text-sm">
          Depth: {depth}cm
        </div>
      </Html>
    </>
  );
}; 