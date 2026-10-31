import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

/**
 * 21st.dev-inspired Cyberpunk & Sci-Fi Vector Icons
 * Featuring multi-stop gradients, vector glow effects, and micro-geometry.
 */

// 1. Starfighter Ship Icon (Delta-wing combat fighter with thruster glow)
export const StarfighterShipIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, glow = true }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow ? 'filter drop-shadow-[0_0_8px_rgba(0,255,136,0.6)]' : ''}`}
    width={size}
    height={size}
  >
    <defs>
      <linearGradient id="shipHull" x1="16" y1="2" x2="16" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#00FF88" />
        <stop offset="50%" stopColor="#00E5FF" />
        <stop offset="100%" stopColor="#0A1128" />
      </linearGradient>
      <linearGradient id="shipCockpit" x1="16" y1="10" x2="16" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#00E5FF" />
      </linearGradient>
      <radialGradient id="thrusterBurn" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FF007F" />
        <stop offset="100%" stopColor="#FF7700" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Thruster Flames */}
    <path d="M12 26L11 31L13 28Z" fill="#FF007F" className="animate-pulse" />
    <path d="M20 26L19 31L21 28Z" fill="#FF007F" className="animate-pulse" />
    <circle cx="12" cy="26" r="2.5" fill="url(#thrusterBurn)" />
    <circle cx="20" cy="26" r="2.5" fill="url(#thrusterBurn)" />

    {/* Delta Wing Main Hull */}
    <path
      d="M16 2L19 9L27 20L23 25L18 23L16 26L14 23L9 25L5 20L13 9L16 2Z"
      fill="url(#shipHull)"
      stroke="#00FF88"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />

    {/* Armor Inset Plating */}
    <path d="M16 5L14 11L10 19L14 20L16 24L18 20L22 19L18 11L16 5Z" fill="#031024" stroke="#00E5FF" strokeWidth="0.8" />

    {/* Glowing Cyan Windshield */}
    <polygon points="16,8 14.5,14 16,16 17.5,14" fill="url(#shipCockpit)" />

    {/* Wingtip Plasma Cannons */}
    <rect x="4" y="16" width="1.5" height="5" rx="0.75" fill="#FF007F" stroke="#FFFFFF" strokeWidth="0.5" />
    <rect x="26.5" y="16" width="1.5" height="5" rx="0.75" fill="#FF007F" stroke="#FFFFFF" strokeWidth="0.5" />
  </svg>
);

// 2. Plasma Laser Blast Icon (Twin converging plasma beams with impact flare)
export const PlasmaLaserIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, glow = true }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow ? 'filter drop-shadow-[0_0_8px_rgba(255,0,127,0.7)]' : ''}`}
    width={size}
    height={size}
  >
    <defs>
      <linearGradient id="laserBeam" x1="0" y1="16" x2="32" y2="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#FF007F" />
        <stop offset="100%" stopColor="#770038" />
      </linearGradient>
      <radialGradient id="plasmaCore" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#FFE600" />
        <stop offset="100%" stopColor="#FF007F" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Left Plasma Cannon Bolt */}
    <path d="M2 11L14 15L2 19Z" fill="url(#laserBeam)" />
    <line x1="2" y1="15" x2="16" y2="15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

    {/* Converging Energy Arc */}
    <path d="M12 7C16 11 16 21 12 25" stroke="#FF007F" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />

    {/* Critical Impact Blast Flare */}
    <circle cx="21" cy="15" r="7" fill="url(#plasmaCore)" />
    <line x1="21" y1="5" x2="21" y2="25" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="11" y1="15" x2="31" y2="15" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="14" y1="8" x2="28" y2="22" stroke="#FFE600" strokeWidth="1" strokeLinecap="round" />
    <line x1="14" y1="22" x2="28" y2="8" stroke="#FFE600" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

