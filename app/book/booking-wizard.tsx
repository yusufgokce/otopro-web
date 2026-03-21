'use client'

import { useReducer, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import type { ServiceType, BodyStylePricing, BodyStyle, WizardState, WizardAction } from '@/lib/types/booking'
import { ServiceStep } from './steps/service-step'
import { ScheduleStep } from './steps/schedule-step'
import { VehicleStep } from './steps/vehicle-step'
import { LocationStep } from './steps/location-step'
import { ReviewStep } from './steps/review-step'
import { AuthStep } from './steps/auth-step'
import { PaymentStep } from './steps/payment-step'
import { Confirmation } from './steps/confirmation'

const REVIEW_STEP = 4

const initialState: WizardState = {
  currentStep: 0,
  editingFromReview: false,
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
    case 'SELECT_SERVICE': {
      const nextStep = state.editingFromReview
        ? REVIEW_STEP
        : Math.min(state.currentStep + 1, 6)
      return {
        ...state,
        selectedService: action.payload,
        currentStep: nextStep,
        editingFromReview: false,
      }
    }
    case 'SET_DATE':
      return { ...state, selectedDate: action.payload }
    case 'SET_TIME':
      return { ...state, selectedTime: action.payload }
    case 'SET_VEHICLE':
      return { ...state, ...action.payload }
    case 'SET_ADDRESS':
      return { ...state, ...action.payload }
    case 'NEXT_STEP':
      // If editing from review, go back to review instead of next step
      if (state.editingFromReview) {
        return { ...state, currentStep: REVIEW_STEP, editingFromReview: false }
      }
      return { ...state, currentStep: Math.min(state.currentStep + 1, 6) }
    case 'PREV_STEP':
      // If editing from review, cancel edit and go back to review
      if (state.editingFromReview) {
        return { ...state, currentStep: REVIEW_STEP, editingFromReview: false }
      }
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) }
    case 'EDIT_FROM_REVIEW':
      return { ...state, currentStep: action.payload, editingFromReview: true }
    case 'RETURN_TO_REVIEW':
      return { ...state, currentStep: REVIEW_STEP, editingFromReview: false }
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
  const searchParams = useSearchParams()
  const [state, dispatch] = useReducer(wizardReducer, initialState)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const prefilled = useRef(false)

  // Pre-fill from URL params (coming from homepage price calculator)
  useEffect(() => {
    if (prefilled.current) return
    prefilled.current = true

    const serviceId = searchParams.get('service')
    const year = searchParams.get('year')
    const make = searchParams.get('make')
    const model = searchParams.get('model')
    const body = searchParams.get('body') as BodyStyle | null
    const color = searchParams.get('color')

    // Pre-fill vehicle data
    if (year || make || model || body || color) {
      dispatch({
        type: 'SET_VEHICLE',
        payload: {
          ...(year && { vehicleYear: year }),
          ...(make && { vehicleMake: make }),
          ...(model && { vehicleModel: model }),
          ...(body && { bodyStyle: body }),
          ...(color && { vehicleColor: color }),
        },
      })
    }

    // Pre-select service and skip to schedule step
    if (serviceId) {
      const service = services.find((s) => s.id === serviceId)
      if (service) {
        dispatch({ type: 'SELECT_SERVICE', payload: service })
        if (year && make && model && body) {
          dispatch({ type: 'GO_TO_STEP', payload: 1 })
        }
      }
    }
  }, [searchParams, services])

  const surcharge = Number(bodyStylePricing.find(
    (b) => b.body_style === state.bodyStyle,
  )?.surcharge ?? 0)

  const totalPrice = Number(state.selectedService?.base_price ?? 0) + surcharge
  const depositAmount = Math.round(totalPrice * 0.3 * 100) / 100

  // Confirmation screen
  if (paymentComplete) {
    return <Confirmation state={state} totalPrice={totalPrice} depositAmount={depositAmount} />
  }

  // Steps: Service(0) → Schedule(1) → Vehicle(2) → Location(3) → Review(4) → [Account(5)] → Payment(5 or 6)
  const stepsLabels = isAuthenticated
    ? ['Service', 'Schedule', 'Vehicle', 'Location', 'Review', 'Payment']
    : ['Service', 'Schedule', 'Vehicle', 'Location', 'Review', 'Account', 'Payment']

  const reviewStepIndex = 4
  const paymentStepIndex = isAuthenticated ? 5 : 6
  const accountStepIndex = isAuthenticated ? -1 : 5

  const showPayment = state.currentStep === paymentStepIndex && bookingId

  return (
    <div className="max-w-5xl mx-auto px-6 h-[calc(100vh-80px)] flex flex-col md:flex-row gap-8 bg-surface-primary">
      {/* ── Mobile progress (horizontal, shown on small screens) ── */}
      <div className="flex items-center justify-center gap-2 pt-6 pb-2 md:hidden">
        {stepsLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                i <= state.currentStep
                  ? 'bg-accent-blue-500 text-white'
                  : 'bg-dark-grey text-grey'
              }`}
            >
              {i < state.currentStep ? '\u2713' : i + 1}
            </div>
            {i < stepsLabels.length - 1 && (
              <div
                className={`w-6 h-px ${
                  i < state.currentStep ? 'bg-accent-blue-500' : 'bg-dark-grey'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Main content area (scrollable) ── */}
      <div className="flex-1 overflow-y-auto min-h-0 pb-6 pt-2 md:pt-8">
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
          <LocationStep state={state} dispatch={dispatch} />
        )}
        {state.currentStep === reviewStepIndex && (
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
        {state.currentStep === accountStepIndex && !isAuthenticated && (
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

      {/* ── Desktop vertical progress sidebar (right side) ── */}
      <aside className="hidden md:flex flex-col items-center pt-8 pb-8 w-44 shrink-0">
        <div className="flex flex-col items-start gap-0 flex-1">
          {stepsLabels.map((label, i) => (
            <div key={label} className="flex flex-col items-center">
              {/* Step row */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    i < state.currentStep
                      ? 'bg-accent-blue-500 text-white'
                      : i === state.currentStep
                        ? 'bg-accent-blue-500 text-white ring-2 ring-accent-blue-500/30 ring-offset-2 ring-offset-surface-primary'
                        : 'bg-dark-grey text-grey'
                  }`}
                >
                  {i < state.currentStep ? '\u2713' : i + 1}
                </div>
                <span
                  className={`text-sm transition-colors ${
                    i === state.currentStep
                      ? 'text-foreground font-semibold'
                      : i < state.currentStep
                        ? 'text-silver'
                        : 'text-grey'
                  }`}
                >
                  {label}
                </span>
              </div>
              {/* Connector line */}
              {i < stepsLabels.length - 1 && (
                <div className="flex justify-start ml-[17px]">
                  <div
                    className={`w-px h-8 ${
                      i < state.currentStep ? 'bg-accent-blue-500' : 'bg-dark-grey'
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
