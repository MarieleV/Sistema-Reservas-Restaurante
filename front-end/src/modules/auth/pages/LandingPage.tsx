import { useState, type FormEvent } from 'react'
import { Mail, Lock, LogIn } from 'lucide-react'
import { Button, Label, inputCls } from '../../../shared/components/ui'
import { serif } from '../../../shared/utils'
import { ADMIN_EMAIL } from '../../../shared/constants'

export function LandingPage({ onLogin, onRegister }: { onLogin: (email: string, pw: string) => string | null; onRegister: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const err = onLogin(email, password)
    if (err) { setError(err); setLoading(false) }
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
            <div className="pt-2"><Button type="submit" disabled={loading}>{loading ? 'Entrando…' : <>Entrar <LogIn className="w-4 h-4" /></>}</Button></div>
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