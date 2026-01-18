// src/components/ui/SyncFlashOverlay.tsx
import { useEffect, useState } from 'react';

type SyncFlashOverlayProps = {
  color: string;
  onComplete?: () => void;
};

export function SyncFlashOverlay({ color, onComplete }: SyncFlashOverlayProps) {
  const [opacity, setOpacity] = useState(0.15);

  useEffect(() => {
    // Fade out animation
    const fadeTimer = setTimeout(() => setOpacity(0), 100);
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: color,
        opacity,
        pointerEvents: 'none',
        transition: 'opacity 0.5s ease-out',
        zIndex: 9999,
      }}
      aria-hidden="true"
    />
  );
}
