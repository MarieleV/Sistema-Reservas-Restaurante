import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { 
  Mail, Lock, LogIn, ArrowLeft, Plus, Trash2, 
  Calendar, Users, Clock, LogOut, CheckCircle, XCircle 
} from 'lucide-react'

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

// UX: Inputs maiores, fundo levemente translúcido que fica branco no foco.
const inputCls =
  'w-full px-4 py-3 rounded-xl border border-[#2A4033]/20 bg-white/60 text-[#1A1208] text-sm focus:bg-white focus:outline-none focus:border-[#2A4033] focus:ring-4 focus:ring-[#2A4033]/10 transition-all duration-300 placeholder:text-[#1A1208]/30'

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold text-[#2A4033]/70 uppercase tracking-[0.15em] mb-2 pl-1">
      {children}
    </label>
  )
}

function Button({ 
  children, type = 'button', onClick, disabled, variant = 'primary', size = 'md', className = '' 
}: { 
  children: React.ReactNode, type?: 'button' | 'submit', onClick?: () => void, disabled?: boolean, variant?: 'primary' | 'secondary' | 'danger' | 'ghost', size?: 'sm' | 'md', className?: string 
}) {
  const base = "font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
  const variants = {
    primary: "bg-[#2A4033] text-[#F5F0E8] hover:bg-[#1e2f25] hover:shadow-lg hover:shadow-[#2A4033]/20 border border-transparent",
    secondary: "bg-[#E8E0D0] text-[#1A1208] hover:bg-[#DCD3C0] border border-transparent",
    danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
    ghost: "bg-transparent text-[#2A4033] hover:bg-[#2A4033]/10 border border-[#2A4033]/20"
  }
  const sizes = {
    sm: "py-1.5 px-3 text-xs",
    md: "w-full py-3 px-6 text-sm"
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  )
}

function StatusBadge({ status }: { status: ReservationStatus }) {
  const map: Record<ReservationStatus, { label: string; cls: string }> = {
    pending: { label: 'Pendente', cls: 'bg-amber-100/50 text-amber-700 border-amber-200/50' },
    confirmed: { label: 'Confirmada', cls: 'bg-emerald-100/50 text-emerald-700 border-emerald-200/50' },
    cancelled: { label: 'Cancelada', cls: 'bg-red-100/50 text-red-600 border-red-200/50' },
  }
  const { label, cls } = map[status]
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      {label}
    </span>
  )
}

