export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled'

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  password: string
  createdAt: string
}

export interface Reservation {
  id: string
  clientId: string
  clientName: string
  date: string
  time: string
  guests: number
  status: ReservationStatus
  notes: string
  createdAt: string
}