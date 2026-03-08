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
    "bg-gold-400 text-black font-semibold",
    "hover:bg-gold-500 active:bg-gold-600",
    "disabled:bg-grey disabled:text-dark-silver",
  ].join(" "),

  secondary: [
    "bg-dune text-white font-semibold border border-dark-grey",
    "hover:bg-dark-grey/60 active:bg-dark-grey",
    "disabled:bg-dune disabled:text-grey disabled:border-dark-grey/50",
  ].join(" "),

  outline: [
    "bg-transparent text-gold-400 font-semibold border-[1.5px] border-gold-400",
    "hover:bg-gold-400/10 active:bg-gold-400/20",
    "disabled:border-grey disabled:text-grey",
  ].join(" "),

  ghost: [
    "bg-transparent text-white font-semibold",
    "hover:bg-white/[0.06] active:bg-white/10",
    "disabled:text-grey",
  ].join(" "),

  destructive: [
    "bg-red-400 text-white font-semibold",
    "hover:bg-red-500 active:bg-red-600",
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
