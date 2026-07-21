import { useState, type FormEvent } from 'react'
import { ArrowLeft, Calendar, Clock, Users } from 'lucide-react'
import type { Reservation } from '../../../shared/types'
import { todayStr, serif } from '../../../shared/utils'
import { TIMES } from '../../../shared/constants'
import { Button, Label, inputCls } from '../../../shared/components/ui'

export function ReservationFormPage({ initial, onSubmit, onBack, isEdit }: { initial?: Partial<Reservation>; onSubmit: (data: any) => string | null; onBack: () => void; isEdit?: boolean }) {
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
            <div className="pt-2"><Button type="submit">{isEdit ? 'Salvar alterações' : 'Confirmar reserva'}</Button></div>
          </form>
        </div>
      </div>
    </div>
  )
}