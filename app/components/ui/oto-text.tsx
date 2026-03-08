import { type HTMLAttributes, type ElementType, type ReactNode } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// OtoText — Typography hierarchy (h1–h7 + body + caption + label)
// ─────────────────────────────────────────────────────────────────────────────
//
// Usage:
//   <OtoText.H1>Page Title</OtoText.H1>
//   <OtoText.H3 className="text-gold-400">Accented Title</OtoText.H3>
//   <OtoText.Body>Regular paragraph text</OtoText.Body>
//   <OtoText.Caption>2 hours ago</OtoText.Caption>
//   <OtoText.Label>SECTION HEADER</OtoText.Label>

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
}

function createTextComponent(
  defaultTag: ElementType,
  defaultClasses: string,
  displayName: string
) {
  function TextComponent({
    as: Tag = defaultTag,
    className = "",
    children,
    ...props
  }: TextProps) {
    return (
      <Tag className={`${defaultClasses} ${className}`} {...props}>
        {children}
      </Tag>
    );
  }
  TextComponent.displayName = displayName;
  return TextComponent;
}

// ── Headers ──

/** 32px, bold, -0.5 tracking — Page titles, hero text */
const H1 = createTextComponent(
  "h1",
  "text-[32px] font-bold tracking-[-0.5px] text-white",
  "OtoText.H1"
);

/** 28px, bold, -0.5 tracking — Section headers */
const H2 = createTextComponent(
  "h2",
  "text-[28px] font-bold tracking-[-0.5px] text-white",
  "OtoText.H2"
);

/** 24px, semibold, -0.3 tracking — Card titles, dialogs */
const H3 = createTextComponent(
  "h3",
  "text-2xl font-semibold tracking-[-0.3px] text-white",
  "OtoText.H3"
);

/** 20px, semibold, -0.2 tracking — Sub-section headers */
const H4 = createTextComponent(
  "h4",
  "text-xl font-semibold tracking-[-0.2px] text-white",
  "OtoText.H4"
);

/** 18px, semibold, -0.1 tracking — Group headers */
const H5 = createTextComponent(
  "h5",
  "text-lg font-semibold tracking-[-0.1px] text-white",
  "OtoText.H5"
);

/** 16px, semibold — List item titles, bold body */
const H6 = createTextComponent(
  "h6",
  "text-base font-semibold text-white",
  "OtoText.H6"
);

/** 14px, semibold, 0.1 tracking — Small headers, labels */
const H7 = createTextComponent(
  "span",
  "text-sm font-semibold tracking-[0.1px] text-white",
  "OtoText.H7"
);

// ── Body ──

/** 16px, normal, 1.5 leading — Default body text */
const Body = createTextComponent(
  "p",
  "text-base font-normal leading-relaxed text-white",
  "OtoText.Body"
);

/** 14px, normal, 1.5 leading — Secondary body text */
const BodySmall = createTextComponent(
  "p",
  "text-sm font-normal leading-relaxed text-dark-silver",
  "OtoText.BodySmall"
);

/** 12px, normal, 1.4 leading — Timestamps, hints */
const Caption = createTextComponent(
  "span",
  "text-xs font-normal leading-snug text-dark-silver",
  "OtoText.Caption"
);

// ── Labels & Utility ──

/** 12px, semibold, 0.5 tracking, uppercase — Form labels, section dividers */
const Label = createTextComponent(
  "span",
  "text-xs font-semibold tracking-[0.5px] uppercase text-grey",
  "OtoText.Label"
);

/** 10px, semibold, 1.0 tracking, uppercase — Category labels, tiny tags */
const Overline = createTextComponent(
  "span",
  "text-[10px] font-semibold tracking-[1px] uppercase text-grey",
  "OtoText.Overline"
);

// ── Export as namespace ──

export const OtoText = {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  H7,
  Body,
  BodySmall,
  Caption,
  Label,
  Overline,
};
