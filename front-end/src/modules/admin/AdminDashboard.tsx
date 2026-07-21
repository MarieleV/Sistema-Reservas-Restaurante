import { useState } from 'react'
import { CheckCircle, XCircle, Trash2 } from 'lucide-react'
import type { Client, Reservation, ReservationStatus } from '../../shared/types'
import { formatDate, serif } from '../../shared/utils'
import { Button, NavBar, Tabs, StatusBadge } from '../../shared/components/ui'

export function AdminDashboard({ clients, reservations, onConfirm, onCancel, onDeleteClient, onLogout }: any) {
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
          {[{ l: 'Total Reservas', v: reservations.length, c: 'text-[#1A1208]' }, { l: 'Pendentes', v: pending, c: 'text-amber-600' }, { l: 'Confirmadas', v: confirmed, c: 'text-emerald-600' }, { l: 'Clientes Cadastrados', v: clients.length, c: 'text-[#2A4033]' }].map(s => (
            <div key={s.l} className="bg-white rounded-2xl border border-[#2A4033]/10 p-5 shadow-sm flex flex-col justify-center">
              <div className={`text-5xl font-black tracking-tight ${s.c}`}>{s.v}</div>
              <div className="text-[11px] font-bold text-[#1A1208]/40 mt-2 uppercase tracking-widest">{s.l}</div>
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