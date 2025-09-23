'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface VideoSource {
  src: string;
  type: string;
  title: string;
}

interface VideoBackgroundProps {
  videos?: VideoSource[];
  fallbackImage?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
}

export default function VideoBackground({
  videos = [
    { src: '/videos/concert-1.mp4', type: 'video/mp4', title: 'Lady Gaga Concert' },
    { src: '/videos/concert-2.mp4', type: 'video/mp4', title: 'Taylor Swift Show' },
    { src: '/videos/concert-3.mp4', type: 'video/mp4', title: 'Ed Sheeran Live' }
  ],
  fallbackImage = '/images/concert-hero.jpg',
  autoPlay = true,
  muted = true,
  loop = true,
  className = ''
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Cycle through videos
  useEffect(() => {
    if (!videos.length || !loop) return;

    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    };

    video.addEventListener('ended', handleVideoEnd);
    return () => video.removeEventListener('ended', handleVideoEnd);
  }, [videos.length, loop]);

  // Handle video loading and playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
      if (isPlaying) {
        video.play().catch(console.error);
      }
    };

    const handleLoadStart = () => {
      setIsVideoLoaded(false);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('loadstart', handleLoadStart);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [currentVideoIndex, isPlaying]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const currentVideo = videos[currentVideoIndex];

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay={autoPlay}
        muted={isMuted}
        playsInline
        preload="metadata"
        key={currentVideoIndex}
      >
        {currentVideo && (
          <source src={currentVideo.src} type={currentVideo.type} />
        )}
        Your browser does not support the video tag.
      </video>

      {/* Fallback Image */}
      {!isVideoLoaded && (
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${fallbackImage})` }}
        />
      )}

      {/* Video Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Loading Indicator */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50"></div>
        </div>
      )}

      {/* Video Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-6 right-6 flex gap-3"
      >
        <button
          onClick={togglePlay}
          className="p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleMute}
          className="p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </motion.div>

      {/* Video Title */}
      {currentVideo && showControls && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-6 left-6"
        >
          <div className="px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-lg">
            <p className="text-sm font-medium">{currentVideo.title}</p>
            <p className="text-xs text-gray-300">
              {currentVideoIndex + 1} of {videos.length}
            </p>
          </div>
        </motion.div>
      )}

      {/* Video Dots Indicator */}
      {videos.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2"
        >
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVideoIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentVideoIndex
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Play video ${index + 1}`}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}