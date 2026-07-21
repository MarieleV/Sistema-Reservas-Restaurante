import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type ReservationStatus = 'pending' | 'confirmed' | 'cancelled'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  password: string
  createdAt: string
}

interface Reservation {
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

type Page =
  | 'landing'
  | 'register'
  | 'client-dashboard'
  | 'new-reservation'
  | 'edit-reservation'
  | 'admin-dashboard'

// ─── Constants ────────────────────────────────────────────────────────────────

const ADMIN_EMAIL = 'admin@nobre.com'
const ADMIN_PASSWORD = 'admin123'

const TIMES = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00',
]

const MAX_PER_SLOT = 15

const SEED_CLIENTS: Client[] = [
  {
    id: 'c1', name: 'Ana Lima', email: 'ana@email.com',
    phone: '(11) 99001-2345', cpf: '123.456.789-00', password: '123456',
    createdAt: '2026-07-01T10:00:00Z',
  },
  {
    id: 'c2', name: 'Bruno Mendes', email: 'bruno@email.com',
    phone: '(21) 98765-4321', cpf: '987.654.321-00', password: '123456',
    createdAt: '2026-07-05T14:30:00Z',
  },
  {
    id: 'c3', name: 'Carla Souza', email: 'carla@email.com',
    phone: '(31) 97777-8888', cpf: '111.222.333-44', password: '123456',
    createdAt: '2026-07-10T09:15:00Z',
  },
]

const SEED_RESERVATIONS: Reservation[] = [
  {
    id: 'r1', clientId: 'c1', clientName: 'Ana Lima', date: '2026-07-22',
    time: '19:30', guests: 2, status: 'confirmed',
    notes: 'Aniversário de casamento', createdAt: '2026-07-15T08:00:00Z',
  },
  {
    id: 'r2', clientId: 'c2', clientName: 'Bruno Mendes', date: '2026-07-22',
    time: '20:00', guests: 4, status: 'pending',
    notes: '', createdAt: '2026-07-16T11:20:00Z',
  },
  {
    id: 'r3', clientId: 'c3', clientName: 'Carla Souza', date: '2026-07-23',
    time: '12:30', guests: 3, status: 'pending',
    notes: 'Almoço de negócios', createdAt: '2026-07-17T16:45:00Z',
  },
  {
    id: 'r4', clientId: 'c1', clientName: 'Ana Lima', date: '2026-07-18',
    time: '21:00', guests: 6, status: 'cancelled',
    notes: '', createdAt: '2026-07-10T10:00:00Z',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return v ? (JSON.parse(v) as T) : fallback
  } catch {
    return fallback
  }
}

function formatDate(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function monthLabel(date: string) {
  return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short' })
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

const serif = { fontFamily: "'Playfair Display', Georgia, serif" } as const

const inputCls =
  'w-full px-3 py-2.5 rounded-md border border-[rgba(42,64,51,0.2)] bg-white text-[#1A1208] text-sm focus:outline-none focus:border-[#2A4033] focus:ring-1 focus:ring-[rgba(42,64,51,0.25)] transition-colors placeholder:text-[rgba(26,18,8,0.3)]'

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-medium text-[rgba(26,18,8,0.5)] uppercase tracking-widest mb-1.5">
      {children}
    </label>
  )
}

