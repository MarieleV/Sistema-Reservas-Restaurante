import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'

// Shared
import type { Client, Reservation } from '../shared/types'
import { load } from '../shared/utils'
import { ADMIN_EMAIL, ADMIN_PASSWORD, MAX_PER_SLOT, SEED_CLIENTS, SEED_RESERVATIONS } from '../shared/constants'

// Modules
import { LandingPage } from '../modules/auth/pages/LandingPage'
import { RegisterPage } from '../modules/auth/pages/RegisterPage'
import { ClientDashboard } from '../modules/client/pages/ClientDashboard'
import { ReservationFormPage } from '../modules/reservation/pages/ReservationFormPage'
import { AdminDashboard } from '../modules/admin/AdminDashboard'

export function AppRoutes() {
  const navigate = useNavigate()
  
  // Estado Global (No futuro, pode virar Context API / Zustand / Redux)
  const [currentUser, setCurrentUser] = useState<Client | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [clients, setClients] = useState<Client[]>(() => load('nobre_clients', SEED_CLIENTS))
  const [reservations, setReservations] = useState<Reservation[]>(() => load('nobre_reservations', SEED_RESERVATIONS))
  const [editingRes, setEditingRes] = useState<Reservation | null>(null)

  useEffect(() => { localStorage.setItem('nobre_clients', JSON.stringify(clients)) }, [clients])
  useEffect(() => { localStorage.setItem('nobre_reservations', JSON.stringify(reservations)) }, [reservations])

  // Lógica de Auth
  const login = (email: string, password: string): string | null => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true); setCurrentUser(null); navigate('/admin'); return null
    }
    const c = clients.find(c => c.email === email && c.password === password)
    if (!c) return 'E-mail ou senha incorretos.'
    setCurrentUser(c); setIsAdmin(false); navigate('/client'); return null
  }

  const logout = () => { setCurrentUser(null); setIsAdmin(false); navigate('/') }

  const registerClient = (data: Omit<Client, 'id' | 'createdAt'>): string | null => {
    if (clients.some(c => c.email === data.email)) return 'E-mail já cadastrado.'
    if (clients.some(c => c.cpf === data.cpf)) return 'CPF já cadastrado.'
    const newClient: Client = { ...data, id: `c${Date.now()}`, createdAt: new Date().toISOString() }
    setClients(prev => [...prev, newClient]); setCurrentUser(newClient); navigate('/client'); return null
  }

  // Operações de Cliente
  const updateClient = (id: string, data: Partial<Client>) => {
    setClients(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)))
    if (currentUser?.id === id) setCurrentUser(prev => (prev ? { ...prev, ...data } : prev))
  }

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id)); setReservations(prev => prev.filter(r => r.clientId !== id))
    if (currentUser?.id === id) logout()
  }

  // Operações de Reserva
  const createReservation = (data: { date: string; time: string; guests: number; notes: string }): string | null => {
    if (!currentUser) return 'Não autenticado.'
    const dup = reservations.find(r => r.clientId === currentUser.id && r.date === data.date && r.status !== 'cancelled')
    if (dup) return 'Você já possui uma reserva para esta data.'
    const slotCount = reservations.filter(r => r.date === data.date && r.time === data.time && r.status !== 'cancelled').length
    if (slotCount >= MAX_PER_SLOT) return 'Não há mesas disponíveis neste horário.'
    const newRes: Reservation = { id: `r${Date.now()}`, clientId: currentUser.id, clientName: currentUser.name, ...data, status: 'pending', createdAt: new Date().toISOString() }
    setReservations(prev => [...prev, newRes]); navigate('/client'); return null
  }

  const editReservation = (id: string, data: { date: string; time: string; guests: number; notes: string }): string | null => {
    if (!currentUser) return 'Não autenticado.'
    const dup = reservations.find(r => r.clientId === currentUser.id && r.date === data.date && r.status !== 'cancelled' && r.id !== id)
    if (dup) return 'Você já possui uma reserva para esta data.'
    setReservations(prev => prev.map(r => (r.id === id ? { ...r, ...data } : r))); navigate('/client'); return null
  }

  const cancelReservation = (id: string) => setReservations(prev => prev.map(r => (r.id === id ? { ...r, status: 'cancelled' } : r)))
  const confirmReservation = (id: string) => setReservations(prev => prev.map(r => (r.id === id ? { ...r, status: 'confirmed' } : r)))

  const myReservations = reservations.filter(r => r.clientId === currentUser?.id)

  return (
    <Routes>
      <Route path="/" element={<LandingPage onLogin={login} onRegister={() => navigate('/register')} />} />
      <Route path="/register" element={<RegisterPage onRegister={registerClient} onBack={() => navigate('/')} />} />

      <Route path="/client" element={
        currentUser ? <ClientDashboard client={currentUser} reservations={myReservations} onNewReservation={() => navigate('/client/new-reservation')} onEditReservation={(r: Reservation) => { setEditingRes(r); navigate('/client/edit-reservation'); }} onCancelReservation={cancelReservation} onUpdateClient={updateClient} onDeleteClient={deleteClient} onLogout={logout} /> : <Navigate to="/" />
      } />
      
      <Route path="/client/new-reservation" element={
        currentUser ? <ReservationFormPage onSubmit={createReservation} onBack={() => navigate('/client')} /> : <Navigate to="/" />
      } />
      
      <Route path="/client/edit-reservation" element={
        (currentUser && editingRes) ? <ReservationFormPage initial={editingRes} onSubmit={data => editReservation(editingRes.id, data)} onBack={() => navigate('/client')} isEdit /> : <Navigate to="/client" />
      } />

      <Route path="/admin" element={
        isAdmin ? <AdminDashboard clients={clients} reservations={reservations} onConfirm={confirmReservation} onCancel={cancelReservation} onDeleteClient={deleteClient} onLogout={logout} /> : <Navigate to="/" />
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}