// 3. Tractor EMP Beam Icon (Hexagonal magnetic wave rings with upward ion column)
export const TractorBeamIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, glow = true }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow ? 'filter drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]' : ''}`}
    width={size}
    height={size}
  >
    <defs>
      <linearGradient id="tractorGrad" x1="16" y1="30" x2="16" y2="2" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.2" />
        <stop offset="50%" stopColor="#00E5FF" />
        <stop offset="100%" stopColor="#FFFFFF" />
      </linearGradient>
    </defs>
    {/* Upward Conical Tractor Wave */}
    <polygon points="16,4 28,28 4,28" fill="url(#tractorGrad)" opacity="0.35" />

    {/* Concentric Magnetic Compression Rings */}
    <ellipse cx="16" cy="24" rx="10" ry="3" stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="3 2" />
    <ellipse cx="16" cy="18" rx="7" ry="2.2" stroke="#00E5FF" strokeWidth="1.5" />
    <ellipse cx="16" cy="12" rx="4.5" ry="1.5" stroke="#FFFFFF" strokeWidth="1.2" />

    {/* Central Ion Beam */}
    <line x1="16" y1="2" x2="16" y2="28" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
    
    {/* Emitter Nodes */}
    <circle cx="16" cy="4" r="2.5" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1" />
    <polygon points="16,1 18,5 14,5" fill="#FFFFFF" />
  </svg>
);

// 4. Shield Vault Icon (Hexagonal cybernetic shield with energy lock)
export const ShieldVaultIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, glow = true }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow ? 'filter drop-shadow-[0_0_8px_rgba(0,255,136,0.7)]' : ''}`}
    width={size}
    height={size}
  >
    <defs>
      <linearGradient id="shieldGrad" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#00FF88" />
        <stop offset="50%" stopColor="#00E5FF" />
        <stop offset="100%" stopColor="#021C16" />
      </linearGradient>
    </defs>
    {/* Outer Hexagonal Aegis */}
    <path
      d="M16 2L28 7V17C28 23.5 22.8 28.5 16 30C9.2 28.5 4 23.5 4 17V7L16 2Z"
      fill="url(#shieldGrad)"
      fillOpacity="0.3"
      stroke="#00FF88"
      strokeWidth="1.5"
    />
    {/* Inner Reinforcing Matrix */}
    <path
      d="M16 6L24 10V16.5C24 21.2 20.4 24.8 16 26C11.6 24.8 8 21.2 8 16.5V10L16 6Z"
      stroke="#00E5FF"
      strokeWidth="1"
      strokeDasharray="2 1"
    />
    {/* Vault Key / Protected Core */}
    <circle cx="16" cy="15" r="3.5" fill="#031024" stroke="#00FF88" strokeWidth="1.5" />
    <path d="M16 18.5V22" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="16" cy="15" r="1.5" fill="#FFFFFF" />
  </svg>
);

// 5. Fleet Forge Icon (Holographic space dock / cyber anvil)
export const FleetForgeIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, glow = true }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow ? 'filter drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]' : ''}`}
    width={size}
    height={size}
  >
    <defs>
      <linearGradient id="forgeGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#00E5FF" />
        <stop offset="100%" stopColor="#0055FF" />
      </linearGradient>
    </defs>
    {/* Orbital Station Spire */}
    <rect x="14" y="2" width="4" height="6" rx="1" fill="#00E5FF" />
    {/* Holographic Tool Anvil */}
    <path
      d="M4 10H28L25 15H20V20L24 25H8L12 20V15H7L4 10Z"
      fill="url(#forgeGrad)"
      stroke="#00E5FF"
      strokeWidth="1.2"
    />
    {/* Construction Blueprint Sparks */}
    <line x1="8" y1="6" x2="11" y2="9" stroke="#FFE600" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="24" y1="6" x2="21" y2="9" stroke="#FFE600" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="16" cy="15" r="2" fill="#FFFFFF" />
    <line x1="16" y1="25" x2="16" y2="30" stroke="#00E5FF" strokeWidth="1.5" />
    <line x1="12" y1="30" x2="20" y2="30" stroke="#00E5FF" strokeWidth="1.5" />
  </svg>
);

// 6. Cyber Datapad Icon (Holographic CSV cartridge with circuit pins)
export const CyberDatapadIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, glow = true }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow ? 'filter drop-shadow-[0_0_8px_rgba(255,230,0,0.6)]' : ''}`}
    width={size}
    height={size}
  >
    <defs>
      <linearGradient id="padGrad" x1="6" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
    </defs>
    {/* Cartridge Shell */}
    <rect x="5" y="4" width="22" height="24" rx="3" fill="url(#padGrad)" stroke="#FFE600" strokeWidth="1.5" />
    {/* Golden Pin Connectors */}
    <rect x="9" y="4" width="2" height="4" fill="#FFE600" />
    <rect x="13" y="4" width="2" height="4" fill="#FFE600" />
    <rect x="17" y="4" width="2" height="4" fill="#FFE600" />
    <rect x="21" y="4" width="2" height="4" fill="#FFE600" />

    {/* Neon Screen Viewport */}
    <rect x="8" y="11" width="16" height="12" rx="1.5" fill="#021020" stroke="#00E5FF" strokeWidth="0.8" />
    
    {/* CSV Data Grid Matrix */}
    <line x1="10" y1="14" x2="22" y2="14" stroke="#00FF88" strokeWidth="1" strokeLinecap="round" />
    <line x1="10" y1="17" x2="18" y2="17" stroke="#00E5FF" strokeWidth="1" strokeLinecap="round" />
    <line x1="10" y1="20" x2="20" y2="20" stroke="#FFE600" strokeWidth="1" strokeLinecap="round" />

    {/* Upload / Data Beam Arrow */}
    <path d="M21 21L21 16M21 16L19 18M21 16L23 18" stroke="#FF007F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 7. Groq Neural Core Icon (Hexagonal quantum AI processor with orbital nodes)
