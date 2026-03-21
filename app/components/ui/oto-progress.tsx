"use client";

// ─────────────────────────────────────────────────────────────────────────────
// OtoProgressBar — Dynamic progress bar with color-changing properties
// ─────────────────────────────────────────────────────────────────────────────
//
// Usage:
//   <OtoProgressBar value={0.65} />                          // dynamic color
//   <OtoProgressBar value={0.5} colorMode="static" />        // gold
//   <OtoProgressBar value={0.8} showLabel height={8} />      // with "80%" label
//
// Step variant:
//   <OtoStepProgress current={2} total={5} />

interface OtoProgressBarProps {
  value: number; // 0.0 to 1.0
  colorMode?: "static" | "dynamic" | "gradient";
  staticColor?: string; // tailwind color class, default gold
  height?: number;
  showLabel?: boolean;
  className?: string;
}

// Maps value (0–1) to CSS color for dynamic mode
function dynamicColor(v: number): string {
  const c = Math.max(0, Math.min(1, v));
  // These map to the Tailwind token hex values
  if (c <= 0.33) return `color-mix(in srgb, #F76B5A ${Math.round((1 - c / 0.33) * 100)}%, #E29C57)`;
  if (c <= 0.66) return `color-mix(in srgb, #E29C57 ${Math.round((1 - (c - 0.33) / 0.33) * 100)}%, #F9A471)`;
  return `color-mix(in srgb, #F9A471 ${Math.round((1 - (c - 0.66) / 0.34) * 100)}%, #7B9B54)`;
}

export function OtoProgressBar({
  value,
  colorMode = "dynamic",
  height = 4,
  showLabel = false,
  className = "",
}: OtoProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, value));
  const radius = height / 2;
  const percent = Math.round(clamped * 100);

  let fillStyle: React.CSSProperties;

  if (colorMode === "gradient") {
    fillStyle = {
      width: `${percent}%`,
      background: "linear-gradient(to right, #F76B5A, #E29C57, #F9A471, #7B9B54)",
    };
  } else if (colorMode === "static") {
    fillStyle = {
      width: `${percent}%`,
      backgroundColor: "#F9A471", // accent-blue-500
    };
  } else {
    fillStyle = {
      width: `${percent}%`,
      backgroundColor: dynamicColor(clamped),
    };
  }

  return (
    <div className={className}>
      {showLabel && (
        <div className="text-right mb-1">
          <span className="text-xs text-dark-silver">{percent}%</span>
        </div>
      )}
      <div
        className="w-full bg-dark-grey overflow-hidden"
        style={{ height, borderRadius: radius }}
      >
        <div
          className="h-full transition-all duration-300 ease-in-out"
          style={{ ...fillStyle, borderRadius: radius }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OtoStepProgress — Segmented step indicator for wizards
// ─────────────────────────────────────────────────────────────────────────────

interface OtoStepProgressProps {
  current: number;
  total: number;
  className?: string;
}

export function OtoStepProgress({
  current,
  total,
  className = "",
}: OtoStepProgressProps) {
  return (
    <div className={`flex gap-1 px-4 py-2 ${className}`}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={[
            "h-1 flex-1 rounded-full transition-colors duration-300",
            i <= current ? "bg-accent-blue-500" : "bg-dark-grey",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OtoStepCircles — Numbered circle step indicator (for booking wizard)
// ─────────────────────────────────────────────────────────────────────────────

interface OtoStepCirclesProps {
  current: number;
  steps: string[];
  className?: string;
}

export function OtoStepCircles({
  current,
  steps,
  className = "",
}: OtoStepCirclesProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {steps.map((label, i) => {
        const isCompleted = i < current;
        const isActive = i === current;
        const isLast = i === steps.length - 1;

        return (
          <div key={i} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center">
              <div
                className={[
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                  isCompleted
                    ? "bg-accent-blue-500 text-white"
                    : isActive
                      ? "bg-accent-blue-500/20 text-accent-blue-500 border-2 border-accent-blue-500"
                      : "bg-surface-widget text-grey border border-dark-grey",
                ].join(" ")}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              {/* Label (hidden on mobile) */}
              <span
                className={[
                  "hidden sm:block mt-1.5 text-xs whitespace-nowrap",
                  isActive ? "text-accent-blue-500 font-semibold" : "text-grey",
                ].join(" ")}
              >
                {label}
              </span>
            </div>

            {/* Connecting line */}
            {!isLast && (
              <div
                className={[
                  "w-8 md:w-12 h-px mx-1",
                  isCompleted ? "bg-accent-blue-500" : "bg-dark-grey",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
