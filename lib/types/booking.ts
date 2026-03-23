export interface ServiceType {
  id: string
  name: string
  description: string
  base_price: number
  estimated_duration_hours: number
  is_active: boolean
  service_category: string
}

export interface BodyStylePricing {
  id: string
  body_style: string
  surcharge: number
}

export type BodyStyle =
  | 'Sedan'
  | 'Coupe'
  | 'Hatchback'
  | 'SUV'
  | 'Truck'
  | 'Van'
  | 'Minivan'
  | 'Convertible'
  | 'Wagon'

export type TimeSlot = '08:00' | '10:00' | '12:00' | '14:00'

export const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
  '08:00': '8:00 AM',
  '10:00': '10:00 AM',
  '12:00': '12:00 PM',
  '14:00': '2:00 PM',
}

export const BODY_STYLES: BodyStyle[] = [
  'Sedan', 'Coupe', 'Hatchback', 'SUV', 'Truck', 'Van', 'Minivan', 'Convertible', 'Wagon',
]

export const PROVINCES = [
  'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT',
] as const

export interface WizardState {
  currentStep: number
  editingFromReview: boolean
  /** Used internally to remember which step to return to after editing */
  _returnToStep?: number
  selectedService: ServiceType | null
  selectedDate: string | null
  selectedTime: TimeSlot | null
  vehicleMake: string
  vehicleModel: string
  vehicleYear: string
  vehicleColor: string
  bodyStyle: BodyStyle | null
  streetAddress: string
  city: string
  province: string
  postalCode: string
  specialRequests: string
}

export type WizardAction =
  | { type: 'SELECT_SERVICE'; payload: ServiceType }
  | { type: 'SET_DATE'; payload: string }
  | { type: 'SET_TIME'; payload: TimeSlot }
  | { type: 'SET_VEHICLE'; payload: Partial<Pick<WizardState, 'vehicleMake' | 'vehicleModel' | 'vehicleYear' | 'vehicleColor' | 'bodyStyle'>> }
  | { type: 'SET_ADDRESS'; payload: Partial<Pick<WizardState, 'streetAddress' | 'city' | 'province' | 'postalCode' | 'specialRequests'>> }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'EDIT_FROM_REVIEW'; payload: number }
  | { type: 'RETURN_TO_REVIEW' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }

export interface BookingPayload {
  vehicleMake: string
  vehicleModel: string
  vehicleYear: number
  vehicleColor: string
  bodyStyle: string
  serviceTypeId: string
  scheduledDate: string
  scheduledTime: string
  streetAddress: string
  city: string
  province: string
  postalCode: string
  specialRequests: string
  basePrice: number
  bodyStyleSurcharge: number
  totalPrice: number
  depositAmount: number
  /** Email address for guest checkouts — stored on detailing_sessions.guest_email */
  guestEmail?: string
}
