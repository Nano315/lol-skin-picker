import { cn } from "@/lib/utils";

/**
 * Bouton de barre de titre, partage par la fenetre principale et le sidecar de
 * draft.
 *
 * Extrait de `WindowTitleBar` quand le sidecar a eu besoin des memes controles :
 * deux copies auraient diverge des la premiere retouche, et c'est justement la
 * coherence entre les deux fenetres qui est en jeu ici.
 */
export default function TitleBarButton({
  children,
  onClick,
  variant = "default",
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
  "aria-label": string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "group inline-flex h-full w-11 items-center justify-center text-ink/60 transition-colors",
        variant === "danger"
          ? "hover:bg-red-500/90 hover:text-white"
          : "hover:bg-white/[0.08] hover:text-white"
      )}
    >
      {children}
    </button>
  );
}