function NavBar({ isAdmin, userName, onLogout }: { isAdmin?: boolean; userName?: string; onLogout: () => void }) {
  return (
    <nav className="bg-[#2A4033] text-[#F5F0E8] shadow-md relative z-20">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[#F5F0E8] text-2xl tracking-widest" style={{ ...serif, fontStyle: 'italic' }}>
            Nobre
          </span>
          {isAdmin && (
            <span className="hidden sm:block text-[#F5F0E8]/40 text-[10px] uppercase tracking-[0.2em] bg-[#1e2f25] px-2 py-1 rounded">
              Admin
            </span>
          )}
        </div>
        <div className="flex items-center gap-6">
          {userName && <span className="hidden sm:block text-[#F5F0E8]/70 text-sm font-medium">{userName}</span>}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-xs font-semibold text-[#F5F0E8]/60 hover:text-[#F5F0E8] transition-colors"
          >
            Sair <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  )
}

function Tabs<T extends string>({ tabs, active, onChange }: { tabs: { id: T; label: string }[]; active: T; onChange: (t: T) => void }) {
  return (
    <div className="flex gap-4 border-b border-[#2A4033]/10">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`pb-3 px-1 text-sm font-semibold transition-all duration-300 border-b-2 ${
            active === t.id
              ? 'border-[#2A4033] text-[#2A4033]'
              : 'border-transparent text-[#1A1208]/40 hover:text-[#1A1208]/70'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ─── Landing / Login ──────────────────────────────────────────────────────────

function LandingPage({ onLogin, onRegister }: { onLogin: (email: string, pw: string) => string | null; onRegister: () => void }) {
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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F5F0E8]">
      <div className="md:w-[45%] bg-[#2A4033] flex flex-col items-center justify-center px-10 py-16 min-h-[300px] md:min-h-screen relative overflow-hidden shadow-2xl z-10">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #F5F0E8 0, #F5F0E8 2px, transparent 0, transparent 20px)' }} />
        <div className="relative text-center max-w-sm z-10">
          <div className="text-[#B85C38] text-[11px] tracking-[0.4em] font-bold mb-8 uppercase">Restaurante</div>
          <h1 className="text-[#F5F0E8] text-7xl md:text-8xl mb-8 drop-shadow-lg" style={{ ...serif, fontStyle: 'italic', lineHeight: 1 }}>Nobre</h1>
          <div className="w-16 h-[2px] bg-[#B85C38] mx-auto mb-8 rounded-full" />
          <p className="text-[#F5F0E8]/70 text-base leading-relaxed font-light">Uma experiência gastronômica singular, onde cada refeição se torna uma memória duradoura.</p>
        </div>
      </div>

      <div className="md:w-[55%] flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-4xl text-[#1A1208] mb-2 font-semibold" style={serif}>Bem-vindo</h2>
            <p className="text-base text-[#1A1208]/50">Acesse sua conta para gerenciar suas reservas.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2A4033]/40" />
                <input className={`${inputCls} pl-12`} type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} placeholder="seu@email.com" required />
              </div>
            </div>
            
            <div>
              <Label>Senha</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2A4033]/40" />
                <input className={`${inputCls} pl-12`} type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="••••••••" required />
              </div>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50/50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

            <div className="pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Entrando…' : <>Entrar <LogIn className="w-4 h-4" /></>}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center flex items-center justify-center gap-2">
            <span className="text-sm text-[#1A1208]/50">Não tem conta? </span>
            <button onClick={onRegister} className="text-sm text-[#B85C38] font-bold hover:text-[#9A4B2D] transition-colors">Cadastre-se agora</button>
          </div>

          <div className="mt-16 pt-6 border-t border-[#2A4033]/10 text-xs text-[#1A1208]/30 text-center font-mono">
            Acesso administrador: {ADMIN_EMAIL}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Register ─────────────────────────────────────────────────────────────────

interface RegForm {
  name: string; email: string; phone: string; cpf: string; password: string; confirm: string
}

function RegisterPage({ onRegister, onBack }: { onRegister: (data: Omit<Client, 'id' | 'createdAt'>) => string | null; onBack: () => void }) {
  const [form, setForm] = useState<RegForm>({ name: '', email: '', phone: '', cpf: '', password: '', confirm: '' })
  const [error, setError] = useState('')

  const set = (k: keyof RegForm) => (e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) return setError('A senha deve ter pelo menos 6 caracteres.')
    if (form.password !== form.confirm) return setError('As senhas não coincidem.')
    
    const err = onRegister({
      name: form.name, email: form.email, phone: form.phone, cpf: form.cpf, password: form.password,
    })
    if (err) setError(err)
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-6 py-12 relative">
      <div className="w-full max-w-lg">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-[#1A1208]/50 hover:text-[#1A1208] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao login
        </button>

        <div className="mb-8">
          <div className="text-[#B85C38] text-[11px] tracking-[0.4em] font-bold uppercase mb-2">Restaurante Nobre</div>
          <h2 className="text-4xl text-[#1A1208] font-semibold" style={serif}>Crie sua conta</h2>
        </div>

        <div className="bg-white rounded-3xl border border-[#2A4033]/10 p-8 shadow-xl shadow-[#2A4033]/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Nome completo</Label>
              <input className={inputCls} value={form.name} onChange={set('name')} placeholder="Ex: Ana Lima" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>E-mail</Label>
                <input className={inputCls} type="email" value={form.email} onChange={set('email')} placeholder="seu@email.com" required />
              </div>
              <div>
                <Label>Telefone</Label>
                <input className={inputCls} value={form.phone} onChange={set('phone')} placeholder="(11) 99999-9999" required />
              </div>
            </div>
            <div>
              <Label>CPF</Label>
              <input className={inputCls} value={form.cpf} onChange={set('cpf')} placeholder="000.000.000-00" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>Senha</Label>
                <input className={inputCls} type="password" value={form.password} onChange={set('password')} placeholder="Mínimo 6 caracteres" required />
              </div>
              <div>
                <Label>Confirmar senha</Label>
                <input className={inputCls} type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repita a senha" required />
              </div>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50/50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

            <div className="pt-4">
              <Button type="submit">Finalizar Cadastro</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Reservation Card ─────────────────────────────────────────────────────────

function ReservationCard({ r, onEdit, onCancel, showActions }: { r: Reservation; onEdit?: () => void; onCancel?: () => void; showActions?: boolean }) {
  const canEdit = showActions && r.status === 'pending'
  const canCancel = showActions && (r.status === 'pending' || r.status === 'confirmed')

  return (
    <div className={`bg-white rounded-2xl border border-[#2A4033]/10 p-5 flex flex-col md:flex-row md:items-center gap-4 transition-all hover:shadow-md ${r.status === 'cancelled' ? 'opacity-60 grayscale-[30%]' : ''}`}>
      <div className="text-center w-16 flex-shrink-0 bg-[#F5F0E8] rounded-xl py-2 flex flex-col justify-center">
        <div className="text-3xl font-extrabold text-[#2A4033] leading-none mb-1 tracking-tight">
          {r.date.split('-')[2]}
        </div>
        <div className="text-[10px] text-[#2A4033]/60 uppercase tracking-widest font-bold">
          {monthLabel(r.date)}
        </div>
      </div>

      <div className="flex-1 min-w-0 md:border-l md:border-[#2A4033]/10 md:pl-5">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1A1208]">
            <Clock className="w-4 h-4 text-[#B85C38]" /> {r.time}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-[#1A1208]/60">
            <Users className="w-4 h-4" /> {r.guests} {r.guests === 1 ? 'pessoa' : 'pessoas'}
          </div>
          <StatusBadge status={r.status} />
        </div>
        {r.notes && <p className="text-sm text-[#1A1208]/50 truncate bg-gray-50 px-3 py-1.5 rounded-lg inline-block max-w-full">Obs: {r.notes}</p>}
      </div>

      {(canEdit || canCancel) && (
        <div className="flex gap-2 flex-shrink-0 mt-3 md:mt-0 pt-3 md:pt-0 border-t md:border-0 border-[#2A4033]/10">
          {canEdit && <Button variant="ghost" size="sm" onClick={onEdit}>Editar</Button>}
          {canCancel && <Button variant="danger" size="sm" onClick={onCancel}>Cancelar</Button>}
        </div>
      )}
    </div>
  )
}

// ─── Client Dashboard ─────────────────────────────────────────────────────────

function ClientDashboard({ client, reservations, onNewReservation, onEditReservation, onCancelReservation, onUpdateClient, onDeleteClient, onLogout }: any) {
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
    if (!profileForm.name.trim()) return setProfileError('Nome é obrigatório.')
    onUpdateClient(client.id, { name: profileForm.name, phone: profileForm.phone })
    setEditProfile(false)
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <NavBar userName={client.name} onLogout={onLogout} />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8"><Tabs tabs={[{ id: 'reservations', label: 'Minhas Reservas' }, { id: 'profile', label: 'Meu Perfil' }]} active={tab} onChange={setTab} /></div>

        {tab === 'reservations' && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl text-[#1A1208] font-semibold" style={serif}>Reservas</h2>
                <p className="text-sm text-[#1A1208]/50 mt-1">{active.length} reserva(s) ativa(s)</p>
              </div>
              <Button onClick={onNewReservation} className="w-full sm:w-auto"><Plus className="w-4 h-4"/> Nova reserva</Button>
            </div>

            {active.length === 0 && (
              <div className="text-center py-24 bg-white/50 rounded-3xl border border-[#2A4033]/5 border-dashed">
                <Calendar className="w-12 h-12 text-[#2A4033]/20 mx-auto mb-4" />
                <p className="text-[#1A1208]/50 mb-4">Você ainda não tem reservas ativas.</p>
                <button onClick={onNewReservation} className="text-sm text-[#B85C38] font-bold hover:underline underline-offset-4">Fazer primeira reserva</button>
              </div>
            )}

            <div className="grid gap-4">
              {active.map(r => <ReservationCard key={r.id} r={r} onEdit={() => onEditReservation(r)} onCancel={() => onCancelReservation(r.id)} showActions />)}
            </div>

            {past.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px bg-[#2A4033]/10 flex-1"></div>
                  <span className="text-[11px] font-bold text-[#1A1208]/40 uppercase tracking-widest">Histórico Cancelado</span>
                  <div className="h-px bg-[#2A4033]/10 flex-1"></div>
                </div>
                <div className="grid gap-4 opacity-70 hover:opacity-100 transition-opacity">
                  {past.map(r => <ReservationCard key={r.id} r={r} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'profile' && (
          <div className="max-w-md animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-3xl text-[#1A1208] mb-8 font-semibold" style={serif}>Meu Perfil</h2>
            <div className="bg-white rounded-3xl border border-[#2A4033]/10 p-8 shadow-sm">
              {!editProfile ? (
                <div>
                  <div className="space-y-6 mb-8">
                    {[{ l: 'Nome', v: client.name }, { l: 'E-mail', v: client.email }, { l: 'Telefone', v: client.phone }, { l: 'CPF', v: client.cpf }].map(f => (
                      <div key={f.l}>
                        <div className="text-[11px] font-bold text-[#2A4033]/50 uppercase tracking-[0.15em] mb-1">{f.l}</div>
                        <div className="text-base text-[#1A1208]">{f.v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-[#2A4033]/10 flex flex-col gap-3">
                    <Button variant="secondary" onClick={() => setEditProfile(true)}>Editar informações</Button>
                    {!deleteConfirm ? (
                      <Button variant="danger" onClick={() => setDeleteConfirm(true)}>Excluir conta</Button>
                    ) : (
                      <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <span className="block text-sm text-red-800 font-semibold mb-3 text-center">Tem certeza? Esta ação é irreversível.</span>
                        <div className="flex gap-2">
                          <Button variant="danger" onClick={() => onDeleteClient(client.id)}>Sim, excluir</Button>
                          <Button variant="secondary" onClick={() => setDeleteConfirm(false)}>Cancelar</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={saveProfile} className="space-y-5">
                  <div><Label>Nome completo</Label><input className={inputCls} value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} required /></div>
                  <div><Label>Telefone</Label><input className={inputCls} value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} /></div>
                  {profileError && <p className="text-sm text-red-600">{profileError}</p>}
                  <div className="flex gap-3 pt-4">
                    <Button type="submit">Salvar</Button>
                    <Button variant="secondary" onClick={() => { setEditProfile(false); setProfileError(''); }}>Cancelar</Button>
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

function ReservationFormPage({ initial, onSubmit, onBack, isEdit }: { initial?: Partial<Reservation>; onSubmit: (data: any) => string | null; onBack: () => void; isEdit?: boolean }) {
  const [date, setDate] = useState(initial?.date ?? '')
  const [time, setTime] = useState(initial?.time ?? '19:00')
  const [guests, setGuests] = useState(initial?.guests ?? 2)
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!date) return setError('Selecione uma data.')
    const err = onSubmit({ date, time, guests, notes })
    if (err) setError(err)
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-[#1A1208]/50 hover:text-[#1A1208] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <div className="mb-8">
          <div className="text-[#B85C38] text-[11px] tracking-[0.4em] font-bold uppercase mb-2">Restaurante Nobre</div>
          <h2 className="text-4xl text-[#1A1208] font-semibold" style={serif}>{isEdit ? 'Editar Reserva' : 'Nova Reserva'}</h2>
        </div>

        <div className="bg-white rounded-3xl border border-[#2A4033]/10 p-8 shadow-xl shadow-[#2A4033]/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label>Data</Label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2A4033]/40" />
                  <input className={`${inputCls} pl-12`} type="date" value={date} min={todayStr()} onChange={e => { setDate(e.target.value); setError(''); }} required />
                </div>
              </div>
              <div>
                <Label>Horário</Label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2A4033]/40" />
                  <select className={`${inputCls} pl-12 appearance-none`} value={time} onChange={e => setTime(e.target.value)}>
                    <optgroup label="Almoço">{TIMES.slice(0, 6).map(t => <option key={t} value={t}>{t}</option>)}</optgroup>
                    <optgroup label="Jantar">{TIMES.slice(6).map(t => <option key={t} value={t}>{t}</option>)}</optgroup>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <Label>Número de pessoas</Label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2A4033]/40" />
                <input className={`${inputCls} pl-12`} type="number" min={1} max={20} value={guests} onChange={e => setGuests(Number(e.target.value))} required />
              </div>
            </div>

            <div>
              <Label>Observações <span className="normal-case text-xs font-normal text-[#1A1208]/40 ml-1">(opcional)</span></Label>
              <textarea className={`${inputCls} resize-none h-24`} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Alergias, comemorações, preferências..." />
            </div>

            <div className="text-xs text-[#2A4033]/70 bg-[#2A4033]/5 rounded-xl px-4 py-3 border border-[#2A4033]/10 flex gap-3 items-center">
              <Clock className="w-5 h-5 flex-shrink-0" />
              <span>Segunda a Sexta<br/>Almoço: 12h–14h30 · Jantar: 19h–22h</span>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50/50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

            <div className="pt-2">
              <Button type="submit">{isEdit ? 'Salvar alterações' : 'Confirmar reserva'}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard({ clients, reservations, onConfirm, onCancel, onDeleteClient, onLogout }: any) {
  const [tab, setTab] = useState<'reservations' | 'clients'>('reservations')
  const [statusFilter, setStatusFilter] = useState<'all' | ReservationStatus>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const pending = reservations.filter((r: Reservation) => r.status === 'pending').length
  const confirmed = reservations.filter((r: Reservation) => r.status === 'confirmed').length
  const filtered = statusFilter === 'all' ? reservations : reservations.filter((r: Reservation) => r.status === statusFilter)
  const sortedRes = [...filtered].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))

  const filterLabels: { id: 'all' | ReservationStatus; label: string }[] = [
    { id: 'all', label: 'Todas' }, { id: 'pending', label: 'Pendentes' }, { id: 'confirmed', label: 'Confirmadas' }, { id: 'cancelled', label: 'Canceladas' },
  ]

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <NavBar isAdmin onLogout={onLogout} />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { l: 'Total Reservas', v: reservations.length, c: 'text-[#1A1208]' }, 
            { l: 'Pendentes', v: pending, c: 'text-amber-600' }, 
            { l: 'Confirmadas', v: confirmed, c: 'text-emerald-600' }, 
            { l: 'Clientes Cadastrados', v: clients.length, c: 'text-[#2A4033]' }
          ].map(s => (
            <div key={s.l} className="bg-white rounded-2xl border border-[#2A4033]/10 p-5 shadow-sm flex flex-col justify-center">
              <div className={`text-5xl font-black tracking-tight ${s.c}`}>
                {s.v}
              </div>
              <div className="text-[11px] font-bold text-[#1A1208]/40 mt-2 uppercase tracking-widest">
                {s.l}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6"><Tabs tabs={[{ id: 'reservations', label: 'Gestão de Reservas' }, { id: 'clients', label: 'Base de Clientes' }]} active={tab} onChange={setTab} /></div>

        {tab === 'reservations' && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {filterLabels.map(f => (
                <button key={f.id} onClick={() => setStatusFilter(f.id)} className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${statusFilter === f.id ? 'bg-[#2A4033] text-[#F5F0E8] border-[#2A4033] shadow-md' : 'bg-white text-[#1A1208]/60 border-[#2A4033]/10 hover:border-[#2A4033]/30'}`}>
                  {f.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-[#2A4033]/10 overflow-hidden shadow-sm">
              {sortedRes.length === 0 ? (
                <div className="text-center py-16 text-[#1A1208]/40 text-sm">Nenhuma reserva encontrada para este filtro.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#2A4033]/5 border-b border-[#2A4033]/10">
                      <tr>{['Cliente', 'Data', 'Horário', 'Pessoas', 'Observações', 'Status', 'Ações'].map(h => <th key={h} className="px-5 py-4 text-[11px] font-bold text-[#2A4033]/60 uppercase tracking-widest whitespace-nowrap">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A4033]/5">
                      {sortedRes.map((r) => (
                        <tr key={r.id} className="hover:bg-[#F5F0E8]/50 transition-colors">
                          <td className="px-5 py-4 font-semibold text-[#1A1208] whitespace-nowrap">{r.clientName}</td>
                          <td className="px-5 py-4 text-[#1A1208]/70 whitespace-nowrap">{formatDate(r.date)}</td>
                          <td className="px-5 py-4 text-[#1A1208]/70"><span className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">{r.time}</span></td>
                          <td className="px-5 py-4 text-[#1A1208]/70">{r.guests}</td>
                          <td className="px-5 py-4 text-[#1A1208]/50 max-w-[200px] truncate">{r.notes || '—'}</td>
                          <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2 whitespace-nowrap">
                              {r.status === 'pending' && <Button size="sm" className="!bg-emerald-50 !text-emerald-700 !border-emerald-200 hover:!bg-emerald-100" onClick={() => onConfirm(r.id)}><CheckCircle className="w-3 h-3"/> Confirmar</Button>}
                              {r.status !== 'cancelled' && <Button size="sm" className="!bg-red-50 !text-red-600 !border-red-200 hover:!bg-red-100" onClick={() => onCancel(r.id)}><XCircle className="w-3 h-3"/> Cancelar</Button>}
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

        {tab === 'clients' && (
          <div className="bg-white rounded-2xl border border-[#2A4033]/10 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2">
            {clients.length === 0 ? (
              <div className="text-center py-16 text-[#1A1208]/40 text-sm">Nenhum cliente cadastrado.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#2A4033]/5 border-b border-[#2A4033]/10">
                    <tr>{['Nome', 'Contato', 'CPF', 'Cadastro', 'Reservas', ''].map(h => <th key={h} className="px-5 py-4 text-[11px] font-bold text-[#2A4033]/60 uppercase tracking-widest whitespace-nowrap">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A4033]/5">
                    {clients.map((c: Client) => {
                      const cResCount = reservations.filter((r: Reservation) => r.clientId === c.id).length
                      return (
                        <tr key={c.id} className="hover:bg-[#F5F0E8]/50 transition-colors">
                          <td className="px-5 py-4 font-semibold text-[#1A1208] whitespace-nowrap">{c.name}</td>
                          <td className="px-5 py-4 text-[#1A1208]/70 whitespace-nowrap">
                            <div className="flex flex-col"><span className="text-xs text-[#1A1208]">{c.email}</span><span className="text-[11px] text-[#1A1208]/50">{c.phone}</span></div>
                          </td>
                          <td className="px-5 py-4 text-[#1A1208]/50 font-mono text-xs whitespace-nowrap">{c.cpf}</td>
                          <td className="px-5 py-4 text-[#1A1208]/50 whitespace-nowrap">{formatDate(c.createdAt.split('T')[0])}</td>
                          <td className="px-5 py-4 font-semibold text-[#2A4033]">{cResCount}</td>
                          <td className="px-5 py-4 text-right">
                            {deleteId === c.id ? (
                              <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                                <span className="text-xs text-red-600 font-semibold mr-2">Confirmar?</span>
                                <Button size="sm" variant="danger" onClick={() => { onDeleteClient(c.id); setDeleteId(null); }}>Sim</Button>
                                <Button size="sm" variant="secondary" onClick={() => setDeleteId(null)}>Não</Button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteId(c.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
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
  const [reservations, setReservations] = useState<Reservation[]>(() => load('nobre_reservations', SEED_RESERVATIONS))
  const [editingRes, setEditingRes] = useState<Reservation | null>(null)

  useEffect(() => { localStorage.setItem('nobre_clients', JSON.stringify(clients)) }, [clients])
  useEffect(() => { localStorage.setItem('nobre_reservations', JSON.stringify(reservations)) }, [reservations])

  const login = (email: string, password: string): string | null => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true); setCurrentUser(null); setPage('admin-dashboard'); return null
    }
    const c = clients.find(c => c.email === email && c.password === password)
    if (!c) return 'E-mail ou senha incorretos.'
    setCurrentUser(c); setIsAdmin(false); setPage('client-dashboard'); return null
  }

  const logout = () => { setCurrentUser(null); setIsAdmin(false); setPage('landing') }

  const registerClient = (data: Omit<Client, 'id' | 'createdAt'>): string | null => {
    if (clients.some(c => c.email === data.email)) return 'E-mail já cadastrado.'
    if (clients.some(c => c.cpf === data.cpf)) return 'CPF já cadastrado.'
    const newClient: Client = { ...data, id: `c${Date.now()}`, createdAt: new Date().toISOString() }
    setClients(prev => [...prev, newClient]); setCurrentUser(newClient); setPage('client-dashboard'); return null
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

  const createReservation = (data: { date: string; time: string; guests: number; notes: string }): string | null => {
    if (!currentUser) return 'Não autenticado.'
    const dup = reservations.find(r => r.clientId === currentUser.id && r.date === data.date && r.status !== 'cancelled')
    if (dup) return 'Você já possui uma reserva para esta data.'
    const slotCount = reservations.filter(r => r.date === data.date && r.time === data.time && r.status !== 'cancelled').length
    if (slotCount >= MAX_PER_SLOT) return 'Não há mesas disponíveis neste horário.'
    const newRes: Reservation = { id: `r${Date.now()}`, clientId: currentUser.id, clientName: currentUser.name, ...data, status: 'pending', createdAt: new Date().toISOString() }
    setReservations(prev => [...prev, newRes]); setPage('client-dashboard'); return null
  }

  const editReservation = (id: string, data: { date: string; time: string; guests: number; notes: string }): string | null => {
    if (!currentUser) return 'Não autenticado.'
    const dup = reservations.find(r => r.clientId === currentUser.id && r.date === data.date && r.status !== 'cancelled' && r.id !== id)
    if (dup) return 'Você já possui uma reserva para esta data.'
    setReservations(prev => prev.map(r => (r.id === id ? { ...r, ...data } : r))); setPage('client-dashboard'); return null
  }

  const cancelReservation = (id: string) => setReservations(prev => prev.map(r => (r.id === id ? { ...r, status: 'cancelled' } : r)))
  const confirmReservation = (id: string) => setReservations(prev => prev.map(r => (r.id === id ? { ...r, status: 'confirmed' } : r)))

  const myReservations = reservations.filter(r => r.clientId === currentUser?.id)

  if (page === 'landing') return <LandingPage onLogin={login} onRegister={() => setPage('register')} />
  if (page === 'register') return <RegisterPage onRegister={registerClient} onBack={() => setPage('landing')} />
  if (page === 'client-dashboard' && currentUser) return <ClientDashboard client={currentUser} reservations={myReservations} onNewReservation={() => setPage('new-reservation')} onEditReservation={(r: Reservation) => { setEditingRes(r); setPage('edit-reservation'); }} onCancelReservation={cancelReservation} onUpdateClient={updateClient} onDeleteClient={deleteClient} onLogout={logout} />
  if (page === 'new-reservation' && currentUser) return <ReservationFormPage onSubmit={createReservation} onBack={() => setPage('client-dashboard')} />
  if (page === 'edit-reservation' && currentUser && editingRes) return <ReservationFormPage initial={editingRes} onSubmit={data => editReservation(editingRes.id, data)} onBack={() => setPage('client-dashboard')} isEdit />
  if (page === 'admin-dashboard' && isAdmin) return <AdminDashboard clients={clients} reservations={reservations} onConfirm={confirmReservation} onCancel={cancelReservation} onDeleteClient={deleteClient} onLogout={logout} />

  return <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center"><button onClick={() => setPage('landing')} className="text-sm font-bold text-[#2A4033] hover:underline">Voltar ao início</button></div>
}