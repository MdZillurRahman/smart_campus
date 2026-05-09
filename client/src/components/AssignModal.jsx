import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserPlus, Loader2 } from 'lucide-react'
import { useStaff } from '../hooks/useStaff'
import { useAssignComplaint } from '../hooks/useComplaints'

export default function AssignModal({ complaint, open, onClose }) {
  const [staffId, setStaffId] = useState('')
  const { data: staff = [], isLoading } = useStaff()
  const { mutateAsync, isPending } = useAssignComplaint()

  const handleAssign = async () => {
    if (!staffId) return
    try {
      await mutateAsync({ id: complaint.id, assigned_to_id: staffId })
      onClose()
    } catch {
      alert('Failed to assign complaint. Please try again.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto sm:mx-0 h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-2">
            <UserPlus className="h-5 w-5 text-white" />
          </div>
          <DialogTitle>Assign Complaint</DialogTitle>
          <DialogDescription>
            Choose a staff member to handle this complaint.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">Complaint</p>
            <p className="text-sm font-medium text-slate-900 mt-0.5 truncate">{complaint?.title}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Staff member</label>
            <Select onValueChange={setStaffId} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? 'Loading staff...' : 'Select staff member'} />
              </SelectTrigger>
              <SelectContent>
                {staff.map(s => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.fullname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAssign} disabled={!staffId || isPending}>
            {isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Assigning…</>
            ) : (
              <><UserPlus className="h-4 w-4 mr-2" /> Assign</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
