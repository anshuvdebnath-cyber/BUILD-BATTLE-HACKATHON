import React from 'react';

export const BackgroundShader: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden select-none">
      {/* Dynamic Animated Chromatic Mesh Shaders (Adaption Labs Style) */}
      <div 
        className="absolute -top-[20%] left-[10%] w-[650px] h-[650px] rounded-full opacity-60 blur-[130px] mix-blend-multiply"
        style={{
          background: 'radial-gradient(circle, rgba(147, 197, 253, 0.45) 0%, rgba(199, 210, 254, 0.25) 50%, transparent 70%)',
          animation: 'float-shader-1 22s ease-in-out infinite alternate',
        }}
      />
      <div 
        className="absolute top-[15%] -right-[10%] w-[700px] h-[700px] rounded-full opacity-50 blur-[140px] mix-blend-multiply"
        style={{
          background: 'radial-gradient(circle, rgba(167, 243, 208, 0.4) 0%, rgba(186, 230, 253, 0.25) 50%, transparent 70%)',
          animation: 'float-shader-2 26s ease-in-out infinite alternate',
        }}
      />
      <div 
        className="absolute top-[50%] left-[25%] w-[800px] h-[550px] rounded-full opacity-35 blur-[150px] mix-blend-multiply"
        style={{
          background: 'radial-gradient(circle, rgba(224, 231, 255, 0.4) 0%, rgba(216, 180, 254, 0.2) 50%, transparent 70%)',
          animation: 'float-shader-3 30s ease-in-out infinite alternate',
        }}
      />

      {/* Subtle Micro-Grain & Geometric Matrix Texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
};

export default BackgroundShader;
