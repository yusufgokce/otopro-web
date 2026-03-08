"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useId,
} from "react";

// ─────────────────────────────────────────────────────────────────────────────
// OtoInput — Standardized text field with top-left label
// ─────────────────────────────────────────────────────────────────────────────
//
// Usage:
//   <OtoInput label="Email" placeholder="you@example.com" />
//   <OtoInput label="Password" type="password" required error="Too short" />
//   <OtoInput label="Phone" prefixIcon={<Phone />} />

interface OtoInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  error?: string;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  onSuffixClick?: () => void;
}

export const OtoInput = forwardRef<HTMLInputElement, OtoInputProps>(
  (
    {
      label,
      error,
      prefixIcon,
      suffixIcon,
      onSuffixClick,
      required,
      disabled,
      className = "",
      id: idProp,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const hasError = !!error;

    return (
      <div className={`${disabled ? "opacity-50" : ""} ${className}`}>
        {/* ── Top-left label ── */}
        <label
          htmlFor={id}
          className="block text-xs font-semibold tracking-[0.5px] uppercase text-dark-silver mb-2"
        >
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>

        {/* ── Input field ── */}
        <div className="relative">
          {prefixIcon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-grey w-5 h-5">
              {prefixIcon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${id}-error` : undefined}
            className={[
              "w-full bg-dune border rounded-lg px-4 py-3 text-white",
              "placeholder:text-grey",
              "focus:outline-none focus:ring-1 transition-colors",
              hasError
                ? "border-red-400 focus:border-red-400 focus:ring-red-400/50"
                : "border-dark-grey focus:border-gold-400 focus:ring-gold-400/50",
              prefixIcon ? "pl-11" : "",
              suffixIcon ? "pr-11" : "",
              disabled ? "cursor-not-allowed" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />

          {suffixIcon && (
            <button
              type="button"
              tabIndex={-1}
              onClick={onSuffixClick}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-grey w-5 h-5 hover:text-dark-silver transition-colors"
            >
              {suffixIcon}
            </button>
          )}
        </div>

        {/* ── Error text ── */}
        {hasError && (
          <p
            id={`${id}-error`}
            className="mt-1.5 text-xs text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

OtoInput.displayName = "OtoInput";

// ─────────────────────────────────────────────────────────────────────────────
// OtoSelect — Standardized select dropdown with top-left label
// ─────────────────────────────────────────────────────────────────────────────

interface OtoSelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "size"
  > {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const OtoSelect = forwardRef<HTMLSelectElement, OtoSelectProps>(
  (
    {
      label,
      error,
      options,
      placeholder,
      required,
      disabled,
      className = "",
      id: idProp,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const hasError = !!error;

    return (
      <div className={`${disabled ? "opacity-50" : ""} ${className}`}>
        <label
          htmlFor={id}
          className="block text-xs font-semibold tracking-[0.5px] uppercase text-dark-silver mb-2"
        >
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>

        <select
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={hasError}
          className={[
            "w-full bg-dune border rounded-lg px-4 py-3 text-white",
            "focus:outline-none focus:ring-1 transition-colors",
            "appearance-none cursor-pointer",
            hasError
              ? "border-red-400 focus:border-red-400 focus:ring-red-400/50"
              : "border-dark-grey focus:border-gold-400 focus:ring-gold-400/50",
            disabled ? "cursor-not-allowed" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        >
          {placeholder && (
            <option value="" className="text-grey">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {hasError && (
          <p
            id={`${id}-error`}
            className="mt-1.5 text-xs text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

OtoSelect.displayName = "OtoSelect";
