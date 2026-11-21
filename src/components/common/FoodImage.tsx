import React, { useEffect, useState } from 'react';
import { Utensils } from 'lucide-react';

interface FoodImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function FoodImage({ src, alt, className = '', priority = false }: FoodImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#24201B] via-[#1C1814] to-[#12100E] text-[#C89B54]/70 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Utensils className="h-7 w-7 mb-2 opacity-70" strokeWidth={1.5} />
        <span className="text-xs font-medium tracking-wide text-[#F7F3EC]/60 px-4 text-center line-clamp-1">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
