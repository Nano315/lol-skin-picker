// src/__tests__/ui-components.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Skeleton, SkeletonCard, SkeletonList } from '../components/ui/Skeleton';
import { SyncProgressBar } from '../components/ui/SyncProgressBar';
import { LoadingButton } from '../components/ui/LoadingButton';
import { ConnectionStatus } from '../components/ui/ConnectionStatus';
import { SyncFlashOverlay } from '../components/ui/SyncFlashOverlay';
import { ConfettiOverlay } from '../components/ui/ConfettiOverlay';

describe('Skeleton', () => {
  it('should render with default props', () => {
    render(<Skeleton />);
    const skeleton = screen.getByLabelText('Loading');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
  });

  it('should render with custom dimensions', () => {
    render(<Skeleton width={100} height={50} />);
    const skeleton = screen.getByLabelText('Loading');
    expect(skeleton).toHaveStyle({ width: '100px', height: '50px' });
  });

  it('should apply circle variant class', () => {
    render(<Skeleton variant="circle" />);
    const skeleton = screen.getByLabelText('Loading');
    expect(skeleton.className).toContain('circle');
  });

  it('should apply text variant class', () => {
    render(<Skeleton variant="text" />);
    const skeleton = screen.getByLabelText('Loading');
    expect(skeleton.className).toContain('text');
  });
});

describe('SkeletonCard', () => {
  it('should render a card with avatar and text lines', () => {
    render(<SkeletonCard />);
    const card = screen.getByLabelText('Loading member');
    expect(card).toBeInTheDocument();
  });
});

describe('SkeletonList', () => {
  it('should render default 3 cards', () => {
    render(<SkeletonList />);
    const cards = screen.getAllByLabelText('Loading member');
    expect(cards).toHaveLength(3);
  });

  it('should render specified number of cards', () => {
    render(<SkeletonList count={5} />);
    const cards = screen.getAllByLabelText('Loading member');
    expect(cards).toHaveLength(5);
  });
});

describe('SyncProgressBar', () => {
  it('should display progress percentage', () => {
    render(<SyncProgressBar progress={45} />);
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('should display custom label', () => {
    render(<SyncProgressBar progress={30} label="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('should show complete state at 100%', () => {
    render(<SyncProgressBar progress={100} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Sync complete')).toBeInTheDocument();
  });

  it('should clamp progress values', () => {
    render(<SyncProgressBar progress={150} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    render(<SyncProgressBar progress={60} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '60');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });
});

describe('LoadingButton', () => {
  it('should render children when not loading', () => {
    render(<LoadingButton>Submit</LoadingButton>);
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('should be disabled when loading', () => {
    render(<LoadingButton loading>Submit</LoadingButton>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should show loading text when provided', () => {
    render(<LoadingButton loading loadingText="Please wait...">Submit</LoadingButton>);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<LoadingButton disabled>Submit</LoadingButton>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should have aria-busy when loading', () => {
    render(<LoadingButton loading>Submit</LoadingButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
  });
});

describe('ConnectionStatus', () => {
  it('should show connected state', () => {
    render(<ConnectionStatus state="connected" />);
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  it('should show connecting state', () => {
    render(<ConnectionStatus state="connecting" />);
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });

  it('should show disconnected state', () => {
    render(<ConnectionStatus state="disconnected" />);
    expect(screen.getByText('Disconnected')).toBeInTheDocument();
  });

  it('should show reconnecting state', () => {
    render(<ConnectionStatus state="reconnecting" />);
    expect(screen.getByText('Reconnecting...')).toBeInTheDocument();
  });

  it('should include room code in title when provided', () => {
    render(<ConnectionStatus state="connected" roomCode="ABC123" />);
    const container = screen.getByRole('status');
    expect(container).toHaveAttribute('title', 'Connected - Room ABC123');
  });

  it('should have proper ARIA attributes', () => {
    render(<ConnectionStatus state="connected" />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });
});

describe('SyncFlashOverlay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render with the specified color', () => {
    const { container } = render(<SyncFlashOverlay color="#ff5555" />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveStyle({ backgroundColor: '#ff5555' });
  });

  it('should be hidden from accessibility tree', () => {
    const { container } = render(<SyncFlashOverlay color="#ff5555" />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
  });

  it('should not block pointer events', () => {
    const { container } = render(<SyncFlashOverlay color="#ff5555" />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveStyle({ pointerEvents: 'none' });
  });

  it('should call onComplete after animation', () => {
    const onComplete = vi.fn();
    render(<SyncFlashOverlay color="#ff5555" onComplete={onComplete} />);

    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('should have fixed positioning', () => {
    const { container } = render(<SyncFlashOverlay color="#ff5555" />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveStyle({ position: 'fixed' });
  });
});

describe('ConfettiOverlay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      return setTimeout(() => cb(Date.now()), 16) as unknown as number;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      clearTimeout(id);
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should render confetti particles', () => {
    const { container } = render(<ConfettiOverlay />);
    const overlay = container.firstChild as HTMLElement;
    // Should have 50 particles by default (PARTICLE_COUNT)
    expect(overlay.children.length).toBe(50);
  });

  it('should be hidden from accessibility tree', () => {
    const { container } = render(<ConfettiOverlay />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
  });

  it('should not block pointer events', () => {
    const { container } = render(<ConfettiOverlay />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveStyle({ pointerEvents: 'none' });
  });

  it('should call onComplete after duration', () => {
    const onComplete = vi.fn();
    render(<ConfettiOverlay onComplete={onComplete} duration={2000} />);

    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('should accept custom duration', () => {
    const onComplete = vi.fn();
    render(<ConfettiOverlay onComplete={onComplete} duration={1000} />);

    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('should have fixed positioning with high z-index', () => {
    const { container } = render(<ConfettiOverlay />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveStyle({ position: 'fixed', zIndex: 9999 });
  });
});
