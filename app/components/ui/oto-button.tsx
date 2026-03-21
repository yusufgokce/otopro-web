"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// OtoButton — Unified button system
// ─────────────────────────────────────────────────────────────────────────────
//
// Usage:
//   <OtoButton>Continue</OtoButton>
//   <OtoButton variant="destructive" size="sm">Delete</OtoButton>
//   <OtoButton variant="outline" icon={<ArrowRight />} iconPosition="end">Next</OtoButton>
//   <OtoButton isLoading>Saving…</OtoButton>
//   <OtoButton variant="ghost" size="sm">Cancel</OtoButton>

export type OtoButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

export type OtoButtonSize = "sm" | "md" | "lg";

interface OtoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: OtoButtonVariant;
  size?: OtoButtonSize;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  isLoading?: boolean;
  isFullWidth?: boolean;
}

// ── Size classes ──

const sizeClasses: Record<OtoButtonSize, string> = {
  sm: "h-9 px-4 text-sm rounded-lg gap-1.5",
  md: "h-11 px-5 text-sm rounded-xl gap-2",
  lg: "h-[52px] px-6 text-base rounded-xl gap-2",
};

const iconSizeClasses: Record<OtoButtonSize, string> = {
  sm: "w-[18px] h-[18px]",
  md: "w-5 h-5",
  lg: "w-5 h-5",
};

// ── Variant classes ──

const variantClasses: Record<OtoButtonVariant, string> = {
  primary: [
    "bg-accent-blue-500 text-white font-semibold",
    "hover:bg-accent-blue-600 active:bg-accent-blue-700",
    "disabled:bg-grey disabled:text-dark-silver",
  ].join(" "),

  secondary: [
    "bg-surface-widget text-foreground font-semibold border border-dark-grey",
    "hover:bg-surface-widget-hover active:bg-dark-grey",
    "disabled:bg-surface-widget disabled:text-grey disabled:border-dark-grey/50",
  ].join(" "),

  outline: [
    "bg-transparent text-accent-blue-500 font-semibold border-[1.5px] border-accent-blue-500",
    "hover:bg-accent-blue-500/10 active:bg-accent-blue-500/20",
    "disabled:border-grey disabled:text-grey",
  ].join(" "),

  ghost: [
    "bg-transparent text-foreground font-semibold",
    "hover:bg-foreground/[0.06] active:bg-foreground/10",
    "disabled:text-grey",
  ].join(" "),

  destructive: [
    "bg-destructive-bg text-destructive-text font-semibold",
    "hover:bg-red-800/80 active:bg-red-700/80",
    "disabled:bg-grey disabled:text-dark-silver",
  ].join(" "),
};

// ── Component ──

export const OtoButton = forwardRef<HTMLButtonElement, OtoButtonProps>(
  (
    {
      variant = "primary",
      size = "lg",
      icon,
      iconPosition = "start",
      isLoading = false,
      isFullWidth = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const spinner = (
      <svg
        className={`animate-spin ${iconSizeClasses[size]}`}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    );

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={[
          "inline-flex items-center justify-center transition-colors cursor-pointer",
          "disabled:cursor-not-allowed",
          sizeClasses[size],
          variantClasses[variant],
          isFullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {isLoading ? (
          spinner
        ) : (
          <>
            {icon && iconPosition === "start" && (
              <span className={iconSizeClasses[size]}>{icon}</span>
            )}
            {children}
            {icon && iconPosition === "end" && (
              <span className={iconSizeClasses[size]}>{icon}</span>
            )}
          </>
        )}
      </button>
    );
  }
);

OtoButton.displayName = "OtoButton";
