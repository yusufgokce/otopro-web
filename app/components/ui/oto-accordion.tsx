"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// OtoAccordion — FAQ / collapsible section with smooth animation
// ─────────────────────────────────────────────────────────────────────────────
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
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(
    defaultOpen ? undefined : 0
  );

  useEffect(() => {
    if (!contentRef.current) return;

    if (isOpen) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight);
      // After transition, set to auto so content can resize naturally
      const timeout = setTimeout(() => setHeight(undefined), 300);
      return () => clearTimeout(timeout);
    } else {
      // First set explicit height so transition can animate from it
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight);
      // Force reflow, then collapse
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHeight(0);
        });
      });
    }
  }, [isOpen]);

  return (
    <div className={`border-b border-dark-grey/40 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-5 cursor-pointer select-none text-left"
      >
        <span className="text-base font-semibold text-foreground pr-4">
          {title}
        </span>
        <span
          className={`text-accent-blue-500 text-xl font-light shrink-0 transition-transform duration-300 ease-out ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
        >
          +
        </span>
      </button>
      <div
        ref={contentRef}
        style={{
          height: height !== undefined ? `${height}px` : "auto",
          overflow: "hidden",
          transition: "height 300ms cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      >
        <div className="pb-5 text-foreground-muted leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
