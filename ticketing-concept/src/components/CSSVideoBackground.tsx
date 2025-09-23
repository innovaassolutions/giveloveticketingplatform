'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface CSSVideoBackgroundProps {
  videoSrc?: string;
  fallbackImage?: string;
  className?: string;
}

export default function CSSVideoBackground({
  videoSrc = '/videos/concert-hero.mp4',
  fallbackImage = '/images/concert-hero.jpg',
  className = ''
}: CSSVideoBackgroundProps) {
  const [videoError, setVideoError] = useState(false);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* CSS-Only Video Background */}
      {!videoError && (
        <>
          <video
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto
                       transform -translate-x-1/2 -translate-y-1/2 object-cover"
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoError(true)}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          {/* Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </>
      )}

      {/* Fallback Background Image */}
      {videoError && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${fallbackImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </>
      )}

      {/* Animated Particles/Lights Effect */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}