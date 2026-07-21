import React from 'react'
import { LogOut } from 'lucide-react'
import { ReservationStatus } from '../types'
import { serif } from '../utils'

export const inputCls =
  'w-full px-4 py-3 rounded-xl border border-[#2A4033]/20 bg-white/60 text-[#1A1208] text-sm focus:bg-white focus:outline-none focus:border-[#2A4033] focus:ring-4 focus:ring-[#2A4033]/10 transition-all duration-300 placeholder:text-[#1A1208]/30'

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold text-[#2A4033]/70 uppercase tracking-[0.15em] mb-2 pl-1">
      {children}
    </label>
  )
}

export function Button({
  children,
  type = 'button',
  onClick,
  disabled,
  variant = 'primary',
  size = 'md',
  className = '',
}: {
  children: React.ReactNode
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md'
  className?: string
}) {
  const base = "font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
  const variants = {
    primary: "bg-[#2A4033] text-[#F5F0E8] hover:bg-[#1e2f25] hover:shadow-lg hover:shadow-[#2A4033]/20 border border-transparent",
    secondary: "bg-[#E8E0D0] text-[#1A1208] hover:bg-[#DCD3C0] border border-transparent",
    danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
    ghost: "bg-transparent text-[#2A4033] hover:bg-[#2A4033]/10 border border-[#2A4033]/20",
  }
  const sizes = {
    sm: "py-1.5 px-3 text-xs",
    md: "w-full py-3 px-6 text-sm",
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  )
}

export function StatusBadge({ status }: { status: ReservationStatus }) {
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

export function NavBar({
  isAdmin,
  userName,
  onLogout,
}: {
  isAdmin?: boolean
  userName?: string
  onLogout: () => void
}) {
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
          <button onClick={onLogout} className="flex items-center gap-2 text-xs font-semibold text-[#F5F0E8]/60 hover:text-[#F5F0E8] transition-colors">
            Sair <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  )
}

export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: T; label: string }[]
  active: T
  onChange: (t: T) => void
}) {
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