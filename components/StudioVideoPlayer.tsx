'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StudioVideoPlayerProps {
  videoSrc: string;
  studioName: string;
  webmSrc?: string;
  fallbackSrc?: string;
}

export default function StudioVideoPlayer({ videoSrc, studioName, webmSrc, fallbackSrc }: StudioVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    // Auto-play on mount
    video.play().catch(() => {
      // Autoplay failed, user interaction required
      setIsPlaying(false);
    });

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progressBar = progressRef.current;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const videoElement = (
    <div
      className="relative w-full h-full group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setShowControls(false);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      }}
    >
      <video
        ref={videoRef}
        muted={isMuted}
        loop
        playsInline
        className="w-full h-full object-cover"
        aria-label={`${studioName} studio tour video`}
        preload="metadata"
      >
        {webmSrc && (
          <source src={webmSrc} type="video/webm" />
        )}
        <source src={videoSrc} type="video/mp4" />
        {fallbackSrc && (
          <source src={fallbackSrc} type="video/mp4" />
        )}
        Your browser does not support the video tag.
      </video>

      {/* Progress Bar */}
      <div
        ref={progressRef}
        className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 cursor-pointer group-hover:h-1.5 transition-all"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-white transition-all"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Control Buttons */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none"
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePlayPause}
                className="p-2 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all pointer-events-auto"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="p-2 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all pointer-events-auto"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              <span className="text-white text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <button
              onClick={openFullscreen}
              className="p-2 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all pointer-events-auto"
              aria-label="Fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* Inline Video */}
      <div className="relative w-full rounded-lg overflow-hidden shadow-xl bg-sb-black aspect-video">
        {videoElement}
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[100]"
            onClick={closeFullscreen}
          >
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeFullscreen();
                }}
                className="absolute top-4 right-4 z-10 p-3 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all"
                aria-label="Close fullscreen"
              >
                <X className="w-6 h-6" />
              </button>

              <div
                className="w-full max-w-7xl aspect-video relative"
                onClick={(e) => e.stopPropagation()}
              >
                <video
                  src={videoSrc}
                  muted={isMuted}
                  loop
                  playsInline
                  autoPlay={isPlaying}
                  className="w-full h-full object-contain"
                  aria-label={`${studioName} studio tour video - fullscreen`}
                  preload="metadata"
                >
                  {webmSrc && (
                    <source src={webmSrc} type="video/webm" />
                  )}
                  <source src={videoSrc} type="video/mp4" />
                  {fallbackSrc && (
                    <source src={fallbackSrc} type="video/mp4" />
                  )}
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

