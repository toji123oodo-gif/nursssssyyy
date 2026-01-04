
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  url: string;
  title: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (isPlaying) audioRef.current?.pause();
    else audioRef.current?.play();
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateProgress = () => setProgress((audio.currentTime / audio.duration) * 100);
    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, []);

  return (
    <div className="flex items-center gap-4 w-full">
      <audio ref={audioRef} src={url} onEnded={() => setIsPlaying(false)} />
      
      <button 
        onClick={togglePlay} 
        className="w-8 h-8 bg-brand-orange text-white rounded flex items-center justify-center hover:bg-brand-orangeHover transition-colors shrink-0 shadow-sm"
      >
        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-bold text-[#333] truncate uppercase tracking-wider">{title}</span>
          <span className="text-[10px] text-[#666] font-mono">MP3</span>
        </div>
        <div className="h-1.5 w-full bg-[#E5E5E5] rounded-full overflow-hidden cursor-pointer relative">
          <div 
            className="h-full bg-brand-orange relative" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
