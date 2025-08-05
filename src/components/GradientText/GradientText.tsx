import "./GradientText.css";
import { ReactNode, useMemo } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;

  /** Nouveau : icône Font Awesome à afficher (ex: faPalette) */
  icon?: IconDefinition;
  /** Taille de l’icône (px, rem, em). Par défaut suit la taille du texte via 1em. */
  iconSize?: number | string;
  /** Position de l’icône par rapport au texte. */
  iconPosition?: "left" | "right";
  /** Espace entre icône et texte. */
  gap?: number | string;
}

/** Transforme l’IconDefinition FA en data-URL SVG utilisable en mask-image. */
function iconToDataUrl(icon: IconDefinition) {
  const [w, h, , , svgPathData] = icon.icon;
  const paths = Array.isArray(svgPathData) ? svgPathData : [svgPathData];
  const body = paths.map((d) => `<path d="${d}"/>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${body}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function GradientText({
  children,
  className = "",
  colors = ["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"],
  animationSpeed = 8,
  showBorder = false,
  icon,
  iconSize = "1em",
  iconPosition = "left",
  gap = "0.5em",
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
  } as const;

  const iconMaskUrl = useMemo(
    () => (icon ? iconToDataUrl(icon) : undefined),
    [icon]
  );

  const iconStyle = icon
    ? ({
        width: typeof iconSize === "number" ? `${iconSize}px` : iconSize,
        height: typeof iconSize === "number" ? `${iconSize}px` : iconSize,
        WebkitMaskImage: `url("${iconMaskUrl}")`,
        maskImage: `url("${iconMaskUrl}")`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        // Le dégradé animé passe à travers le masque (icône) :
        ...gradientStyle,
      } as const)
    : undefined;

  return (
    <div className={`animated-gradient-text ${className}`} style={{ gap }}>
      {showBorder && <div className="gradient-overlay" style={gradientStyle} />}

      {icon && iconPosition === "left" && (
        <span
          className="gradient-icon"
          style={iconStyle}
          aria-hidden="true"
          role="img"
        />
      )}

      <span className="text-content" style={gradientStyle}>
        {children}
      </span>

      {icon && iconPosition === "right" && (
        <span
          className="gradient-icon"
          style={iconStyle}
          aria-hidden="true"
          role="img"
        />
      )}
    </div>
  );
}
