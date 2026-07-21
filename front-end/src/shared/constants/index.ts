import { Client, Reservation } from '../types'

export const ADMIN_EMAIL = 'admin@nobre.com'
export const ADMIN_PASSWORD = 'admin123'

export const TIMES = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00',
]

export const MAX_PER_SLOT = 15

export const SEED_CLIENTS: Client[] = [
  { id: 'c1', name: 'Ana Lima', email: 'ana@email.com', phone: '(11) 99001-2345', cpf: '123.456.789-00', password: '123456', createdAt: '2026-07-01T10:00:00Z' },
  { id: 'c2', name: 'Bruno Mendes', email: 'bruno@email.com', phone: '(21) 98765-4321', cpf: '987.654.321-00', password: '123456', createdAt: '2026-07-05T14:30:00Z' },
  { id: 'c3', name: 'Carla Souza', email: 'carla@email.com', phone: '(31) 97777-8888', cpf: '111.222.333-44', password: '123456', createdAt: '2026-07-10T09:15:00Z' },
]

export const SEED_RESERVATIONS: Reservation[] = [
  { id: 'r1', clientId: 'c1', clientName: 'Ana Lima', date: '2026-07-22', time: '19:30', guests: 2, status: 'confirmed', notes: 'Aniversário de casamento', createdAt: '2026-07-15T08:00:00Z' },
  { id: 'r2', clientId: 'c2', clientName: 'Bruno Mendes', date: '2026-07-22', time: '20:00', guests: 4, status: 'pending', notes: '', createdAt: '2026-07-16T11:20:00Z' },
  { id: 'r3', clientId: 'c3', clientName: 'Carla Souza', date: '2026-07-23', time: '12:30', guests: 3, status: 'pending', notes: 'Almoço de negócios', createdAt: '2026-07-17T16:45:00Z' },
  { id: 'r4', clientId: 'c1', clientName: 'Ana Lima', date: '2026-07-18', time: '21:00', guests: 6, status: 'cancelled', notes: '', createdAt: '2026-07-10T10:00:00Z' },
]