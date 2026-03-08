// ─────────────────────────────────────────────────────────────────────────────
// OtoDivider — Themed horizontal divider
// ─────────────────────────────────────────────────────────────────────────────
//
// Usage:
//   <OtoDivider />                        // full-width, 1px
//   <OtoDivider indent={16} />            // left margin
//   <OtoDivider variant="section" />      // with vertical padding

interface OtoDividerProps {
  variant?: "default" | "section";
  indent?: number;
  className?: string;
}

export function OtoDivider({
  variant = "default",
  indent = 0,
  className = "",
}: OtoDividerProps) {
  return (
    <hr
      className={[
        "border-0 border-t border-dark-grey",
        variant === "section" ? "my-6" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={indent ? { marginLeft: indent } : undefined}
    />
  );
}
