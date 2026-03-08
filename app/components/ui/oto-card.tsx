import { type HTMLAttributes, type ReactNode } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// OtoCard — Standardized card with variant support
// ─────────────────────────────────────────────────────────────────────────────
//
// Usage:
//   <OtoCard>Content here</OtoCard>
//   <OtoCard variant="elevated" padding="lg">Rich content</OtoCard>
//   <OtoCard variant="filled" onClick={() => {}}>Tappable</OtoCard>
//   <OtoCard highlight>Featured card with gold border</OtoCard>

export type OtoCardVariant = "elevated" | "outlined" | "filled";
export type OtoCardPadding = "none" | "sm" | "md" | "lg";

interface OtoCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: OtoCardVariant;
  padding?: OtoCardPadding;
  highlight?: boolean;
  children: ReactNode;
}

const paddingClasses: Record<OtoCardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const variantClasses: Record<OtoCardVariant, string> = {
  elevated: [
    "bg-dune border border-dark-grey rounded-2xl",
    "shadow-[0_2px_8px_rgba(0,0,0,0.2)]",
  ].join(" "),

  outlined: "bg-dune border border-dark-grey rounded-2xl",

  filled: "bg-dune/60 rounded-2xl",
};

export function OtoCard({
  variant = "outlined",
  padding = "md",
  highlight = false,
  className = "",
  onClick,
  children,
  ...props
}: OtoCardProps) {
  const isInteractive = !!onClick;

  return (
    <div
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
              }
            }
          : undefined
      }
      className={[
        variantClasses[variant],
        paddingClasses[padding],
        highlight ? "border-gold-400" : "",
        isInteractive
          ? "cursor-pointer transition-colors hover:border-gold-400/40"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
