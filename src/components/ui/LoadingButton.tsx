// src/components/ui/LoadingButton.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

type LoadingButtonProps = {
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  loadingText?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  title?: string;
};

export function LoadingButton({
  loading = false,
  disabled = false,
  children,
  loadingText,
  onClick,
  className,
  type = 'button',
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
          <FontAwesomeIcon icon={faSpinner} spin />
          {loadingText && <span style={{ marginLeft: 8 }}>{loadingText}</span>}
        </>
      ) : (
        children
      )}
    </button>
  );
}
