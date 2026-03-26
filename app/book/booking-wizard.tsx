'use client'

import { useReducer, useState, useEffect, useRef, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import type { ServiceType, BodyStylePricing, BodyStyle, WizardState, WizardAction } from '@/lib/types/booking'
import { VehicleStep } from './steps/vehicle-step'
import { ServiceStep } from './steps/service-step'
import { DetailsStep } from './steps/details-step'
import { AccountStep } from './steps/account-step'
import { PaymentStep } from './steps/payment-step'
import { Confirmation } from './steps/confirmation'
import { createBooking } from '@/lib/actions/booking'

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

interface Props {
  services: ServiceType[]
  bodyStylePricing: BodyStylePricing[]
  isAuthenticated: boolean
}

/**
 * New booking flow:
 * 1. Vehicle  — "Find your quote" (always shown, even from hamburger)
 * 2. Service  — prices with surcharge baked in
 * 3. Details  — Schedule + Location merged into one scrollable page
 * 4. Account  — login / signup / guest (skipped if already authenticated)
 * 5. Payment  — Stripe deposit
 */
export function BookingWizard({ services, bodyStylePricing, isAuthenticated }: Props) {
  const searchParams = useSearchParams()
  const [state, dispatch] = useReducer(wizardReducer, initialState)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [userAuthenticated, setUserAuthenticated] = useState(isAuthenticated)
  const [guestEmail, setGuestEmail] = useState<string | null>(null)
  const [bookingError, setBookingError] = useState('')
  const [isCreatingBooking, startBookingTransition] = useTransition()
  const prefilled = useRef(false)
  const bookingCreationStarted = useRef(false)

  // Build dynamic step list
  const steps = (() => {
    const s: string[] = ['Vehicle', 'Service', 'Details']
    if (!userAuthenticated) s.push('Account')
    s.push('Payment')
    return s
  })()

  const paymentStepIndex = steps.indexOf('Payment')

  // Persist wizard state to sessionStorage on every change
  useEffect(() => {
    sessionStorage.setItem('otopro-wizard', JSON.stringify(state))
  }, [state])

  // Clear sessionStorage when payment is complete
  useEffect(() => {
    if (paymentComplete) {
      sessionStorage.removeItem('otopro-wizard')
    }
  }, [paymentComplete])

  // Pre-fill from URL params (coming from homepage price calculator)
  useEffect(() => {
    if (prefilled.current) return
    prefilled.current = true

    const year = searchParams.get('year')
    const make = searchParams.get('make')
    const model = searchParams.get('model')
    const body = searchParams.get('body') as BodyStyle | null
    const color = searchParams.get('color')
    const serviceId = searchParams.get('service')
    const hasUrlParams = year || make || model || body || color || serviceId

    // Restore from sessionStorage if no URL params are present
    if (!hasUrlParams) {
      try {
        const saved = sessionStorage.getItem('otopro-wizard')
        if (saved) {
          const parsed = JSON.parse(saved) as WizardState
          // Re-lookup selectedService from the services prop (methods don't survive JSON round-trip)
          if (parsed.selectedService) {
            const matchedService = services.find((s) => s.id === parsed.selectedService!.id)
            parsed.selectedService = matchedService ?? null
          }
          // Restore each field via existing actions
          if (parsed.vehicleMake || parsed.vehicleModel || parsed.vehicleYear || parsed.bodyStyle || parsed.vehicleColor) {
            dispatch({
              type: 'SET_VEHICLE',
              payload: {
                vehicleMake: parsed.vehicleMake,
                vehicleModel: parsed.vehicleModel,
                vehicleYear: parsed.vehicleYear,
                vehicleColor: parsed.vehicleColor,
                bodyStyle: parsed.bodyStyle,
              },
            })
          }
          if (parsed.selectedService) {
            dispatch({ type: 'SELECT_SERVICE', payload: parsed.selectedService })
          }
          if (parsed.selectedDate) dispatch({ type: 'SET_DATE', payload: parsed.selectedDate })
          if (parsed.selectedTime) dispatch({ type: 'SET_TIME', payload: parsed.selectedTime })
          if (parsed.streetAddress || parsed.city || parsed.province || parsed.postalCode) {
            dispatch({
              type: 'SET_ADDRESS',
              payload: {
                streetAddress: parsed.streetAddress,
                city: parsed.city,
                province: parsed.province,
                postalCode: parsed.postalCode,
                specialRequests: parsed.specialRequests,
              },
            })
          }
          if (parsed.currentStep > 0) {
            dispatch({ type: 'GO_TO_STEP', payload: parsed.currentStep })
          }
          return
        }
      } catch {
        // Invalid sessionStorage data — ignore and continue with URL params / defaults
      }
    }

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

    // If all vehicle params + service are present, pre-select service and skip to Details
    if (year && make && model && body && color && serviceId) {
      const matchedService = services.find((s) => s.id === serviceId)
      if (matchedService) {
        dispatch({ type: 'SELECT_SERVICE', payload: matchedService })
        dispatch({ type: 'GO_TO_STEP', payload: 2 })
      }
    }
  }, [searchParams, services])

  const surcharge = Number(
    bodyStylePricing.find((b) => b.body_style === state.bodyStyle)?.surcharge ?? 0
  )

  const totalPrice = Number(state.selectedService?.base_price ?? 0) + surcharge
  const depositAmount = Math.round(totalPrice * 0.3 * 100) / 100

  /** Create booking in DB, then advance to payment */
  function handleCreateBookingAndPay(email?: string) {
    if (bookingCreationStarted.current) return
    bookingCreationStarted.current = true
    setBookingError('')
    startBookingTransition(async () => {
      const result = await createBooking({
        vehicleMake: state.vehicleMake,
        vehicleModel: state.vehicleModel,
        vehicleYear: parseInt(state.vehicleYear),
        vehicleColor: state.vehicleColor,
        bodyStyle: state.bodyStyle!,
        serviceTypeId: state.selectedService!.id,
        scheduledDate: state.selectedDate!,
        scheduledTime: state.selectedTime!,
        streetAddress: state.streetAddress,
        city: state.city,
        province: state.province,
        postalCode: state.postalCode,
        specialRequests: state.specialRequests,
        basePrice: state.selectedService!.base_price,
        bodyStyleSurcharge: surcharge,
        totalPrice,
        depositAmount,
        ...(email && { guestEmail: email }),
      })

      if (result.success && result.bookingId) {
        setBookingId(result.bookingId)
        dispatch({ type: 'GO_TO_STEP', payload: paymentStepIndex })
      } else {
        // Reset so user can retry
        bookingCreationStarted.current = false
        setBookingError(result.error || 'Something went wrong creating your booking')
      }
    })
  }

  // Confirmation screen
  if (paymentComplete) {
    return (
      <Confirmation
        state={state}
        totalPrice={totalPrice}
        depositAmount={depositAmount}
        bookingId={bookingId}
        email={guestEmail ?? undefined}
      />
    )
  }

  // For authenticated users: when they advance past Details, create booking automatically
  const needsBookingCreation =
    userAuthenticated &&
    !bookingId &&
    !isCreatingBooking &&
    !bookingError &&
    state.currentStep === paymentStepIndex

  useEffect(() => {
    if (needsBookingCreation && !bookingCreationStarted.current) {
      handleCreateBookingAndPay()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsBookingCreation])

  const showPayment = state.currentStep === paymentStepIndex && bookingId
  const currentStepName = steps[state.currentStep] ?? 'Vehicle'

  return (
    <div className="max-w-5xl mx-auto px-6 h-[calc(100vh-80px)] flex flex-col md:flex-row gap-8 bg-surface-primary">
      {/* Mobile progress (horizontal) */}
      <div className="flex items-center justify-center gap-2 pt-6 pb-2 md:hidden">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                i <= state.currentStep
                  ? 'bg-accent-blue-500 text-white'
                  : 'bg-surface-widget-hover text-foreground-muted'
              }`}
            >
              {i < state.currentStep ? '\u2713' : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-6 h-px ${
                  i < state.currentStep ? 'bg-accent-blue-500' : 'bg-surface-widget-hover'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto min-h-0 pt-2 md:pt-8 scrollbar-hide">
        {currentStepName === 'Vehicle' && (
          <VehicleStep
            state={state}
            dispatch={dispatch}
            bodyStylePricing={bodyStylePricing}
          />
        )}
        {currentStepName === 'Service' && (
          <ServiceStep
            services={services}
            state={state}
            dispatch={dispatch}
            surcharge={surcharge}
          />
        )}
        {currentStepName === 'Details' && (
          <DetailsStep state={state} dispatch={dispatch} />
        )}
        {currentStepName === 'Account' && (
          <AccountStep
            dispatch={dispatch}
            onAuthenticated={() => {
              setUserAuthenticated(true)
              // Directly trigger booking creation — don't rely solely on the effect.
              // setTimeout lets state settle (steps array recomputes) before we act.
              setTimeout(() => handleCreateBookingAndPay(), 0)
            }}
            onGuest={(email) => {
              setGuestEmail(email)
              handleCreateBookingAndPay(email)
            }}
          />
        )}
        {/* If user is already authenticated, create booking when leaving Details step */}
        {showPayment && (
          <PaymentStep
            bookingId={bookingId}
            depositAmount={depositAmount}
            totalPrice={totalPrice}
            onPaymentComplete={() => setPaymentComplete(true)}
          />
        )}

        {/* Booking creation error */}
        {bookingError && (
          <p className="text-red-400 text-sm text-center mt-4">{bookingError}</p>
        )}
        {isCreatingBooking && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-accent-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-dark-silver text-sm">Creating your booking...</span>
          </div>
        )}
      </div>

      {/* Desktop vertical progress sidebar */}
      <aside className="hidden md:flex flex-col items-center justify-center w-44 shrink-0">
        <div className="flex flex-col items-start gap-0">
          {steps.map((label, i) => (
            <div key={label} className="flex flex-col items-center">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    i < state.currentStep
                      ? 'bg-accent-blue-500 text-white'
                      : i === state.currentStep
                        ? 'bg-accent-blue-500 text-white ring-2 ring-accent-blue-500/30 ring-offset-2 ring-offset-surface-primary'
                        : 'bg-surface-widget-hover text-foreground-muted'
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
              {i < steps.length - 1 && (
                <div className="flex justify-start ml-[17px]">
                  <div
                    className={`w-px h-8 ${
                      i < state.currentStep ? 'bg-accent-blue-500' : 'bg-surface-widget-hover'
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

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SELECT_SERVICE':
      // No longer auto-advances — just sets the service
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
      return { ...state, currentStep: state.currentStep + 1 }
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) }
    case 'EDIT_FROM_REVIEW':
      return {
        ...state,
        currentStep: action.payload,
        editingFromReview: true,
        _returnToStep: state.currentStep,
      }
    case 'RETURN_TO_REVIEW':
      return {
        ...state,
        currentStep: state._returnToStep ?? state.currentStep,
        editingFromReview: false,
        _returnToStep: undefined,
      }
    case 'GO_TO_STEP':
      return { ...state, currentStep: action.payload }
    default:
      return state
  }
}
