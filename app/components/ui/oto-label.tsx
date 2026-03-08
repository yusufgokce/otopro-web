import { type ReactNode } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// OtoLabel — Standardized section label (top-left, uppercase, muted)
// ─────────────────────────────────────────────────────────────────────────────
//
// Usage:
//   <OtoLabel>Upcoming Sessions</OtoLabel>
//   <OtoLabel trailing={<OtoButton variant="ghost" size="sm">Edit</OtoButton>}>
//     Vehicle Details
//   </OtoLabel>

interface OtoLabelProps {
  children: ReactNode;
  trailing?: ReactNode;
  className?: string;
}

export function OtoLabel({
  children,
  trailing,
  className = "",
}: OtoLabelProps) {
  return (
    <div
      className={`flex items-center justify-between mb-2 ${className}`}
    >
      <span className="text-xs font-semibold tracking-[0.5px] uppercase text-grey">
        {children}
      </span>
      {trailing}
    </div>
  );
}
