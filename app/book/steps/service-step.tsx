'use client'

import type { ServiceType, WizardState, WizardAction } from '@/lib/types/booking'

interface Props {
  services: ServiceType[]
  state: WizardState
  dispatch: React.Dispatch<WizardAction>
}

export function ServiceStep({ services, state, dispatch }: Props) {
  const bookable = services.filter((s) => s.base_price > 0)

  function select(service: ServiceType) {
    dispatch({ type: 'SELECT_SERVICE', payload: service })
    setTimeout(() => dispatch({ type: 'NEXT_STEP' }), 200)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-2">Choose your detail package</h1>
      <p className="text-white/50 text-center mb-10">
        Select the service that fits your needs
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {bookable.map((s) => {
          const selected = state.selectedService?.id === s.id
          return (
            <button
              key={s.id}
              onClick={() => select(s)}
              className={`text-left p-6 rounded-2xl border transition-all ${
                selected
                  ? 'bg-[#6B4EFF]/10 border-[#6B4EFF]'
                  : 'bg-white/[0.04] border-white/[0.08] hover:border-[#6B4EFF]/40'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg">{s.name}</h3>
                {selected && (
                  <span className="text-[#6B4EFF] text-lg">✓</span>
                )}
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                {s.description}
              </p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-[#6B4EFF]">
                  ${s.base_price}
                </span>
                <span className="text-white/40 text-sm">
                  ~{s.estimated_duration_hours} hrs
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
