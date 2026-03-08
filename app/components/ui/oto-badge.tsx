import { type ReactNode } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// OtoBadge — Status badge / chip system
// ─────────────────────────────────────────────────────────────────────────────
//
// Usage:
//   <OtoBadge variant="success">Confirmed</OtoBadge>
//   <OtoBadge variant="error" icon={<X />}>Cancelled</OtoBadge>
//   <OtoBadge variant="promotion" size="sm">NEW</OtoBadge>

export type OtoBadgeVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "pending"
  | "promotion"
  | "neutral";

export type OtoBadgeSize = "sm" | "md";

interface OtoBadgeProps {
  variant?: OtoBadgeVariant;
  size?: OtoBadgeSize;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<OtoBadgeVariant, string> = {
  success: "bg-green-800/60 text-green-300",
  warning: "bg-gold-800/60 text-gold-400",
  error: "bg-red-800/60 text-red-300",
  info: "bg-blue-800/60 text-blue-300",
  pending: "bg-dark-grey/60 text-grey",
  promotion: "bg-gold-800/60 text-gold-300",
  neutral: "bg-dune text-dark-silver",
};

const sizeClasses: Record<OtoBadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px] gap-1 rounded",
  md: "px-2.5 py-1 text-xs gap-1.5 rounded-lg",
};

export function OtoBadge({
  variant = "neutral",
  size = "md",
  icon,
  children,
  className = "",
}: OtoBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center font-semibold whitespace-nowrap",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
