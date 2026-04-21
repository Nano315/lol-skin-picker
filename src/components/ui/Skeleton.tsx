// src/components/ui/Skeleton.tsx
import { cn } from "@/lib/utils";

type SkeletonProps = {
  variant?: "rect" | "circle" | "text";
  width?: string | number;
  height?: string | number;
  className?: string;
};

/**
 * Low-level shimmer placeholder. The gradient + `animate-shimmer` keyframe
 * (defined in tailwind.config.ts) produce the diagonal sheen. Three shape
 * variants cover the common cases; everything else can ride on className.
 */
export function Skeleton({
  variant = "rect",
  width,
  height,
  className,
}: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width !== undefined) style.width = typeof width === "number" ? `${width}px` : width;
  if (height !== undefined) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      data-variant={variant}
      style={style}
      className={cn(
        "bg-[length:200%_100%] animate-shimmer",
        "bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.04)_75%)]",
        variant === "circle" && "rounded-full",
        variant === "text" && "rounded-sm",
        variant === "rect" && "rounded",
        className
      )}
    />
  );
}

/**
 * Member placeholder used in lists. Mirrors the avatar + two-line layout of
 * a real row so the page height doesn't jump when data lands.
 */
export function SkeletonCard() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading member"
      className="flex items-center gap-3 rounded-xl bg-black/20 p-3"
    >
      <Skeleton variant="circle" width={48} height={48} />
      <div className="flex flex-1 flex-col gap-2">
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
