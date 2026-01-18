// src/components/ui/Skeleton.tsx
import styles from './Skeleton.module.css';

type SkeletonProps = {
  variant?: 'rect' | 'circle' | 'text';
  width?: string | number;
  height?: string | number;
  className?: string;
};

export function Skeleton({
  variant = 'rect',
  width,
  height,
  className
}: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width !== undefined) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height !== undefined) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${styles.skeleton} ${styles[variant]} ${className || ''}`}
      style={style}
      aria-busy="true"
      aria-label="Loading"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.card} aria-busy="true" aria-label="Loading member">
      <Skeleton variant="circle" width={48} height={48} />
      <div className={styles.lines}>
        <Skeleton variant="text" width="60%" height={16} />
        <Skeleton variant="text" width="40%" height={12} />
      </div>
    </div>
  );
}

type SkeletonListProps = {
  count?: number;
};

export function SkeletonList({ count = 3 }: SkeletonListProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  );
}
