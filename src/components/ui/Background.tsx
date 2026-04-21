/**
 * Decorative atmospheric background — grid, vignette, radial glow, soft
 * pulsing blurs. Fixed full-viewport, pointer-events disabled, sits behind
 * everything (z-0). Mirrors the vitrine site for DA unification.
 */
export default function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Base radial glow top */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.18),transparent_55%)]" />
      {/* Secondary glow bottom right */}
      <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-accent/10 blur-3xl animate-pulse-slow" />
      {/* Top left glow (delayed pulse) */}
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-accent-strong/10 blur-3xl animate-pulse-slow [animation-delay:2s]" />
      {/* Subtle grid mask */}
      <div className="absolute inset-0 bg-grid-dim [background-size:56px_56px] opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}