function StatusBadge({ status }: { status: ReservationStatus }) {
  const map: Record<ReservationStatus, { label: string; cls: string }> = {
    pending: { label: 'Pendente', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    confirmed: { label: 'Confirmada', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    cancelled: { label: 'Cancelada', cls: 'bg-red-50 text-red-500 border-red-200' },
  }
  const { label, cls } = map[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${cls}`}>
      {label}
    </span>
  )
}

function NavBar({
  isAdmin,
  userName,
  onLogout,
}: {
  isAdmin?: boolean
  userName?: string
  onLogout: () => void
}) {
  return (
    <nav className="bg-[#2A4033] text-[#F5F0E8]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span
            className="text-[#F5F0E8] text-xl tracking-widest"
            style={{ ...serif, fontStyle: 'italic' }}
          >
            Nobre
          </span>
          {isAdmin && (
            <span className="hidden sm:block text-[#F5F0E8]/30 text-[10px] uppercase tracking-[0.2em]">
              Administração
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {userName && (
            <span className="hidden sm:block text-[#F5F0E8]/50 text-sm">{userName}</span>
          )}
          <button
            onClick={onLogout}
            className="text-xs text-[#F5F0E8]/40 hover:text-[#F5F0E8] transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  )
}

function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: T; label: string }[]
  active: T
  onChange: (t: T) => void
}) {
  return (
    <div className="flex border-b border-[rgba(42,64,51,0.12)]">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-4 py-2.5 text-sm font-medium transition-colors -mb-px border-b-2 ${
            active === t.id
              ? 'border-[#2A4033] text-[#2A4033]'
              : 'border-transparent text-[rgba(26,18,8,0.45)] hover:text-[#1A1208]'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ─── Landing / Login ──────────────────────────────────────────────────────────

function LandingPage({
  onLogin,
  onRegister,
}: {
  onLogin: (email: string, pw: string) => string | null
  onRegister: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const err = onLogin(email, password)
    if (err) {
      setError(err)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Brand panel */}
      <div className="md:w-[48%] bg-[#2A4033] flex flex-col items-center justify-center px-10 py-16 min-h-[260px] md:min-h-screen relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #F5F0E8 0, #F5F0E8 1px, transparent 0, transparent 50%)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative text-center max-w-xs">
          <div className="text-[#B85C38] text-[10px] tracking-[0.4em] font-medium mb-6 uppercase">
            Restaurante
          </div>
          <h1
            className="text-[#F5F0E8] text-7xl md:text-8xl mb-6"
            style={{ ...serif, fontStyle: 'italic', lineHeight: 1.05 }}
          >
            Nobre
          </h1>
          <div className="w-12 h-px bg-[#B85C38] mx-auto mb-6" />
          <p className="text-[#F5F0E8]/50 text-sm leading-relaxed">
            Uma experiência gastronômica singular, onde cada refeição se torna uma memória duradoura.
          </p>
          <div className="mt-10 space-y-1.5 text-[#F5F0E8]/25 text-[11px] tracking-wider">
            <div>Segunda a Sexta-feira</div>
            <div>Almoço · 12h – 14h30 · Jantar · 19h – 22h</div>
          </div>
        </div>
      </div>

      {/* Login panel */}
      <div className="md:w-[52%] flex items-center justify-center px-8 py-16 bg-[#F5F0E8]">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl text-[#1A1208] mb-1" style={serif}>
            Bem-vindo
          </h2>
          <p className="text-sm text-[rgba(26,18,8,0.45)] mb-8">
            Acesse sua conta para gerenciar reservas.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>E-mail</Label>
              <input
                className={inputCls}
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <Label>Senha</Label>
              <input
                className={inputCls}
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="••••••"
                required
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#2A4033] text-[#F5F0E8] text-sm font-medium rounded-md hover:bg-[#1e2f25] transition-colors disabled:opacity-60 mt-1"
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-[rgba(26,18,8,0.45)]">Não tem conta? </span>
            <button
              onClick={onRegister}
              className="text-sm text-[#2A4033] font-medium hover:underline underline-offset-2"
            >
              Cadastre-se
            </button>
          </div>

          <div className="mt-10 pt-6 border-t border-[rgba(42,64,51,0.1)] text-[11px] text-[rgba(26,18,8,0.3)] text-center">
            Acesso administrador: {ADMIN_EMAIL}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Register ─────────────────────────────────────────────────────────────────

interface RegForm {
  name: string
  email: string
  phone: string
  cpf: string
  password: string
  confirm: string
}

function RegisterPage({
  onRegister,
  onBack,
}: {
  onRegister: (data: Omit<Client, 'id' | 'createdAt'>) => string | null
  onBack: () => void
}) {
  const [form, setForm] = useState<RegForm>({
    name: '', email: '', phone: '', cpf: '', password: '', confirm: '',
  })
  const [error, setError] = useState('')

  const set = (k: keyof RegForm) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (form.password !== form.confirm) {
      setError('As senhas não coincidem.')
      return
    }
    const err = onRegister({
      name: form.name,
      email: form.email,
      phone: form.phone,
      cpf: form.cpf,
      password: form.password,
    })
    if (err) setError(err)
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-[rgba(26,18,8,0.45)] hover:text-[#1A1208] mb-8 transition-colors"
        >
          ← Voltar ao login
        </button>

        <div className="mb-8">
          <div className="text-[#B85C38] text-[10px] tracking-[0.4em] uppercase mb-2">
            Restaurante Nobre
          </div>
          <h2 className="text-4xl text-[#1A1208]" style={{ ...serif, fontStyle: 'italic' }}>
            Crie sua conta
          </h2>
          <p className="text-sm text-[rgba(26,18,8,0.45)] mt-2">
            Preencha seus dados para começar a realizar reservas.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[rgba(42,64,51,0.10)] p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nome completo</Label>
              <input
                className={inputCls}
                value={form.name}
                onChange={set('name')}
                placeholder="Ana Lima"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>E-mail</Label>
                <input
                  className={inputCls}
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <input
                  className={inputCls}
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
            </div>
            <div>
              <Label>CPF</Label>
              <input
                className={inputCls}
                value={form.cpf}
                onChange={set('cpf')}
                placeholder="000.000.000-00"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Senha</Label>
                <input
                  className={inputCls}
                  type="password"
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
              <div>
                <Label>Confirmar senha</Label>
                <input
                  className={inputCls}
                  type="password"
                  value={form.confirm}
                  onChange={set('confirm')}
                  placeholder="Repita a senha"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#2A4033] text-[#F5F0E8] text-sm font-medium rounded-md hover:bg-[#1e2f25] transition-colors mt-1"
            >
              Criar conta
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Reservation Card ─────────────────────────────────────────────────────────

function ReservationCard({
  r,
  onEdit,
  onCancel,
  showActions,
}: {
  r: Reservation
  onEdit?: () => void
  onCancel?: () => void
  showActions?: boolean
}) {
  const canEdit = showActions && r.status === 'pending'
  const canCancel = showActions && (r.status === 'pending' || r.status === 'confirmed')

  return (
    <div
      className={`bg-white rounded-xl border border-[rgba(42,64,51,0.09)] p-4 flex flex-col sm:flex-row sm:items-center gap-3 transition-opacity ${r.status === 'cancelled' ? 'opacity-45' : ''}`}
    >
      <div className="text-center w-12 flex-shrink-0">
        <div
          className="text-2xl font-semibold text-[#2A4033]"
          style={serif}
        >
          {r.date.split('-')[2]}
        </div>
        <div className="text-[10px] text-[rgba(26,18,8,0.4)] uppercase tracking-wide">
          {monthLabel(r.date)}
        </div>
      </div>

      <div className="border-l border-[rgba(42,64,51,0.1)] pl-4 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <span className="text-sm font-medium text-[#1A1208]">{r.time}</span>
          <span className="text-[rgba(26,18,8,0.25)]">·</span>
          <span className="text-sm text-[rgba(26,18,8,0.55)]">
            {r.guests} {r.guests === 1 ? 'pessoa' : 'pessoas'}
          </span>
          <StatusBadge status={r.status} />
        </div>
        {r.notes && (
          <p className="text-xs text-[rgba(26,18,8,0.4)] truncate mt-0.5">{r.notes}</p>
        )}
      </div>

      {(canEdit || canCancel) && (
        <div className="flex gap-1.5 flex-shrink-0">
          {canEdit && (
            <button
              onClick={onEdit}
              className="py-1.5 px-3 text-xs text-[#2A4033] font-medium rounded-md hover:bg-[#2A4033]/8 transition-colors border border-[rgba(42,64,51,0.2)]"
            >
              Editar
            </button>
          )}
          {canCancel && (
            <button
              onClick={onCancel}
              className="py-1.5 px-3 text-xs text-red-500 font-medium rounded-md hover:bg-red-50 transition-colors border border-red-200"
            >
              Cancelar
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Client Dashboard ─────────────────────────────────────────────────────────

function ClientDashboard({
  client,
  reservations,
  onNewReservation,
  onEditReservation,
  onCancelReservation,
  onUpdateClient,
  onDeleteClient,
  onLogout,
}: {
  client: Client
  reservations: Reservation[]
  onNewReservation: () => void
  onEditReservation: (r: Reservation) => void
  onCancelReservation: (id: string) => void
  onUpdateClient: (id: string, data: Partial<Client>) => void
  onDeleteClient: (id: string) => void
  onLogout: () => void
}) {
  const [tab, setTab] = useState<'reservations' | 'profile'>('reservations')
  const [editProfile, setEditProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: client.name, phone: client.phone })
  const [profileError, setProfileError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const sorted = [...reservations].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const active = sorted.filter(r => r.status !== 'cancelled')
  const past = sorted.filter(r => r.status === 'cancelled')

  const saveProfile = (e: FormEvent) => {
    e.preventDefault()
    if (!profileForm.name.trim()) {
      setProfileError('Nome é obrigatório.')
      return
    }
    onUpdateClient(client.id, { name: profileForm.name, phone: profileForm.phone })
    setEditProfile(false)
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <NavBar userName={client.name} onLogout={onLogout} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Tabs
            tabs={[
              { id: 'reservations' as const, label: 'Minhas Reservas' },
              { id: 'profile' as const, label: 'Meu Perfil' },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>

        {/* Reservations tab */}
        {tab === 'reservations' && (
          <div>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl text-[#1A1208]" style={serif}>
                  Reservas
                </h2>
                <p className="text-sm text-[rgba(26,18,8,0.4)] mt-1">
                  {active.length} reserva{active.length !== 1 ? 's' : ''} ativa{active.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={onNewReservation}
                className="flex items-center gap-2 py-2 px-4 bg-[#2A4033] text-[#F5F0E8] text-sm font-medium rounded-md hover:bg-[#1e2f25] transition-colors flex-shrink-0"
              >
                + Nova reserva
              </button>
            </div>

            {active.length === 0 && (
              <div className="text-center py-20 text-[rgba(26,18,8,0.3)]">
                <div className="text-5xl mb-4 opacity-60">🍽</div>
                <p className="text-sm mb-3">Nenhuma reserva ativa no momento.</p>
                <button
                  onClick={onNewReservation}
                  className="text-sm text-[#2A4033] font-medium hover:underline underline-offset-2"
                >
                  Fazer uma reserva
                </button>
              </div>
            )}

            <div className="grid gap-2.5">
              {active.map(r => (
                <ReservationCard
                  key={r.id}
                  r={r}
                  onEdit={() => onEditReservation(r)}
                  onCancel={() => onCancelReservation(r.id)}
                  showActions
                />
              ))}
            </div>

            {past.length > 0 && (
              <div className="mt-10">
                <div className="text-[10px] font-medium text-[rgba(26,18,8,0.35)] uppercase tracking-widest mb-3">
                  Histórico
                </div>
                <div className="grid gap-2.5">
                  {past.map(r => (
                    <ReservationCard key={r.id} r={r} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile tab */}
        {tab === 'profile' && (
          <div className="max-w-md">
            <h2 className="text-2xl text-[#1A1208] mb-6" style={serif}>
              Meu Perfil
            </h2>

            <div className="bg-white rounded-2xl border border-[rgba(42,64,51,0.10)] p-6 shadow-sm">
              {!editProfile ? (
                <div>
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    {[
                      { label: 'Nome', value: client.name },
                      { label: 'E-mail', value: client.email },
                      { label: 'Telefone', value: client.phone },
                      { label: 'CPF', value: client.cpf },
                    ].map(f => (
                      <div key={f.label}>
                        <div className="text-[10px] font-medium text-[rgba(26,18,8,0.4)] uppercase tracking-widest mb-0.5">
                          {f.label}
                        </div>
                        <div className="text-sm text-[#1A1208]">{f.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-[rgba(42,64,51,0.08)] flex flex-wrap gap-2">
                    <button
                      onClick={() => setEditProfile(true)}
                      className="py-2 px-4 bg-[#E8E0D0] text-[#1A1208] text-sm font-medium rounded-md hover:bg-[#ddd4c0] transition-colors"
                    >
                      Editar perfil
                    </button>
                    {!deleteConfirm ? (
                      <button
                        onClick={() => setDeleteConfirm(true)}
                        className="py-2 px-4 bg-red-50 text-red-600 text-sm font-medium rounded-md hover:bg-red-100 transition-colors border border-red-200"
                      >
                        Excluir conta
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-red-600">Tem certeza?</span>
                        <button
                          onClick={() => onDeleteClient(client.id)}
                          className="py-1.5 px-3 bg-red-500 text-white text-xs font-medium rounded-md hover:bg-red-600 transition-colors"
                        >
                          Confirmar exclusão
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(false)}
                          className="py-1.5 px-3 bg-[#E8E0D0] text-[#1A1208] text-xs font-medium rounded-md hover:bg-[#ddd4c0] transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={saveProfile} className="space-y-4">
                  <div>
                    <Label>Nome completo</Label>
                    <input
                      className={inputCls}
                      value={profileForm.name}
                      onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>Telefone</Label>
                    <input
                      className={inputCls}
                      value={profileForm.phone}
                      onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  {profileError && (
                    <p className="text-xs text-red-600">{profileError}</p>
                  )}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="py-2 px-4 bg-[#2A4033] text-[#F5F0E8] text-sm font-medium rounded-md hover:bg-[#1e2f25] transition-colors"
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditProfile(false)
                        setProfileError('')
                      }}
                      className="py-2 px-4 bg-[#E8E0D0] text-[#1A1208] text-sm font-medium rounded-md hover:bg-[#ddd4c0] transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Reservation Form Page ────────────────────────────────────────────────────

function ReservationFormPage({
  initial,
  onSubmit,
  onBack,
  isEdit,
}: {
  initial?: Partial<Reservation>
  onSubmit: (data: { date: string; time: string; guests: number; notes: string }) => string | null
  onBack: () => void
  isEdit?: boolean
}) {
  const [date, setDate] = useState(initial?.date ?? '')
  const [time, setTime] = useState(initial?.time ?? '19:00')
  const [guests, setGuests] = useState(initial?.guests ?? 2)
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!date) {
      setError('Selecione uma data.')
      return
    }
    const err = onSubmit({ date, time, guests, notes })
    if (err) setError(err)
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-[rgba(26,18,8,0.45)] hover:text-[#1A1208] mb-8 transition-colors"
        >
          ← Voltar
        </button>

        <div className="mb-8">
          <div className="text-[#B85C38] text-[10px] tracking-[0.4em] uppercase mb-2">
            Restaurante Nobre
          </div>
          <h2
            className="text-4xl text-[#1A1208]"
            style={{ ...serif, fontStyle: 'italic' }}
          >
            {isEdit ? 'Editar Reserva' : 'Nova Reserva'}
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-[rgba(42,64,51,0.10)] p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data</Label>
                <input
                  className={inputCls}
                  type="date"
                  value={date}
                  min={todayStr()}
                  onChange={e => {
                    setDate(e.target.value)
                    setError('')
                  }}
                  required
                />
              </div>
              <div>
                <Label>Horário</Label>
                <select
                  className={inputCls}
                  value={time}
                  onChange={e => setTime(e.target.value)}
                >
                  <optgroup label="Almoço">
                    {TIMES.slice(0, 6).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Jantar">
                    {TIMES.slice(6).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            <div>
              <Label>Número de pessoas</Label>
              <input
                className={inputCls}
                type="number"
                min={1}
                max={20}
                value={guests}
                onChange={e => setGuests(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <Label>
                Observações{' '}
                <span className="text-[rgba(26,18,8,0.3)] font-normal normal-case tracking-normal">
                  (opcional)
                </span>
              </Label>
              <textarea
                className={`${inputCls} resize-none`}
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Alergias, comemorações, preferências de mesa…"
              />
            </div>

            <div className="text-xs text-[rgba(26,18,8,0.4)] bg-[#F5F0E8] rounded-lg px-3 py-3 leading-relaxed">
              Funcionamento: Segunda a Sexta · Almoço 12h–14h30 · Jantar 19h–22h
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#2A4033] text-[#F5F0E8] text-sm font-medium rounded-md hover:bg-[#1e2f25] transition-colors"
            >
              {isEdit ? 'Salvar alterações' : 'Confirmar reserva'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard({
  clients,
  reservations,
  onConfirm,
  onCancel,
  onDeleteClient,
  onLogout,
}: {
  clients: Client[]
  reservations: Reservation[]
  onConfirm: (id: string) => void
  onCancel: (id: string) => void
  onDeleteClient: (id: string) => void
  onLogout: () => void
}) {
  const [tab, setTab] = useState<'reservations' | 'clients'>('reservations')
  const [statusFilter, setStatusFilter] = useState<'all' | ReservationStatus>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const pending = reservations.filter(r => r.status === 'pending').length
  const confirmed = reservations.filter(r => r.status === 'confirmed').length

  const filtered =
    statusFilter === 'all'
      ? reservations
      : reservations.filter(r => r.status === statusFilter)

  const sortedRes = [...filtered].sort(
    (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
  )

  const filterLabels: { id: 'all' | ReservationStatus; label: string }[] = [
    { id: 'all', label: 'Todas' },
    { id: 'pending', label: 'Pendentes' },
    { id: 'confirmed', label: 'Confirmadas' },
    { id: 'cancelled', label: 'Canceladas' },
  ]

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <NavBar isAdmin onLogout={onLogout} />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: 'Total de reservas', value: reservations.length, color: 'text-[#1A1208]' },
            { label: 'Pendentes', value: pending, color: 'text-amber-600' },
            { label: 'Confirmadas', value: confirmed, color: 'text-emerald-600' },
            { label: 'Clientes', value: clients.length, color: 'text-[#2A4033]' },
          ].map(s => (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-[rgba(42,64,51,0.09)] p-4"
            >
              <div className={`text-3xl font-semibold ${s.color}`} style={serif}>
                {s.value}
              </div>
              <div className="text-[10px] text-[rgba(26,18,8,0.4)] mt-1 uppercase tracking-widest">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs
            tabs={[
              { id: 'reservations' as const, label: 'Reservas' },
              { id: 'clients' as const, label: 'Clientes' },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>

        {/* Reservations table */}
        {tab === 'reservations' && (
          <div>
            <div className="flex gap-2 mb-4 flex-wrap">
              {filterLabels.map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                    statusFilter === f.id
                      ? 'bg-[#2A4033] text-[#F5F0E8] border-[#2A4033]'
                      : 'bg-white text-[rgba(26,18,8,0.55)] border-[rgba(42,64,51,0.15)] hover:border-[rgba(42,64,51,0.35)]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-[rgba(42,64,51,0.09)] overflow-hidden shadow-sm">
              {sortedRes.length === 0 ? (
                <div className="text-center py-14 text-[rgba(26,18,8,0.3)] text-sm">
                  Nenhuma reserva encontrada.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[rgba(42,64,51,0.07)]">
                        {['Cliente', 'Data', 'Horário', 'Pessoas', 'Observações', 'Status', 'Ações'].map(h => (
                          <th
                            key={h}
                            className="text-left px-4 py-3 text-[10px] font-medium text-[rgba(26,18,8,0.4)] uppercase tracking-widest whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedRes.map((r, i) => (
                        <tr
                          key={r.id}
                          className={`hover:bg-[#F5F0E8]/60 transition-colors ${
                            i < sortedRes.length - 1 ? 'border-b border-[rgba(42,64,51,0.05)]' : ''
                          }`}
                        >
                          <td className="px-4 py-3 font-medium text-[#1A1208] whitespace-nowrap">
                            {r.clientName}
                          </td>
                          <td className="px-4 py-3 text-[rgba(26,18,8,0.65)] whitespace-nowrap">
                            {formatDate(r.date)}
                          </td>
                          <td className="px-4 py-3 text-[rgba(26,18,8,0.65)]">{r.time}</td>
                          <td className="px-4 py-3 text-[rgba(26,18,8,0.65)]">{r.guests}</td>
                          <td className="px-4 py-3 text-[rgba(26,18,8,0.4)] max-w-[160px] truncate">
                            {r.notes || '—'}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={r.status} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5 whitespace-nowrap">
                              {r.status === 'pending' && (
                                <button
                                  onClick={() => onConfirm(r.id)}
                                  className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors"
                                >
                                  Confirmar
                                </button>
                              )}
                              {r.status !== 'cancelled' && (
                                <button
                                  onClick={() => onCancel(r.id)}
                                  className="px-2.5 py-1 text-xs bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                                >
                                  Cancelar
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clients table */}
        {tab === 'clients' && (
          <div className="bg-white rounded-xl border border-[rgba(42,64,51,0.09)] overflow-hidden shadow-sm">
            {clients.length === 0 ? (
              <div className="text-center py-14 text-[rgba(26,18,8,0.3)] text-sm">
                Nenhum cliente cadastrado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[rgba(42,64,51,0.07)]">
                      {['Nome', 'E-mail', 'Telefone', 'CPF', 'Cadastro', 'Reservas', ''].map(h => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-[10px] font-medium text-[rgba(26,18,8,0.4)] uppercase tracking-widest whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((c, i) => {
                      const cResCount = reservations.filter(r => r.clientId === c.id).length
                      return (
                        <tr
                          key={c.id}
                          className={`hover:bg-[#F5F0E8]/60 transition-colors ${
                            i < clients.length - 1 ? 'border-b border-[rgba(42,64,51,0.05)]' : ''
                          }`}
                        >
                          <td className="px-4 py-3 font-medium text-[#1A1208] whitespace-nowrap">
                            {c.name}
                          </td>
                          <td className="px-4 py-3 text-[rgba(26,18,8,0.65)]">{c.email}</td>
                          <td className="px-4 py-3 text-[rgba(26,18,8,0.65)] whitespace-nowrap">
                            {c.phone}
                          </td>
                          <td className="px-4 py-3 text-[rgba(26,18,8,0.4)] font-mono text-xs whitespace-nowrap">
                            {c.cpf}
                          </td>
                          <td className="px-4 py-3 text-[rgba(26,18,8,0.45)] whitespace-nowrap">
                            {formatDate(c.createdAt.split('T')[0])}
                          </td>
                          <td className="px-4 py-3 text-[rgba(26,18,8,0.65)]">{cResCount}</td>
                          <td className="px-4 py-3">
                            {deleteId === c.id ? (
                              <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <span className="text-xs text-red-600">Excluir?</span>
                                <button
                                  onClick={() => {
                                    onDeleteClient(c.id)
                                    setDeleteId(null)
                                  }}
                                  className="px-2 py-0.5 text-xs bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition-colors"
                                >
                                  Sim
                                </button>
                                <button
                                  onClick={() => setDeleteId(null)}
                                  className="px-2 py-0.5 text-xs bg-[#E8E0D0] text-[#1A1208] rounded hover:bg-[#ddd4c0] transition-colors"
                                >
                                  Não
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteId(c.id)}
                                className="px-2.5 py-1 text-xs bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                              >
                                Excluir
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>('landing')
  const [currentUser, setCurrentUser] = useState<Client | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [clients, setClients] = useState<Client[]>(() => load('nobre_clients', SEED_CLIENTS))
  const [reservations, setReservations] = useState<Reservation[]>(() =>
    load('nobre_reservations', SEED_RESERVATIONS)
  )
  const [editingRes, setEditingRes] = useState<Reservation | null>(null)

  useEffect(() => {
    localStorage.setItem('nobre_clients', JSON.stringify(clients))
  }, [clients])

  useEffect(() => {
    localStorage.setItem('nobre_reservations', JSON.stringify(reservations))
  }, [reservations])

  const login = (email: string, password: string): string | null => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      setCurrentUser(null)
      setPage('admin-dashboard')
      return null
    }
    const c = clients.find(c => c.email === email && c.password === password)
    if (!c) return 'E-mail ou senha incorretos.'
    setCurrentUser(c)
    setIsAdmin(false)
    setPage('client-dashboard')
    return null
  }

  const logout = () => {
    setCurrentUser(null)
    setIsAdmin(false)
    setPage('landing')
  }

  const registerClient = (data: Omit<Client, 'id' | 'createdAt'>): string | null => {
    if (clients.some(c => c.email === data.email)) return 'E-mail já cadastrado.'
    if (clients.some(c => c.cpf === data.cpf)) return 'CPF já cadastrado.'
    const newClient: Client = { ...data, id: `c${Date.now()}`, createdAt: new Date().toISOString() }
    setClients(prev => [...prev, newClient])
    setCurrentUser(newClient)
    setPage('client-dashboard')
    return null
  }

  const updateClient = (id: string, data: Partial<Client>) => {
    setClients(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)))
    if (currentUser?.id === id) setCurrentUser(prev => (prev ? { ...prev, ...data } : prev))
  }

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id))
    setReservations(prev => prev.filter(r => r.clientId !== id))
    if (currentUser?.id === id) logout()
  }

  const createReservation = (data: {
    date: string; time: string; guests: number; notes: string
  }): string | null => {
    if (!currentUser) return 'Não autenticado.'
    const dup = reservations.find(
      r => r.clientId === currentUser.id && r.date === data.date && r.status !== 'cancelled'
    )
    if (dup) return 'Você já possui uma reserva para esta data.'
    const slotCount = reservations.filter(
      r => r.date === data.date && r.time === data.time && r.status !== 'cancelled'
    ).length
    if (slotCount >= MAX_PER_SLOT) return 'Não há mesas disponíveis neste horário.'
    const newRes: Reservation = {
      id: `r${Date.now()}`,
      clientId: currentUser.id,
      clientName: currentUser.name,
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    setReservations(prev => [...prev, newRes])
    setPage('client-dashboard')
    return null
  }

  const editReservation = (
    id: string,
    data: { date: string; time: string; guests: number; notes: string }
  ): string | null => {
    if (!currentUser) return 'Não autenticado.'
    const dup = reservations.find(
      r =>
        r.clientId === currentUser.id &&
        r.date === data.date &&
        r.status !== 'cancelled' &&
        r.id !== id
    )
    if (dup) return 'Você já possui uma reserva para esta data.'
    setReservations(prev => prev.map(r => (r.id === id ? { ...r, ...data } : r)))
    setPage('client-dashboard')
    return null
  }

  const cancelReservation = (id: string) =>
    setReservations(prev => prev.map(r => (r.id === id ? { ...r, status: 'cancelled' } : r)))

  const confirmReservation = (id: string) =>
    setReservations(prev => prev.map(r => (r.id === id ? { ...r, status: 'confirmed' } : r)))

  const myReservations = reservations.filter(r => r.clientId === currentUser?.id)

  if (page === 'landing') {
    return <LandingPage onLogin={login} onRegister={() => setPage('register')} />
  }

  if (page === 'register') {
    return <RegisterPage onRegister={registerClient} onBack={() => setPage('landing')} />
  }

  if (page === 'client-dashboard' && currentUser) {
    return (
      <ClientDashboard
        client={currentUser}
        reservations={myReservations}
        onNewReservation={() => setPage('new-reservation')}
        onEditReservation={r => {
          setEditingRes(r)
          setPage('edit-reservation')
        }}
        onCancelReservation={cancelReservation}
        onUpdateClient={updateClient}
        onDeleteClient={deleteClient}
        onLogout={logout}
      />
    )
  }

  if (page === 'new-reservation' && currentUser) {
    return (
      <ReservationFormPage
        onSubmit={createReservation}
        onBack={() => setPage('client-dashboard')}
      />
    )
  }

  if (page === 'edit-reservation' && currentUser && editingRes) {
    return (
      <ReservationFormPage
        initial={editingRes}
        onSubmit={data => editReservation(editingRes.id, data)}
        onBack={() => setPage('client-dashboard')}
        isEdit
      />
    )
  }

  if (page === 'admin-dashboard' && isAdmin) {
    return (
      <AdminDashboard
        clients={clients}
        reservations={reservations}
        onConfirm={confirmReservation}
        onCancel={cancelReservation}
        onDeleteClient={deleteClient}
        onLogout={logout}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
      <button onClick={() => setPage('landing')} className="text-sm text-[#2A4033] underline">
        Voltar ao início
      </button>
    </div>
  )
}