export const GroqNeuralCoreIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, glow = true }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow ? 'filter drop-shadow-[0_0_8px_rgba(255,230,0,0.7)]' : ''}`}
    width={size}
    height={size}
  >
    <defs>
      <linearGradient id="neuralGrad" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFE600" />
        <stop offset="50%" stopColor="#FF007F" />
        <stop offset="100%" stopColor="#770038" />
      </linearGradient>
    </defs>
    {/* Hexagonal Processor Frame */}
    <polygon points="16,3 27,9 27,23 16,29 5,23 5,9" fill="#0A0F1D" stroke="url(#neuralGrad)" strokeWidth="1.5" />
    
    {/* Synaptic Orbital Rings */}
    <circle cx="16" cy="16" r="7" stroke="#FFE600" strokeWidth="1" strokeDasharray="3 2" />
    
    {/* Central Groq Accelerator Lightning Core */}
    <polygon points="17,8 11,17 15,17 14,24 21,14 17,14" fill="#FFE600" stroke="#FFFFFF" strokeWidth="0.8" />
    
    {/* Peripheral Neural Nodes */}
    <circle cx="16" cy="3" r="1.5" fill="#00E5FF" />
    <circle cx="27" cy="9" r="1.5" fill="#FF007F" />
    <circle cx="27" cy="23" r="1.5" fill="#FFE600" />
    <circle cx="16" cy="29" r="1.5" fill="#00E5FF" />
    <circle cx="5" cy="23" r="1.5" fill="#FF007F" />
    <circle cx="5" cy="9" r="1.5" fill="#FFE600" />
  </svg>
);

// 8. Glitch Hazard Icon (Chromatic aberration dual-offset warning)
export const GlitchHazardIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, glow = true }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow ? 'filter drop-shadow-[0_0_8px_rgba(255,0,127,0.8)]' : ''}`}
    width={size}
    height={size}
  >
    {/* Chromatic Cyan Ghost */}
    <polygon points="15,4 27,26 3,26" stroke="#00E5FF" strokeWidth="1.5" strokeLinejoin="round" opacity="0.7" />
    
    {/* Chromatic Pink Ghost */}
    <polygon points="17,6 29,28 5,28" stroke="#FF007F" strokeWidth="1.5" strokeLinejoin="round" opacity="0.7" />

    {/* Primary Neon Amber Hazard Triangle */}
    <polygon points="16,5 28,27 4,27" fill="#180B0F" stroke="#FFE600" strokeWidth="1.8" strokeLinejoin="round" />
    
    {/* Exclamation Symbol */}
    <line x1="16" y1="12" x2="16" y2="19" stroke="#FFE600" strokeWidth="2" strokeLinecap="round" />
    <circle cx="16" cy="23" r="1.2" fill="#FFE600" />

    {/* Digital Glitch Slices */}
    <line x1="6" y1="18" x2="13" y2="18" stroke="#FF007F" strokeWidth="1.5" />
    <line x1="19" y1="15" x2="26" y2="15" stroke="#00E5FF" strokeWidth="1.5" />
  </svg>
);

// 9. Sound Synthwave Visualizer Icon (Animated 80s equalizer bars)
export const SoundSynthwaveIcon: React.FC<IconProps & { active?: boolean }> = ({ className = 'w-5 h-5', size, active = true, glow = true }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow && active ? 'filter drop-shadow-[0_0_6px_rgba(255,0,127,0.8)]' : ''}`}
    width={size}
    height={size}
  >
    <rect x="4" y={active ? 10 : 16} width="3" height={active ? 14 : 4} rx="1.5" fill="#00FF88" className={active ? 'animate-pulse' : ''} />
    <rect x="10" y={active ? 4 : 14} width="3" height={active ? 20 : 6} rx="1.5" fill="#00E5FF" />
    <rect x="16" y={active ? 2 : 12} width="3" height={active ? 24 : 8} rx="1.5" fill="#FF007F" />
    <rect x="22" y={active ? 8 : 15} width="3" height={active ? 16 : 5} rx="1.5" fill="#FFE600" />
    <rect x="28" y={active ? 12 : 16} width="3" height={active ? 10 : 4} rx="1.5" fill="#FF7700" className={active ? 'animate-pulse' : ''} />
  </svg>
);

// 10. Rupee Cash Token Icon (Cybernetic holographic coin with ₹ symbol)
export const RupeeCashTokenIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, glow = true }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glow ? 'filter drop-shadow-[0_0_8px_rgba(0,255,136,0.7)]' : ''}`}
    width={size}
    height={size}
  >
    <defs>
      <linearGradient id="rupeeRing" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#00FF88" />
        <stop offset="50%" stopColor="#00E5FF" />
        <stop offset="100%" stopColor="#FFE600" />
      </linearGradient>
    </defs>
    {/* Outer Energy Ring */}
    <circle cx="16" cy="16" r="14" fill="#04121A" stroke="url(#rupeeRing)" strokeWidth="1.8" />
    {/* Inner Hexagonal Border */}
    <polygon points="16,5 25,10.5 25,21.5 16,27 7,21.5 7,10.5" stroke="#00E5FF" strokeWidth="0.8" strokeDasharray="3 2" />
    
    {/* Sharp ₹ Glyphs */}
    <path
      d="M12 9H20M12 12.5H19M12 9V16C13.5 16 16.5 15.5 16.5 12.5C16.5 9.5 12 9.5 12 9.5ZM14.5 16L19 23"
      stroke="#00FF88"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
