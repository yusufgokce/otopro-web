'use client'

import { useReducer, useState } from 'react'
import type { ServiceType, BodyStylePricing, WizardState, WizardAction } from '@/lib/types/booking'
import { ServiceStep } from './steps/service-step'
import { ScheduleStep } from './steps/schedule-step'
import { VehicleStep } from './steps/vehicle-step'
import { ReviewStep } from './steps/review-step'
import { AuthStep } from './steps/auth-step'
import { PaymentStep } from './steps/payment-step'
import { Confirmation } from './steps/confirmation'

const initialState: WizardState = {
  currentStep: 0,
  selectedService: null,
  selectedDate: null,
  selectedTime: null,
  vehicleMake: '',
  vehicleModel: '',
  vehicleYear: '',
  vehicleColor: '',
  bodyStyle: null,
  streetAddress: '',
  city: '',
  province: '',
  postalCode: '',
  specialRequests: '',
}

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SELECT_SERVICE':
      return { ...state, selectedService: action.payload }
    case 'SET_DATE':
      return { ...state, selectedDate: action.payload }
    case 'SET_TIME':
      return { ...state, selectedTime: action.payload }
    case 'SET_VEHICLE':
      return { ...state, ...action.payload }
    case 'SET_ADDRESS':
      return { ...state, ...action.payload }
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 5) }
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) }
    case 'GO_TO_STEP':
      return { ...state, currentStep: action.payload }
    default:
      return state
  }
}

interface Props {
  services: ServiceType[]
  bodyStylePricing: BodyStylePricing[]
  isAuthenticated: boolean
}

export function BookingWizard({ services, bodyStylePricing, isAuthenticated }: Props) {
  const [state, dispatch] = useReducer(wizardReducer, initialState)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [paymentComplete, setPaymentComplete] = useState(false)

  const surcharge = bodyStylePricing.find(
    (b) => b.body_style === state.bodyStyle,
  )?.surcharge ?? 0

  const totalPrice = (state.selectedService?.base_price ?? 0) + surcharge
  const depositAmount = Math.round(totalPrice * 0.3 * 100) / 100

  // Confirmation screen
  if (paymentComplete) {
    return <Confirmation state={state} totalPrice={totalPrice} depositAmount={depositAmount} />
  }

  // Determine steps & labels based on auth status
  const stepsLabels = isAuthenticated
    ? ['Service', 'Schedule', 'Vehicle', 'Review', 'Payment']
    : ['Service', 'Schedule', 'Vehicle', 'Review', 'Account', 'Payment']

  const paymentStepIndex = isAuthenticated ? 4 : 5

  const showPayment = state.currentStep === paymentStepIndex && bookingId

  return (
    <div className="max-w-2xl mx-auto px-6 pb-20">
      {/* Progress bar */}
      <div className="flex items-center justify-center gap-2 py-8">
        {stepsLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  i < state.currentStep
                    ? 'bg-gold-400 text-black'
                    : i === state.currentStep
                      ? 'bg-gold-400 text-black'
                      : 'bg-dark-grey text-grey'
                }`}
              >
                {i < state.currentStep ? '\u2713' : i + 1}
              </div>
              <span className="text-[10px] text-grey mt-1 hidden sm:block">{label}</span>
            </div>
            {i < stepsLabels.length - 1 && (
              <div
                className={`w-8 h-px ${
                  i < state.currentStep ? 'bg-gold-400' : 'bg-dark-grey'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Steps */}
      {state.currentStep === 0 && (
        <ServiceStep services={services} state={state} dispatch={dispatch} />
      )}
      {state.currentStep === 1 && (
        <ScheduleStep state={state} dispatch={dispatch} />
      )}
      {state.currentStep === 2 && (
        <VehicleStep
          state={state}
          dispatch={dispatch}
          bodyStylePricing={bodyStylePricing}
        />
      )}
      {state.currentStep === 3 && (
        <ReviewStep
          state={state}
          dispatch={dispatch}
          surcharge={surcharge}
          totalPrice={totalPrice}
          depositAmount={depositAmount}
          isAuthenticated={isAuthenticated}
          onBookingCreated={(id) => {
            setBookingId(id)
            dispatch({ type: 'GO_TO_STEP', payload: paymentStepIndex })
          }}
        />
      )}
      {state.currentStep === 4 && !isAuthenticated && (
        <AuthStep
          state={state}
          surcharge={surcharge}
          totalPrice={totalPrice}
          depositAmount={depositAmount}
          dispatch={dispatch}
          onBookingCreated={(id) => {
            setBookingId(id)
            dispatch({ type: 'GO_TO_STEP', payload: paymentStepIndex })
          }}
        />
      )}
      {showPayment && (
        <PaymentStep
          bookingId={bookingId}
          depositAmount={depositAmount}
          totalPrice={totalPrice}
          onPaymentComplete={() => setPaymentComplete(true)}
        />
      )}
    </div>
  )
}
