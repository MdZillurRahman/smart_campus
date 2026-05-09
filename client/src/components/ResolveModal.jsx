import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCheck, Loader2, AlertCircle } from 'lucide-react'
import { useResolveComplaint } from '../hooks/useComplaints'

export default function ResolveModal({ complaint, open, onClose }) {
  const [note, setNote] = useState('')
  const { mutateAsync, isPending } = useResolveComplaint()

  const handleResolve = async () => {
    if (!note.trim()) return
    try {
      await mutateAsync({ id: complaint.id, resolution_note: note })
      onClose()
      setNote('')
    } catch {
      alert('Failed to resolve complaint. Please try again.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto sm:mx-0 h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-2">
            <CheckCheck className="h-5 w-5 text-white" />
          </div>
          <DialogTitle>Resolve Complaint</DialogTitle>
          <DialogDescription>
            Add a short note describing how this issue was resolved.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">Complaint</p>
            <p className="text-sm font-medium text-slate-900 mt-0.5 truncate">{complaint?.title}</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="resolution-note">Resolution Note</Label>
            <Textarea
              id="resolution-note"
              placeholder="Describe what was done to resolve this issue..."
              rows={4}
              value={note}
              onChange={e => setNote(e.target.value)}
              className="resize-none"
            />
            {!note.trim() && (
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> A resolution note is required.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleResolve} disabled={!note.trim() || isPending}>
            {isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Resolving…</>
            ) : (
              <><CheckCheck className="h-4 w-4 mr-2" /> Mark Resolved</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
