import { Clock, Users } from 'lucide-react'
import type { Reservation } from '../../../shared/types'
import { monthLabel, serif } from '../../../shared/utils'
import { Button, StatusBadge } from '../../../shared/components/ui'

export function ReservationCard({ r, onEdit, onCancel, showActions }: { r: Reservation; onEdit?: () => void; onCancel?: () => void; showActions?: boolean }) {
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