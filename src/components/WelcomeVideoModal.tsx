import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './ui/button';

interface WelcomeVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Declare YouTube API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function WelcomeVideoModal({ isOpen, onClose }: WelcomeVideoModalProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const updateIntervalRef = useRef<number | null>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      setPlayerReady(true);
    };

    if (window.YT && window.YT.Player) {
      setPlayerReady(true);
    }
  }, []);

  // Initialize YouTube Player
  useEffect(() => {
    if (!playerReady || !isOpen || playerRef.current) return;

    const player = new window.YT.Player('youtube-player', {
      videoId: 'kMO0OM9CdGg',
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: (event: any) => {
          setDuration(event.target.getDuration());
        },
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
          } else if (event.data === window.YT.PlayerState.ENDED) {
            onClose();
          }
        },
      },
    });

    playerRef.current = player;

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [playerReady, isOpen, onClose]);

  // Update current time continuously
  useEffect(() => {
    if (isPlaying && playerRef.current) {
      updateIntervalRef.current = window.setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          setCurrentTime(playerRef.current.getCurrentTime());
        }
      }, 100); // Update every 100ms for smooth playhead movement
    } else {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
    }

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // Handle dragging cleanup
  useEffect(() => {
    if (isDragging) {
      const handleMouseUp = () => setIsDragging(false);
      const handleMouseMove = (e: MouseEvent) => {
        if (!timelineRef.current || !playerRef.current) return;
        
        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(x / rect.width, 1));
        const newTime = percentage * duration;
        
        if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
            playerRef.current.seekTo(newTime, true);
        }
        setCurrentTime(newTime);
      };

      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isDragging, duration]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePlayPause = () => {
    if (playerRef.current && typeof playerRef.current.playVideo === 'function' && typeof playerRef.current.pauseVideo === 'function') {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    }
  };

  const handleMuteToggle = () => {
    if (playerRef.current && typeof playerRef.current.mute === 'function' && typeof playerRef.current.unMute === 'function') {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen().catch(err => {
            console.log('Fullscreen request failed:', err);
          });
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(err => {
            console.log('Exit fullscreen failed:', err);
          });
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleSkip = () => {
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      playerRef.current.pauseVideo();
    }
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !playerRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(x / rect.width, 1));
    const newTime = percentage * duration;
    
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
        playerRef.current.seekTo(newTime, true);
    }
    setCurrentTime(newTime);
  };

  const handleTimelineDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleTimelineClick(e);
  };

  const handleTimelineHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(x / rect.width, 1));
    const time = percentage * duration;
    
    setHoverTime(time);
    setHoverPosition(x);
  };

  const handleTimelineLeave = () => {
    setHoverTime(null);
  };

  const handleMouseEnter = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    controlsTimeoutRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-lg sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-3 sm:p-4 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="text-white font-semibold text-sm sm:text-base truncate">Welcome to QPON Merchant Dashboard</h2>
            <p className="text-white/80 text-xs sm:text-sm hidden sm:block">Quick tutorial to get you started</p>
          </div>
          <button
            onClick={handleSkip}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors flex-shrink-0"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div ref={containerRef} className="relative bg-black aspect-video" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div id="youtube-player" className="w-full h-full"></div>

          {/* Close Button - Always Visible */}
          <button
            onClick={handleSkip}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-all shadow-lg hover:shadow-xl backdrop-blur-sm"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>

          {/* Play/Pause Overlay */}
          {!isPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer z-10"
              onClick={handlePlayPause}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-[#E35000] hover:bg-[#c44500] transition-all shadow-2xl hover:shadow-[0_0_30px_rgba(227,80,0,0.5)]">
                <Play size={24} className="sm:w-8 sm:h-8 text-white ml-1" fill="white" />
              </div>
            </div>
          )}

          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-4 z-10" style={{ display: showControls ? 'block' : 'none' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handlePlayPause}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  {isPlaying ? (
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex gap-0.5 sm:gap-1">
                      <div className="w-0.5 sm:w-1 h-2.5 sm:h-3 bg-white"></div>
                      <div className="w-0.5 sm:w-1 h-2.5 sm:h-3 bg-white"></div>
                    </div>
                  ) : (
                    <Play size={14} className="sm:w-4 sm:h-4 ml-0.5" fill="white" />
                  )}
                </button>
                <button
                  onClick={handleMuteToggle}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  {isMuted ? <VolumeX size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Volume2 size={16} className="sm:w-[18px] sm:h-[18px]" />}
                </button>
                <span className="text-white text-xs sm:text-sm font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <button
                onClick={handleFullscreen}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                {isFullscreen ? <Minimize2 size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Maximize2 size={16} className="sm:w-[18px] sm:h-[18px]" />}
              </button>
            </div>

            {/* YouTube-Style Interactive Timeline */}
            <div className="space-y-2">
              {/* Timeline Bar */}
              <div 
                ref={timelineRef}
                className="relative h-1.5 bg-white/20 rounded-full cursor-pointer group"
                onClick={handleTimelineClick}
                onMouseDown={handleTimelineDragStart}
                onMouseMove={handleTimelineHover}
                onMouseLeave={handleTimelineLeave}
              >
                {/* Progress Bar */}
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#6BB6FF] to-[#E35000] rounded-full transition-all pointer-events-none"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />

                {/* Playhead */}
                <div 
                  className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-all group-hover:w-5 group-hover:h-5 pointer-events-none"
                  style={{ 
                    left: `${(currentTime / duration) * 100}%`, 
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-30"></div>
                </div>

                {/* Hover Preview Tooltip */}
                {hoverTime !== null && (
                  <div 
                    className="absolute -top-20 bg-gradient-to-br from-[#E8F4FF] to-[#FFE8DC] px-3 py-2 rounded-lg shadow-xl border-2 border-white/50 pointer-events-none"
                    style={{ 
                      left: `${hoverPosition}px`, 
                      transform: 'translateX(-50%)',
                    }}
                  >
                    <div className="text-[#0E2250] text-xs font-semibold whitespace-nowrap">
                      {formatTime(hoverTime)}
                    </div>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#FFE8DC] rotate-45 border-r-2 border-b-2 border-white/50"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Learn how to create deals, manage coupons, and track analytics
          </p>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            
            <Button
              onClick={onClose}
              className="h-9 px-4 text-sm bg-[#E35000] hover:bg-[#c44500] text-white w-full sm:w-auto order-1 sm:order-2"
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}