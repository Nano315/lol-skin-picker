// src/components/ui/LoadingButton.tsx
import { Loader2 } from "lucide-react";

type LoadingButtonProps = {
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  loadingText?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  title?: string;
};

/**
 * Minimal shim kept for the legacy call-sites that still wire their own
 * styling via `className`. It only owns the loading/disabled/aria-busy
 * contract — prefer the DA `Button` primitive for new code.
 */
export function LoadingButton({
  loading = false,
  disabled = false,
  children,
  loadingText,
  onClick,
  className,
  type = "button",
  title,
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          {loadingText && <span className="ml-2">{loadingText}</span>}
        </>
      ) : (
        children
      )}
    </button>
  );
}
