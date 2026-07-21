import { useState, type FormEvent } from 'react'
import { Plus, Calendar } from 'lucide-react'
import type { Client, Reservation } from '../../../shared/types'
import { serif } from '../../../shared/utils'
import { Button, Label, NavBar, Tabs, inputCls } from '../../../shared/components/ui'
import { ReservationCard } from '../../reservation/components/ReservationCard'

export function ClientDashboard({ client, reservations, onNewReservation, onEditReservation, onCancelReservation, onUpdateClient, onDeleteClient, onLogout }: any) {
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