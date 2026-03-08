"use client";

import { type ReactNode } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// OtoAccordion — FAQ / collapsible section
// ─────────────────────────────────────────────────────────────────────────────
//
// Uses native <details>/<summary> — no JS required for toggle.
//
// Usage:
//   <OtoAccordion title="What is included?">
//     <p>Full interior and exterior detailing...</p>
//   </OtoAccordion>

interface OtoAccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function OtoAccordion({
  title,
  children,
  defaultOpen = false,
  className = "",
}: OtoAccordionProps) {
  return (
    <details
      open={defaultOpen}
      className={`group border-b border-dark-grey ${className}`}
    >
      <summary className="flex items-center justify-between py-5 cursor-pointer list-none select-none">
        <span className="text-base font-semibold text-white pr-4">
          {title}
        </span>
        <span className="text-gold-400 text-xl font-light transition-transform duration-200 group-open:rotate-45 shrink-0">
          +
        </span>
      </summary>
      <div className="pb-5 text-dark-silver leading-relaxed">
        {children}
      </div>
    </details>
  );
}
