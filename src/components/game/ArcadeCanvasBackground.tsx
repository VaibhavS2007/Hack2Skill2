import React from 'react';

interface ArcadeCanvasBackgroundProps {
  screenShake: boolean;
}

export const ArcadeCanvasBackground: React.FC<ArcadeCanvasBackgroundProps> = ({
  screenShake,
}) => {
  const assetBaseUrl = import.meta.env.BASE_URL;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 transition-transform duration-75 overflow-hidden ${
        screenShake ? 'animate-shake' : ''
      }`}
    >
      {/* 1. Google Flow Cosmic Black Hole Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
      >
        <source src={`${assetBaseUrl}cosmic-blackhole.mp4`} type="video/mp4" />
        <source
          src={`${assetBaseUrl}Cosmic_black_hole_swirling_plasma_3f27cc88.mp4`}
          type="video/mp4"
        />
      </video>

      {/* 2. Ambient Contrast Tint Overlay for Crisp UI Legibility */}
      <div className="absolute inset-0 bg-slate-950/40 pointer-events-none" />

      {/* 3. Deep Space Radial Vignette */}
      <div className="absolute inset-0 bg-radial-vignette opacity-75 pointer-events-none" />

      {/* 4. Subtle Top & Bottom Gradient Dimmers */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-950/80 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />
    </div>
  );
};
