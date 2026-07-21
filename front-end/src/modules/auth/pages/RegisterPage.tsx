import { useState, type ChangeEvent, type FormEvent } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button, Label, inputCls } from '../../../shared/components/ui'
import { serif } from '../../../shared/utils'
import type { Client } from '../../../shared/types'

interface RegForm { name: string; email: string; phone: string; cpf: string; password: string; confirm: string }

export function RegisterPage({ onRegister, onBack }: { onRegister: (data: Omit<Client, 'id' | 'createdAt'>) => string | null; onBack: () => void }) {
  const [form, setForm] = useState<RegForm>({ name: '', email: '', phone: '', cpf: '', password: '', confirm: '' })
  const [error, setError] = useState('')

  const set = (k: keyof RegForm) => (e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) return setError('A senha deve ter pelo menos 6 caracteres.')
    if (form.password !== form.confirm) return setError('As senhas não coincidem.')
    const err = onRegister({ name: form.name, email: form.email, phone: form.phone, cpf: form.cpf, password: form.password })
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
            <div><Label>Nome completo</Label><input className={inputCls} value={form.name} onChange={set('name')} placeholder="Ex: Ana Lima" required /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><Label>E-mail</Label><input className={inputCls} type="email" value={form.email} onChange={set('email')} placeholder="seu@email.com" required /></div>
              <div><Label>Telefone</Label><input className={inputCls} value={form.phone} onChange={set('phone')} placeholder="(11) 99999-9999" required /></div>
            </div>
            <div><Label>CPF</Label><input className={inputCls} value={form.cpf} onChange={set('cpf')} placeholder="000.000.000-00" required /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><Label>Senha</Label><input className={inputCls} type="password" value={form.password} onChange={set('password')} placeholder="Mínimo 6 caracteres" required /></div>
              <div><Label>Confirmar senha</Label><input className={inputCls} type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repita a senha" required /></div>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50/50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}
            <div className="pt-4"><Button type="submit">Finalizar Cadastro</Button></div>
          </form>
        </div>
      </div>
    </div>
  )
}