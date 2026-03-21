import { type AnchorHTMLAttributes, type ReactNode } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// OtoLink — Underlined external link
// ─────────────────────────────────────────────────────────────────────────────
//
// Always underlined, always opens in new tab (target="_blank").
// For in-app navigation, use Next.js <Link> instead.
//
// Usage:
//   <OtoLink href="https://otopro.ca/privacy">Privacy Policy</OtoLink>

interface OtoLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel"> {
  children: ReactNode;
}

export function OtoLink({
  children,
  className = "",
  ...props
}: OtoLinkProps) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "text-accent-blue-500 underline underline-offset-2 decoration-accent-blue-500/60",
        "hover:decoration-accent-blue-500 hover:text-accent-blue-300",
        "transition-colors",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </a>
  );
}
