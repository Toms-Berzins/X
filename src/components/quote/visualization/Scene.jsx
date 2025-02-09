import React from 'react';
import { OrbitControls, Grid } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import { BoxWithControls } from './BoxWithControls';
import { DimensionLabels } from './DimensionLabels';

// Extend Three.js elements
extend(THREE);

export const Scene = (props) => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
      />

      {/* Helpers */}
      <group>
        <Grid
          args={[200, 200]}
          position={[0, 0, 0]}
          cellSize={10}
          cellThickness={1}
          cellColor="#6b7280"
          sectionSize={50}
          sectionThickness={1.5}
          sectionColor="#374151"
          fadeDistance={200}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid
        />
      </group>

      {/* Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={50}
        maxDistance={500}
      />

      {/* The box with transform controls */}
      <BoxWithControls {...props} />

      {/* Dimension labels */}
      <DimensionLabels {...props} />
    </>
  );
}; 